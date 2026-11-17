import json

with open('andhra-dashboard/public/data/andhra_candidates_2024.json', encoding='utf-8') as f:
    d = json.load(f)
print("Type of data:", type(d))
if isinstance(d, dict):
    print("Keys:", list(d.keys())[:10])
    if '66' in d or 66 in d:
        print("66:", d.get('66') or d.get(66))
elif isinstance(d, list):
    print("Item 0 type:", type(d[0]))
    print("Item 0:", d[0])
