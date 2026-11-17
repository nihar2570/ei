"""
Normalize and Clean Mandal Names Across All 175 Andhra Assembly Constituencies
-------------------------------------------------------------------------------
Uses Approach A (Matching Against Known Canonical Mandals + OCR Normalization)
to eliminate corrupted OCR strings, duplicate mandal pins, and fractured Voronoi cells.
"""

import os
import sys
import json
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(BASE_DIR, "scripts"))

from compile_andhra_mandals import KNOWN_MANDALS

PUBLIC_BOOTHS_DIR = os.path.join(BASE_DIR, "public", "data", "booths")
DIST_BOOTHS_DIR = os.path.join(BASE_DIR, "dist", "data", "booths")


def normalize_ocr(s: str) -> str:
    s = s.upper()
    # Normalize common OCR misreadings
    s = s.replace("I-", "L").replace("1-", "L").replace("|-", "L").replace("l-", "L")
    s = s.replace("0", "O")
    s = re.sub(r"[^A-Z0-9]", "", s)
    return s


def levenshtein(s1: str, s2: str) -> int:
    if len(s1) < len(s2):
        return levenshtein(s2, s1)
    if len(s2) == 0:
        return len(s1)
    prev = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        curr = [i + 1]
        for j, c2 in enumerate(s2):
            insert = prev[j + 1] + 1
            delete = curr[j] + 1
            subst = prev[j] + (0 if c1 == c2 else 1)
            curr.append(min(insert, delete, subst))
        prev = curr
    return prev[-1]


def get_canonical_mandals_for_ac(ac_no: int, raw_counts: dict) -> list:
    known = [k.upper().strip() for k in KNOWN_MANDALS.get(ac_no, [])]

    # Specific common regional aliases / full names in electoral rolls
    known = [k if k != "K.V. PALLE" else "KAMBHAMVARIPALLE" for k in known]
    known = [k if k != "VALMIKIPURAM" else "VAYALPAD(VALMIKIPURAM)" for k in known]

    # If raw data has a legitimate mandal with >= 15 booths not yet in known, include it
    for m, cnt in raw_counts.items():
        nm = normalize_ocr(m)
        if cnt >= 15 and not any(levenshtein(nm, normalize_ocr(k)) <= 2 for k in known):
            known.append(m)

    return known


def build_ac_mandal_map(ac_no: int, raw_counts: dict) -> dict:
    canonical = get_canonical_mandals_for_ac(ac_no, raw_counts)
    mapping = {}

    for raw in raw_counts:
        n_raw = normalize_ocr(raw)
        best_cand = None
        best_dist = 999

        for cand in canonical:
            n_cand = normalize_ocr(cand)
            if n_raw == n_cand:
                best_cand = cand
                best_dist = 0
                break
            if n_raw in n_cand or n_cand in n_raw:
                dist = abs(len(n_raw) - len(n_cand))
            else:
                dist = levenshtein(n_raw, n_cand)
            if dist < best_dist:
                best_dist = dist
                best_cand = cand

        if best_cand and (best_dist <= 3 or best_dist <= len(n_raw) * 0.4):
            mapping[raw] = best_cand
        else:
            mapping[raw] = raw.strip().upper()

    return mapping


def process_directories():
    target_dirs = [PUBLIC_BOOTHS_DIR]
    if os.path.exists(DIST_BOOTHS_DIR):
        target_dirs.append(DIST_BOOTHS_DIR)

    total_booths_updated = 0
    total_files_updated = 0

    for target_dir in target_dirs:
        print(f"\nProcessing directory: {target_dir}")
        for ac_no in range(1, 176):
            booth_path = os.path.join(target_dir, f"ac_{ac_no}.json")
            if not os.path.exists(booth_path):
                continue

            with open(booth_path, "r", encoding="utf-8") as f:
                booths = json.load(f)

            if not booths:
                continue

            counts = {}
            for b in booths:
                m = (b.get("mandal") or "").strip().upper()
                if m:
                    counts[m] = counts.get(m, 0) + 1

            alias_map = build_ac_mandal_map(ac_no, counts)

            file_updated = False
            for b in booths:
                raw_m = (b.get("mandal") or "").strip().upper()
                canonical_m = alias_map.get(raw_m, raw_m)
                if canonical_m and canonical_m != b.get("mandal"):
                    b["mandal"] = canonical_m
                    total_booths_updated += 1
                    file_updated = True

            if file_updated:
                total_files_updated += 1
                with open(booth_path, "w", encoding="utf-8") as f:
                    json.dump(booths, f, indent=2, ensure_ascii=False)

    print(f"\n[DONE] Normalized {total_booths_updated} booths across {total_files_updated} AC files.")


if __name__ == "__main__":
    process_directories()
