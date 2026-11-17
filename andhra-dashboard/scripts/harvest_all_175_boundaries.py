"""
Statewide APSAC Boundary Harvesting & Polling Station Georeferencing Engine
----------------------------------------------------------------------------
1. Fetches all 670 Mandals & 18,454 Villages across all 13 APSAC Districts.
2. Caches raw district data locally to ensure resilience.
3. Partitions into 175 Assembly Constituency GeoJSON bundles:
   - public/data/boundaries/ac_{acNo}_mandals.geojson
   - public/data/boundaries/ac_{acNo}_villages.geojson
4. Performs village-anchored coordinate snapping and spatial join for all 45,000+ booths.
"""

import os
import sys
import json
import re
import math
import time
import urllib.request
import urllib.parse
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {'User-Agent': 'Mozilla/5.0'}
MANDAL_URL = "https://apsac.ap.gov.in/gisserver/rest/services/ADMINISTRATIVE/administrative_boundaries/MapServer/3/query"
VILLAGE_URL = "https://apsac.ap.gov.in/gisserver/rest/services/ADMINISTRATIVE/administrative_boundaries/MapServer/5/query"

DISTRICTS = [
    'SRIKAKULAM', 'VISAKHAPATNAM', 'EAST GODAVARI', 'PRAKASAM', 'GUNTUR',
    'VIZIANAGARAM', 'KRISHNA', 'CHITTOOR', 'WEST GODAVARI', 'KURNOOL',
    'ANANTAPUR', 'POTTI SRIRAMULU NELLORE', 'YSR KADAPA'
]

CACHE_DIR = 'andhra-dashboard/public/data/boundaries/cache'
OUT_DIR = 'andhra-dashboard/public/data/boundaries'
BOOTH_DIR = 'andhra-dashboard/public/data/booths'
DIST_BOOTH_DIR = 'andhra-dashboard/dist/data/booths'
MANDAL_DATA_PATH = 'andhra-dashboard/src/data/mandalData.ts'

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

def clean_name(s):
    return re.sub(r'[^A-Z0-9]', '', s.upper())

def tokenize(vn):
    clean = normalize(vn)
    stop = {'PALLE', 'PALLI', 'VILLAGE', 'GRAMAMU', 'KHANDRIGA', 'KANDRIGA', 'H', 'O'}
    tokens = [t for t in clean.split() if t not in stop and len(t) >= 3]
    return tokens

# 1. Harvest & Cache All 13 Districts
def fetch_statewide_cache():
    os.makedirs(CACHE_DIR, exist_ok=True)
    all_mandals = []
    all_villages = []

    print("\n[PHASE 1] Fetching Statewide APSAC Boundaries (13 Districts)...")
    for dname in DISTRICTS:
        d_clean = clean_name(dname)
        m_cache_file = os.path.join(CACHE_DIR, f"{d_clean}_mandals.json")
        v_cache_file = os.path.join(CACHE_DIR, f"{d_clean}_villages.json")

        # Mandals
        if os.path.exists(m_cache_file):
            with open(m_cache_file, 'r', encoding='utf-8') as f:
                d_mandals = json.load(f)
        else:
            print(f"Downloading {dname} Mandals...")
            m_params = {
                'where': f"dstrctnam='{dname}'",
                'outFields': 'objectid,mandalnam,mandalcod,dstrctnam,dstrctcod,dmcd',
                'outSR': '4326',
                'f': 'geojson'
            }
            req_m = urllib.request.Request(f"{MANDAL_URL}?{urllib.parse.urlencode(m_params)}", headers=HEADERS)
            try:
                with urllib.request.urlopen(req_m, context=ctx, timeout=35) as resp:
                    d_mandals = json.loads(resp.read().decode('utf-8')).get('features', [])
                with open(m_cache_file, 'w', encoding='utf-8') as f:
                    json.dump(d_mandals, f)
            except Exception as e:
                print(f"Error fetching mandals for {dname}: {e}")
                d_mandals = []

        all_mandals.extend(d_mandals)

        # Villages
        if os.path.exists(v_cache_file):
            with open(v_cache_file, 'r', encoding='utf-8') as f:
                d_villages = json.load(f)
        else:
            print(f"Downloading {dname} Villages...")
            v_params = {
                'where': f"dstrctnam='{dname}'",
                'outFields': 'objectid,villagenam,villagecod,mandalnam,mandalcod,dstrctnam',
                'outSR': '4326',
                'f': 'geojson'
            }
            req_v = urllib.request.Request(f"{VILLAGE_URL}?{urllib.parse.urlencode(v_params)}", headers=HEADERS)
            try:
                with urllib.request.urlopen(req_v, context=ctx, timeout=45) as resp:
                    d_villages = json.loads(resp.read().decode('utf-8')).get('features', [])
                with open(v_cache_file, 'w', encoding='utf-8') as f:
                    json.dump(d_villages, f)
            except Exception as e:
                print(f"Error fetching villages for {dname}: {e}")
                d_villages = []

        all_villages.extend(d_villages)
        print(f"  ✓ {dname}: {len(d_mandals)} mandals, {len(d_villages)} villages loaded.")

    print(f"\nStatewide Cache Ready: {len(all_mandals)} mandals, {len(all_villages)} villages across AP.")
    return all_mandals, all_villages

# 2. Parse Constituent Mandals from mandalData.ts
def parse_constituent_mandals():
    with open(MANDAL_DATA_PATH, 'r', encoding='utf-8') as f:
        text = f.read()

    ac_mandals = {}
    for ac_no in range(1, 176):
        m = re.search(rf'"{ac_no}":\s*\[(.*?)\]', text, re.DOTALL) or re.search(rf'{ac_no}:\s*\[(.*?)\]', text, re.DOTALL)
        if m:
            names = re.findall(r'"name":\s*"([^"]+)"', m.group(1))
            ac_mandals[ac_no] = [n.strip().upper() for n in names]
        else:
            ac_mandals[ac_no] = []
    return ac_mandals

# 3. Main Processor for all 175 ACs
def process_all_acs():
    all_mandals, all_villages = fetch_statewide_cache()
    ac_mandals_map = parse_constituent_mandals()

    # Index mandals and villages by clean mandal name
    mandals_by_name = {}
    for m in all_mandals:
        m['geometry'] = round_geom(m['geometry'])
        mn = clean_name(m['properties'].get('mandalnam', ''))
        if mn:
            mandals_by_name.setdefault(mn, []).append(m)

    villages_by_mandal = {}
    for v in all_villages:
        v['geometry'] = round_geom(v['geometry'])
        mn = clean_name(v['properties'].get('mandalnam', ''))
        if mn:
            villages_by_mandal.setdefault(mn, []).append(v)

    print(f"\n[PHASE 2 & 3] Slicing Boundaries & Snapping Booths for all 175 ACs...")
    os.makedirs(OUT_DIR, exist_ok=True)

    total_acs_processed = 0
    total_booths_snapped = 0

    for ac_no in range(1, 176):
        c_mandals = ac_mandals_map.get(ac_no, [])
        if not c_mandals:
            continue

        matched_mandals = []
        matched_villages = []

        for m_name in c_mandals:
            cn = clean_name(m_name)
            
            # Direct match or partial match
            found_m = []
            for mn, m_list in mandals_by_name.items():
                if cn == mn or (len(cn) >= 5 and (cn in mn or mn in cn)):
                    found_m.extend(m_list)
                elif 'VALMIKIPURAM' in cn and 'VAYALPAD' in mn:
                    found_m.extend(m_list)
                elif 'VAYALPAD' in cn and 'VALMIKIPURAM' in mn:
                    found_m.extend(m_list)
                elif 'KVPALLE' in cn and 'KAMBHAM' in mn:
                    found_m.extend(m_list)

            # Deduplicate
            seen_ids = set()
            for m in found_m:
                mid = m['properties'].get('objectid')
                if mid not in seen_ids:
                    seen_ids.add(mid)
                    m_copy = dict(m)
                    m_copy['properties'] = dict(m['properties'])
                    m_copy['properties']['ac_no'] = ac_no
                    matched_mandals.append(m_copy)

            # Villages
            for mn, v_list in villages_by_mandal.items():
                if cn == mn or (len(cn) >= 5 and (cn in mn or mn in cn)):
                    for v in v_list:
                        v_copy = dict(v)
                        v_copy['properties'] = dict(v['properties'])
                        v_copy['properties']['ac_no'] = ac_no
                        matched_villages.append(v_copy)

        # Save AC GeoJSONs
        m_path = os.path.join(OUT_DIR, f"ac_{ac_no}_mandals.geojson")
        v_path = os.path.join(OUT_DIR, f"ac_{ac_no}_villages.geojson")

        with open(m_path, 'w', encoding='utf-8') as f:
            json.dump({'type': 'FeatureCollection', 'features': matched_mandals}, f, separators=(',', ':'))

        with open(v_path, 'w', encoding='utf-8') as f:
            json.dump({'type': 'FeatureCollection', 'features': matched_villages}, f, separators=(',', ':'))

        # Snap Booths
        booth_file = os.path.join(BOOTH_DIR, f"ac_{ac_no}.json")
        dist_booth_file = os.path.join(DIST_BOOTH_DIR, f"ac_{ac_no}.json")

        if os.path.exists(booth_file) and matched_villages:
            with open(booth_file, 'r', encoding='utf-8') as bf:
                booths = json.load(bf)

            # Pre-compute village centroids
            v_centroids = []
            for v in matched_villages:
                vn = v['properties'].get('villagenam', '').strip()
                if not vn or vn == 'FOREST': continue
                lat, lng = get_centroid(v['geometry'])
                v_centroids.append({
                    'name': vn,
                    'mandal': v['properties'].get('mandalnam', ''),
                    'code': v['properties'].get('villagecod', ''),
                    'lat': lat,
                    'lng': lng,
                    'geometry': v['geometry']
                })

            village_campus_counter = {}
            ac_snapped_count = 0

            for b in booths:
                b_name = b.get('name', '')
                b_bldg = b.get('building', '')
                b_loc = b.get('locality', '')
                b_sec = ' '.join(b.get('sections', [])) if isinstance(b.get('sections'), list) else ''
                full_text = normalize(f"{b_name} {b_bldg} {b_loc} {b_sec}")

                cur_lat = b.get('lat', 0)
                cur_lng = b.get('lng', 0)

                best_v = None
                best_score = 0

                for vc in v_centroids:
                    v_tokens = tokenize(vc['name'])
                    if not v_tokens: continue
                    v_norm = normalize(vc['name'])
                    if v_norm in full_text:
                        score = 100 + len(v_norm)
                    elif all(t in full_text for t in v_tokens):
                        score = 50 + sum(len(t) for t in v_tokens)
                    else:
                        continue

                    if b.get('mandalName') and vc['mandal'].upper() == b.get('mandalName', '').upper():
                        score += 25

                    if score > best_score:
                        best_score = score
                        best_v = vc

                if best_v:
                    is_inside = point_in_geom(cur_lng, cur_lat, best_v['geometry'])
                    dist = haversine(cur_lat, cur_lng, best_v['lat'], best_v['lng'])
                    if not is_inside and dist > 0.2:
                        ac_snapped_count += 1
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
                        b['mandalName'] = best_v['mandal']
                        b['geocodingSource'] = 'APSAC_VILLAGE_ANCHOR'
                    else:
                        b['villageName'] = best_v['name']
                        b['villageCode'] = best_v['code']
                        b['mandalName'] = best_v['mandal']
                else:
                    # Spatial join to find mandal if missing
                    if not b.get('mandalName'):
                        for m in matched_mandals:
                            if point_in_geom(cur_lng, cur_lat, m['geometry']):
                                b['mandalName'] = m['properties'].get('mandalnam', '')
                                b['mandalCode'] = m['properties'].get('mandalcod', '')
                                break

            # Save booth files
            with open(booth_file, 'w', encoding='utf-8') as bf:
                json.dump(booths, bf, indent=2)
            if os.path.exists(os.path.dirname(dist_booth_file)):
                with open(dist_booth_file, 'w', encoding='utf-8') as dbf:
                    json.dump(booths, dbf, indent=2)

            total_booths_snapped += ac_snapped_count

        total_acs_processed += 1
        if ac_no % 25 == 0 or ac_no == 175:
            print(f"  Processed {ac_no}/175 ACs (Total drifted booths snapped so far: {total_booths_snapped})...")

    print(f"\n=======================================================")
    print(f"SUCCESS! All {total_acs_processed} Assembly Constituencies harvested and georeferenced!")
    print(f"Total severely drifted booths corrected statewide: {total_booths_snapped}")
    print(f"=======================================================")

if __name__ == '__main__':
    process_all_acs()
