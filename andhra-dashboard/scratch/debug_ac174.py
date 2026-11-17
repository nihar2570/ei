import json
import re

# 1. Read mandalData.ts
with open('andhra-dashboard/src/data/mandalData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('"174":')
print("--- mandalData.ts for 174 ---")
print(text[idx:idx+1000])

# 2. Read ac_174.json booths
with open('andhra-dashboard/public/data/booths/ac_174.json', 'r', encoding='utf-8') as f:
    booths = json.load(f)

print(f"\n--- ac_174.json has {len(booths)} booths ---")
mandals_in_booths = {}
for b in booths:
    m = b.get('mandal') or b.get('mandalName') or 'UNKNOWN'
    mandals_in_booths[m] = mandals_in_booths.get(m, 0) + 1
print("Mandals in ac_174.json:", mandals_in_booths)

# 3. Check boundaries GeoJSON
ac_mandals_geo = 'andhra-dashboard/public/data/boundaries/ac_174_mandals.geojson'
try:
    with open(ac_mandals_geo, 'r', encoding='utf-8') as f:
        geo = json.load(f)
        names = [feat['properties'].get('mandalnam') for feat in geo['features']]
        print("\nMandals in ac_174_mandals.geojson:", names)
except Exception as e:
    print("Error reading ac_174_mandals.geojson:", e)
