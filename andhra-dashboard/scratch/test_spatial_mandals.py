import json
import os
import glob
from shapely.geometry import shape

# Load AC features
with open('andhra-dashboard/public/data/andhra_assembly.geojson', 'r', encoding='utf-8') as fp:
    ac_feats = json.load(fp)['features']

ac_shapes = {}
for f in ac_feats:
    ac_no = f['properties'].get('ac_no') or f['properties'].get('AC_NO')
    if ac_no:
        ac_shapes[int(ac_no)] = shape(f['geometry'])

# Load APSAC mandals
all_mandals = []
for f in glob.glob('andhra-dashboard/public/data/boundaries/cache/*_mandals.json'):
    with open(f, 'r', encoding='utf-8') as fp:
        all_mandals.extend(json.load(fp))

print(f"Loaded {len(all_mandals)} mandals and {len(ac_shapes)} AC geometries.")

# Test AC 174
ac174 = ac_shapes[174]
intersecting_174 = []
for m in all_mandals:
    m_geom = shape(m['geometry'])
    if ac174.intersects(m_geom):
        inter_area = ac174.intersection(m_geom).area
        # Only if intersection is significant (> 1% of mandal or AC)
        if inter_area > 0.001:
            intersecting_174.append((m['properties']['mandalnam'], inter_area))

intersecting_174.sort(key=lambda x: x[1], reverse=True)
print("\nAC 174 Spatially Intersecting Mandals:")
for name, area in intersecting_174:
    print(f"  {name}: area {area:.5f}")
