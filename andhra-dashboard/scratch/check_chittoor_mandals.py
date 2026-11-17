import json

with open('andhra-dashboard/public/data/boundaries/cache/CHITTOOR_mandals.json', 'r', encoding='utf-8') as f:
    mandals = json.load(f)

palamaner_targets = ['PALAMANER', 'PEDDAPANJANI', 'GANGAVARAM', 'BAIREDDI PALLE', 'VENKATAGIRIKOTA']

found = {}
for m in mandals:
    mn = m['properties'].get('mandalnam', '').strip().upper()
    for t in palamaner_targets:
        if t in mn or mn in t:
            found[t] = mn

print("Target mandals in Chittoor cache:")
for t in palamaner_targets:
    print(f"  {t} -> {found.get(t)}")
