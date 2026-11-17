import json
from collections import Counter

with open('andhra-dashboard/public/data/booths/ac_174.json', 'r', encoding='utf-8') as f:
    booths = json.load(f)

mandal_counts = Counter(b.get('mandal') for b in booths)
mandalName_counts = Counter(b.get('mandalName') for b in booths)
print("b['mandal']:", mandal_counts)
print("b['mandalName']:", mandalName_counts)
