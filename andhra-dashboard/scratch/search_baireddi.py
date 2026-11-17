import json

with open('andhra-dashboard/public/data/boundaries/cache/CHITTOOR_mandals.json', 'r', encoding='utf-8') as f:
    mandals = json.load(f)

for m in mandals:
    mn = m['properties'].get('mandalnam', '').strip()
    if 'RED' in mn.upper() or 'BAI' in mn.upper() or 'BIR' in mn.upper():
        print(mn)
