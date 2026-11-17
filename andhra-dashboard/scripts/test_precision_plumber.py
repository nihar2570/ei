import pdfplumber
import urllib.request
import ssl
import json
import io

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = json.load(open('andhra-dashboard/public/data/form20_urls.json', encoding='utf-8'))
cand_data = json.load(open('andhra-dashboard/public/data/andhra_candidates_2024.json', encoding='utf-8'))

def test_ac100_extraction():
    url = urls['100']
    cands = cand_data['100']['candidates']
    win_cand = cands[0] # Yarapathineni (TDP)
    run_cand = cands[1] # Kasu Mahesh Reddy (YSRCP)

    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
        pdf_bytes = resp.read()

    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        # Find candidate column indices from page 0 table
        table0 = pdf.pages[0].extract_table()
        header_names = table0[1]
        
        win_col = None
        run_col = None
        tot_col = None
        nota_col = None
        
        for idx, cell in enumerate(header_names):
            if not cell:
                continue
            txt = cell.replace('\n', ' ').strip().upper()
            if 'YARAPATHINENI' in txt:
                win_col = idx
            elif 'MAHESH' in txt:
                run_col = idx
                
        # Find total and NOTA columns from row 0
        for idx, cell in enumerate(table0[0]):
            if not cell:
                continue
            txt = cell.replace('\n', ' ').strip().upper()
            if txt == 'TOTAL' or txt.startswith('TOTAL\n'):
                tot_col = idx
            elif 'NOTA' in txt:
                nota_col = idx
            elif 'TOTAL OF VALID' in txt or 'TOTAL\nOF\nVALID' in txt:
                valid_col = idx
                
        print(f"Detected Columns: Winner (TDP)={win_col}, Runner (YSRCP)={run_col}, Total={tot_col}, NOTA={nota_col}")
        
        # Now extract all booths across all pages!
        cum_w = 0
        cum_r = 0
        cum_tot = 0
        booths = []
        
        for p_idx, page in enumerate(pdf.pages):
            t = page.extract_table()
            if not t:
                continue
            for r in t:
                first = str(r[0] or '').strip()
                if first.isdigit():
                    b_no = int(first)
                    w_v = int(str(r[win_col] or 0).replace(',', ''))
                    r_v = int(str(r[run_col] or 0).replace(',', ''))
                    tot_v = int(str(r[tot_col] or 0).replace(',', ''))
                    cum_w += w_v
                    cum_r += r_v
                    cum_tot += tot_v
                    booths.append((b_no, w_v, r_v, tot_v))
                    
        print(f"Extracted {len(booths)} booths!")
        off_w = win_cand['evm_votes']
        off_r = run_cand['evm_votes']
        print(f"TDP:   Extracted = {cum_w:,} | Official EVM = {off_w:,} (Delta: {cum_w - off_w:+d})")
        print(f"YSRCP: Extracted = {cum_r:,} | Official EVM = {off_r:,} (Delta: {cum_r - off_r:+d})")

test_ac100_extraction()
