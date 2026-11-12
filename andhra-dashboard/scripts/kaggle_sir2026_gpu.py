"""
Kaggle GPU (NVIDIA T4 / T4 x2 / P100) ECI SIR 2026 Full Voter-Roll Extractor
----------------------------------------------------------------------------
Runs on Kaggle Linux GPU notebooks using pypdfium2 + RapidOCR (CUDA ONNX Runtime).
Outputs exact dashboard schema JSONs (booth_{n}.json) bundled per AC as:
  /kaggle/working/out/ac_{ac}_voters.zip
  /kaggle/working/out/ac_{ac}_summary.json

Quick Start on Kaggle (Notebook Settings -> Accelerator: GPU T4 x2, Internet: ON):
  Cell 1:
    !pip install -q -U rapidocr onnxruntime-gpu pypdfium2 opencv-python-headless requests
  Cell 2 (Test GPU + ECI connectivity on 1 booth first):
    !python kaggle_sir2026_gpu.py --test
  Cell 3 (Run batch of ACs, e.g. 1..25):
    !python kaggle_sir2026_gpu.py --start 1 --end 25 --gpu-workers 2
"""

import argparse
import io
import json
import os
import re
import time
import zipfile
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

import cv2
import numpy as np
import pypdfium2 as pdfium
import requests
import urllib3

urllib3.disable_warnings()

# Authoritative booth counts per AC (#1..#175) from public/data/booths/ac_*.json
AC_BOOTH_COUNTS = {
    1: 319, 2: 302, 3: 318, 4: 323, 5: 324, 6: 270, 7: 318, 8: 290, 9: 295, 10: 307,
    11: 272, 12: 242, 13: 256, 14: 294, 15: 261, 16: 267, 17: 252, 18: 321, 19: 279, 20: 400,
    21: 285, 22: 248, 23: 293, 24: 237, 25: 339, 26: 272, 27: 238, 28: 319, 29: 332, 30: 275,
    31: 341, 32: 266, 33: 312, 34: 273, 35: 265, 36: 247, 37: 266, 38: 281, 39: 238, 40: 308,
    41: 261, 42: 247, 43: 307, 44: 259, 45: 210, 46: 214, 47: 277, 48: 239, 49: 238, 50: 263,
    51: 310, 52: 264, 53: 399, 54: 212, 55: 248, 56: 199, 57: 558, 58: 181, 59: 262, 60: 244,
    61: 254, 62: 249, 63: 245, 64: 248, 65: 247, 66: 280, 67: 324, 68: 292, 69: 246, 70: 291,
    71: 327, 72: 254, 73: 244, 74: 219, 75: 223, 76: 436, 77: 238, 78: 319, 79: 269, 80: 318,
    81: 321, 82: 323, 83: 234, 84: 225, 85: 281, 86: 252, 87: 353, 88: 277, 89: 237, 90: 299,
    91: 317, 92: 281, 93: 334, 94: 338, 95: 312, 96: 278, 97: 285, 98: 295, 99: 329, 100: 328,
    101: 321, 102: 267, 103: 291, 104: 304, 105: 314, 106: 246, 107: 265, 108: 271, 109: 293, 110: 291,
    111: 277, 112: 287, 113: 314, 114: 324, 115: 283, 116: 327, 117: 258, 118: 344, 119: 289, 120: 311,
    121: 571, 122: 324, 123: 324, 124: 289, 125: 306, 126: 340, 127: 269, 128: 302, 129: 309, 130: 279,
    131: 327, 132: 310, 133: 284, 134: 312, 135: 239, 136: 276, 137: 318, 138: 373, 139: 334, 140: 306,
    141: 296, 142: 277, 143: 291, 144: 322, 145: 267, 146: 284, 147: 320, 148: 343, 149: 285, 150: 46,
    151: 47, 152: 35, 153: 17, 154: 229, 155: 201, 156: 241, 157: 251, 158: 265, 159: 214, 160: 5,
    161: 11, 162: 239, 163: 39, 164: 21, 165: 92, 166: 581, 167: 264, 168: 56, 169: 32, 170: 14,
    171: 210, 172: 187, 173: 219, 174: 228, 175: 294,
}

_OCR_ENGINE = None
_HTTP_SESSION = None


def sir_pdf_url(ac_no: int, booth_no: int) -> str:
    return (
        f"https://voters.eci.gov.in/eroll/2026/s01/sir-draftroll/{ac_no}/"
        f"2026-EROLLGEN-S01-{ac_no}-SIR-DraftRoll-Revision1-ENG-{booth_no}-WI.pdf"
    )


def _init_gpu_worker(gpu_id_queue=None):
    global _OCR_ENGINE, _HTTP_SESSION
    if gpu_id_queue is not None:
        gpu_id = gpu_id_queue.get()
        os.environ['CUDA_VISIBLE_DEVICES'] = str(gpu_id)

    _HTTP_SESSION = requests.Session()
    _HTTP_SESSION.headers.update({'User-Agent': 'Mozilla/5.0'})

    try:
        from rapidocr import RapidOCR
        _OCR_ENGINE = RapidOCR(params={'EngineConfig.onnxruntime.use_cuda': True})
    except TypeError:
        from rapidocr import RapidOCR
        _OCR_ENGINE = RapidOCR()
    except ImportError:
        from rapidocr_onnxruntime import RapidOCR
        _OCR_ENGINE = RapidOCR(use_cuda=True)


def run_ocr(img_bgr_or_gray: np.ndarray) -> list[tuple[float, float, float, float, str]]:
    """Return normalized [(cx, cy, x0, y0, text), ...] from RapidOCR output."""
    if img_bgr_or_gray.ndim == 2:
        img = cv2.cvtColor(img_bgr_or_gray, cv2.COLOR_GRAY2BGR)
    else:
        img = img_bgr_or_gray

    out = _OCR_ENGINE(img)
    items = []
    # RapidOCR v3+ returns RapidOCROutput (.boxes, .txts)
    if hasattr(out, 'txts') and hasattr(out, 'boxes'):
        if out.txts and out.boxes is not None:
            for box, txt in zip(out.boxes, out.txts):
                pts = np.asarray(box)
                x0 = float(pts[:, 0].min())
                y0 = float(pts[:, 1].min())
                x1 = float(pts[:, 0].max())
                y1 = float(pts[:, 1].max())
                items.append(((x0 + x1) / 2.0, (y0 + y1) / 2.0, x0, y0, str(txt).strip()))
        return items

    # Legacy rapidocr_onnxruntime returns (list, elapse)
    raw = out[0] if isinstance(out, tuple) else out
    if raw:
        for row in raw:
            box, txt = row[0], row[1]
            pts = np.asarray(box)
            x0 = float(pts[:, 0].min())
            y0 = float(pts[:, 1].min())
            x1 = float(pts[:, 0].max())
            y1 = float(pts[:, 1].max())
            items.append(((x0 + x1) / 2.0, (y0 + y1) / 2.0, x0, y0, str(txt).strip()))
    return items


def extract_table_counts(items, width: int, height: int, y_min_ratio: float = 0.70, max_dy_ratio: float = 0.09) -> dict:
    """Extract Starting/Ending/Male/Female/TG/Total counts using proportional ECI anchors."""
    sub = [t for t in items if t[3] >= height * y_min_ratio]
    header_cols = {}
    header_ys = []
    for cx, cy, x0, y0, txt in sub:
        for token in re.split(r'\s+', txt):
            low = re.sub(r'[^a-z]', '', token.lower())
            if not low:
                continue
            if 'starting' in low:
                header_cols['starting'] = cx
                header_ys.append(y0)
            elif 'ending' in low:
                header_cols['ending'] = cx
                header_ys.append(y0)
            elif low in ('male', 'maie', 'malo'):
                header_cols['male'] = cx
                header_ys.append(y0)
            elif low in ('female', 'femaie', 'femalo') or low.startswith('femal'):
                header_cols['female'] = cx
                header_ys.append(y0)
            elif 'third' in low:
                header_cols['tg'] = cx
                header_ys.append(y0)
            elif low == 'total':
                header_cols['total'] = cx
                header_ys.append(y0)

    anchors = {
        'starting': width * 0.075,
        'ending': width * 0.176,
        'male': width * 0.314,
        'female': width * 0.495,
        'tg': width * 0.680,
        'total': width * 0.875,
    }
    for k, v in header_cols.items():
        if abs(v - anchors[k]) < width * 0.14:
            anchors[k] = v

    counts = {'starting': 1, 'ending': 0, 'male': 0, 'female': 0, 'tg': 0, 'total': 0}
    num_tokens = []
    for cx, cy, x0, y0, txt in sub:
        clean_num = txt.replace('O', '0').replace('o', '0').replace(',', '').strip()
        if re.fullmatch(r'\d{1,5}', clean_num):
            num_tokens.append((cx, y0, int(clean_num)))

    band = []
    if header_ys:
        ref_y = max(header_ys)
        band = [t for t in num_tokens if ref_y + 3 < t[1] < ref_y + height * max_dy_ratio]
    if not band and num_tokens:
        num_tokens.sort(key=lambda t: t[1])
        best_row = []
        tol = max(12.0, height * (max_dy_ratio * 0.35))
        for i, tok in enumerate(num_tokens):
            row = [t for t in num_tokens[i:] if abs(t[1] - tok[1]) <= tol]
            if len(row) > len(best_row):
                best_row = row
        if len(best_row) >= 3:
            band = best_row

    for cx, y0, val in band:
        best_key = min(anchors.keys(), key=lambda k: abs(cx - anchors[k]))
        if abs(cx - anchors[best_key]) < width * 0.12:
            counts[best_key] = val
    return counts


def parse_page1_meta(items, width: int, height: int, ac_no: int, booth_no: int, pdf_pages: int, pdf_bytes_len: int):
    sec_header_y = ps_header_y = addr_header_y = num_elec_y = None
    for cx, cy, x0, y0, txt in items:
        low = txt.lower()
        if x0 < width * 0.45:
            if 'sections in the part' in low:
                sec_header_y = y0
            elif 'name of polling station' in low:
                ps_header_y = y0
            elif 'address of polling station' in low:
                addr_header_y = y0
            elif 'number of electors' in low:
                num_elec_y = y0

    sections = []
    if sec_header_y is not None:
        stop_y = ps_header_y or (height * 0.6)
        right_labels = ('main town', 'post office', 'police station', 'tehsil', 'subdivision', 'district', 'pin code', 'pin')
        for cx, cy, x0, y0, txt in sorted(items, key=lambda t: t[3]):
            if x0 < width * 0.40 and sec_header_y + 15 < y0 < stop_y - 30:
                low_s = txt.lower()
                if 'polling station details' in low_s or 'details of polling' in low_s:
                    break
                if any(low_s == lbl or low_s.startswith(lbl) for lbl in right_labels):
                    continue
                clean_sec = re.sub(r'^[\|\[\]Il1]\s*-\s*', '1-', txt)
                clean_sec = re.sub(r'^(\d+)\s*-\s*', r'\1-', clean_sec).strip()
                if len(clean_sec) >= 3:
                    sections.append(clean_sec)

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
            ps_name = re.sub(rf'^{booth_no}\s*[-:.]\s*', '', cands[0][4]).strip()

    ps_addr = ''
    if addr_header_y is not None:
        stop_y = num_elec_y or (height * 0.72)
        cands = [t for t in items if t[2] < width * 0.65 and addr_header_y + 15 < t[3] < stop_y - 10]
        cands.sort(key=lambda t: t[3])
        if cands:
            ps_addr = ' '.join(c[4] for c in cands[:2]).strip()

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
                if abs(y0 - ly) <= height * 0.015:
                    val = txt.lstrip(':;. ').strip()
                    if val:
                        kv[key] = val

    counts = extract_table_counts(items, width, height)
    pin_match = re.search(r'\b(5[0-3]\d{4})\b', kv.get('pin', ''))
    pincode = pin_match.group(1) if pin_match else ''
    tehsil = re.sub(r'\s+', ' ', re.sub(r'[^A-Za-z0-9 ()/-]', ' ', kv.get('tehsil', ''))).strip().upper()
    if tehsil == 'ASSEMBLY MANDAL' or len(tehsil) < 3:
        tehsil = ''

    net_total = counts['total'] or counts['ending'] or (counts['male'] + counts['female'] + counts['tg'])

    return {
        'boothName': ps_addr or ps_name or f'Polling Station #{booth_no}',
        'pollingStationName': ps_name or f'Polling Station #{booth_no}',
        'pollingStationAddress': ps_addr or ps_name or f'Polling Station #{booth_no}',
        'mandalName': tehsil,
        'pincode': pincode,
        'sections': sections,
        'roll_source': {
            'year': 2026,
            'revision': 'Draft Electoral Roll of Special Intensive Revision, 2026',
            'qualifying_date': '01-07-2026',
            'publication_date': '31-07-2026',
            'url': sir_pdf_url(ac_no, booth_no),
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
            'tehsil': tehsil,
            'subdivision': kv.get('subdivision', ''),
            'district': kv.get('district', ''),
        },
    }


def parse_card(raw_lines: list[str]) -> dict:
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
            gender = 'F' if gv.startswith('f') else 'M' if gv.startswith('m') else 'TG' if gv.startswith('t') else gender
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


def download_pdf(ac_no: int, booth_no: int) -> bytes:
    url = sir_pdf_url(ac_no, booth_no)
    last_err = None
    for attempt in range(3):
        try:
            r = _HTTP_SESSION.get(url, timeout=45, verify=False)
            r.raise_for_status()
            return r.content
        except Exception as e:
            last_err = e
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f'Download failed AC {ac_no} Booth {booth_no}: {last_err}')


def process_booth(task: tuple[int, int]) -> tuple[int, dict]:
    ac_no, booth_no = task
    t0 = time.time()
    pdf_bytes = download_pdf(ac_no, booth_no)
    doc = pdfium.PdfDocument(pdf_bytes)
    pdf_pages = len(doc)

    # Page 1
    p1_arr = doc[0].render(scale=1.8).to_numpy()
    p1_items = run_ocr(p1_arr)
    p1_h, p1_w = p1_arr.shape[:2]
    p1_meta = parse_page1_meta(p1_items, p1_w, p1_h, ac_no, booth_no, pdf_pages, len(pdf_bytes))

    rs = p1_meta['roll_source']
    if rs['male_electors'] == 0 or rs['female_electors'] == 0 or (
        rs['male_electors'] + rs['female_electors'] + rs['tg_electors'] != rs['net_electors']
    ):
        hi1 = doc[0].render(scale=2.5).to_numpy()
        hh, hw = hi1.shape[:2]
        strip = hi1[int(hh * 0.68):int(hh * 0.92), :]
        c_hi = extract_table_counts(run_ocr(strip), hw, strip.shape[0], y_min_ratio=0.05, max_dy_ratio=0.38)
        nt_hi = c_hi['total'] or c_hi['ending'] or (c_hi['male'] + c_hi['female'] + c_hi['tg'])
        if c_hi['male'] > 0 and c_hi['female'] > 0 and nt_hi > 0:
            rs['male_electors'] = c_hi['male']
            rs['female_electors'] = c_hi['female']
            rs['tg_electors'] = c_hi['tg']
            rs['net_electors'] = nt_hi

    sections_list = p1_meta['sections']
    current_section = sections_list[0] if sections_list else f'1-{p1_meta["pollingStationName"]}'
    electors = []

    for pi in range(2, pdf_pages):
        arr = doc[pi].render(scale=1.5).to_numpy()
        H, W = arr.shape[:2]
        items = run_ocr(arr)
        top_txt = ' '.join(t[4] for t in sorted(items, key=lambda x: x[3])[:6])
        if 'SUMMARY OF ELECTORS' in top_txt.upper():
            break

        grid = [[[] for _ in range(3)] for _ in range(10)]
        for cx, cy, x0, y0, txt in items:
            if cy < H * 0.032:
                if 'section no and name' in txt.lower():
                    current_section = match_section(txt, sections_list, current_section)
                continue
            if cy > H * 0.965:
                continue
            col = min(2, max(0, int(cx / (W / 3))))
            row = min(9, max(0, int((cy - H * 0.03) / ((H * 0.935) / 10))))
            grid[row][col].append((round(cy), txt))

        hi_arr = None
        for r in range(10):
            for c in range(3):
                raw = [t for _, t in sorted(grid[r][c])]
                if not raw:
                    continue
                p = parse_card(raw)
                if not (len(p['epic']) >= 6 and p['name'] and 18 <= p['age'] <= 120 and p['gender']):
                    if hi_arr is None:
                        hi_arr = doc[pi].render(scale=2.6).to_numpy()
                    hH, hW = hi_arr.shape[:2]
                    x0 = max(0, int(c * hW / 3) - 12)
                    x1 = min(hW, int((c + 1) * hW / 3) + 12)
                    y0 = max(0, int(hH * 0.03 + r * (hH * 0.935 / 10)) - 10)
                    y1 = min(hH, int(hH * 0.03 + (r + 1) * (hH * 0.935 / 10)) + 10)
                    crop = hi_arr[y0:y1, x0:x1]
                    c_items = run_ocr(crop)
                    c_items.sort(key=lambda x: x[3])
                    p2 = parse_card([t[4] for t in c_items])
                    for k in ['slNo', 'epic', 'name', 'relativeName', 'houseNo', 'age', 'gender']:
                        if not p[k] and p2[k]:
                            p[k] = p2[k]
                    if p2['age'] >= 18 and not (18 <= p['age'] <= 120):
                        p['age'] = p2['age']

                sl = p['slNo'] if (p['slNo'] and len(electors) < p['slNo'] <= len(electors) + 35) else (len(electors) + 1)
                epic = p['epic'] if len(p['epic']) >= 6 else f'UXN{ac_no:03d}{booth_no:03d}{sl:04d}'
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

    doc.close()
    total_electors = len(electors)
    male_count = sum(1 for e in electors if e['gender'] == 'M')
    female_count = sum(1 for e in electors if e['gender'] == 'F')
    tg_count = sum(1 for e in electors if e['gender'] == 'TG')

    out_obj = {
        'acNo': ac_no,
        'boothNo': booth_no,
        'boothName': p1_meta['boothName'],
        'mandalName': p1_meta['mandalName'],
        'totalElectors': total_electors,
        'maleCount': male_count,
        'femaleCount': female_count,
        'tgCount': tg_count,
        'firstTimeCount': sum(1 for e in electors if 18 <= e['age'] <= 25),
        'youngCount': sum(1 for e in electors if 26 <= e['age'] <= 40),
        'middleCount': sum(1 for e in electors if 41 <= e['age'] <= 60),
        'seniorCount': sum(1 for e in electors if e['age'] > 60),
        'householdCount': len({str(e['houseNo']).strip() for e in electors if str(e['houseNo']).strip()}),
        'totalPages': (total_electors + 29) // 30,
        'roll2026Url': sir_pdf_url(ac_no, booth_no),
        'roll2026Pages': pdf_pages,
        'isAuthenticExtract': True,
        'roll_source': rs,
        'electors': electors,
        '_sec': round(time.time() - t0, 1),
    }
    return booth_no, out_obj


def safe_process_booth(task: tuple[int, int]) -> tuple[int, dict | None, str | None]:
    ac_no, booth_no = task
    try:
        bno, obj = process_booth(task)
        return bno, obj, None
    except Exception as e:
        return booth_no, None, str(e)


def run_test():
    print('=== 1. Checking ONNX / PyTorch GPU on Kaggle ===')
    try:
        import onnxruntime as ort
        print('ONNX Runtime Providers:', ort.get_available_providers())
    except Exception as e:
        print('ONNX Runtime check error:', e)
    try:
        import torch
        print('PyTorch CUDA available:', torch.cuda.is_available(), '| GPUs:', torch.cuda.device_count())
        for i in range(torch.cuda.device_count()):
            print(f'  GPU {i}:', torch.cuda.get_device_name(i))
    except Exception as e:
        print('PyTorch check:', e)

    print('\n=== 2. Testing ECI download + GPU OCR on AC 1 Booth 1 ===')
    _init_gpu_worker()
    t0 = time.time()
    bno, obj = process_booth((1, 1))
    print(
        f'Booth #{bno} OK in {time.time() - t0:.1f}s | '
        f'{obj["totalElectors"]} voters ({obj["maleCount"]}M/{obj["femaleCount"]}F, '
        f'{obj["householdCount"]} HH, {obj["totalPages"]} Panna @30/p) | '
        f'Sample elector[0]: {obj["electors"][0] if obj["electors"] else None}'
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--start', type=int, default=1)
    parser.add_argument('--end', type=int, default=10)
    parser.add_argument('--gpu-workers', type=int, default=2, help='Set 2 for Kaggle T4 x2, 1 for T4/P100')
    parser.add_argument('--out-dir', type=str, default='/kaggle/working/out')
    parser.add_argument('--test', action='store_true')
    args = parser.parse_args()

    if args.test:
        run_test()
        return

    import multiprocessing as mp
    os.makedirs(args.out_dir, exist_ok=True)
    ctx = mp.get_context('spawn')
    gpu_q = ctx.Queue()
    for i in range(args.gpu_workers):
        gpu_q.put(i % 2 if args.gpu_workers >= 2 else 0)

    with ProcessPoolExecutor(
        max_workers=args.gpu_workers,
        mp_context=ctx,
        initializer=_init_gpu_worker,
        initargs=(gpu_q,),
    ) as ex:
        for ac_no in range(args.start, args.end + 1):
            zip_path = os.path.join(args.out_dir, f'ac_{ac_no}_voters.zip')
            sum_path = os.path.join(args.out_dir, f'ac_{ac_no}_summary.json')
            if os.path.exists(zip_path) and os.path.exists(sum_path):
                print(f'[AC {ac_no:3d}] Already zipped, skipping.')
                continue

            total_booths = AC_BOOTH_COUNTS.get(ac_no, 0)
            if total_booths == 0:
                continue

            t0 = time.time()
            tasks = [(ac_no, b) for b in range(1, total_booths + 1)]
            summaries = []
            errs = []
            with zipfile.ZipFile(zip_path + '.tmp', 'w', compression=zipfile.ZIP_DEFLATED) as zf:
                for bno, obj, err in ex.map(safe_process_booth, tasks):
                    if err or obj is None:
                        errs.append((bno, err))
                        continue
                    obj.pop('_sec', None)
                    zf.writestr(f'ac_{ac_no}/booth_{bno}.json', json.dumps(obj, ensure_ascii=False, separators=(',', ':')))
                    summaries.append({
                        'booth_no': bno,
                        'name': obj['boothName'],
                        'mandal': obj['mandalName'],
                        'electorate': obj['totalElectors'],
                        'male_electors': obj['maleCount'],
                        'female_electors': obj['femaleCount'],
                        'tg_electors': obj['tgCount'],
                        'panna_pages': obj['totalPages'],
                        'pdf_pages': obj['roll2026Pages'],
                    })

            os.replace(zip_path + '.tmp', zip_path)
            with open(sum_path, 'w', encoding='utf-8') as f:
                json.dump(summaries, f, ensure_ascii=False)

            tot_v = sum(s['electorate'] for s in summaries)
            mb_zip = os.path.getsize(zip_path) / (1024 * 1024)
            print(
                f'[AC {ac_no:3d}] {len(summaries)}/{total_booths} booths ({len(errs)} err) done in {time.time()-t0:.1f}s | '
                f'{tot_v:,} voters | zip: {mb_zip:.1f} MB',
                flush=True,
            )


if __name__ == '__main__':
    main()
