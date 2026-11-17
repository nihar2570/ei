import json
import os

collapsed_acs = []
for ac in range(1, 176):
    f = f'andhra-dashboard/public/data/booths/ac_{ac}.json'
    if not os.path.exists(f): continue
    try:
        with open(f, 'r', encoding='utf-8') as fp:
            blist = json.load(fp)
        coords = set((round(b.get('lat', 0), 4), round(b.get('lng', 0), 4)) for b in blist)
        ratio = len(coords) / max(1, len(blist))
        if ratio < 0.35:
            collapsed_acs.append((ac, len(blist), len(coords), round(ratio, 2)))
    except Exception as e:
        print(f"FAILED on AC {ac}: {e}")

print(f"Total checked: 175. Collapsed count: {len(collapsed_acs)}")
for c in collapsed_acs:
    print(c)
