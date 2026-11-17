"""
Harvest Authentic Administrative Boundaries (Mandals & Villages) from AP GIS Portal (APSAC)
--------------------------------------------------------------------------------------------
Source: APSAC MapServer 'administrative_boundaries' (publisher2)
Endpoints:
  - Mandals: MapServer/3
  - Villages: MapServer/5
"""

import sys
import os
import json
import re
import urllib.request
import urllib.parse
import ssl
import argparse

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {'User-Agent': 'Mozilla/5.0'}
MANDAL_URL = "https://apsac.ap.gov.in/gisserver/rest/services/ADMINISTRATIVE/administrative_boundaries/MapServer/3/query"
VILLAGE_URL = "https://apsac.ap.gov.in/gisserver/rest/services/ADMINISTRATIVE/administrative_boundaries/MapServer/5/query"

MANDAL_ALIASES = {
    'DEVARAPALLI': ['DEVARAPALLE'],
    'DEVARAPALLE': ['DEVARAPALLI'],
    'VALMIKIPURAM': ['VAYALPAD'],
    'VAYALPAD': ['VALMIKIPURAM'],
    'CHEEPURUPALLI': ['CHEEPURUPALLE'],
    'CHEEPURUPALLE': ['CHEEPURUPALLI'],
    'BONDAPALLI': ['BONDAPALLE'],
    'BONDAPALLE': ['BONDAPALLI'],
    'DACHEPALLI': ['DACHEPALLE'],
    'DACHEPALLE': ['DACHEPALLI'],
    'SAMBEPALLI': ['SAMBEPALLE'],
    'SAMBEPALLE': ['SAMBEPALLI'],
    'LAKKIREDDIPALLI': ['LAKKIREDDIPALLE'],
    'LAKKIREDDIPALLE': ['LAKKIREDDIPALLI'],
    'VEMPALLI': ['VEMPALLE'],
    'VEMPALLE': ['VEMPALLI'],
    'BAIREDDIPALLI': ['BAIREDDIPALLE'],
    'BAIREDDIPALLE': ['BAIREDDIPALLI', 'BIREDDYPALLI'],
    'BIREDDYPALLI': ['BAIREDDIPALLE', 'BAIREDDIPALLI'],
    'AGIRIPALLI': ['AGIRIPALLE'],
    'AGIRIPALLE': ['AGIRIPALLI'],
    'CHALLAPALLI': ['CHALLAPALLE'],
    'CHALLAPALLE': ['CHALLAPALLI'],
    'ARAKU VALLEY': ['ARUKU VALLEY', 'ARAKU'],
    'ARUKU': ['ARAKU VALLEY', 'ARUKU VALLEY'],
    'PARAWADA': ['PARAVADA'],
    'PARAVADA': ['PARAWADA'],
    'PALAKODERU': ['PALACODERU'],
    'PALACODERU': ['PALAKODERU'],
    'PALAKOLLU': ['PALACOLE'],
    'PALACOLE': ['PALAKOLLU'],
    'TALLAREVU': ['THALLAREVU'],
    'THALLAREVU': ['TALLAREVU'],
    'VAJRAPUKOTTURU': ['VAJRAPUKOTHURU'],
    'VAJRAPUKOTHURU': ['VAJRAPUKOTTURU'],
    'G.SIGADAM': ['GANGUVARISIGADAM', 'GANGUVARI SINGADAM'],
    'SANTHAKAVATI': ['SANTHAKAVITI'],
    'SANTHAKAVITI': ['SANTHAKAVATI'],
    'BHEEMILI': ['BHEEMUNIPATNAM'],
    'BHEEMUNIPATNAM': ['BHEEMILI'],
    'RAVIKAMATHAM': ['RAVIKAMATAM'],
    'RAVIKAMATAM': ['RAVIKAMATHAM'],
    'ANAKAPALLE': ['ANAKAPALLI'],
    'ANAKAPALLI': ['ANAKAPALLE'],
    'U.KOTHAPALLI': ['KOTHAPALLE', 'UPPADA KOTHAPALLI'],
    'PEDDARAVEEDU': ['PEDA  ARAVEEDU', 'PEDA ARAVEEDU'],
    'J.PANGULURU': ['JANAKAVARAMPANGULURU', 'JANAKAVARAM PANGULURU'],
    'ZARUGUMALLI': ['ZARUGUMILLI'],
    'ZARUGUMILLI': ['ZARUGUMALLI'],
    'BESTHAVARIPETA': ['BESTAWARIPETA'],
    'BESTAWARIPETA': ['BESTHAVARIPETA'],
    'CS PURAM': ['CHANDRASEKHARA PURAM', 'CHADRASEKARAPURAM'],
    'AS PETA': ['ANUMASAMUDRAMPETA', 'ANUMASAMUDRAMPET'],
    'BUCHIREDDYPALEM': ['BUCHIREDDIPALEM'],
    'BUCHIREDDIPALEM': ['BUCHIREDDYPALEM'],
    'OZILI': ['OJILI'],
    'OJILI': ['OZILI'],
    'TADIPATRI': ['TADPATRI'],
    'TADPATRI': ['TADIPATRI'],
    'B.K. SAMUDRAM': ['BUKKARAYA  SAMUDRAM', 'BUKKARAYASAMUDRAM'],
    'SODUM': ['SODAM'],
    'SODAM': ['SODUM'],
    'B.N. KANDRIGA': ['BUCHINAIDU  KANDRIGA', 'BUCHINAIDU KHANDRIGA'],
    'S.R. PURAM': ['SRIRANGARAJAPURAM', 'SRIRANGA RAJA PURAM'],
    'PTM': ['PEDDA THIPPASAMUDRAM', 'PEDDATIPPASAMUDRAM'],
    'O.D. CHERUVU': ['OBULADEVARACHERUVU'],
    'NAMBULAPULAKUNTA': ['NAMBULIPULIKUNTA'],
}

def normalize_mandal_name(name):
    return re.sub(r'[^A-Z0-9]', '', (name or '').upper())

def mandals_match(name1, name2):
    n1 = normalize_mandal_name(name1)
    n2 = normalize_mandal_name(name2)
    if not n1 or not n2:
        return False
    if n1 == n2:
        return True
    if n1 in n2 or n2 in n1:
        return True
    # Check alias dict
    u1 = (name1 or '').strip().upper()
    u2 = (name2 or '').strip().upper()
    for a in MANDAL_ALIASES.get(u1, []):
        na = normalize_mandal_name(a)
        if na == n2 or na in n2 or n2 in na:
            return True
    for a in MANDAL_ALIASES.get(u2, []):
        na = normalize_mandal_name(a)
        if na == n1 or na in n1 or n1 in na:
            return True
    # Terminal PALLI / PALLE
    if (n1.endswith('PALLI') or n1.endswith('PALLE')) and (n2.endswith('PALLI') or n2.endswith('PALLE')):
        if n1[:-5] == n2[:-5]:
            return True
    # Terminal I / E variation
    if (n1[:-1] == n2[:-1]) and (n1[-1] in 'IE' and n2[-1] in 'IE'):
        return True
    return False

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

def harvest_ac(ac_no, ac_geojson_path, out_dir, booth_dir):
    print(f"\n==========================================")
    print(f"Processing AC #{ac_no}...")
    print(f"==========================================")
    
    with open(ac_geojson_path, 'r', encoding='utf-8') as f:
        ac_data = json.load(f)

    ac_feat = None
    for f in ac_data['features']:
        props = f.get('properties', {})
        p_no = props.get('AC_NO') or props.get('ac_no')
        if p_no == ac_no or str(p_no) == str(ac_no):
            ac_feat = f
            break

    if not ac_feat:
        print(f"Error: AC #{ac_no} not found in {ac_geojson_path}")
        return False

    ac_name = ac_feat['properties'].get('AC_NAME') or ac_feat['properties'].get('ac_name', f"AC_{ac_no}")
    print(f"Constituency: {ac_name} (#{ac_no})")

    # Compute bounding box
    coords = ac_feat.get('geometry', {}).get('coordinates', [])
    pts = []
    def extract_pts(c):
        if isinstance(c[0], (int, float)):
            pts.append(c)
        else:
            for sub in c: extract_pts(sub)
    extract_pts(coords)
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    bbox_str = f"{min(xs)},{min(ys)},{max(xs)},{max(ys)}"

    # 1. Query Mandals intersecting bbox
    m_params = {
        'geometry': bbox_str,
        'geometryType': 'esriGeometryEnvelope',
        'spatialRel': 'esriSpatialRelIntersects',
        'inSR': '4326',
        'outSR': '4326',
        'outFields': 'objectid,mandalnam,mandalcod,dstrctnam,dstrctcod,dmcd',
        'f': 'geojson'
    }
    m_url = f"{MANDAL_URL}?{urllib.parse.urlencode(m_params)}"
    req = urllib.request.Request(m_url, headers=HEADERS)
    with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
        m_data = json.loads(resp.read().decode('utf-8'))

    # Load official constituent mandals for this AC from mandalData.ts
    mandal_data_path = 'andhra-dashboard/src/data/mandalData.ts'
    constituent_mandals = set()
    if os.path.exists(mandal_data_path):
        with open(mandal_data_path, 'r', encoding='utf-8') as mf:
            m_text = mf.read()
        m_match = re.search(rf'"{ac_no}":\s*\[(.*?)\]', m_text, re.DOTALL) or re.search(rf'{ac_no}:\s*\[(.*?)\]', m_text, re.DOTALL)
        if m_match:
            for nm in re.findall(r'"name":\s*"([^"]+)"', m_match.group(1)):
                clean_nm = nm.strip().upper()
                constituent_mandals.add(clean_nm)
                for alias in MANDAL_ALIASES.get(clean_nm, []):
                    constituent_mandals.add(alias.upper())

    # Also load mandals declared in booth files
    booth_file = os.path.join(booth_dir, f"ac_{ac_no}.json")
    if os.path.exists(booth_file):
        try:
            with open(booth_file, 'r', encoding='utf-8') as bf:
                bdata = json.load(bf)
                for b in bdata:
                    bm = b.get('mandal')
                    if bm and isinstance(bm, str) and len(bm.strip()) > 2:
                        c_bm = bm.strip().upper()
                        constituent_mandals.add(c_bm)
                        for alias in MANDAL_ALIASES.get(c_bm, []):
                            constituent_mandals.add(alias.upper())
        except Exception as e:
            print(f"Warning: Could not read booths for mandals: {e}")

    # Expand any aliases for all gathered constituent mandals
    for cm in list(constituent_mandals):
        for alias in MANDAL_ALIASES.get(cm, []):
            constituent_mandals.add(alias.upper())

    print(f"Constituent mandals for AC #{ac_no}: {constituent_mandals}")

    # Filter mandals strictly to constituent mandals
    matched_mandals = []
    for m in m_data.get('features', []):
        m_name = m['properties'].get('mandalnam', '').strip().upper()
        if constituent_mandals:
            if not any(mandals_match(c, m_name) for c in constituent_mandals):
                continue
        m['geometry'] = round_geom(m['geometry'])
        m['properties']['ac_no'] = ac_no
        m['properties']['ac_name'] = ac_name
        matched_mandals.append(m)

    print(f"Retrieved {len(matched_mandals)} constituent mandals: {[m['properties']['mandalnam'] for m in matched_mandals]}")

    # 2. Query Villages
    m_names = [m['properties']['mandalnam'] for m in matched_mandals if m['properties'].get('mandalnam')]
    if len(m_names) > 0 and len(m_names) <= 15:
        where_v = "mandalnam IN (" + ", ".join([f"'{m}'" for m in m_names]) + ")"
        v_params = {
            'where': where_v,
            'outFields': 'objectid,villagenam,villagecod,mandalnam,mandalcod,dstrctnam',
            'outSR': '4326',
            'f': 'geojson'
        }
    else:
        v_params = {
            'geometry': bbox_str,
            'geometryType': 'esriGeometryEnvelope',
            'spatialRel': 'esriSpatialRelIntersects',
            'inSR': '4326',
            'outSR': '4326',
            'outFields': 'objectid,villagenam,villagecod,mandalnam,mandalcod,dstrctnam',
            'f': 'geojson'
        }
    
    v_url = f"{VILLAGE_URL}?{urllib.parse.urlencode(v_params)}"
    req_v = urllib.request.Request(v_url, headers=HEADERS)
    with urllib.request.urlopen(req_v, context=ctx, timeout=30) as resp:
        v_data = json.loads(resp.read().decode('utf-8'))

    matched_villages = []
    for v in v_data.get('features', []):
        v['geometry'] = round_geom(v['geometry'])
        v['properties']['ac_no'] = ac_no
        v['properties']['ac_name'] = ac_name
        matched_villages.append(v)

    print(f"Retrieved {len(matched_villages)} villages.")

    os.makedirs(out_dir, exist_ok=True)
    m_file = os.path.join(out_dir, f"ac_{ac_no}_mandals.geojson")
    v_file = os.path.join(out_dir, f"ac_{ac_no}_villages.geojson")

    with open(m_file, 'w', encoding='utf-8') as f:
        json.dump({'type': 'FeatureCollection', 'features': matched_mandals}, f, separators=(',', ':'))
    with open(v_file, 'w', encoding='utf-8') as f:
        json.dump({'type': 'FeatureCollection', 'features': matched_villages}, f, separators=(',', ':'))

    print(f"Saved: {m_file} ({os.path.getsize(m_file)/1024:.1f} KB)")
    print(f"Saved: {v_file} ({os.path.getsize(v_file)/1024:.1f} KB)")

    # 3. Update Booths
    booth_file = os.path.join(booth_dir, f"ac_{ac_no}.json")
    if os.path.exists(booth_file):
        with open(booth_file, 'r', encoding='utf-8') as f:
            booths = json.load(f)

        updated_count = 0
        for b in booths:
            lng, lat = b.get('lng', 0), b.get('lat', 0)
            if not lng or not lat: continue
            for m in matched_mandals:
                if point_in_geom(lng, lat, m['geometry']):
                    b['mandalName'] = m['properties']['mandalnam']
                    b['mandalCode'] = m['properties'].get('mandalcod', '')
                    updated_count += 1
                    break
            for v in matched_villages:
                if point_in_geom(lng, lat, v['geometry']):
                    b['villageName'] = v['properties']['villagenam']
                    b['villageCode'] = v['properties'].get('villagecod', '')
                    break

        # Fallback: if mandalName is still unset but booth has a declared mandal, match against matched_mandals
        for b in booths:
            if not b.get('mandalName') and b.get('mandal'):
                for m in matched_mandals:
                    if mandals_match(b['mandal'], m['properties']['mandalnam']):
                        b['mandalName'] = m['properties']['mandalnam']
                        b['mandalCode'] = m['properties'].get('mandalcod', '')
                        updated_count += 1
                        break

        with open(booth_file, 'w', encoding='utf-8') as f:
            json.dump(booths, f, indent=2)
        print(f"Updated {updated_count}/{len(booths)} booths with authentic mandal & village metadata.")

    # Also mirror files to dist if dist folder exists
    dist_boundaries = 'andhra-dashboard/dist/data/boundaries'
    dist_booths = 'andhra-dashboard/dist/data/booths'
    if os.path.exists(dist_boundaries):
        import shutil
        shutil.copy2(m_file, os.path.join(dist_boundaries, f"ac_{ac_no}_mandals.geojson"))
        shutil.copy2(v_file, os.path.join(dist_boundaries, f"ac_{ac_no}_villages.geojson"))
        if os.path.exists(booth_file) and os.path.exists(dist_booths):
            shutil.copy2(booth_file, os.path.join(dist_booths, f"ac_{ac_no}.json"))
        print(f"Mirrored boundary & booth files to dist/data.")

    return True

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Harvest APSAC administrative boundaries per AC.")
    parser.add_argument('--ac', type=int, default=163, help="Assembly Constituency Number (e.g. 163 for Pileru)")
    args = parser.parse_args()

    ac_geojson = 'andhra-dashboard/public/data/andhra_assembly.geojson'
    out_dir = 'andhra-dashboard/public/data/boundaries'
    booth_dir = 'andhra-dashboard/public/data/booths'

    harvest_ac(args.ac, ac_geojson, out_dir, booth_dir)
