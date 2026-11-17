import subprocess
import json

out = subprocess.check_output(['git', 'show', 'efb2e684:andhra-dashboard/public/data/booths/ac_174.json'], encoding='utf-8')
data = json.loads(out)
print("Commit efb2e684 total booths:", len(data))
m_names = set(b.get('mandalName') for b in data)
mandals = set(b.get('mandal') for b in data)
print("mandalName values:", m_names)
print("mandal values:", mandals)
lats = [b.get('lat', 0) for b in data]
print(f"Lat range: {min(lats):.4f} to {max(lats):.4f}")
sample = data[100]
print("Booth 101:", sample.get('booth_no'), sample.get('name'), sample.get('lat'), sample.get('lng'), sample.get('mandal'), sample.get('mandalName'))
