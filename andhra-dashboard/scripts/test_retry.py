import os
import json
import time
from google import genai
from google.genai import types
from PIL import Image

env_file = 'andhra-dashboard/.env'
for line in open(env_file, encoding='utf-8'):
    if line.strip().startswith('GEMINI_API_KEY='):
        os.environ['GEMINI_API_KEY'] = line.strip().split('=', 1)[1].strip()

client = genai.Client()
img = Image.open('debug_page_0.png')

prompt = """
Extract all polling station rows from this Form-20 sheet.
The columns are:
- Polling Station No. (1, 2, 3...)
- Candidate 1: TANETI VANITA (YSRCP)
- Candidate 2: BHARATHA RAO SIRRA (OTH)
- Candidate 3: MADDIPATI VENKATA RAJU (TDP)
- Candidate 4: SODADASI MARTIN LUTHER (INC)
- Candidates 5-10: Minor/Independents (sum these into "others")
- Total of Valid Votes
- NOTA
- Total Votes (including NOTA)

Return ONLY a JSON array of objects:
[
  {
    "booth_no": 1,
    "tdp": 433,
    "ysrcp": 228,
    "inc": 9,
    "others": 10,
    "nota": 28,
    "total_valid": 680,
    "total": 708
  }
]
"""

MODELS = ['gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash']

def call_with_retry(img, prompt):
    for attempt in range(8):
        for m in MODELS:
            try:
                print(f"Trying {m} (attempt {attempt+1})...")
                resp = client.models.generate_content(
                    model=m,
                    contents=[img, prompt],
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.0
                    )
                )
                return resp.text, m
            except Exception as e:
                err_str = str(e)
                if '503' in err_str or 'high demand' in err_str.lower():
                    print(f"  {m} is busy (503). Trying next...")
                    continue
                else:
                    print(f"  {m} error: {e}")
        wait = 2 ** attempt
        print(f"All models busy on attempt {attempt+1}. Backing off {wait}s...")
        time.sleep(wait)
    raise RuntimeError("Failed after retries")

raw_text, used_model = call_with_retry(img, prompt)
print(f"Success with {used_model}!")
data = json.loads(raw_text)
if isinstance(data, dict) and "booths" in data:
    data = data["booths"]
print(f"Extracted {len(data)} booths from Page 1:")
for b in data[:5]:
    print(f"  PS #{b['booth_no']:3d}: TDP={b['tdp']} | YSRCP={b['ysrcp']} | INC={b['inc']} | OTH={b['others']} | NOTA={b['nota']} | Total={b['total']}")
