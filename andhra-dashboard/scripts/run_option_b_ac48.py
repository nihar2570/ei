"""
Local Table Engine: OpenCV Morphological Grid Reconstruction + RapidOCR (PP-Structure ONNX)
Executes Option B across all pages of AC 48, tallies booth-by-booth votes, and audits against official ECI totals.
"""

import sys
import io
import os
import re
import time
import numpy as np
import cv2
import fitz
from rapidocr_onnxruntime import RapidOCR

PDF_PATH = "temp_ac48.pdf"
OFFICIAL_WIN_EVM = 114564   # TDP (Jogeswara Rao.V)
OFFICIAL_RUN_EVM = 71155    # YSRCP (Thota Trimurthulu)
OFFICIAL_TOT_EVM = 191894

def clean_val(text):
    if not text or text in ('-', '一', '—', '.'):
        return 0
    t = str(text).replace(',', '').strip()
    # Map common OCR confusion in isolated digits
    t = t.replace('O', '0').replace('o', '0').replace('I', '1').replace('l', '1').replace('B', '8')
    m = re.findall(r'\d+', t)
    return int(m[0]) if m else 0

def extract_page_table(page, engine):
    pix = page.get_pixmap(dpi=300)
    img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
    if pix.n == 4:
        img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 1. Morphological grid detection
    _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)
    h_lines = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (40, 1)), iterations=2)
    v_lines = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (1, 40)), iterations=2)
    table_grid = cv2.add(h_lines, v_lines)
    contours, _ = cv2.findContours(table_grid, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    # Filter rectangular cell boxes
    cells = [cv2.boundingRect(c) for c in contours if 30 < cv2.boundingRect(c)[2] < 350 and 20 < cv2.boundingRect(c)[3] < 90]
    if not cells:
        return []

    # Sort and cluster into rows
    cells.sort(key=lambda c: (c[1], c[0]))
    rows = []
    curr_row = []
    curr_y = None
    for c in cells:
        x, y, w, h = c
        if curr_y is None or abs(y - curr_y) < 16:
            curr_row.append(c)
            curr_y = y
        else:
            curr_row.sort(key=lambda item: item[0])
            rows.append(curr_row)
            curr_row = [c]
            curr_y = y
    if curr_row:
        curr_row.sort(key=lambda item: item[0])
        rows.append(curr_row)

    # 2. Run RapidOCR
    res, _ = engine(img)
    if not res:
        return []

    # Map text boxes to nearest cell
    grid = {}
    for box, text, score in res:
        cx = (box[0][0] + box[2][0]) / 2
        cy = (box[0][1] + box[2][1]) / 2
        for r_idx, r in enumerate(rows):
            for c_idx, (rx, ry, rw, rh) in enumerate(r):
                if rx - 8 <= cx <= rx + rw + 8 and ry - 8 <= cy <= ry + rh + 8:
                    grid[(r_idx, c_idx)] = text
                    break

    # Extract parsed rows
    parsed_rows = []
    for r_idx, r in enumerate(rows):
        row_vals = [grid.get((r_idx, c_idx), '') for c_idx in range(len(r))]
        parsed_rows.append(row_vals)
    return parsed_rows

def main():
    print("=" * 70)
    print("🚀 RUNNING LOCAL OPENCV + ONNX TABLE PIPELINE (OPTION B) ON AC 48")
    print("=" * 70)

    engine = RapidOCR()
    doc = fitz.open(PDF_PATH)
    total_pages = len(doc)

    all_booths = {}
    start_time = time.time()

    for p_idx in range(total_pages):
        t0 = time.time()
        p_rows = extract_page_table(doc[p_idx], engine)
        elapsed = time.time() - t0

        page_booths = 0
        for row in p_rows:
            if not row or len(row) < 5:
                continue
            first = clean_val(row[0])
            if 1 <= first <= 300:
                # In AC 48 Mandapeta: Col 3 is TDP (Winner), Col 4 is YSRCP (Runner)
                w_v = clean_val(row[3]) if len(row) > 3 else 0
                r_v = clean_val(row[4]) if len(row) > 4 else 0
                tot_v = clean_val(row[-2]) if len(row) >= 6 else (w_v + r_v)
                all_booths[first] = {
                    'booth_no': first,
                    'win_votes': w_v,
                    'run_votes': r_v,
                    'total_votes': tot_v
                }
                page_booths += 1

        print(f"  Page {p_idx+1:2d}/{total_pages:2d}: extracted {page_booths:2d} booths ({elapsed:.1f}s)")

    total_time = time.time() - start_time
    print(f"\nProcessing complete in {total_time:.1f}s (Average: {total_time/total_pages:.1f}s / page)")

    # Audit Tally Verification
    cum_w = sum(b['win_votes'] for b in all_booths.values())
    cum_r = sum(b['run_votes'] for b in all_booths.values())
    cum_tot = sum(b['total_votes'] for b in all_booths.values())

    delta_w = cum_w - OFFICIAL_WIN_EVM
    delta_r = cum_r - OFFICIAL_RUN_EVM

    print("\n" + "=" * 70)
    print("📊 OPTION B AUDIT TALLY REPORT (AC 48: MANDAPETA)")
    print("=" * 70)
    print(f"Total Polling Stations Extracted: {len(all_booths)} / 219")
    print(f"• Winner (TDP - Jogeswara Rao.V):")
    print(f"  Extracted = {cum_w:,} | Official EVM = {OFFICIAL_WIN_EVM:,} | DELTA = {delta_w:+d} ({abs(delta_w)/OFFICIAL_WIN_EVM*100:.2f}%)")
    print(f"• Runner (YSRCP - Thota Trimurthulu):")
    print(f"  Extracted = {cum_r:,} | Official EVM = {OFFICIAL_RUN_EVM:,} | DELTA = {delta_r:+d} ({abs(delta_r)/OFFICIAL_RUN_EVM*100:.2f}%)")
    print(f"• Total Polled EVM Votes:")
    print(f"  Extracted = {cum_tot:,} | Official EVM = {OFFICIAL_TOT_EVM:,}")
    print("=" * 70)

if __name__ == '__main__':
    main()
