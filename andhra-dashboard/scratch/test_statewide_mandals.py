import json
import re
import os
import glob

# 1. Load all APSAC mandals from cache
all_apsac_mandals = []
for f in glob.glob('andhra-dashboard/public/data/boundaries/cache/*_mandals.json'):
    with open(f, 'r', encoding='utf-8') as fp:
        all_apsac_mandals.extend(json.load(fp))

print(f"Total APSAC mandals loaded: {len(all_apsac_mandals)}")

# 2. Load assembly boundaries
with open('andhra-dashboard/public/data/andhra_assembly.geojson', 'r', encoding='utf-8') as fp:
    assembly_geo = json.load(fp)['features']

ac_geo_map = {}
for feat in assembly_geo:
    p = feat.get('properties', {})
    ac_no = p.get('ac_no') or p.get('AC_NO')
    if ac_no:
        ac_geo_map[int(ac_no)] = feat

print(f"Total AC boundary features: {len(ac_geo_map)}")

# 3. For each AC, check distinct b['mandal'] from public/data/booths/ac_{ac}.json
booth_mandals_per_ac = {}
for ac_no in range(1, 176):
    b_path = f'andhra-dashboard/public/data/booths/ac_{ac_no}.json'
    if os.path.exists(b_path):
        with open(b_path, 'r', encoding='utf-8') as fp:
            blist = json.load(fp)
            mandals = set()
            for b in blist:
                m = b.get('mandal')
                if m and m.strip():
                    mandals.add(m.strip().upper())
            booth_mandals_per_ac[ac_no] = mandals

print("AC 1 booth mandals:", booth_mandals_per_ac.get(1))
print("AC 174 booth mandals:", booth_mandals_per_ac.get(174))
print("AC 175 booth mandals:", booth_mandals_per_ac.get(175))
