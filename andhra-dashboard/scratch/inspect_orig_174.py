import subprocess
import json

out = subprocess.check_output(['git', 'show', 'efb2e684:andhra-dashboard/public/data/booths/ac_174.json'], encoding='utf-8')
data = json.loads(out)

by_m = {}
for b in data:
    m = b.get('mandal', 'UNKNOWN')
    by_m.setdefault(m, []).append(b)

for m, blist in by_m.items():
    lats = [b.get('lat', 0) for b in blist]
    lngs = [b.get('lng', 0) for b in blist]
    print(f"Mandal {m} ({len(blist)} booths):")
    print(f"  Lat: {min(lats):.4f} to {max(lats):.4f}")
    print(f"  Lng: {min(lngs):.4f} to {max(lngs):.4f}")
