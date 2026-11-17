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

def inspect_header(ac_no):
    url = urls.get(str(ac_no))
    cands = cand_data.get(str(ac_no), {}).get('candidates', [])
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
        pdf_bytes = resp.read()

    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        table = pdf.pages[0].extract_table()
        print(f"\n--- AC {ac_no} ({cand_data.get(str(ac_no),{}).get('ac_name')}) ---")
        for r_idx, r in enumerate(table[:4]):
            print(f"Row {r_idx}: {r}")

inspect_header(100)
