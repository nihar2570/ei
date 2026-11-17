import os
import json
from google import genai
from google.genai import types
from PIL import Image

env_file = 'andhra-dashboard/.env'
for line in open(env_file, encoding='utf-8'):
    if line.strip().startswith('GEMINI_API_KEY='):
        os.environ['GEMINI_API_KEY'] = line.strip().split('=', 1)[1].strip()

client = genai.Client()
img = Image.open('debug_page_0.png')
print("Testing gemini-3.7-flash structured JSON extraction...")

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

resp = client.models.generate_content(
    model='gemini-3.7-flash',
    contents=[img, prompt],
    config=types.GenerateContentConfig(
        response_mime_type="application/json",
        temperature=0.0
    )
)

data = json.loads(resp.text)
if isinstance(data, dict) and "booths" in data:
    data = data["booths"]
print(f"Extracted {len(data)} booths!")
for b in data[:5]:
    print(f"  PS #{b['booth_no']:3d}: TDP={b['tdp']} | YSRCP={b['ysrcp']} | INC={b['inc']} | OTH={b['others']} | NOTA={b['nota']} | Total={b['total']}")
