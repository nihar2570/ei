import json

with open('andhra-dashboard/public/data/booths/ac_174.json', 'r', encoding='utf-8') as f:
    booths = json.load(f)

print(f"Total booths: {len(booths)}")

by_mandal = {}
for b in booths:
    m = b.get('mandal') or b.get('mandalName') or 'UNKNOWN'
    if m not in by_mandal:
        by_mandal[m] = []
    by_mandal[m].append(b)

for m, blist in by_mandal.items():
    lats = [b.get('lat', 0) for b in blist]
    lngs = [b.get('lng', 0) for b in blist]
    sources = set(b.get('geocodingSource', 'none') for b in blist)
    print(f"\nMandal: {m} ({len(blist)} booths)")
    print(f"  Lat range: {min(lats):.4f} to {max(lats):.4f}")
    print(f"  Lng range: {min(lngs):.4f} to {max(lngs):.4f}")
    print(f"  Sources: {sources}")
    print(f"  Sample booth 1: {blist[0].get('booth_no')} - {blist[0].get('name')} -> ({blist[0].get('lat')}, {blist[0].get('lng')})")
