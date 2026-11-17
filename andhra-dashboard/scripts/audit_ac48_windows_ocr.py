"""
Full audit of AC 48 (Mandapeta) using native Windows OCR (winocr / Windows.Media.Ocr).
Reconstructs the table from word bounding boxes, calculates cumulative extracted votes,
and measures the exact discrepancy (delta) against official Returning Officer certified EVM totals.
"""

import asyncio
import io
import json
import os
import re
import sys
import pypdfium2 as pdfium
import winocr
from PIL import Image

OFFICIAL_AC_NO = 48
OFFICIAL_AC_NAME = "MANDAPETA"
OFFICIAL_WIN_NAME = "Jogeswara Rao.V"
OFFICIAL_WIN_PARTY = "TDP"
OFFICIAL_WIN_EVM = 114564

OFFICIAL_RUN_NAME = "Thota Trimurthulu"
OFFICIAL_RUN_PARTY = "YSRCP"
OFFICIAL_RUN_EVM = 71155

OFFICIAL_TOTAL_EVM = 191894
PDF_PATH = "temp_ac48.pdf"

def clean_ocr_number(text):
    """Converts OCR garbled tokens like '58B', 'IO', '1421S' into digits."""
    s = text.strip()
    # Common OCR substitutions in numbers
    s = s.replace('O', '0').replace('o', '0').replace('I', '1').replace('l', '1').replace('B', '8').replace('S', '5').replace('s', '5')
    digits = re.findall(r'\d+', s)
    return int(digits[0]) if digits else None

async def process_page_with_winocr(pdf, p_idx):
    page = pdf[p_idx]
    # Render at 2.0x scale for crisp OCR
    img = page.render(scale=2.0).to_pil()
    ocr_res = await winocr.recognize_pil(img, 'en')

    # Collect all words with bounding boxes
    words = []
    for line in ocr_res.lines:
        for w in line.words:
            rect = w.bounding_rect
            val = clean_ocr_number(w.text)
            words.append({
                'text': w.text,
                'val': val,
                'x': rect.x,
                'y': rect.y,
                'w': rect.width,
                'h': rect.height
            })
    return words

async def main():
    print("=" * 70)
    print(f"🔍 WINDOWS OCR AUDIT BENCHMARK: AC {OFFICIAL_AC_NO} ({OFFICIAL_AC_NAME})")
    print(f"   Official Certified EVM Totals:")
    print(f"   • Winner: {OFFICIAL_WIN_NAME} ({OFFICIAL_WIN_PARTY}) = {OFFICIAL_WIN_EVM:,} votes")
    print(f"   • Runner: {OFFICIAL_RUN_NAME} ({OFFICIAL_RUN_PARTY}) = {OFFICIAL_RUN_EVM:,} votes")
    print(f"   • Total EVM Polled: {OFFICIAL_TOTAL_EVM:,} votes")
    print("=" * 70)

    pdf = pdfium.PdfDocument(PDF_PATH)
    num_pages = len(pdf)
    print(f"Loaded {num_pages} pages from {PDF_PATH}.\nProcessing with native Windows.Media.Ocr...")

    all_pages_words = []
    for p_idx in range(num_pages):
        words = await process_page_with_winocr(pdf, p_idx)
        all_pages_words.append(words)
        print(f"  Page {p_idx+1:2d}/{num_pages:2d}: {len(words):3d} OCR words detected")

    print("\nReconstructing tabular columns and booths across all pages...")

    # Discover column X centroids across all data numbers (y > 350)
    data_numbers = []
    for p_idx, words in enumerate(all_pages_words):
        y_min = 350 if p_idx == 0 else 180  # Page 0 has large header
        for w in words:
            if w['val'] is not None and w['y'] >= y_min:
                data_numbers.append(w)

    print(f"Total numerical cells detected by Windows OCR: {len(data_numbers)}")

    # Histogram of X coordinates to find candidate columns
    # Column 0: Booth No (~80)
    # Column 1: Cand 1 (~210)
    # Column 2: Cand 2 (~250)
    # Column 3: Cand 3 (~290)
    # etc...
    # Let's cluster numbers into X-bins
    x_bins = {}
    for w in data_numbers:
        # group within 25px
        bx = int(round(w['x'] / 25.0) * 25)
        x_bins.setdefault(bx, []).append(w['val'])

    sorted_bins = sorted(x_bins.items(), key=lambda item: item[0])
    print("\nDetected Column X-Centroids & Column Sums from Windows OCR:")
    col_candidates = []
    for bx, vals in sorted_bins:
        s = sum(vals)
        cnt = len(vals)
        print(f"  X ~ {bx:4d} px | Entries: {cnt:3d} | Sum: {s:10,d}")
        col_candidates.append((bx, cnt, s, vals))

    # Match Candidate 1 (TDP: ~114,564) and Candidate 2 (YSRCP: ~71,155)
    best_tdp = None
    best_ysr = None
    min_tdp_diff = 9999999
    min_ysr_diff = 9999999

    for bx, cnt, s, vals in col_candidates:
        if bx < 150: # Likely booth no
            continue
        diff_tdp = abs(s - OFFICIAL_WIN_EVM)
        diff_ysr = abs(s - OFFICIAL_RUN_EVM)

        if diff_tdp < min_tdp_diff:
            min_tdp_diff = diff_tdp
            best_tdp = (bx, s, cnt)

        if diff_ysr < min_ysr_diff:
            min_ysr_diff = diff_ysr
            best_ysr = (bx, s, cnt)

    # Booth Detection: Look at X < 150
    booth_numbers_detected = set()
    for w in data_numbers:
        if w['x'] < 130 and 1 <= w['val'] <= 300:
            booth_numbers_detected.add(w['val'])

    print("\n" + "=" * 70)
    print("📊 WINDOWS OCR EXTRACTION & TALLY AUDIT REPORT")
    print("=" * 70)

    print(f"1. Polling Booth Detection:")
    print(f"   • Expected Polling Stations in AC 48: 219 booths")
    print(f"   • Booths successfully recognized by Windows OCR: {len(booth_numbers_detected)} / 219")
    print(f"   • Missing / Unrecognized Booths: {219 - len(booth_numbers_detected)} booths ({(219 - len(booth_numbers_detected))/219*100:.1f}% failure rate)")

    print(f"\n2. Candidate Vote Sums & Delta:")
    if best_tdp:
        bx, s_tdp, cnt_tdp = best_tdp
        delta_tdp = s_tdp - OFFICIAL_WIN_EVM
        print(f"   • Winner ({OFFICIAL_WIN_PARTY} - {OFFICIAL_WIN_NAME}):")
        print(f"     - Extracted by Windows OCR: {s_tdp:,} votes (from {cnt_tdp} rows at X={bx})")
        print(f"     - Certified Official EVM:   {OFFICIAL_WIN_EVM:,} votes")
        print(f"     - DELTA (Discrepancy):      {delta_tdp:+d} votes ({abs(delta_tdp)/OFFICIAL_WIN_EVM*100:.2f}% error)")
    else:
        print(f"   • Winner ({OFFICIAL_WIN_PARTY}): ❌ Could not identify column")

    if best_ysr:
        bx, s_ysr, cnt_ysr = best_ysr
        delta_ysr = s_ysr - OFFICIAL_RUN_EVM
        print(f"\n   • Runner ({OFFICIAL_RUN_PARTY} - {OFFICIAL_RUN_NAME}):")
        print(f"     - Extracted by Windows OCR: {s_ysr:,} votes (from {cnt_ysr} rows at X={bx})")
        print(f"     - Certified Official EVM:   {OFFICIAL_RUN_EVM:,} votes")
        print(f"     - DELTA (Discrepancy):      {delta_ysr:+d} votes ({abs(delta_ysr)/OFFICIAL_RUN_EVM*100:.2f}% error)")
    else:
        print(f"   • Runner ({OFFICIAL_RUN_PARTY}): ❌ Could not identify column")

    # Total EVM polled column
    best_tot = max(col_candidates, key=lambda c: c[2]) if col_candidates else None
    if best_tot:
        s_tot = best_tot[2]
        delta_tot = s_tot - OFFICIAL_TOTAL_EVM
        print(f"\n   • Total EVM Polled:")
        print(f"     - Extracted by Windows OCR: {s_tot:,} votes")
        print(f"     - Certified Official EVM:   {OFFICIAL_TOTAL_EVM:,} votes")
        print(f"     - DELTA (Discrepancy):      {delta_tot:+d} votes")

    print("\n" + "=" * 70)

if __name__ == '__main__':
    asyncio.run(main())
