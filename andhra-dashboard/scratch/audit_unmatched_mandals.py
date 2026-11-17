import json
import re

with open('andhra-dashboard/src/data/mandalData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Load all mandals from APSAC cache
import glob
mandals_by_name = {}
for mf in glob.glob('andhra-dashboard/public/data/boundaries/cache/*_mandals.json'):
    with open(mf, 'r', encoding='utf-8') as f:
        for m in json.load(f):
            mn = re.sub(r'[^A-Z0-9]', '', m['properties'].get('mandalnam', '').upper())
            mandals_by_name.setdefault(mn, []).append(m)

print("Total unique APSAC mandal clean names:", len(mandals_by_name))

# Check each AC in mandalData.ts
missing_per_ac = {}
for ac_no in range(1, 176):
    m = re.search(rf'"{ac_no}":\s*\[(.*?)\]', text, re.DOTALL)
    if not m: continue
    names = re.findall(r'"name":\s*"([^"]+)"', m.group(1))
    missing = []
    for n in names:
        cn = re.sub(r'[^A-Z0-9]', '', n.upper())
        if cn not in mandals_by_name:
            # check basic replacements
            norm_cn = cn.replace('SH', 'S').replace('TH', 'T')
            found = any(norm_cn == k.replace('SH', 'S').replace('TH', 'T') for k in mandals_by_name)
            if not found:
                missing.append(n)
    if missing:
        missing_per_ac[ac_no] = missing

print(f"\nACs with unmatched mandals: {len(missing_per_ac)}")
for ac, mlist in list(missing_per_ac.items())[:15]:
    print(f"AC {ac}: {mlist}")
