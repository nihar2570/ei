import subprocess
import json
import re
import math

# 1. Load baseline booths from commit efb2e684
out = subprocess.check_output(['git', 'show', 'efb2e684:andhra-dashboard/public/data/booths/ac_174.json'], encoding='utf-8')
baseline_booths = json.loads(out)
base_map = {b['booth_no']: b for b in baseline_booths}

# 2. Load current ac_174.json to keep any new fields
with open('andhra-dashboard/public/data/booths/ac_174.json', 'r', encoding='utf-8') as f:
    curr_booths = json.load(f)

# 3. Load ac_174_villages.geojson
with open('andhra-dashboard/public/data/boundaries/ac_174_villages.geojson', 'r', encoding='utf-8') as f:
    villages_geo = json.load(f)['features']

def get_centroid(geom):
    coords = geom['coordinates']
    pts = []
    def ex(c):
        if isinstance(c[0], (int, float)): pts.append(c)
        else:
            for s in c: ex(s)
    ex(coords)
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return (round(sum(ys)/len(ys), 6), round(sum(xs)/len(xs), 6))

def point_in_polygon(x, y, poly):
    ring = poly[0]
    n = len(ring)
    inside = False
    p1x, p1y = ring[0]
    for i in range(n + 1):
        p2x, p2y = ring[i % n]
        if y > min(p1y, p2y):
            if y <= max(p1y, p2y):
                if x <= max(p1x, p2x):
                    if p1y != p2y:
                        xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    if p1x == p2x or x <= xinters:
                        inside = not inside
        p1x, p1y = p2x, p2y
    return inside

def point_in_geom(x, y, geom):
    t = geom['type']
    coords = geom['coordinates']
    if t == 'Polygon':
        return point_in_polygon(x, y, coords)
    elif t == 'MultiPolygon':
        for poly in coords:
            if point_in_polygon(x, y, poly):
                return True
    return False

def normalize(s):
    if not s: return ''
    s = s.upper()
    s = re.sub(r'[^A-Z0-9\s]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

def tokenize(vn):
    clean = normalize(vn)
    stop = {'PALLE', 'PALLI', 'VILLAGE', 'GRAMAMU', 'KHANDRIGA', 'KANDRIGA', 'H', 'O'}
    return [t for t in clean.split() if t not in stop and len(t) >= 3]

# Mandal alias mapping for matching
MANDAL_MAP = {
    'PALAMANER': 'PALAMANER',
    'PAI-AMANER': 'PALAMANER',
    'PEDDAPANJANI': 'PEDDAPANJANI',
    'PEDDA PANJANI': 'PEDDAPANJANI',
    'GANGAVARAM': 'GANGAVARAM',
    'BAIREDDI PALLE': 'BAIREDDIPALLE',
    'BAIREDDIPALLE': 'BAIREDDIPALLE',
    'VENKATAGIRI KOTA': 'VENKATAGIRIKOTA',
    'VENKATAGIRIKOTA': 'VENKATAGIRIKOTA'
}

# Group villages by normalized mandal
v_by_mandal = {}
for v in villages_geo:
    mn = v['properties'].get('mandalnam', '').strip().upper()
    vn = v['properties'].get('villagenam', '').strip()
    if not vn or vn == 'FOREST': continue
    lat, lng = get_centroid(v['geometry'])
    v_info = {
        'name': vn,
        'mandal': mn,
        'code': v['properties'].get('villagecod', ''),
        'lat': lat,
        'lng': lng,
        'geometry': v['geometry'],
        'tokens': tokenize(vn),
        'norm': normalize(vn)
    }
    v_by_mandal.setdefault(mn, []).append(v_info)

campus_counter = {}
snapped_count = 0

for b in curr_booths:
    b_no = b['booth_no']
    orig = base_map.get(b_no, {})
    
    # Canonical mandal from booth
    raw_m = (b.get('mandal') or orig.get('mandal') or '').strip().upper()
    canon_m = MANDAL_MAP.get(raw_m, raw_m)
    b['mandal'] = canon_m
    b['mandalName'] = canon_m
    
    # Restore original base lat/lng first
    base_lat = orig.get('lat', b.get('lat'))
    base_lng = orig.get('lng', b.get('lng'))
    b['lat'] = base_lat
    b['lng'] = base_lng
    
    # Now find village strictly WITHIN THE SAME MANDAL
    m_villages = v_by_mandal.get(canon_m, [])
    full_text = normalize(f"{b.get('name', '')} {b.get('building', '')} {b.get('locality', '')}")
    
    best_v = None
    best_score = 0
    for vc in m_villages:
        if not vc['tokens']: continue
        if vc['norm'] in full_text:
            score = 100 + len(vc['norm'])
        elif all(t in full_text for t in vc['tokens']):
            score = 50 + sum(len(t) for t in vc['tokens'])
        else:
            continue
        if score > best_score:
            best_score = score
            best_v = vc
            
    if best_v:
        is_inside = point_in_geom(base_lng, base_lat, best_v['geometry'])
        if not is_inside:
            vk = f"{best_v['mandal']}::{best_v['name']}"
            idx = campus_counter.get(vk, 0)
            campus_counter[vk] = idx + 1
            if idx == 0:
                b['lat'] = best_v['lat']
                b['lng'] = best_v['lng']
            else:
                angle = (idx * 60) * (math.pi / 180)
                b['lat'] = round(best_v['lat'] + (0.00018 * math.cos(angle)), 6)
                b['lng'] = round(best_v['lng'] + (0.00018 * math.sin(angle)), 6)
            b['geocodingSource'] = 'APSAC_VILLAGE_ANCHOR'
            snapped_count += 1
        b['villageName'] = best_v['name']
        b['villageCode'] = best_v['code']
    else:
        # Keep base coordinates, mark geocoding source
        b['geocodingSource'] = orig.get('geocodingSource', 'SYNTHETIC_MANDAL_SECTOR')

print(f"Total booths in AC 174: {len(curr_booths)}")
print(f"Booths snapped to authentic village in same mandal: {snapped_count}")

# Check breakdown by mandalName
from collections import Counter
print("mandalName distribution:", Counter(b['mandalName'] for b in curr_booths))

# Check lat ranges
by_m = {}
for b in curr_booths:
    by_m.setdefault(b['mandalName'], []).append(b)

for m, blist in by_m.items():
    lats = [b['lat'] for b in blist]
    lngs = [b['lng'] for b in blist]
    print(f"{m} ({len(blist)} booths): Lat {min(lats):.4f} to {max(lats):.4f}, Lng {min(lngs):.4f} to {max(lngs):.4f}")

# Save back to ac_174.json
with open('andhra-dashboard/public/data/booths/ac_174.json', 'w', encoding='utf-8') as f:
    json.dump(curr_booths, f, indent=2)

with open('andhra-dashboard/dist/data/booths/ac_174.json', 'w', encoding='utf-8') as f:
    json.dump(curr_booths, f, indent=2)

print("Saved ac_174.json to public and dist.")
