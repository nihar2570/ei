import json
import os
import glob
import re
import math
import time
from shapely.geometry import shape, Point
from shapely.strtree import STRtree

start_time = time.time()

BASE_DIR = 'andhra-dashboard'
PUBLIC_DIR = os.path.join(BASE_DIR, 'public', 'data')
DIST_DIR = os.path.join(BASE_DIR, 'dist', 'data')
BOUNDARIES_DIR = os.path.join(PUBLIC_DIR, 'boundaries')
DIST_BOUNDARIES_DIR = os.path.join(DIST_DIR, 'boundaries')
BOOTHS_DIR = os.path.join(PUBLIC_DIR, 'booths')
DIST_BOOTHS_DIR = os.path.join(DIST_DIR, 'booths')
CACHE_DIR = os.path.join(BOUNDARIES_DIR, 'cache')

os.makedirs(BOUNDARIES_DIR, exist_ok=True)
os.makedirs(DIST_BOUNDARIES_DIR, exist_ok=True)

# 1. Load AC geometries
with open(os.path.join(PUBLIC_DIR, 'andhra_assembly.geojson'), 'r', encoding='utf-8') as fp:
    ac_feats = json.load(fp)['features']

ac_shapes = {}
for f in ac_feats:
    p = f.get('properties', {})
    ac_no = p.get('ac_no') or p.get('AC_NO')
    if ac_no:
        ac_shapes[int(ac_no)] = shape(f['geometry'])

# 2. Load APSAC mandals & villages
all_mandals = []
for f in glob.glob(os.path.join(CACHE_DIR, '*_mandals.json')):
    with open(f, 'r', encoding='utf-8') as fp:
        all_mandals.extend(json.load(fp))

all_villages = []
for f in glob.glob(os.path.join(CACHE_DIR, '*_villages.json')):
    with open(f, 'r', encoding='utf-8') as fp:
        all_villages.extend(json.load(fp))

print(f"Loaded {len(all_mandals)} mandals & {len(all_villages)} villages in {time.time() - start_time:.2f}s", flush=True)

# Precompute mandal shapes & spatial tree
m_list = []
m_geoms = []
for m in all_mandals:
    mn = m['properties'].get('mandalnam', '').strip().upper()
    mc = m['properties'].get('mandalcod', '')
    geom = shape(m['geometry'])
    item = {'name': mn, 'code': mc, 'feature': m, 'geom': geom}
    m_list.append(item)
    m_geoms.append(geom)

m_tree = STRtree(m_geoms)

# Index villages by mandal
villages_by_mandal = {}
for v in all_villages:
    mn = v['properties'].get('mandalnam', '').strip().upper()
    vn = v['properties'].get('villagenam', '').strip()
    if not vn or vn == 'FOREST': continue
    vc = v['properties'].get('villagecod', '')
    v_geom = shape(v['geometry'])
    centroid = v_geom.centroid
    villages_by_mandal.setdefault(mn, []).append({
        'name': vn,
        'code': vc,
        'mandal': mn,
        'lat': round(centroid.y, 6),
        'lng': round(centroid.x, 6),
        'geom': v_geom,
        'feature': v
    })

print(f"Indexed in {time.time() - start_time:.2f}s. Processing 175 ACs...", flush=True)

with open(os.path.join(PUBLIC_DIR, 'andhra_elections.json'), 'r', encoding='utf-8') as fp:
    elections_meta = json.load(fp)['results']['2024']

def normalize(s):
    if not s: return ''
    s = s.upper()
    s = re.sub(r'[^A-Z0-9\s]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

def tokenize(vn):
    clean = normalize(vn)
    stop = {'PALLE', 'PALLI', 'VILLAGE', 'GRAMAMU', 'KHANDRIGA', 'KANDRIGA', 'H', 'O', 'NORTH', 'SOUTH', 'EAST', 'WEST'}
    return [t for t in clean.split() if t not in stop and len(t) >= 3]

all_compiled_booths = []
total_booths_statewide = 0
total_snapped_statewide = 0

for ac_no in range(1, 176):
    ac_geom = ac_shapes.get(ac_no)
    if not ac_geom: continue

    # Query mandals intersecting AC geometry
    candidates_idx = m_tree.query(ac_geom)
    matched_mandals = []
    for idx in candidates_idx:
        item = m_list[idx]
        if ac_geom.intersects(item['geom']):
            inter = ac_geom.intersection(item['geom'])
            if inter.area > 0.0005 or (item['geom'].area > 0 and (inter.area / item['geom'].area) > 0.02):
                m_feat = dict(item['feature'])
                m_feat['properties'] = dict(item['feature']['properties'])
                m_feat['properties']['ac_no'] = ac_no
                matched_mandals.append((item['name'], inter.area, item, m_feat))

    matched_mandals.sort(key=lambda x: x[1], reverse=True)
    c_mandal_names = [m[0] for m in matched_mandals]
    mandal_features = [m[3] for m in matched_mandals]

    # Save boundaries
    m_path = os.path.join(BOUNDARIES_DIR, f"ac_{ac_no}_mandals.geojson")
    with open(m_path, 'w', encoding='utf-8') as fp:
        json.dump({'type': 'FeatureCollection', 'features': mandal_features}, fp)
    if os.path.exists(DIST_BOUNDARIES_DIR):
        with open(os.path.join(DIST_BOUNDARIES_DIR, f"ac_{ac_no}_mandals.geojson"), 'w', encoding='utf-8') as fp:
            json.dump({'type': 'FeatureCollection', 'features': mandal_features}, fp)

    # Villages
    v_features = []
    ac_villages = []
    for mn in c_mandal_names:
        for v in villages_by_mandal.get(mn, []):
            v_feat = dict(v['feature'])
            v_feat['properties'] = dict(v['feature']['properties'])
            v_feat['properties']['ac_no'] = ac_no
            v_features.append(v_feat)
            ac_villages.append(v)

    v_path = os.path.join(BOUNDARIES_DIR, f"ac_{ac_no}_villages.geojson")
    with open(v_path, 'w', encoding='utf-8') as fp:
        json.dump({'type': 'FeatureCollection', 'features': v_features}, fp)
    if os.path.exists(DIST_BOUNDARIES_DIR):
        with open(os.path.join(DIST_BOUNDARIES_DIR, f"ac_{ac_no}_villages.geojson"), 'w', encoding='utf-8') as fp:
            json.dump({'type': 'FeatureCollection', 'features': v_features}, fp)

    # Process Booths
    booth_file = os.path.join(BOOTHS_DIR, f"ac_{ac_no}.json")
    if not os.path.exists(booth_file): continue
    with open(booth_file, 'r', encoding='utf-8') as fp:
        booths = json.load(fp)

    ac_v_by_m = {}
    for v in ac_villages:
        ac_v_by_m.setdefault(v['mandal'], []).append(v)

    campus_counter = {}
    ac_snapped = 0

    for b in booths:
        cur_lat = b.get('lat', 0)
        cur_lng = b.get('lng', 0)
        pt = Point(cur_lng, cur_lat) if (cur_lat and cur_lng) else None

        # Determine true mandal
        chosen_mandal = None
        raw_m = (b.get('mandal') or b.get('mandalName') or '').strip().upper()
        raw_m_clean = re.sub(r'[^A-Z0-9]', '', raw_m)

        for c_m in c_mandal_names:
            c_m_clean = re.sub(r'[^A-Z0-9]', '', c_m)
            if raw_m_clean and (raw_m_clean == c_m_clean or raw_m_clean in c_m_clean or c_m_clean in raw_m_clean):
                chosen_mandal = c_m
                break

        if not chosen_mandal and pt:
            for item in matched_mandals:
                if item[2]['geom'].contains(pt):
                    chosen_mandal = item[0]
                    break

        if not chosen_mandal:
            chosen_mandal = c_mandal_names[0] if c_mandal_names else 'GENERAL'

        b['mandal'] = chosen_mandal
        b['mandalName'] = chosen_mandal

        # Village snap strictly within chosen_mandal
        m_villages = ac_v_by_m.get(chosen_mandal, [])
        full_text = normalize(f"{b.get('name', '')} {b.get('building', '')} {b.get('locality', '')}")

        best_v = None
        best_score = 0
        for vc in m_villages:
            tokens = tokenize(vc['name'])
            if not tokens: continue
            v_norm = normalize(vc['name'])
            if v_norm in full_text:
                score = 100 + len(v_norm)
            elif all(t in full_text for t in tokens):
                score = 50 + sum(len(t) for t in tokens)
            else:
                continue
            if score > best_score:
                best_score = score
                best_v = vc

        if best_v:
            b_pt = Point(b['lng'], b['lat'])
            if not best_v['geom'].contains(b_pt):
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
                ac_snapped += 1
            b['villageName'] = best_v['name']
            b['villageCode'] = best_v['code']
        else:
            if not b.get('geocodingSource'):
                b['geocodingSource'] = 'MANDAL_TERRITORY_ANCHOR'

        all_compiled_booths.append({
            'ac_no': ac_no,
            'ac_name': elections_meta.get(str(ac_no), {}).get('ac_name', f"AC_{ac_no}"),
            'district': elections_meta.get(str(ac_no), {}).get('district', ''),
            'booth_no': b['booth_no'],
            'name': b.get('name', ''),
            'building': b.get('building', ''),
            'locality': b.get('locality', ''),
            'villageName': b.get('villageName', ''),
            'villageCode': b.get('villageCode', ''),
            'mandal': chosen_mandal,
            'mandalCode': b.get('mandalCode', ''),
            'pincode': b.get('pincode', ''),
            'lat': b.get('lat'),
            'lng': b.get('lng'),
            'geocodingSource': b.get('geocodingSource', '')
        })

    with open(booth_file, 'w', encoding='utf-8') as fp:
        json.dump(booths, fp, indent=2)
    dist_b = os.path.join(DIST_BOOTHS_DIR, f"ac_{ac_no}.json")
    if os.path.exists(DIST_BOOTHS_DIR):
        with open(dist_b, 'w', encoding='utf-8') as fp:
            json.dump(booths, fp, indent=2)

    total_booths_statewide += len(booths)
    total_snapped_statewide += ac_snapped

print(f"Processed {total_booths_statewide} booths across all 175 ACs ({total_snapped_statewide} village snaps) in {time.time() - start_time:.2f}s", flush=True)

# Master JSON
out_master = os.path.join(PUBLIC_DIR, 'andhra_booths_2024_all.json')
all_compiled_booths.sort(key=lambda x: (x.get('ac_no', 0), x.get('booth_no', 0)))
with open(out_master, 'w', encoding='utf-8') as fp:
    json.dump(all_compiled_booths, fp, indent=2, ensure_ascii=False)
print(f"Saved master JSON ({len(all_compiled_booths)} booths) in {time.time() - start_time:.2f}s", flush=True)
