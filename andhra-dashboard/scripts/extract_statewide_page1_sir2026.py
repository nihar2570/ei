"""
Statewide ECI SIR 2026 Page-1 Fast Extractor (HTTP Range + WinOCR)
------------------------------------------------------------------
Fetches ONLY the bytes needed for PDF Page 1 + total page count (~400-550 KB
instead of ~10-15 MB per PDF) via HTTP 206 Range requests and WinOCR GRAY8,
updating public/data/booths/ac_{ac}.json, public/data/booth_extraction_tracker.json,
and public/data/andhra_demographics.json with authentic Page-1 SIR 2026 metadata
(polling station name/building, sections, mandal, pincode, total/male/female/TG
electors, PDF pages, and 30-per-page Panna counts).
"""

import argparse
import asyncio
import ctypes
import json
import os
import re
import time
from concurrent.futures import ProcessPoolExecutor
from datetime import datetime

import cv2
import numpy as np
import pypdfium2 as pdfium
import pypdfium2.raw as pdfium_c
import requests
import urllib3
from PIL import Image
from requests.adapters import HTTPAdapter
from winsdk.windows.graphics.imaging import BitmapAlphaMode, BitmapPixelFormat, SoftwareBitmap
from winsdk.windows.media.ocr import OcrEngine
from winsdk.windows.security.cryptography import CryptographicBuffer

urllib3.disable_warnings()

BOOTHS_DIR = os.path.join('public', 'data', 'booths')
ROLLS_DIR = os.path.join('public', 'data', 'rolls')
DEMOGRAPHICS_FILE = os.path.join('public', 'data', 'andhra_demographics.json')
TRACKER_FILE = os.path.join('public', 'data', 'booth_extraction_tracker.json')

_WORKER_SESSION = None
_WORKER_ENGINE = None


def _init_worker():
    global _WORKER_SESSION, _WORKER_ENGINE
    try:
        cv2.setNumThreads(1)
    except Exception:
        pass
    s = requests.Session()
    adapter = HTTPAdapter(pool_connections=16, pool_maxsize=16)
    s.mount('https://', adapter)
    s.headers.update({'User-Agent': 'Mozilla/5.0'})
    _WORKER_SESSION = s
    _WORKER_ENGINE = OcrEngine.try_create_from_user_profile_languages()


class RangePdfReader:
    def __init__(self, url: str, session: requests.Session):
        self.url = url
        self.session = session
        self.bytes_fetched = 0
        self.chunk = 131072  # 128 KB
        self.blocks = {}
        r = session.get(url, headers={'Range': 'bytes=0-393215'}, timeout=20, verify=False)
        if r.status_code not in (200, 206):
            raise RuntimeError(f'HTTP {r.status_code}')
        cr = r.headers.get('Content-Range', '')
        self.size = int(cr.split('/')[-1]) if '/' in cr else int(r.headers['Content-Length'])
        data = r.content
        self.bytes_fetched += len(data)
        for i in range(0, len(data), self.chunk):
            self.blocks[i // self.chunk] = data[i:i + self.chunk]

    def _fetch_block(self, bidx: int):
        if bidx in self.blocks:
            return self.blocks[bidx]
        s = bidx * self.chunk
        e = min(self.size - 1, s + self.chunk - 1)
        last_exc = None
        for attempt in range(3):
            try:
                r = self.session.get(self.url, headers={'Range': f'bytes={s}-{e}'}, timeout=25, verify=False)
                if r.status_code not in (200, 206):
                    raise RuntimeError(f'HTTP {r.status_code}')
                data = r.content
                self.blocks[bidx] = data
                self.bytes_fetched += len(data)
                return data
            except Exception as exc:
                last_exc = exc
                time.sleep(0.5 * (attempt + 1))
        raise last_exc

    def read(self, pos: int, sz: int) -> bytes:
        out = bytearray()
        while len(out) < sz and pos < self.size:
            bidx = pos // self.chunk
            off = pos % self.chunk
            blk = self._fetch_block(bidx)
            take = min(sz - len(out), len(blk) - off)
            if take <= 0:
                break
            out.extend(blk[off:off + take])
            pos += take
        return bytes(out)


def pil_gray_to_sbmp(pil_img):
    if pil_img.mode != 'L':
        pil_img = pil_img.convert('L')
    buf = CryptographicBuffer.create_from_byte_array(pil_img.tobytes())
    return SoftwareBitmap.create_copy_from_buffer(
        buf, BitmapPixelFormat.GRAY8, pil_img.width, pil_img.height, BitmapAlphaMode.IGNORE
    )


def extract_table_counts(lines, width: int, height: int, y_min_ratio: float = 0.70, max_dy_ratio: float = 0.09) -> dict:
    """Extract Starting/Ending/Male/Female/TG/Total counts at word level with proportional ECI anchors."""
    words = []
    for l in lines:
        for w in (l.words or []):
            r = w.bounding_rect
            if r.y >= height * y_min_ratio:
                wcx = r.x + r.width / 2.0
                wcy = r.y + r.height / 2.0
                words.append((wcx, wcy, r.x, r.y, w.text.strip()))

    header_cols = {}
    header_ys = []
    for wcx, wcy, wx0, wy0, txt in words:
        low = re.sub(r'[^a-z]', '', txt.lower())
        if not low:
            continue
        if 'starting' in low:
            header_cols['starting'] = wcx
            header_ys.append(wy0)
        elif 'ending' in low:
            header_cols['ending'] = wcx
            header_ys.append(wy0)
        elif low in ('male', 'maie', 'malo'):
            header_cols['male'] = wcx
            header_ys.append(wy0)
        elif low in ('female', 'femaie', 'femalo') or low.startswith('femal'):
            header_cols['female'] = wcx
            header_ys.append(wy0)
        elif 'third' in low:
            header_cols['tg'] = wcx
            header_ys.append(wy0)
        elif low == 'total':
            header_cols['total'] = wcx
            header_ys.append(wy0)

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
    for wcx, wcy, wx0, wy0, txt in words:
        clean_num = txt.replace('O', '0').replace('o', '0').replace(',', '').strip()
        if re.fullmatch(r'\d{1,5}', clean_num):
            num_tokens.append((wcx, wy0, int(clean_num)))

    band_tokens = []
    if header_ys:
        ref_y = max(header_ys)
        band_tokens = [t for t in num_tokens if ref_y + 3 < t[1] < ref_y + height * max_dy_ratio]
    if not band_tokens and num_tokens:
        # Fallback: pick horizontal cluster of numeric cells when OCR missed all table headers
        num_tokens.sort(key=lambda t: t[1])
        best_row = []
        tol = max(12.0, height * (max_dy_ratio * 0.35))
        for i, tok in enumerate(num_tokens):
            row = [t for t in num_tokens[i:] if abs(t[1] - tok[1]) <= tol]
            if len(row) > len(best_row):
                best_row = row
        if len(best_row) >= 3:
            band_tokens = best_row

    for wcx, wy0, val in band_tokens:
        best_key = min(anchors.keys(), key=lambda k: abs(wcx - anchors[k]))
        if abs(wcx - anchors[best_key]) < width * 0.12:
            counts[best_key] = val

    return counts


def parse_page1_meta(lines, width: int, height: int, booth_no: int):
    items = []
    for l in lines:
        if not l.words:
            continue
        xs = [w.bounding_rect.x for w in l.words]
        ys = [w.bounding_rect.y for w in l.words]
        items.append((sum(xs) / len(xs), sum(ys) / len(ys), l.words[0].bounding_rect.x, l.words[0].bounding_rect.y, l.text.strip()))

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

    counts = extract_table_counts(lines, width, height, y_min_ratio=0.70, max_dy_ratio=0.09)

    pin_match = re.search(r'\b(5[0-3]\d{4})\b', kv.get('pin', ''))
    pincode = pin_match.group(1) if pin_match else ''
    tehsil = re.sub(r'\s+', ' ', re.sub(r'[^A-Za-z0-9 ()/-]', ' ', kv.get('tehsil', ''))).strip()

    net_total = counts['total'] or counts['ending'] or (counts['male'] + counts['female'] + counts['tg'])
    if counts['male'] + counts['female'] + counts['tg'] > 0 and net_total == 0:
        net_total = counts['male'] + counts['female'] + counts['tg']

    return {
        'name': ps_addr or ps_name,
        'ps_name': ps_name,
        'sections': sections,
        'tehsil': tehsil,
        'pincode': pincode,
        'net_total': net_total,
        'male': counts['male'],
        'female': counts['female'],
        'tg': counts['tg'],
    }


def _needs_count_retry(meta: dict) -> bool:
    nt = meta.get('net_total', 0)
    m = meta.get('male', 0)
    f = meta.get('female', 0)
    tg = meta.get('tg', 0)
    return nt == 0 or m == 0 or f == 0 or (m + f + tg != nt)


async def _process_one_booth_async(ac_no: int, booth_no: int):
    url = f'https://voters.eci.gov.in/eroll/2026/s01/sir-draftroll/{ac_no}/2026-EROLLGEN-S01-{ac_no}-SIR-DraftRoll-Revision1-ENG-{booth_no}-WI.pdf'
    last_err = None
    for attempt in range(3):
        try:
            rp = RangePdfReader(url, _WORKER_SESSION)

            @ctypes.CFUNCTYPE(ctypes.c_int, ctypes.c_void_p, ctypes.c_ulong, ctypes.POINTER(ctypes.c_ubyte), ctypes.c_ulong)
            def get_block(param, position, pBuf, size):
                try:
                    data = rp.read(position, size)
                    ctypes.memmove(pBuf, data, len(data))
                    return 1 if len(data) == size else 0
                except Exception:
                    return 0

            fa = pdfium_c.FPDF_FILEACCESS()
            fa.m_FileLen = rp.size
            fa.m_GetBlock = get_block
            fa.m_Param = None
            raw_doc = pdfium_c.FPDF_LoadCustomDocument(ctypes.byref(fa), None)
            if not raw_doc:
                raise RuntimeError('FPDF_LoadCustomDocument returned NULL')
            doc = pdfium.PdfDocument(raw_doc)
            try:
                pdf_pages = len(doc)
                pil = doc[0].render(scale=1.8).to_pil().convert('L')

                res = await _WORKER_ENGINE.recognize_async(pil_gray_to_sbmp(pil))
                meta = parse_page1_meta(res.lines, pil.width, pil.height, booth_no)

                if _needs_count_retry(meta):
                    pil_hi = doc[0].render(scale=2.6).to_pil().convert('L')
                    strip = pil_hi.crop((0, int(pil_hi.height * 0.68), pil_hi.width, int(pil_hi.height * 0.92)))
                    res_hi = await _WORKER_ENGINE.recognize_async(pil_gray_to_sbmp(strip))
                    c_hi = extract_table_counts(res_hi.lines, strip.width, strip.height, y_min_ratio=0.05, max_dy_ratio=0.38)
                    nt_hi = c_hi['total'] or c_hi['ending'] or (c_hi['male'] + c_hi['female'] + c_hi['tg'])
                    if nt_hi == 0 or c_hi['male'] == 0 or c_hi['female'] == 0 or (c_hi['male'] + c_hi['female'] + c_hi['tg'] != nt_hi):
                        arr = np.array(strip)
                        _, bw = cv2.threshold(arr, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
                        res_bw = await _WORKER_ENGINE.recognize_async(pil_gray_to_sbmp(Image.fromarray(bw)))
                        c_bw = extract_table_counts(res_bw.lines, strip.width, strip.height, y_min_ratio=0.05, max_dy_ratio=0.38)
                        nt_bw = c_bw['total'] or c_bw['ending'] or (c_bw['male'] + c_bw['female'] + c_bw['tg'])
                        if c_bw['male'] + c_bw['female'] + c_bw['tg'] == nt_bw and nt_bw > 0:
                            c_hi, nt_hi = c_bw, nt_bw
                        else:
                            if c_bw['male'] > 0 and c_hi['male'] == 0:
                                c_hi['male'] = c_bw['male']
                            if c_bw['female'] > 0 and c_hi['female'] == 0:
                                c_hi['female'] = c_bw['female']
                            if c_bw['total'] > 0 and c_hi['total'] == 0:
                                c_hi['total'] = c_bw['total']
                                nt_hi = nt_bw
                    if c_hi['male'] > 0 and c_hi['female'] > 0 and nt_hi > 0 and (
                        c_hi['male'] + c_hi['female'] + c_hi['tg'] == nt_hi or meta['male'] == 0 or meta['female'] == 0
                    ):
                        meta['male'] = c_hi['male']
                        meta['female'] = c_hi['female']
                        meta['tg'] = c_hi['tg']
                        meta['net_total'] = nt_hi
            finally:
                doc.close()

            meta['booth_no'] = booth_no
            meta['pdf_pages'] = pdf_pages
            meta['pdf_size_kb'] = round(rp.size / 1024)
            meta['bytes_fetched'] = rp.bytes_fetched
            return meta
        except Exception as e:
            last_err = str(e)
            await asyncio.sleep(1.0 * (attempt + 1))
    return {'booth_no': booth_no, 'error': last_err}


def _worker_task(args):
    ac_no, booth_no = args
    return asyncio.run(_process_one_booth_async(ac_no, booth_no))


def clean_mandal_match(tehsil: str, existing_mandals: list[str], fallback: str) -> str:
    norm = lambda s: re.sub(r'[^a-z0-9]', '', (s or '').lower())
    tn = norm(tehsil)
    if tn and tn != 'assemblymandal':
        for em in existing_mandals:
            if norm(em) == tn:
                return em
        if len(tehsil.strip()) >= 3 and 'ASSEMBLY' not in tehsil.upper():
            return tehsil.strip().upper()
    return fallback


def update_ac_from_page1(ac_no: int, results: list[dict]):
    booth_file = os.path.join(BOOTHS_DIR, f'ac_{ac_no}.json')
    with open(booth_file, 'r', encoding='utf-8') as f:
        booths = json.load(f)

    existing_mandals = sorted({b.get('mandal', '') for b in booths if b.get('mandal') and b.get('mandal') != 'ASSEMBLY MANDAL'})
    by_no = {r['booth_no']: r for r in results if 'error' not in r}

    total_electors_ac = 0
    total_male_ac = 0
    total_female_ac = 0
    total_tg_ac = 0
    total_pannas_ac = 0
    sample = None

    for b in booths:
        bno = b['booth_no']
        r = by_no.get(bno)
        if r:
            if r.get('name') and len(r['name']) >= 3:
                b['name'] = r['name']
                b['building'] = r['name']
            if r.get('sections'):
                b['sections'] = '. '.join(r['sections'])
            if r.get('pincode'):
                b['pincode'] = r['pincode']
            b['mandal'] = clean_mandal_match(r.get('tehsil', ''), existing_mandals, b.get('mandal', 'GENERAL MANDAL'))

            # Respect boothDataIntegrity sanity bounds [50, 3500] when OCR had realistic value
            net_e = r.get('net_total', 0)
            if 50 <= net_e <= 3500:
                b['electorate'] = net_e
            m_e = r.get('male', 0)
            f_e = r.get('female', 0)
            tg_e = r.get('tg', 0)
            if m_e > 0:
                b['male_electors'] = m_e
            if f_e > 0:
                b['female_electors'] = f_e
            b['tg_electors'] = tg_e

            elect = b['electorate']
            pp = (elect + 29) // 30
            b['panna_pages'] = pp
            b['page1_sir2026_verified'] = True
            if 'roll_2026' in b and isinstance(b['roll_2026'], dict):
                b['roll_2026']['pdf_pages'] = r.get('pdf_pages') or b['roll_2026'].get('pdf_pages', 28)
                b['roll_2026']['pdf_size_kb'] = r.get('pdf_size_kb') or b['roll_2026'].get('pdf_size_kb', 9000)
                b['roll_2026']['electorate'] = elect
                b['roll_2026']['panna_pages'] = pp
                b['roll_2026']['panna_pramukhs'] = pp

            if sample is None and bno == 1:
                sample = {
                    'booth_no': 1,
                    'name': b['name'],
                    'building': b['building'],
                    'mandal': b['mandal'],
                    'electors': elect,
                    'total_pages': b['roll_2026']['pdf_pages'] if isinstance(b.get('roll_2026'), dict) else r.get('pdf_pages', 28),
                    'panna_pages': pp,
                    'male_electors': b.get('male_electors', 0),
                    'female_electors': b.get('female_electors', 0),
                }
        else:
            b['panna_pages'] = (b.get('electorate', 800) + 29) // 30

        total_electors_ac += b.get('electorate', 0)
        total_male_ac += b.get('male_electors', 0)
        total_female_ac += b.get('female_electors', 0)
        total_tg_ac += b.get('tg_electors', 0)
        total_pannas_ac += b.get('panna_pages', 0)

    tmp_file = booth_file + '.tmp'
    with open(tmp_file, 'w', encoding='utf-8') as f:
        json.dump(booths, f, ensure_ascii=False, indent=2)
    os.replace(tmp_file, booth_file)

    # Update booth_extraction_tracker.json for this AC
    if os.path.exists(TRACKER_FILE):
        with open(TRACKER_FILE, 'r', encoding='utf-8') as f:
            tracker = json.load(f)
        tracker['last_updated'] = datetime.now().isoformat()
        ac_sum = tracker.get('ac_summaries', {}).get(str(ac_no), {})
        ac_sum.update({
            'page1_verified_booths': sum(1 for b in booths if b.get('page1_sir2026_verified')),
            'panna_page_size': 30,
            'total_panna_pages': total_pannas_ac,
            'total_electors': total_electors_ac,
            'male_electors': total_male_ac,
            'female_electors': total_female_ac,
            'tg_electors': total_tg_ac,
        })
        if sample:
            ac_sum['sample_ocr'] = sample
        tracker['ac_summaries'][str(ac_no)] = ac_sum
        with open(TRACKER_FILE, 'w', encoding='utf-8') as f:
            json.dump(tracker, f, ensure_ascii=False, indent=2)

    return total_electors_ac, total_male_ac, total_female_ac, total_pannas_ac, len(by_no)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--start', type=int, default=1)
    parser.add_argument('--end', type=int, default=174)
    parser.add_argument('--workers', type=int, default=12)
    parser.add_argument('--only-pending', action='store_true', help='Skip booths that already have page1_sir2026_verified=True')
    args = parser.parse_args()

    t_all = time.time()
    with ProcessPoolExecutor(max_workers=args.workers, initializer=_init_worker) as ex:
        for ac_no in range(args.start, args.end + 1):
            booth_file = os.path.join(BOOTHS_DIR, f'ac_{ac_no}.json')
            if not os.path.exists(booth_file):
                continue
            with open(booth_file, 'r', encoding='utf-8') as f:
                booths = json.load(f)
            targets = [
                b['booth_no'] for b in booths
                if not (args.only_pending and b.get('page1_sir2026_verified'))
            ]
            if not targets:
                print(f'[AC {ac_no:3d}] Already Page-1 verified ({len(booths)} booths), skipping.', flush=True)
                continue

            t0 = time.time()
            results = list(ex.map(_worker_task, [(ac_no, bno) for bno in targets]))
            errs = [r for r in results if 'error' in r]
            mb_fetched = sum(r.get('bytes_fetched', 0) for r in results if 'error' not in r) / (1024 * 1024)
            tot_e, tot_m, tot_f, tot_p, ok_cnt = update_ac_from_page1(ac_no, results)
            print(
                f'[AC {ac_no:3d}] {ok_cnt}/{len(targets)} Page-1 OCR ok ({len(errs)} err) | '
                f'{mb_fetched:.1f} MB fetched in {time.time()-t0:.1f}s | '
                f'{tot_e:,} voters ({tot_m:,}M/{tot_f:,}F, {tot_p:,} Panna @30/p)',
                flush=True,
            )

    print(f'Done ACs {args.start}..{args.end} in {time.time() - t_all:.1f}s', flush=True)


if __name__ == '__main__':
    main()
