"""
Precision ECI Form-20 Worker
Extracts certified booth votes for an assigned shard of Assembly Constituencies.
"""

import argparse
import asyncio
import json
import os
import re
import ssl
import sys
import time
import urllib.request
import pypdf
import pypdfium2 as pdfium
from PIL import Image

from winsdk.windows.media.ocr import OcrEngine
from winsdk.windows.graphics.imaging import SoftwareBitmap, BitmapPixelFormat, BitmapAlphaMode
from winsdk.windows.security.cryptography import CryptographicBuffer

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

CANDIDATES_FILE = 'public/data/andhra_candidates_2024.json'
URLS_FILE = 'public/data/form20_urls.json'
BOOTHS_DIR = 'public/data/booths'

async def ocr_img(pil_img, engine):
    im = pil_img.convert('L')
    buf = CryptographicBuffer.create_from_byte_array(im.tobytes())
    sbmp = SoftwareBitmap.create_copy_from_buffer(buf, BitmapPixelFormat.GRAY8, im.width, im.height, BitmapAlphaMode.IGNORE)
    return await engine.recognize_async(sbmp)

def cluster_by_y(items, y_tol=18):
    items.sort(key=lambda t: t['y'])
    rows = []
    for it in items:
        placed = False
        for r in rows:
            if abs(r['y'] - it['y']) <= y_tol:
                r['items'].append(it)
                r['y'] = sum(x['y'] for x in r['items']) / len(r['items'])
                placed = True
                break
        if not placed:
            rows.append({'y': it['y'], 'items': [it]})
    return rows

def is_genuine_digital(pdf_path, expected_names):
    try:
        reader = pypdf.PdfReader(pdf_path)
        text = ' '.join((p.extract_text() or '') for p in reader.pages[:3]).upper()
        # Must match at least one candidate first or last name
        for name in expected_names:
            parts = [p.upper() for p in name.split() if len(p) >= 3]
            for part in parts:
                if part in text:
                    return True
        return False
    except Exception:
        return False

def parse_digital_pdf(pdf_path, ac_no, cand_meta):
    try:
        reader = pypdf.PdfReader(pdf_path)
        booth_map = {}
        
        for p_idx, p in enumerate(reader.pages):
            text = p.extract_text() or ''
            for line in text.split('\n'):
                nums = [int(x) for x in re.findall(r'\b\d+\b', line)]
                if len(nums) >= 6:
                    b_no = None
                    if nums[0] == nums[1] and 1 <= nums[0] <= 550:
                        b_no = nums[0]
                        c_votes = nums[2:-3] if len(nums) >= 7 else nums[2:-1]
                        tot = nums[-3] if len(nums) >= 7 else nums[-1]
                    elif 1 <= nums[0] <= 550 and len(nums) >= 7:
                        b_no = nums[0]
                        c_votes = nums[1:-3] if len(nums) >= 7 else nums[1:-1]
                        tot = nums[-3] if len(nums) >= 7 else nums[-1]
                    
                    if b_no and c_votes and 40 <= tot <= 1500:
                        c_sorted = sorted(c_votes, reverse=True)
                        w_v = c_sorted[0]
                        r_v = c_sorted[1] if len(c_sorted) > 1 else 0
                        if w_v + r_v <= tot:
                            oth_v = max(0, tot - w_v - r_v)
                            if oth_v <= 250:
                                booth_map[b_no] = {
                                    'booth_no': b_no,
                                    'win_votes': w_v,
                                    'run_votes': r_v,
                                    'oth_votes': oth_v,
                                    'total_votes': tot,
                                    'page': p_idx
                                }
        return booth_map if len(booth_map) >= 80 else None
    except Exception:
        return None

async def extract_scanned_pdf(pdf_path, ac_no, cand_meta, engine):
    pdf = pdfium.PdfDocument(pdf_path)
    num_pages = len(pdf)
    booth_map = {}
    
    for p_idx in range(num_pages):
        page = pdf[p_idx]
        pil = page.render(scale=2.2).to_pil()
        w, h = pil.size
        
        # Determine initial header bound
        header_y = int(h * 0.12) if p_idx == 0 else int(h * 0.08)
        
        # 1. Left band OCR (booth numbers)
        left_band = pil.crop((0, header_y, int(w * 0.28), h))
        res_l = await ocr_img(left_band, engine)
        
        # Detect table boundaries
        min_y = header_y
        max_y = h - 20
        
        for l in res_l.lines:
            txt_upper = l.text.upper()
            if any(k in txt_upper for k in ['TOTAL', 'GRAND TOTAL', 'SUB TOTAL', 'VALID VOTES']):
                max_y = min(max_y, l.words[0].bounding_rect.y + header_y - 5)
            if any(k in txt_upper for k in ['FORM 20', 'FINAL RESULT', 'LEGISLATIVE', 'ELECTORS IN', 'POLLING STATION']):
                min_y = max(min_y, l.words[0].bounding_rect.y + header_y + 20)
                
        booth_tokens = []
        for l in res_l.lines:
            for w_item in l.words:
                txt = w_item.text.strip().replace('O', '0').replace('o', '0')
                if txt.isdigit():
                    val = int(txt)
                    abs_y = w_item.bounding_rect.y + header_y
                    if 1 <= val <= 500 and min_y <= abs_y < max_y:
                        booth_tokens.append({
                            'x': w_item.bounding_rect.x,
                            'y': abs_y,
                            'b_no': val
                        })
                        
        booth_rows = cluster_by_y(booth_tokens, y_tol=18)
        ps_by_y = []
        for r in booth_rows:
            b_vals = [it['b_no'] for it in r['items']]
            chosen_b = b_vals[0]
            for v in b_vals:
                if b_vals.count(v) >= 2:
                    chosen_b = v
                    break
            ps_by_y.append({'y': r['y'], 'b_no': chosen_b})
            
        # 2. Right band OCR (candidate votes & totals)
        right_band = pil.crop((int(w * 0.22), header_y, w, h))
        res_r = await ocr_img(right_band, engine)
        
        vote_tokens = []
        for l in res_r.lines:
            for w_item in l.words:
                txt = w_item.text.strip().replace('O', '0').replace('o', '0')
                abs_y = w_item.bounding_rect.y + header_y
                if txt.isdigit() and min_y <= abs_y < max_y:
                    val = int(txt)
                    vote_tokens.append({
                        'x': w_item.bounding_rect.x + int(w * 0.22),
                        'y': abs_y,
                        'val': val
                    })
                    
        vote_rows = cluster_by_y(vote_tokens, y_tol=18)
        
        for ps in ps_by_y:
            b_no = ps['b_no']
            if b_no in booth_map:
                continue
                
            closest_r = None
            min_dy = 999
            for r in vote_rows:
                dy = abs(r['y'] - ps['y'])
                if dy < min_dy and dy <= 22:
                    min_dy = dy
                    closest_r = r
                    
            if not closest_r:
                continue
                
            items = sorted(closest_r['items'], key=lambda it: it['x'])
            if len(items) < 2:
                continue
                
            # Rightmost totals (must be within realistic polling range 50 to 1500)
            valid_totals = [it['val'] for it in items if it['x'] > w * 0.65 and 50 <= it['val'] <= 1500]
            tot_v = valid_totals[-1] if valid_totals else 0
            
            # Candidate columns (left of the totals)
            cand_vals = [it['val'] for it in items if it['x'] <= w * 0.68 and it['val'] <= 1400]
            if not cand_vals:
                continue
                
            cand_sorted = sorted(cand_vals, reverse=True)
            top1 = cand_sorted[0]
            top2 = cand_sorted[1] if len(cand_sorted) > 1 else 0
            
            # Candidate sanity
            if top1 < 10 or top1 > 1400:
                continue
                
            # Check / derive total votes
            if tot_v == 0 or tot_v < (top1 + top2) or tot_v > 1500:
                # Sum candidate numbers
                tot_v = top1 + top2 + sum(cand_sorted[2:5])
                
            if tot_v < 40 or tot_v > 1500:
                continue
                
            oth_v = max(0, tot_v - top1 - top2)
            if oth_v > 250:
                continue  # Anomaly protection: excessive other votes indicates misaligned column
                
            # Candidate mapping: assign top1 / top2 in left-to-right ballot order
            cand_matches = [it for it in items if it['val'] in (top1, top2) and it['x'] <= w * 0.68]
            cand_matches.sort(key=lambda it: it['x'])
            
            if len(cand_matches) >= 2:
                w_v = cand_matches[0]['val']
                r_v = cand_matches[1]['val']
            else:
                w_v = top1
                r_v = top2
                
            booth_map[b_no] = {
                'booth_no': b_no,
                'win_votes': w_v,
                'run_votes': r_v,
                'oth_votes': oth_v,
                'total_votes': tot_v,
                'page': p_idx
            }
            
    return booth_map

async def process_ac(ac_no, engine, urls, candidates_data, worker_id):
    ac_str = str(ac_no)
    url = urls.get(ac_str)
    if not url:
        return None
        
    cand_meta = candidates_data.get(ac_str, {})
    ac_name = cand_meta.get('ac_name', f'AC {ac_no}')
    win_cand = cand_meta.get('candidates', [{}])[0].get('name', 'Winner')
    win_party = cand_meta.get('candidates', [{}])[0].get('party', 'TDP')
    win_share = cand_meta.get('candidates', [{}])[0].get('vote_share', 52.0) / 100.0
    run_cand = cand_meta.get('candidates', [{}])[1].get('name', 'Runner-up') if len(cand_meta.get('candidates', [])) > 1 else 'Runner-up'
    run_party = cand_meta.get('candidates', [{}])[1].get('party', 'YSRCP') if len(cand_meta.get('candidates', [])) > 1 else 'YSRCP'
    run_share = cand_meta.get('candidates', [{}])[1].get('vote_share', 42.0) / 100.0 if len(cand_meta.get('candidates', [])) > 1 else 0.42

    booth_file = os.path.join(BOOTHS_DIR, f'ac_{ac_no}.json')
    if not os.path.exists(booth_file):
        return None
        
    with open(booth_file, 'r', encoding='utf-8') as f:
        booths = json.load(f)
        
    # Check if already 90%+ certified
    existing_cert = sum(1 for b in booths if 'OFFICIAL' in b.get('form20_source', ''))
    if existing_cert >= len(booths) * 0.85:
        print(f"[W{worker_id}] ▶ [AC {ac_no:3d} {ac_name.upper()}] ALREADY CERTIFIED ({existing_cert}/{len(booths)} booths) - SKIPPED", flush=True)
        return 'SKIPPED'
        
    print(f"\n[W{worker_id}] =======================================================", flush=True)
    print(f"[W{worker_id}] ▶ [AC {ac_no:3d} {ac_name.upper()}] Form-20 Precision Extraction", flush=True)
    print(f"[W{worker_id}]   Contest: {win_cand} ({win_party}) vs {run_cand} ({run_party})", flush=True)
    
    t0 = time.time()
    pdf_temp = f"temp_w{worker_id}_{ac_no}.pdf"
    booth_map = None
    method = "MANDAL_MODEL_ESTIMATE"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=40) as resp:
            with open(pdf_temp, 'wb') as f:
                f.write(resp.read())
                
        # 1. Try digital text if genuinely digital
        expected_names = [win_cand, run_cand]
        if is_genuine_digital(pdf_temp, expected_names):
            booth_map = parse_digital_pdf(pdf_temp, ac_no, cand_meta)
            if booth_map:
                method = "OFFICIAL_FORM_20_DIGITAL"
                print(f"[W{worker_id}]   Verified Genuine Digital Text: {len(booth_map)} booths extracted in {time.time()-t0:.1f}s!", flush=True)
                
        # 2. If not digital or digital extraction returned < 80 booths, run Scanned Two-Band OCR
        if not booth_map or len(booth_map) < 80:
            method = "OFFICIAL_FORM_20_OCR"
            print(f"[W{worker_id}]   Scanned PDF: Running Precision Grid OCR...", flush=True)
            booth_map = await extract_scanned_pdf(pdf_temp, ac_no, cand_meta, engine)
            print(f"[W{worker_id}]   Precision OCR: {len(booth_map) if booth_map else 0} booths extracted in {time.time()-t0:.1f}s!", flush=True)
            
    except Exception as e:
        print(f"[W{worker_id}]   Download/Extraction error for AC {ac_no}: {e}", flush=True)
        booth_map = None
    finally:
        if os.path.exists(pdf_temp):
            try: os.remove(pdf_temp)
            except Exception: pass
            
    if not booth_map:
        booth_map = {}
        
    verified_cnt = 0
    inherited_cnt = 0
    model_cnt = 0
    
    for b in booths:
        b_no = b['booth_no']
        electorate = b.get('electorate', 950)
        
        # Check if record in booth_map and passes physical bounds
        rec = booth_map.get(b_no)
        is_rec_valid = False
        if rec:
            tot = rec['total_votes']
            w_v = rec['win_votes']
            r_v = rec['run_votes']
            oth_v = rec['oth_votes']
            turnout_calc = (tot / max(1, electorate)) * 100
            if 40 <= tot <= 1500 and turnout_calc <= 100.0 and (w_v + r_v) <= tot and oth_v <= 250:
                is_rec_valid = True
                
        if is_rec_valid:
            w_v = rec['win_votes']
            r_v = rec['run_votes']
            tot = rec['total_votes']
            oth_v = rec['oth_votes']
            src = method
            verified_cnt += 1
        else:
            # Campus sister booth check
            sisters = [s for s in booths if s['booth_no'] < b_no and s.get('lat') == b.get('lat') and s.get('lng') == b.get('lng')]
            sister_match = None
            for s in sisters:
                if s['booth_no'] in booth_map:
                    sister_match = s['booth_no']
                    break
            if sister_match:
                rec_sis = booth_map[sister_match]
                parent_elec = max(1, [x.get('electorate', 950) for x in booths if x['booth_no'] == sister_match][0])
                ratio = electorate / parent_elec
                w_v = max(10, int(rec_sis['win_votes'] * ratio))
                r_v = max(10, int(rec_sis['run_votes'] * ratio))
                tot = max(w_v + r_v + 5, int(rec_sis['total_votes'] * ratio))
                oth_v = max(0, tot - w_v - r_v)
                src = f"CAMPUS_INHERITED_PS_{sister_match}"
                inherited_cnt += 1
            else:
                m_turnout = 0.77
                polled = int(electorate * m_turnout)
                w_v = int(polled * win_share)
                r_v = int(polled * run_share)
                tot = polled
                oth_v = max(0, tot - w_v - r_v)
                src = "MANDAL_MODEL_ESTIMATE"
                model_cnt += 1
                
        if w_v >= r_v:
            winner = win_party
            margin = w_v - r_v
        else:
            winner = run_party
            margin = r_v - w_v
            
        margin_pct = round((margin / max(1, tot)) * 100, 1)
        turnout_pct = round((tot / max(1, electorate)) * 100, 1)
        
        b['total_votes'] = tot
        b['turnout_pct'] = min(100.0, turnout_pct)
        b['winner_party'] = winner
        b['margin'] = margin
        b['margin_pct'] = margin_pct
        b['form20_source'] = src
        b['form20_verified'] = (src in ["OFFICIAL_FORM_20_DIGITAL", "OFFICIAL_FORM_20_OCR"])
        b['votes'] = {win_party: w_v, run_party: r_v, 'OTH': oth_v}
        b['candidates'] = {
            f"{win_cand} ({win_party})": w_v,
            f"{run_cand} ({run_party})": r_v,
            "Others": oth_v
        }
        b['tier'] = "SECURE" if margin_pct > 15 else ("LEAN" if margin_pct > 5 else "BATTLEGROUND")
        b['triage'] = "secure" if margin_pct > 15 else ("lean" if margin_pct > 5 else "battleground")
        
    with open(booth_file, 'w', encoding='utf-8') as f:
        json.dump(booths, f, indent=2, ensure_ascii=False)
        
    elapsed = time.time() - t0
    print(f"[W{worker_id}] ✔ [AC {ac_no:3d} {ac_name.upper()}] COMPLETED in {elapsed:.1f}s: {verified_cnt} verified, {inherited_cnt} campus-inherited, {model_cnt} model fallback", flush=True)
    return 'DONE'

async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--worker-id', type=int, required=True)
    parser.add_argument('--num-workers', type=int, default=4)
    args = parser.parse_args()
    
    wid = args.worker_id
    n_workers = args.num_workers
    
    # Stagger worker startup to avoid concurrent burst on CEO Andhra
    await asyncio.sleep(wid * 0.75)
    
    engine = OcrEngine.try_create_from_user_profile_languages()
    urls = json.load(open(URLS_FILE, encoding='utf-8'))
    cand_data = json.load(open(CANDIDATES_FILE, encoding='utf-8'))
    
    # Identify pending ACs
    pending_acs = []
    for ac in range(1, 176):
        bf = os.path.join(BOOTHS_DIR, f'ac_{ac}.json')
        if os.path.exists(bf):
            data = json.load(open(bf, encoding='utf-8'))
            model_cnt = sum(1 for b in data if b.get('form20_source') == 'MANDAL_MODEL_ESTIMATE')
            if model_cnt > 40:
                pending_acs.append(ac)
                
    my_acs = [ac for idx, ac in enumerate(pending_acs) if idx % n_workers == wid]
    print(f"[W{wid}] Worker {wid} initialized. Assigned {len(my_acs)} ACs to process.", flush=True)
    
    for ac in my_acs:
        await process_ac(ac, engine, urls, cand_data, wid)
        await asyncio.sleep(0.5) # Gentle rate-limit pause
        
    print(f"[W{wid}] Worker {wid} COMPLETED ALL ASSIGNED ACs!", flush=True)

if __name__ == '__main__':
    asyncio.run(main())
