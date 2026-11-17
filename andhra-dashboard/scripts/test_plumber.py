import pdfplumber
import urllib.request
import ssl
import json
import io

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://ceoandhra.nic.in/ceoap_new/ceo/General%20Elections-2024/100-Gurajala%20AC.pdf"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
    pdf_bytes = resp.read()

with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
    print(f"Total pages: {len(pdf.pages)}")
    table = pdf.pages[0].extract_table()
    if table:
        print(f"Page 1 table extracted! Rows: {len(table)}, Cols: {len(table[0])}")
        print("Header row:", table[0])
        print("First data row:", table[1])
        print("Second data row:", table[2])
    else:
        print("No table structure found on page 1")
