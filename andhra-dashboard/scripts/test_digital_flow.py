import os
import json
import urllib.request
import ssl
import pypdf
import io

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

candidates = json.load(open('andhra-dashboard/public/data/andhra_candidates_2024.json', encoding='utf-8'))
urls = json.load(open('andhra-dashboard/public/data/form20_urls.json', encoding='utf-8'))

def test_digital_ac(ac_no):
    meta = candidates.get(str(ac_no), {})
    url = urls.get(str(ac_no))
    print(f"\n--- Testing Digital Extraction for AC {ac_no}: {meta.get('ac_name')} ---")
    print(f"URL: {url}")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
        pdf_bytes = resp.read()

    reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
    print(f"Pages: {len(reader.pages)}")
    first_page_text = reader.pages[0].extract_text() or ''
    print(f"Page 1 Text Sample:\n{first_page_text[:400]}")

test_digital_ac(100)
