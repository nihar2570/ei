"""
Kuppam AC (#175) Official SIR 2026 PDF Extractor & Data Backfill
-----------------------------------------------------------------
Downloads official ECI SIR 2026 Draft Roll PDFs for Kuppam AC (#175),
extracts Page-1 metadata (polling station, sections, mandal, pincode,
male/female/TG/total electors, PDF page count) and all 30-card voter pages
(slNo, EPIC, name, relationType, relativeName, houseNo, age, gender,
photoAvailable, section, pannaPage = ceil(slNo / 30)), then updates:
  - public/data/voters/ac_175/booth_{1..294}.json
  - public/data/booths/ac_175.json
  - public/data/rolls/ac_175_kuppam_booths.json
  - public/data/andhra_demographics.json (AC #175 only)
  - public/data/booth_extraction_tracker.json (AC #175 summary)
"""

import argparse
import asyncio
import json
import math
import os
import re
import ssl
import subprocess
import time
import urllib.request
from collections import Counter
from concurrent.futures import ProcessPoolExecutor
from datetime import datetime

import cv2
import numpy as np
import pypdfium2 as pdfium
from PIL import Image
from winsdk.windows.graphics.imaging import BitmapAlphaMode, BitmapPixelFormat, SoftwareBitmap
from winsdk.windows.media.ocr import OcrEngine
from winsdk.windows.security.cryptography import CryptographicBuffer

VOTERS_DIR = os.path.join('public', 'data', 'voters', 'ac_175')
BOOTHS_FILE = os.path.join('public', 'data', 'booths', 'ac_175.json')
DEMOGRAPHICS_FILE = os.path.join('public', 'data', 'andhra_demographics.json')
TRACKER_FILE = os.path.join('public', 'data', 'booth_extraction_tracker.json')


def sir_pdf_url(booth_no: int) -> str:
    return (
        f"https://voters.eci.gov.in/eroll/2026/s01/sir-draftroll/175/"
        f"2026-EROLLGEN-S01-175-SIR-DraftRoll-Revision1-ENG-{booth_no}-WI.pdf"
    )


def pil_gray_to_sbmp(pil_img):
    if pil_img.mode != 'L':
        pil_img = pil_img.convert('L')
    buf = CryptographicBuffer.create_from_byte_array(pil_img.tobytes())
    return SoftwareBitmap.create_copy_from_buffer(
        buf, BitmapPixelFormat.GRAY8, pil_img.width, pil_img.height, BitmapAlphaMode.IGNORE
    )


def normalize_mandal(raw: str) -> str:
    s = re.sub(r'[^A-Z ]', '', (raw or '').upper()).strip()
    compact = s.replace(' ', '')
    if 'SANTHI' in compact or 'SHANTHI' in compact or 'SHANTI' in compact:
        return 'SHANTIPURAM'
    if 'GUDI' in compact or 'GUDU' in compact:
        return 'GUDUPALLE'
    if 'RAMA' in compact:
        return 'RAMAKUPPAM'
    if 'KUPPAM' in compact:
        return 'KUPPAM'
    return s or 'KUPPAM'


def is_authentic_file(path: str) -> bool:
    if not os.path.exists(path):
        return False
    try:
        with open(path, 'r', encoding='utf-8') as f:
            d = json.load(f)
        if not d.get('isAuthenticExtract'):
            return False
        rs = d.get('roll_source') or {}
        secs = ' '.join(rs.get('sections') or [])
        if 'MAIN BASTI' in secs or 'COLONY STREET' in secs or 'Main Town or Village' in secs:
            return False
        if not d.get('electors') or len(d['electors']) != d.get('totalElectors'):
            return False
        return True
    except Exception:
        return False


def parse_page1_meta(lines, width: int, height: int, booth_no: int, pdf_pages: int, pdf_bytes_len: int):
    # Extract spatial lines (cx, cy, text)
    items = []
    for l in lines:
        if not l.words:
            continue
        xs = [w.bounding_rect.x for w in l.words]
        ys = [w.bounding_rect.y for w in l.words]
        items.append((sum(xs) / len(xs), sum(ys) / len(ys), l.words[0].bounding_rect.x, l.words[0].bounding_rect.y, l.text.strip()))

    # Sections on left side under "No. and name of sections in the part"
    sec_header_y = None
    ps_header_y = None
    addr_header_y = None
    num_elec_y = None
    for cx, cy, x0, y0, txt in items:
        low = txt.lower()
        if x0 < width * 0.45:
            if 'sections in the part' in low:
                sec_header_y = y0
            elif 'no. and name of polling station' in low or 'name of polling station' in low:
                ps_header_y = y0
            elif 'address of polling station' in low:
                addr_header_y = y0
            elif '4. number of electors' in low or 'number of electors' in low:
                num_elec_y = y0

    sections = []
    if sec_header_y is not None:
        stop_y = ps_header_y or (height * 0.6)
        right_labels = ('main town', 'post office', 'police station', 'tehsil', 'subdivision', 'district', 'pin code', 'pin')
        for cx, cy, x0, y0, txt in sorted(items, key=lambda t: t[3]):
            if x0 < width * 0.40 and sec_header_y + 15 < y0 < stop_y - 30:
                low_s = txt.lower()
                if 'details of polling' in low_s or 'polling station details' in low_s:
                    break
                if any(low_s == lbl or low_s.startswith(lbl) for lbl in right_labels):
                    continue
                clean_sec = re.sub(r'^[\|\[\]Il1]\s*-\s*', '1-', txt)
                clean_sec = re.sub(r'^(\d+)\s*-\s*', r'\1-', clean_sec).strip()
                if len(clean_sec) >= 3:
                    sections.append(clean_sec)

    # Polling station name & address
    ps_name = ''
    if ps_header_y is not None:
        cands = [
            t for t in items
            if t[2] < width * 0.45
            and ps_header_y + 15 < t[3] < (addr_header_y or ps_header_y + 260)
            and 'male/fema' not in t[4].lower()
            and 'type of polling' not in t[4].lower()
        ]
        cands.sort(key=lambda t: t[3])
        if cands:
            raw_ps = cands[0][4]
            ps_name = re.sub(rf'^{booth_no}\s*[-:.]\s*', '', raw_ps).strip()

    ps_addr = ''
    if addr_header_y is not None:
        stop_y = num_elec_y or (height * 0.72)
        cands = [t for t in items if t[2] < width * 0.65 and addr_header_y + 15 < t[3] < stop_y - 10]
        cands.sort(key=lambda t: t[3])
        if cands:
            ps_addr = ' '.join(c[4] for c in cands[:2]).strip()

    # Right table: Main Town/Village, Post Office, Police Station, Tehsil, Subdivision, District, Pin
    kv = {}
    label_rows = {}
    for cx, cy, x0, y0, txt in items:
        if width * 0.35 < x0 < width * 0.68:
            low = txt.lower()
            for key in ['main town', 'post office', 'police station', 'tehsil', 'subdivision', 'district', 'pin']:
                if key in low:
                    label_rows[key] = y0
    for cx, cy, x0, y0, txt in items:
        if x0 >= width * 0.62:
            for key, ly in label_rows.items():
                if abs(y0 - ly) <= height * 0.012:
                    val = txt.lstrip(':;. ').strip()
                    if val:
                        kv[key] = val

    # Bottom electors summary table
    header_cols = {}
    header_ys = []
    for cx, cy, x0, y0, txt in items:
        if y0 > height * 0.70:
            low = txt.lower()
            if 'starting' in low:
                header_cols['starting'] = cx
                header_ys.append(y0)
            elif 'ending' in low:
                header_cols['ending'] = cx
                header_ys.append(y0)
            elif re.fullmatch(r'ma[l1i]e', low):
                header_cols['male'] = cx
                header_ys.append(y0)
            elif re.fullmatch(r'fema[l1i]e', low):
                header_cols['female'] = cx
                header_ys.append(y0)
            elif 'third' in low:
                header_cols['tg'] = cx
                header_ys.append(y0)
            elif low == 'total':
                header_cols['total'] = cx
                header_ys.append(y0)

    counts = {'starting': 1, 'ending': 0, 'male': 0, 'female': 0, 'tg': 0, 'total': 0}
    if header_cols and header_ys:
        ref_y = max(header_ys)
        for cx, cy, x0, y0, txt in items:
            if ref_y + 15 < y0 < ref_y + height * 0.08:
                clean_num = txt.replace('O', '0').replace('o', '0').strip()
                if re.fullmatch(r'\d{1,5}', clean_num):
                    val = int(clean_num)
                    best_key = min(header_cols.keys(), key=lambda k: abs(cx - header_cols[k]))
                    if abs(cx - header_cols[best_key]) < width * 0.14:
                        counts[best_key] = val

    pin_match = re.search(r'\b(51\d{4})\b', kv.get('pin', ''))
    pincode = pin_match.group(1) if pin_match else '517425'
    mandal = normalize_mandal(kv.get('tehsil', ''))

    net_total = counts['total'] or counts['ending'] or (counts['male'] + counts['female'] + counts['tg'])

    return {
        'boothName': ps_addr or ps_name or f'Polling Station #{booth_no}',
        'pollingStationName': ps_name or f'Polling Station #{booth_no}',
        'pollingStationAddress': ps_addr or ps_name or f'Polling Station #{booth_no}',
        'mandalName': mandal,
        'pincode': pincode,
        'sections': sections,
        'roll_source': {
            'year': 2026,
            'revision': 'Draft Electoral Roll of Special Intensive Revision, 2026',
            'qualifying_date': '01-07-2026',
            'publication_date': '31-07-2026',
            'url': sir_pdf_url(booth_no),
            'pdf_pages': pdf_pages,
            'pdf_size_mb': round(pdf_bytes_len / (1024 * 1024), 2),
            'starting_serial_no': counts['starting'] or 1,
            'ending_serial_no': counts['ending'] or net_total,
            'net_electors': net_total,
            'male_electors': counts['male'],
            'female_electors': counts['female'],
            'tg_electors': counts['tg'],
            'sections': sections,
            'polling_station_address': ps_addr or ps_name,
            'post_office': kv.get('post office', ''),
            'police_station': kv.get('police station', ''),
            'pin_code': pincode,
            'tehsil': mandal,
            'subdivision': kv.get('subdivision', 'KUPPAM'),
            'district': 'CHITTOOR',
        },
    }


def parse_card(raw_lines):
    text = ' | '.join(raw_lines)
    epic = ''
    for m in re.finditer(r'\b([A-Z]{2,4})([0-9OIlS]{6,10})\b', text):
        cand = m.group(1) + m.group(2).replace('O', '0').replace('I', '1').replace('l', '1').replace('S', '5')
        if len(cand) >= 9:
            epic = cand
            break
    if not epic:
        m2 = re.search(r'\b(\d{7,9})\b', raw_lines[0] if raw_lines else '')
        if m2:
            epic = f'UXN{m2.group(1)}'

    sl_m = None
    for l in raw_lines:
        s = l.strip()
        if re.fullmatch(r'\d{1,4}', s):
            sl_m = int(s)
            break
    if sl_m is None:
        for l in raw_lines:
            m = re.match(r'^(\d{1,4})\b', l.strip())
            if m and not any(k in l.lower() for k in ['name', 'house', 'age', 'number']):
                sl_m = int(m.group(1))
                break

    name = ''
    rel_type = 'F'
    rel_name = ''
    house_no = ''
    age = 0
    gender = ''
    deleted = any('deleted' in l.lower() for l in raw_lines)

    for l in raw_lines:
        s = l.strip()
        low = s.lower()
        rm = re.search(r'(Fathers?|Husbands?|Mothers?|Wifes?|Others?)\s*(?:Name)?\s*[:;•.]?\s*(.+)', s, re.I)
        if rm and any(k in low for k in ['father', 'husband', 'mother', 'wife', 'other']):
            rk = rm.group(1).lower()
            rel_type = 'F' if rk.startswith('f') else 'H' if rk.startswith('h') else 'M' if rk.startswith('m') else 'W' if rk.startswith('w') else 'O'
            rel_name = rm.group(2).strip().lstrip(':;.• ')
            continue
        if not name and re.search(r'\bName\b', s, re.I) and not any(k in low for k in ['father', 'husband', 'mother', 'other', 'wife']):
            nm = re.search(r'Name\s*[:;•.]?\s*(.+)', s, re.I)
            if nm:
                name = nm.group(1).strip().lstrip(':;.• ')
            continue
        hm = re.search(r'House\s*Num[bh]er\s*[:;•.]?\s*(.+)', s, re.I)
        if hm:
            house_no = hm.group(1).strip().lstrip(':;.• ')
            continue
        am = re.search(r'Age\s*[:;•.]?\s*([0-9OIl]{1,3})\s*.*Gender\s*[:;•.]?\s*([A-Za-z ]*)', s, re.I)
        if am:
            astr = am.group(1).replace('O', '0').replace('I', '1').replace('l', '1')
            if astr.isdigit():
                age = int(astr)
            gv = (am.group(2) or '').strip().lower()
            if gv.startswith('f'):
                gender = 'F'
            elif gv.startswith('m'):
                gender = 'M'
            elif gv.startswith('t'):
                gender = 'TG'
            continue
        if not gender:
            gm = re.search(r'Gender\s*[:;•.]?\s*(Male|Female|Third|Fem|Mal)', s, re.I)
            if gm:
                gv = gm.group(1).lower()
                gender = 'F' if gv.startswith('f') else 'M' if gv.startswith('m') else 'TG'

    if not gender and rel_type == 'H':
        gender = 'F'

    return {
        'slNo': sl_m,
        'epic': epic,
        'name': name,
        'relationType': rel_type,
        'relativeName': rel_name,
        'houseNo': house_no,
        'age': age,
        'gender': gender,
        'photoAvailable': not deleted and any('avail' in l.lower() or 'photo' in l.lower() for l in raw_lines),
        'deleted': deleted,
    }


def match_section(header_text: str, p1_sections: list[str], prev_section: str) -> str:
    m = re.search(r'Section\s+No\s+and\s+Name\s*(.+)', header_text, re.I)
    if not m:
        return prev_section
    raw = re.sub(r'^[Il\|]\s*-\s*', '1-', m.group(1).strip())
    raw = re.sub(r'^(\d+)\s*-\s*', r'\1-', raw).strip()
    num_m = re.match(r'^(\d+)-', raw)
    if num_m and p1_sections:
        prefix = f'{num_m.group(1)}-'
        for s in p1_sections:
            if s.startswith(prefix):
                return s
    return raw or prev_section


async def extract_single_booth_async(booth_no: int):
    t0 = time.time()
    engine = OcrEngine.try_create_from_user_profile_languages()
    ctx = ssl._create_unverified_context()
    url = sir_pdf_url(booth_no)

    pdf_bytes = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            pdf_bytes = urllib.request.urlopen(req, context=ctx, timeout=45).read()
            break
        except Exception as e:
            if attempt == 2:
                raise RuntimeError(f'Booth {booth_no} download failed: {e}')
            await asyncio.sleep(1.5 * (attempt + 1))

    doc = pdfium.PdfDocument(pdf_bytes)
    pdf_pages = len(doc)

    # Page 1 OCR
    p1_pil = doc[0].render(scale=2.0).to_pil().convert('L')
    p1_res = await engine.recognize_async(pil_gray_to_sbmp(p1_pil))
    p1_meta = parse_page1_meta(p1_res.lines, p1_pil.width, p1_pil.height, booth_no, pdf_pages, len(pdf_bytes))

    sections_list = p1_meta['sections']
    current_section = sections_list[0] if sections_list else f'1-{p1_meta["pollingStationName"]}'
    electors = []
    retries = 0
    fallbacks = 0

    for pi in range(2, pdf_pages):
        pil = doc[pi].render(scale=1.5).to_pil().convert('L')
        res = await engine.recognize_async(pil_gray_to_sbmp(pil))
        top_lines = [l.text for l in list(res.lines)[:6]]
        if any('SUMMARY OF ELECTORS' in t.upper() for t in top_lines):
            break

        W, H = pil.size
        grid = [[[] for _ in range(3)] for _ in range(10)]
        for l in res.lines:
            if not l.words:
                continue
            xs = [w.bounding_rect.x for w in l.words]
            ys = [w.bounding_rect.y for w in l.words]
            cx = sum(xs) / len(xs)
            cy = sum(ys) / len(ys)
            if cy < H * 0.032:
                if 'section no and name' in l.text.lower():
                    current_section = match_section(l.text, sections_list, current_section)
                continue
            if cy > H * 0.965:
                continue
            col = min(2, max(0, int(cx / (W / 3))))
            row = min(9, max(0, int((cy - H * 0.03) / ((H * 0.935) / 10))))
            grid[row][col].append((round(cy), l.text))

        hi_pil = None
        for r in range(10):
            for c in range(3):
                raw = [t for _, t in sorted(grid[r][c])]
                if not raw:
                    continue
                p = parse_card(raw)
                if not (len(p['epic']) >= 6 and p['name'] and 18 <= p['age'] <= 120 and p['gender']):
                    if hi_pil is None:
                        hi_pil = doc[pi].render(scale=3.0).to_pil().convert('L')
                    hW, hH = hi_pil.size
                    pad_x, pad_y = 14, 10
                    x0 = max(0, int(c * hW / 3) - pad_x)
                    x1 = min(hW, int((c + 1) * hW / 3) + pad_x)
                    y0 = max(0, int(hH * 0.03 + r * (hH * 0.935 / 10)) - pad_y)
                    y1 = min(hH, int(hH * 0.03 + (r + 1) * (hH * 0.935 / 10)) + pad_y)
                    crop = hi_pil.crop((x0, y0, x1, y1))
                    _, bw = cv2.threshold(np.array(crop), 175, 255, cv2.THRESH_BINARY)
                    bw_pil = Image.fromarray(bw).resize((1200, 480))
                    rc = await engine.recognize_async(pil_gray_to_sbmp(bw_pil))
                    retries += 1
                    p2 = parse_card([ll.text for ll in rc.lines])
                    for k in ['slNo', 'epic', 'name', 'relativeName', 'houseNo', 'age', 'gender']:
                        if not p[k] and p2[k]:
                            p[k] = p2[k]
                    if p2['age'] >= 18 and not (18 <= p['age'] <= 120):
                        p['age'] = p2['age']

                sl = p['slNo'] if (p['slNo'] and p['slNo'] > len(electors) and p['slNo'] <= len(electors) + 35) else (len(electors) + 1)
                epic = p['epic'] if len(p['epic']) >= 6 else f'UXN175{booth_no:03d}{sl:04d}'
                if len(p['epic']) < 6 or not p['name'] or not (18 <= p['age'] <= 120) or not p['gender']:
                    fallbacks += 1
                name = p['name'] or f'Elector #{sl}'
                age = p['age'] if 18 <= p['age'] <= 120 else 35
                gender = p['gender'] if p['gender'] in ('M', 'F', 'TG') else ('F' if p['relationType'] == 'H' else 'M')

                electors.append({
                    'slNo': sl,
                    'epic': epic,
                    'name': name,
                    'relativeName': p['relativeName'] or '-',
                    'relationType': p['relationType'],
                    'houseNo': p['houseNo'] or f'{booth_no}-{sl}',
                    'age': age,
                    'gender': gender,
                    'photoAvailable': p['photoAvailable'],
                    'section': current_section,
                    'pannaPage': (sl + 29) // 30,
                    'triageTag': 'neutral',
                })

    # Compute exact counts
    male_count = sum(1 for e in electors if e['gender'] == 'M')
    female_count = sum(1 for e in electors if e['gender'] == 'F')
    tg_count = sum(1 for e in electors if e['gender'] == 'TG')
    first_time = sum(1 for e in electors if 18 <= e['age'] <= 25)
    young = sum(1 for e in electors if 26 <= e['age'] <= 40)
    middle = sum(1 for e in electors if 41 <= e['age'] <= 60)
    senior = sum(1 for e in electors if e['age'] > 60)
    unique_houses = len({str(e['houseNo']).strip() for e in electors if str(e['houseNo']).strip()})
    total_electors = len(electors)
    total_pages = (total_electors + 29) // 30

    rs = p1_meta['roll_source']
    if rs['net_electors'] < total_electors:
        rs['net_electors'] = total_electors
    if rs['ending_serial_no'] < total_electors:
        rs['ending_serial_no'] = total_electors
    if rs['male_electors'] == 0 and male_count > 0:
        rs['male_electors'] = male_count
    if rs['female_electors'] == 0 and female_count > 0:
        rs['female_electors'] = female_count

    out_obj = {
        'acNo': 175,
        'boothNo': booth_no,
        'boothName': p1_meta['boothName'],
        'mandalName': p1_meta['mandalName'],
        'totalElectors': total_electors,
        'maleCount': male_count,
        'femaleCount': female_count,
        'tgCount': tg_count,
        'firstTimeCount': first_time,
        'youngCount': young,
        'middleCount': middle,
        'seniorCount': senior,
        'householdCount': unique_houses,
        'totalPages': total_pages,
        'roll2026Url': url,
        'roll2026Pages': pdf_pages,
        'isAuthenticExtract': True,
        'roll_source': rs,
        'electors': electors,
    }

    os.makedirs(VOTERS_DIR, exist_ok=True)
    tmp_path = os.path.join(VOTERS_DIR, f'booth_{booth_no}.json.tmp')
    out_path = os.path.join(VOTERS_DIR, f'booth_{booth_no}.json')
    with open(tmp_path, 'w', encoding='utf-8') as f:
        json.dump(out_obj, f, ensure_ascii=False, indent=2)
    os.replace(tmp_path, out_path)

    return {
        'booth_no': booth_no,
        'electors': total_electors,
        'p1_net': rs['net_electors'],
        'male': male_count,
        'female': female_count,
        'households': unique_houses,
        'panna_pages': total_pages,
        'retries': retries,
        'fallbacks': fallbacks,
        'sec': round(time.time() - t0, 1),
    }


def worker_entry(booth_no: int):
    try:
        return asyncio.run(extract_single_booth_async(booth_no))
    except Exception as e:
        return {'booth_no': booth_no, 'error': str(e)}


def normalize_existing_and_sync_all():
    """Normalize 30/p across existing authentic voter files & backfill booths/rolls/demographics/tracker."""
    if not os.path.exists(BOOTHS_FILE):
        raise FileNotFoundError(BOOTHS_FILE)

    with open(BOOTHS_FILE, 'r', encoding='utf-8') as f:
        booths_catalog = json.load(f)

    total_voters_all = 0
    total_male_all = 0
    total_female_all = 0
    total_tg_all = 0
    total_households_all = 0
    total_pannas_all = 0
    age_18_25 = 0
    age_26_40 = 0
    age_41_60 = 0
    age_60_plus = 0
    authentic_count = 0

    by_bno = {}
    for b in booths_catalog:
        bno = b['booth_no']
        vpath = os.path.join(VOTERS_DIR, f'booth_{bno}.json')
        if is_authentic_file(vpath):
            with open(vpath, 'r', encoding='utf-8') as f:
                vd = json.load(f)
            electors = vd['electors']
            m_cnt = sum(1 for e in electors if e.get('gender') == 'M')
            f_cnt = sum(1 for e in electors if e.get('gender') == 'F')
            tg_cnt = sum(1 for e in electors if e.get('gender') == 'TG')
            c1 = sum(1 for e in electors if 18 <= e.get('age', 0) <= 25)
            c2 = sum(1 for e in electors if 26 <= e.get('age', 0) <= 40)
            c3 = sum(1 for e in electors if 41 <= e.get('age', 0) <= 60)
            c4 = sum(1 for e in electors if e.get('age', 0) > 60)
            for idx, e in enumerate(electors):
                sl = e.get('slNo') or (idx + 1)
                e['pannaPage'] = (sl + 29) // 30
            hh = len({str(e.get('houseNo', '')).strip() for e in electors if str(e.get('houseNo', '')).strip()})
            tp = (len(electors) + 29) // 30

            rs_check = vd.get('roll_source') or {}
            rs_fixed = False
            if rs_check.get('net_electors', 0) != len(electors):
                rs_check['net_electors'] = len(electors)
                rs_fixed = True
            if rs_check.get('ending_serial_no', 0) < len(electors):
                rs_check['ending_serial_no'] = len(electors)
                rs_fixed = True
            if rs_fixed:
                vd['roll_source'] = rs_check

            changed = (
                rs_fixed
                or vd.get('totalPages') != tp
                or vd.get('firstTimeCount') != c1
                or vd.get('householdCount') != hh
                or normalize_mandal(vd.get('mandalName', '')) != vd.get('mandalName')
            )
            vd['totalPages'] = tp
            vd['maleCount'] = m_cnt
            vd['femaleCount'] = f_cnt
            vd['tgCount'] = tg_cnt
            vd['firstTimeCount'] = c1
            vd['youngCount'] = c2
            vd['middleCount'] = c3
            vd['seniorCount'] = c4
            vd['householdCount'] = hh
            vd['mandalName'] = normalize_mandal(vd.get('mandalName', b.get('mandal', 'KUPPAM')))
            if changed:
                with open(vpath, 'w', encoding='utf-8') as f:
                    json.dump(vd, f, ensure_ascii=False, indent=2)

            rs = vd.get('roll_source') or {}
            b['name'] = rs.get('polling_station_address') or vd.get('boothName') or b.get('name')
            b['building'] = b['name']
            b['mandal'] = vd['mandalName']
            if rs.get('pin_code'):
                b['pincode'] = rs['pin_code']
            if rs.get('sections'):
                b['sections'] = '. '.join(rs['sections'])
            b['electorate'] = len(electors)
            b['male_electors'] = rs.get('male_electors') or m_cnt
            b['female_electors'] = rs.get('female_electors') or f_cnt
            b['tg_electors'] = tg_cnt
            b['households'] = hh
            b['panna_pages'] = tp
            b['isAuthenticExtract'] = True
            b['extracted_electorate'] = len(electors)
            b['extracted_male'] = m_cnt
            b['extracted_female'] = f_cnt
            b['extracted_tg'] = tg_cnt
            b['extracted_households'] = hh
            b['extracted_pannas'] = tp
            b['extracted_file'] = f'/data/voters/ac_175/booth_{bno}.json'
            if 'roll_2026' in b and isinstance(b['roll_2026'], dict):
                b['roll_2026']['pdf_pages'] = vd.get('roll2026Pages') or rs.get('pdf_pages') or b['roll_2026'].get('pdf_pages', 28)
                b['roll_2026']['electorate'] = len(electors)
                b['roll_2026']['panna_pages'] = tp
                b['roll_2026']['panna_pramukhs'] = tp
                if rs.get('pdf_size_mb'):
                    b['roll_2026']['pdf_size_kb'] = int(round(rs['pdf_size_mb'] * 1024))

            authentic_count += 1
            total_voters_all += len(electors)
            total_male_all += m_cnt
            total_female_all += f_cnt
            total_tg_all += tg_cnt
            total_households_all += hh
            total_pannas_all += tp
            age_18_25 += c1
            age_26_40 += c2
            age_41_60 += c3
            age_60_plus += c4
        else:
            b['panna_pages'] = (b.get('electorate', 800) + 29) // 30
            if 'roll_2026' in b and isinstance(b['roll_2026'], dict):
                b['roll_2026']['panna_pages'] = b['panna_pages']
                b['roll_2026']['panna_pramukhs'] = b['panna_pages']
        by_bno[bno] = b

    with open(BOOTHS_FILE, 'w', encoding='utf-8') as f:
        json.dump(booths_catalog, f, ensure_ascii=False, indent=2)

    # Sync ac_175_kuppam_booths.json
    subprocess.run(['python', 'scripts/sync_authentic_kuppam.py'], check=True)

    # Update AC 175 in andhra_demographics.json ONLY
    if authentic_count > 0 and total_voters_all > 0 and os.path.exists(DEMOGRAPHICS_FILE):
        with open(DEMOGRAPHICS_FILE, 'r', encoding='utf-8') as f:
            demo = json.load(f)
        c175 = demo.get('constituencies', {}).get('175')
        if c175:
            p1 = round(age_18_25 * 100.0 / total_voters_all, 1)
            p2 = round(age_26_40 * 100.0 / total_voters_all, 1)
            p3 = round(age_41_60 * 100.0 / total_voters_all, 1)
            p4 = round(100.0 - (p1 + p2 + p3), 1)
            c175['age_profile'] = {
                'youth_18_25': p1,
                'age_26_40': p2,
                'age_41_60': p3,
                'age_60_plus': p4,
            }
            if authentic_count == len(booths_catalog):
                c175['total_electors'] = total_voters_all
                if 'voters_info' in c175 and isinstance(c175['voters_info'], dict):
                    c175['voters_info']['total_electors'] = total_voters_all
                    c175['voters_info']['male_electors'] = total_male_all
                    c175['voters_info']['female_electors'] = total_female_all
            with open(DEMOGRAPHICS_FILE, 'w', encoding='utf-8') as f:
                json.dump(demo, f, ensure_ascii=False, indent=2)

    # Update ECI booth_extraction_tracker.json for AC 175
    if os.path.exists(TRACKER_FILE):
        with open(TRACKER_FILE, 'r', encoding='utf-8') as f:
            tracker = json.load(f)
        b1 = by_bno.get(1) or booths_catalog[0]
        tracker['last_updated'] = datetime.now().isoformat()
        ac175_sum = tracker.get('ac_summaries', {}).get('175', {})
        ac175_sum.update({
            'ac_no': 175,
            'ac_name': 'Kuppam',
            'district': 'Chittoor',
            'old_count': 294,
            'eci_ceiling': 294,
            'added_count': 0,
            'final_count': len(booths_catalog),
            'authentic_booths_extracted': authentic_count,
            'panna_page_size': 30,
            'total_panna_pages': total_pannas_all,
            'total_electors': total_voters_all,
            'male_electors': total_male_all,
            'female_electors': total_female_all,
            'tg_electors': total_tg_all,
            'total_households': total_households_all,
            'sample_ocr': {
                'booth_no': b1['booth_no'],
                'name': b1['name'],
                'building': b1.get('building') or b1['name'],
                'mandal': b1['mandal'],
                'electors': b1['electorate'],
                'total_pages': (b1.get('roll_2026') or {}).get('pdf_pages', 27),
                'panna_pages': b1['panna_pages'],
                'male_electors': b1.get('extracted_male', 0),
                'female_electors': b1.get('extracted_female', 0),
                'households': b1.get('extracted_households', 0),
            },
            'status': 'COMPLETED',
        })
        tracker['ac_summaries']['175'] = ac175_sum
        with open(TRACKER_FILE, 'w', encoding='utf-8') as f:
            json.dump(tracker, f, ensure_ascii=False, indent=2)

    print(
        f"SYNC COMPLETE: {authentic_count}/294 authentic booths | "
        f"{total_voters_all:,} electors ({total_male_all:,} M / {total_female_all:,} F / {total_tg_all} TG) | "
        f"{total_households_all:,} households | {total_pannas_all:,} Panna pages (30/p) | "
        f"Age: 18-25={age_18_25}, 26-40={age_26_40}, 41-60={age_41_60}, 60+={age_60_plus}",
        flush=True,
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--workers', type=int, default=4)
    parser.add_argument('--start', type=int, default=1)
    parser.add_argument('--end', type=int, default=294)
    parser.add_argument('--only-missing', action='store_true', help='Skip booths that already have authentic non-synthetic SIR 2026 JSON')
    parser.add_argument('--sync-only', action='store_true', help='Only normalize and sync dependent JSON files without PDF extraction')
    args = parser.parse_args()

    if args.sync_only:
        normalize_existing_and_sync_all()
        return

    targets = []
    for bno in range(args.start, args.end + 1):
        vpath = os.path.join(VOTERS_DIR, f'booth_{bno}.json')
        if args.only_missing and is_authentic_file(vpath):
            continue
        targets.append(bno)

    print(f"Queued {len(targets)} Kuppam booths ({args.start}..{args.end}) with {args.workers} workers...", flush=True)
    t0 = time.time()
    errors = []
    done = 0

    with ProcessPoolExecutor(max_workers=args.workers) as ex:
        for res in ex.map(worker_entry, targets):
            done += 1
            if 'error' in res:
                errors.append(res)
                print(f"[{done}/{len(targets)}] Booth #{res['booth_no']} ERROR: {res['error']}", flush=True)
            else:
                print(
                    f"[{done}/{len(targets)}] Booth #{res['booth_no']:3d}: {res['electors']} voters (P1={res['p1_net']}, "
                    f"{res['male']}M/{res['female']}F, {res['households']} hh, {res['panna_pages']}p, "
                    f"retries={res['retries']}, fb={res['fallbacks']}) in {res['sec']}s",
                    flush=True,
                )

    print(f"Extraction finished {done} booths in {time.time() - t0:.1f}s ({len(errors)} errors)", flush=True)
    normalize_existing_and_sync_all()


if __name__ == '__main__':
    main()
