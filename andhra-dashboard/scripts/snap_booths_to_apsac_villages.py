"""
Village-Anchored Polling Station Placement Engine (APSAC Cadastral Georeferencing)
---------------------------------------------------------------------------------
1. Parses booth name, building, locality, and section texts to extract authentic revenue village.
2. Cross-references against official APSAC Cadastral Village polygons (ac_163_villages.geojson).
3. If current GPS falls outside the true village polygon, calculates drift distance and snaps
   the booth into the authentic village polygon.
4. Applies spiderfied sub-facility dispersal (15-25m) for multi-room polling campuses to prevent
   marker occlusion while preserving campus grouping.
"""

import json
import math
import re
import os

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

def main():
    villages_path = 'andhra-dashboard/public/data/boundaries/ac_163_villages.geojson'
    mandals_path = 'andhra-dashboard/public/data/boundaries/ac_163_mandals.geojson'
    
    with open(villages_path, 'r', encoding='utf-8') as f:
        villages = json.load(f)['features']
    with open(mandals_path, 'r', encoding='utf-8') as f:
        mandals = json.load(f)['features']

    village_list = []
    for v in villages:
        p = v['properties']
        vn = p.get('villagenam', '').strip()
        mn = p.get('mandalnam', '').strip()
        if not vn or vn == 'FOREST': continue
        lat, lng = get_centroid(v['geometry'])
        village_list.append({
            'name': vn,
            'mandal': mn,
            'code': p.get('villagecod', ''),
            'lat': lat,
            'lng': lng,
            'geometry': v['geometry']
        })

    target_files = [
        'andhra-dashboard/public/data/booths/ac_163.json',
        'andhra-dashboard/dist/data/booths/ac_163.json'
    ]

    for file_path in target_files:
        if not os.path.exists(file_path):
            continue
        with open(file_path, 'r', encoding='utf-8') as f:
            booths = json.load(f)

        print(f"\nProcessing {file_path} ({len(booths)} booths)...")

        corrected_count = 0
        total_drift_km = 0.0
        village_campus_counter = {}

        for b in booths:
            b_name = b.get('name', '')
            b_bldg = b.get('building', '')
            b_loc = b.get('locality', '')
            b_sec = ' '.join(b.get('sections', [])) if isinstance(b.get('sections'), list) else ''
            full_text = normalize(f"{b_name} {b_bldg} {b_loc} {b_sec}")

            cur_lat = b.get('lat', 0)
            cur_lng = b.get('lng', 0)

            best_village = None
            best_score = 0

            for v in village_list:
                v_tokens = tokenize(v['name'])
                if not v_tokens: continue

                v_norm = normalize(v['name'])
                if v_norm in full_text:
                    score = 100 + len(v_norm)
                elif all(t in full_text for t in v_tokens):
                    score = 50 + sum(len(t) for t in v_tokens)
                else:
                    continue

                if b.get('mandalName') and v['mandal'].upper() == b.get('mandalName', '').upper():
                    score += 25

                if score > best_score:
                    best_score = score
                    best_village = v

            if best_village:
                is_inside = point_in_geom(cur_lng, cur_lat, best_village['geometry'])
                
                # If outside true village polygon by > 200 meters, correct coordinates!
                dist = haversine(cur_lat, cur_lng, best_village['lat'], best_village['lng'])
                if not is_inside and dist > 0.2:
                    corrected_count += 1
                    total_drift_km += dist
                    
                    # Group offset for multiple booths in the same village to prevent stacking
                    vk = f"{best_village['mandal']}::{best_village['name']}"
                    idx_in_v = village_campus_counter.get(vk, 0)
                    village_campus_counter[vk] = idx_in_v + 1

                    # Clean subtle radial spiderfy (15m offset per room)
                    if idx_in_v == 0:
                        snapped_lat = best_village['lat']
                        snapped_lng = best_village['lng']
                    else:
                        angle = (idx_in_v * 60) * (math.pi / 180)
                        # ~20 meters
                        offset_lat = (0.00018 * math.cos(angle))
                        offset_lng = (0.00018 * math.sin(angle))
                        snapped_lat = round(best_village['lat'] + offset_lat, 6)
                        snapped_lng = round(best_village['lng'] + offset_lng, 6)

                    b['lat'] = snapped_lat
                    b['lng'] = snapped_lng
                    b['villageName'] = best_village['name']
                    b['villageCode'] = best_village['code']
                    b['mandalName'] = best_village['mandal']
                    b['geocodingSource'] = 'APSAC_VILLAGE_ANCHOR'
                    b['originalDriftKm'] = round(dist, 2)
                else:
                    # Verified accurate
                    b['villageName'] = best_village['name']
                    b['villageCode'] = best_village['code']
                    b['mandalName'] = best_village['mandal']
                    b['geocodingSource'] = 'VERIFIED_POLYGON'

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(booths, f, indent=2)

        print(f"Successfully snapped {corrected_count} drifted booths into their authentic APSAC village polygons!")
        if corrected_count > 0:
            print(f"Average drift corrected: {total_drift_km / corrected_count:.2f} km")

if __name__ == '__main__':
    main()
