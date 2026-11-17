import json
import os
import glob
from shapely.geometry import shape

# 1. Load AC geometries
with open('andhra-dashboard/public/data/andhra_assembly.geojson', 'r', encoding='utf-8') as fp:
    ac_feats = json.load(fp)['features']

ac_shapes = {}
for f in ac_feats:
    ac_no = f['properties'].get('ac_no') or f['properties'].get('AC_NO')
    if ac_no:
        ac_shapes[int(ac_no)] = shape(f['geometry'])

# 2. Load APSAC mandals
all_mandals = []
for f in glob.glob('andhra-dashboard/public/data/boundaries/cache/*_mandals.json'):
    with open(f, 'r', encoding='utf-8') as fp:
        all_mandals.extend(json.load(fp))

print(f"Loaded {len(all_mandals)} mandals across AP.")

# Precompute mandal shapes
m_shapes = []
for m in all_mandals:
    m_shapes.append((m, shape(m['geometry'])))

# 3. Compute intersecting mandals for every AC
ac_mandals_map = {}
total_matched_pairs = 0

for ac_no in range(1, 176):
    ac_geom = ac_shapes[ac_no]
    matched = []
    for m, m_geom in m_shapes:
        if ac_geom.intersects(m_geom):
            inter = ac_geom.intersection(m_geom)
            # Threshold: at least 0.0005 deg^2 or at least 2% of mandal area
            if inter.area > 0.0005 or (m_geom.area > 0 and (inter.area / m_geom.area) > 0.02):
                matched.append((m['properties']['mandalnam'], inter.area, m))
    matched.sort(key=lambda x: x[1], reverse=True)
    ac_mandals_map[ac_no] = matched
    total_matched_pairs += len(matched)

print(f"Statewide spatial intersection completed: {total_matched_pairs} mandal-AC pairs.")
min_m = min(len(v) for v in ac_mandals_map.values())
max_m = max(len(v) for v in ac_mandals_map.values())
avg_m = total_matched_pairs / 175.0
print(f"Mandals per AC: Min = {min_m}, Max = {max_m}, Avg = {avg_m:.1f}")

# Sample check
for ac in [1, 2, 48, 50, 70, 100, 163, 174, 175]:
    names = [m[0] for m in ac_mandals_map[ac]]
    print(f"AC {ac:3d}: {len(names)} mandals -> {names}")
