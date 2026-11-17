import os
import json
import re
import math

def round_geom(geom, precision=5):
    if not geom: return geom
    t = geom.get('type')
    coords = geom.get('coordinates', [])
    def r_pt(pt):
        return [round(pt[0], precision), round(pt[1], precision)]
    def r_ring(ring):
        return [r_pt(p) for p in ring]
    def r_poly(poly):
        return [r_ring(r) for r in poly]
    if t == 'Polygon':
        geom['coordinates'] = r_poly(coords)
    elif t == 'MultiPolygon':
        geom['coordinates'] = [r_poly(p) for p in coords]
    return geom

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

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def normalize(s):
    if not s: return ''
    s = s.upper()
    s = re.sub(r'[^A-Z0-9\s]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

def tokenize(vn):
    clean = normalize(vn)
    stop = {'PALLE', 'PALLI', 'VILLAGE', 'GRAMAMU', 'KHANDRIGA', 'KANDRIGA', 'H', 'O'}
    tokens = [t for t in clean.split() if t not in stop and len(t) >= 3]
    return tokens

def fix_kuppam():
    print("=== FIXING KUPPAM AC (175) MANDALS, VILLAGES, AND POLLING BOOTHS ===")

    # 1. Load Mandals from Cache
    chittoor_mandals_file = 'andhra-dashboard/public/data/boundaries/cache/CHITTOOR_mandals.json'
    with open(chittoor_mandals_file, 'r', encoding='utf-8') as f:
        chittoor_mandals = json.load(f)

    # 4 authentic constituent mandals of Kuppam AC
    target_mandals = {
        'KUPPAM': 'KUPPAM',
        'SANTHIPURAM': 'SHANTIPURAM',
        'GUDUPALLE': 'GUDUPALLE',
        'RAMAKUPPAM': 'RAMAKUPPAM'
    }

    matched_mandals = []
    for m in chittoor_mandals:
        m_name = m['properties'].get('mandalnam', '').strip()
        if m_name in target_mandals:
            m_copy = json.loads(json.dumps(m))
            m_copy['geometry'] = round_geom(m_copy['geometry'])
            m_copy['properties']['ac_no'] = 175
            # Set canonical mandal name matching mandalData.ts ('SHANTIPURAM')
            canonical_name = target_mandals[m_name]
            m_copy['properties']['mandalnam'] = canonical_name
            m_copy['properties']['alt_mandalnam'] = m_name
            matched_mandals.append(m_copy)

    print(f"Matched {len(matched_mandals)} mandals: {[m['properties']['mandalnam'] for m in matched_mandals]}")
    assert len(matched_mandals) == 4, "Must match exactly 4 mandals"

    # Save ac_175_mandals.geojson to public and dist
    mandal_fc = {'type': 'FeatureCollection', 'features': matched_mandals}
    for m_path in [
        'andhra-dashboard/public/data/boundaries/ac_175_mandals.geojson',
        'andhra-dashboard/dist/data/boundaries/ac_175_mandals.geojson'
    ]:
        os.makedirs(os.path.dirname(m_path), exist_ok=True)
        with open(m_path, 'w', encoding='utf-8') as f:
            json.dump(mandal_fc, f, separators=(',', ':'))
        print(f"  ✓ Saved {m_path}")

    # 2. Load Villages from Cache
    chittoor_villages_file = 'andhra-dashboard/public/data/boundaries/cache/CHITTOOR_villages.json'
    with open(chittoor_villages_file, 'r', encoding='utf-8') as f:
        chittoor_villages = json.load(f)

    matched_villages = []
    for v in chittoor_villages:
        m_name = v['properties'].get('mandalnam', '').strip()
        if m_name in target_mandals:
            v_copy = json.loads(json.dumps(v))
            v_copy['geometry'] = round_geom(v_copy['geometry'])
            v_copy['properties']['ac_no'] = 175
            canonical_name = target_mandals[m_name]
            v_copy['properties']['mandalnam'] = canonical_name
            v_copy['properties']['alt_mandalnam'] = m_name
            matched_villages.append(v_copy)

    print(f"Matched {len(matched_villages)} villages across the 4 mandals.")
    village_fc = {'type': 'FeatureCollection', 'features': matched_villages}
    for v_path in [
        'andhra-dashboard/public/data/boundaries/ac_175_villages.geojson',
        'andhra-dashboard/dist/data/boundaries/ac_175_villages.geojson'
    ]:
        os.makedirs(os.path.dirname(v_path), exist_ok=True)
        with open(v_path, 'w', encoding='utf-8') as f:
            json.dump(village_fc, f, separators=(',', ':'))
        print(f"  ✓ Saved {v_path}")

    # 3. Pre-compute village centroids for booth snapping
    v_centroids_by_mandal = {}
    for v in matched_villages:
        vn = v['properties'].get('villagenam', '').strip()
        if not vn or vn == 'FOREST': continue
        m_name = v['properties'].get('mandalnam')
        lat, lng = get_centroid(v['geometry'])
        entry = {
            'name': vn,
            'mandal': m_name,
            'code': v['properties'].get('villagecod', ''),
            'lat': lat,
            'lng': lng,
            'geometry': v['geometry']
        }
        v_centroids_by_mandal.setdefault(m_name, []).append(entry)

    # 4. Process Booths
    booth_file = 'andhra-dashboard/public/data/booths/ac_175.json'
    with open(booth_file, 'r', encoding='utf-8') as f:
        booths = json.load(f)

    b2019_file = 'andhra-dashboard/public/data/booths_2019/ac_175.json'
    with open(b2019_file, 'r', encoding='utf-8') as f:
        b2019_list = json.load(f)
    b2019_map = {b['booth_no']: b for b in b2019_list}

    village_campus_counter = {}

    for b in booths:
        b_no = b['booth_no']

        # Determine true mandal
        if 1 <= b_no <= 65:
            m_target = 'SHANTIPURAM'
        elif 66 <= b_no <= 123:
            m_target = 'RAMAKUPPAM'
        elif 124 <= b_no <= 171:
            m_target = 'GUDUPALLE'
        elif 172 <= b_no <= 294:
            m_target = 'KUPPAM'
        else:
            m_target = b.get('mandal', 'KUPPAM').upper()

        b['mandal'] = m_target
        b['mandalName'] = m_target

        b_name = b.get('name', '')
        b_bldg = b.get('building', '')
        b_loc = b.get('locality', '')
        b_sec = ' '.join(b.get('sections', [])) if isinstance(b.get('sections'), list) else (b.get('sections') or '')
        full_text = normalize(f"{b_name} {b_bldg} {b_loc} {b_sec}")

        # Search villages in the correct mandal
        candidate_villages = v_centroids_by_mandal.get(m_target, [])
        best_v = None
        best_score = 0

        for vc in candidate_villages:
            v_tokens = tokenize(vc['name'])
            if not v_tokens: continue
            v_norm = normalize(vc['name'])
            if v_norm and v_norm in full_text:
                score = 100 + len(v_norm)
            elif all(t in full_text for t in v_tokens):
                score = 50 + sum(len(t) for t in v_tokens)
            else:
                continue

            if score > best_score:
                best_score = score
                best_v = vc

        if best_v:
            vk = f"{best_v['mandal']}::{best_v['name']}"
            idx_in_v = village_campus_counter.get(vk, 0)
            village_campus_counter[vk] = idx_in_v + 1

            if idx_in_v == 0:
                b['lat'] = best_v['lat']
                b['lng'] = best_v['lng']
            else:
                angle = (idx_in_v * 60) * (math.pi / 180)
                b['lat'] = round(best_v['lat'] + (0.00018 * math.cos(angle)), 6)
                b['lng'] = round(best_v['lng'] + (0.00018 * math.sin(angle)), 6)

            b['villageName'] = best_v['name']
            b['villageCode'] = best_v['code']
            b['geocodingSource'] = 'APSAC_VILLAGE_ANCHOR'
        else:
            # Fallback to verified 2019 coordinates
            b19 = b2019_map.get(b_no)
            if b19 and b19.get('lat') and b19.get('lng') and b19['lat'] != 0:
                b['lat'] = b19['lat']
                b['lng'] = b19['lng']
                b['villageName'] = b19.get('village') or b.get('villageName') or b19.get('name', '')
                b['geocodingSource'] = 'ECI_FORM20_GEOREF_2019'
            else:
                # If neither, find mandal centroid
                m_feat = next(m for m in matched_mandals if m['properties']['mandalnam'] == m_target)
                m_lat, m_lng = get_centroid(m_feat['geometry'])
                b['lat'] = m_lat
                b['lng'] = m_lng
                b['geocodingSource'] = 'APSAC_MANDAL_CENTROID'

    # Validate output
    m_counts = {}
    mn_counts = {}
    out_of_bounds = []
    for b in booths:
        m = b.get('mandal')
        mn = b.get('mandalName')
        m_counts[m] = m_counts.get(m, 0) + 1
        mn_counts[mn] = mn_counts.get(mn, 0) + 1
        lat, lng = b.get('lat', 0), b.get('lng', 0)
        if not (12.60 <= lat <= 12.98 and 78.18 <= lng <= 78.63):
            out_of_bounds.append((b['booth_no'], lat, lng, b['name']))

    print(f"\nValidation:")
    print(f"  Total booths: {len(booths)}")
    print(f"  mandal distribution: {m_counts}")
    print(f"  mandalName distribution: {mn_counts}")
    print(f"  Out of bounds booths: {len(out_of_bounds)}")
    assert len(out_of_bounds) == 0, f"Found out of bounds booths: {out_of_bounds}"
    assert m_counts['SHANTIPURAM'] == 65, "Shantipuram must have 65 booths"
    assert mn_counts['SHANTIPURAM'] == 65, "mandalName Shantipuram must have 65 booths"

    # Save to public and dist
    for b_path in [
        'andhra-dashboard/public/data/booths/ac_175.json',
        'andhra-dashboard/dist/data/booths/ac_175.json'
    ]:
        with open(b_path, 'w', encoding='utf-8') as f:
            json.dump(booths, f, indent=2)
        print(f"  ✓ Saved {b_path}")

    print("\nSUCCESS: All files for Kuppam AC 175 updated cleanly!")

if __name__ == '__main__':
    fix_kuppam()
