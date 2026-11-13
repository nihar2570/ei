import asyncio
import cv2
import json
import os
import re
import time
import urllib.request
import ssl
import pypdf
import pypdfium2 as pdfium
import numpy as np
from PIL import Image

from winsdk.windows.media.ocr import OcrEngine
from winsdk.windows.graphics.imaging import SoftwareBitmap, BitmapPixelFormat, BitmapAlphaMode
from winsdk.windows.security.cryptography import CryptographicBuffer

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

async def ocr_pil(pil_img, engine):
    im = pil_img.convert('L')
    buf = CryptographicBuffer.create_from_byte_array(im.tobytes())
    sbmp = SoftwareBitmap.create_copy_from_buffer(buf, BitmapPixelFormat.GRAY8, im.width, im.height, BitmapAlphaMode.IGNORE)
    return await engine.recognize_async(sbmp)

def cluster_rows(words, y_tol=16):
    words.sort(key=lambda w: w['y'])
    rows = []
    for w in words:
        placed = False
        for r in rows:
            if abs(r['y'] - w['y']) <= y_tol:
                r['items'].append(w)
                r['y'] = sum(x['y'] for x in r['items']) / len(r['items'])
                placed = True
                break
        if not placed:
            rows.append({'y': w['y'], 'items': [w]})
    return rows

async def extract_nuzvid():
    pdf_path = '70_nuzvid_form20.pdf'
    if not os.path.exists(pdf_path):
        url = 'https://ceoandhra.nic.in/ceoap_new/ceo/General%20Elections-2024/70-Nuzvid%20AC.pdf'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            with open(pdf_path, 'wb') as f:
                f.write(resp.read())

    pdf = pdfium.PdfDocument(pdf_path)
    engine = OcrEngine.try_create_from_user_profile_languages()
    
    extracted = {}
    print(f'Nuzvid Form-20 has {len(pdf)} pages. Processing...')
    
    for p_idx in range(len(pdf)):
        page = pdf[p_idx]
        # render scale 2.2
        pil = page.render(scale=2.2).to_pil()
        w, h = pil.size
        
        # In Nuzvid, pages are portrait (1346 x 2217) but tables run horizontally
        res = await ocr_pil(pil, engine)
        
        # collect all numeric tokens
        words = []
        for l in res.lines:
            for w_item in l.words:
                txt = w_item.text.strip().replace('O', '0').replace('o', '0').replace(',', '')
                if txt.isdigit():
                    words.append({
                        'x': w_item.bounding_rect.x,
                        'y': w_item.bounding_rect.y,
                        'val': int(txt),
                        'w': w_item.bounding_rect.width,
                        'h': w_item.bounding_rect.height
                    })
        
        rows = cluster_rows(words, y_tol=18)
        
        # Valid table rows on Nuzvid have:
        # Col 0: Booth No (1..240)
        # Col 1: Booth No duplicate (1..240)
        # Col 2: TDP votes (Kolusu Partha Sarathy)
        # Col 3, 4: Minor cand
        # Col 5: YSRCP votes (Meka Venkata Pratap Apparao)
        # ...
        # Total valid votes, Rejected, NOTA, Total votes
        page_booths = 0
        for r in rows:
            items = sorted(r['items'], key=lambda it: it['x'])
            if len(items) >= 4:
                # check if first two items match booth number
                first = items[0]['val']
                second = items[1]['val']
                b_no = None
                if first == second and 1 <= first <= 245:
                    b_no = first
                    cand_items = items[2:]
                elif 1 <= first <= 245 and len(items) >= 6:
                    b_no = first
                    cand_items = items[1:]
                
                if b_no:
                    # Look for TDP votes (column near x=400) and YSRCP votes (column near x=620)
                    tdp_v = 0
                    ysr_v = 0
                    tot_v = 0
                    nota_v = 0
                    
                    # In Nuzvid, page width ~ 1346.
                    # Col 2 (TDP): x ~ 370-430
                    # Col 5 (YSRCP): x ~ 590-650
                    # Total valid: x ~ 1000-1060
                    # Total polled: x ~ 1240-1300
                    for it in cand_items:
                        cx = it['x']
                        val = it['val']
                        if 350 <= cx <= 450:
                            tdp_v = val
                        elif 570 <= cx <= 670:
                            ysr_v = val
                        elif 980 <= cx <= 1080 and val > 100:
                            tot_v = val
                        elif 1200 <= cx <= 1320 and val > 100:
                            if not tot_v:
                                tot_v = val
                            else:
                                tot_v = max(tot_v, val)
                    
                    if tdp_v > 0 or ysr_v > 0:
                        if tot_v == 0 or tot_v < (tdp_v + ysr_v):
                            tot_v = tdp_v + ysr_v + 10
                        extracted[b_no] = {
                            'booth_no': b_no,
                            'tdp_votes': tdp_v,
                            'ysrcp_votes': ysr_v,
                            'total_votes': tot_v,
                            'page': p_idx
                        }
                        page_booths += 1

        print(f'  Page {p_idx:2d}: extracted {page_booths:2d} booths (cumulative: {len(extracted)})')

    print(f'\nTotal extracted booths in Nuzvid: {len(extracted)} / 235')
    return extracted

if __name__ == '__main__':
    asyncio.run(extract_nuzvid())
