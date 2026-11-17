import os
import json
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from PIL import Image

env_file = 'andhra-dashboard/.env'
for line in open(env_file, encoding='utf-8'):
    if line.strip().startswith('GEMINI_API_KEY='):
        os.environ['GEMINI_API_KEY'] = line.strip().split('=', 1)[1].strip()

client = genai.Client()

class BoothResult(BaseModel):
    booth_no: int = Field(description="Polling station / booth number")
    tdp: int = Field(description="Votes for Maddipati Venkata Raju (TDP)")
    ysrcp: int = Field(description="Votes for Taneti Vanita (YSRCP)")
    inc: int = Field(description="Votes for Sodadasi Martin Luther (INC)")
    others: int = Field(description="Sum of all other independent / minor candidates")
    nota: int = Field(description="NOTA votes")
    total_valid_votes: int = Field(description="Total Valid Votes")
    total_votes: int = Field(description="Total Votes including NOTA")

class PageResult(BaseModel):
    page_number: int
    booths: list[BoothResult]

img = Image.open('debug_page_0.png')
print("Testing structured JSON extraction on Page 1 (Booths 1 to 30)...")

resp = client.models.generate_content(
    model='gemini-3.8-flash',
    contents=[
        img,
        "Extract every single polling station row from this Form-20 sheet into JSON. Candidate 1 is Taneti Vanita (YSRCP), Candidate 3 is Maddipati Venkata Raju (TDP), Candidate 4 is Sodadasi Martin Luther (INC). Others is sum of all other candidates. NOTA is NOTA column. Ensure booth_no is strictly sequential as in the table."
    ],
    config=types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=PageResult,
        temperature=0.0
    )
)

data = json.loads(resp.text)
print(f"Extracted {len(data.get('booths', []))} booths from Page 1:")
for b in data.get('booths', [])[:5]:
    print(f"  PS #{b['booth_no']:3d}: TDP={b['tdp']} | YSRCP={b['ysrcp']} | INC={b['inc']} | OTH={b['others']} | NOTA={b['nota']} | Total={b['total_votes']}")
