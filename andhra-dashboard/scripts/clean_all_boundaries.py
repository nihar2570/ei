import os
import json
import re

CACHE_DIR = 'andhra-dashboard/public/data/boundaries/cache'
PUB_BOUNDARIES = 'andhra-dashboard/public/data/boundaries'
DIST_BOUNDARIES = 'andhra-dashboard/dist/data/boundaries'
MANDAL_DATA_PATH = 'andhra-dashboard/src/data/mandalData.ts'
ASSEMBLY_PATH = 'andhra-dashboard/public/data/andhra_assembly.geojson'

DISTRICTS = [
    'SRIKAKULAM', 'VISAKHAPATNAM', 'EAST GODAVARI', 'PRAKASAM', 'GUNTUR',
    'VIZIANAGARAM', 'KRISHNA', 'CHITTOOR', 'WEST GODAVARI', 'KURNOOL',
    'ANANTAPUR', 'POTTI SRIRAMULU NELLORE', 'YSR KADAPA'
]

def clean_name(s):
    return re.sub(r'[^A-Z0-9]', '', s.upper()) if s else ''

def norm_spelling(s):
    s = clean_name(s)
    s = re.sub(r'RURAL|URBAN|PART|MANDAL', '', s)
    s = s.replace('SH', 'S')
    s = s.replace('TH', 'T')
    s = s.replace('TT', 'T')
    s = s.replace('EE', 'I')
    s = s.replace('OO', 'U')
    s = re.sub(r'PALLE|PALLI', 'PALLI', s)
    return s

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

NEW_TO_OLD_DISTRICTS = {
    'SRIKAKULAM': ['SRIKAKULAM'],
    'VIZIANAGARAM': ['VIZIANAGARAM'],
    'PARVATHIPURAMMANYAM': ['VIZIANAGARAM', 'SRIKAKULAM'],
    'VISAKHAPATNAM': ['VISAKHAPATNAM'],
    'ANAKAPALLI': ['VISAKHAPATNAM'],
    'ALLURISITHARAMARAJU': ['VISAKHAPATNAM', 'EAST GODAVARI'],
    'KAKINADA': ['EAST GODAVARI'],
    'EASTGODAVARI': ['EAST GODAVARI'],
    'DRBRAMBEDKARKONASEEMA': ['EAST GODAVARI'],
    'ELURU': ['WEST GODAVARI', 'KRISHNA'],
    'WESTGODAVARI': ['WEST GODAVARI'],
    'NTR': ['KRISHNA'],
    'KRISHNA': ['KRISHNA'],
    'PALNADU': ['GUNTUR'],
    'GUNTUR': ['GUNTUR'],
    'BAPATLA': ['GUNTUR', 'PRAKASAM'],
    'PRAKASAM': ['PRAKASAM'],
    'SRIPOTTISRIRAMULUNELLORE': ['POTTI SRIRAMULU NELLORE'],
    'POTTISRIRAMULUNELLORE': ['POTTI SRIRAMULU NELLORE'],
    'KURNOOL': ['KURNOOL'],
    'NANDYAL': ['KURNOOL'],
    'ANANTHAPURAMU': ['ANANTAPUR'],
    'ANANTAPUR': ['ANANTAPUR'],
    'SRISATHYASAI': ['ANANTAPUR'],
    'YSRKADAPA': ['YSR KADAPA'],
    'ANNAMAYYA': ['YSR KADAPA', 'CHITTOOR'],
    'CHITTOOR': ['CHITTOOR'],
    'TIRUPATI': ['CHITTOOR', 'POTTI SRIRAMULU NELLORE'],
}

MANDAL_ALIASES = {
    'SHANTIPURAM': ['SANTHIPURAM'],
    'SANTHIPURAM': ['SHANTIPURAM'],
    'VALMIKIPURAM': ['VAYALPAD', 'VOYALPADU'],
    'VAYALPAD': ['VALMIKIPURAM'],
    'KVPALLE': ['KAMBHAMVARIPALLE', 'KAMBHAMVARIPALLI', 'KAMBHAM'],
    'SANTANUTHALAPADU': ['SANTHANUTHALAPADU', 'SANTHANUTHALA PADU'],
    'BHEEMILI': ['BHEEMUNIPATNAM'],
    'G.SIGADAM': ['G SIGADAM', 'GARANGAM SIGADAM'],
    'GSIGADAM': ['G SIGADAM', 'GARANGAM SIGADAM'],
    'SANTHAKAVATI': ['SANTHAKAVITI'],
}

def clean_statewide_boundaries():
    print("=== REBUILDING & CLEANING ALL 175 AC BOUNDARIES ===")

    # 1. Load statewide cache
    all_mandals = []
    all_villages = []
    for dname in DISTRICTS:
        d_clean = clean_name(dname)
        m_cache_file = os.path.join(CACHE_DIR, f"{d_clean}_mandals.json")
        v_cache_file = os.path.join(CACHE_DIR, f"{d_clean}_villages.json")
        if os.path.exists(m_cache_file):
            with open(m_cache_file, 'r', encoding='utf-8') as f:
                all_mandals.extend(json.load(f))
        if os.path.exists(v_cache_file):
            with open(v_cache_file, 'r', encoding='utf-8') as f:
                all_villages.extend(json.load(f))

    print(f"Loaded {len(all_mandals)} cached mandals and {len(all_villages)} cached villages.")

    # Index by (district, mandal_name)
    mandals_by_dist_name = {}
    for m in all_mandals:
        m['geometry'] = round_geom(m['geometry'])
        d = clean_name(m['properties'].get('dstrctnam'))
        mn = clean_name(m['properties'].get('mandalnam'))
        mandals_by_dist_name.setdefault((d, mn), []).append(m)

    villages_by_dist_name = {}
    for v in all_villages:
        v['geometry'] = round_geom(v['geometry'])
        d = clean_name(v['properties'].get('dstrctnam'))
        mn = clean_name(v['properties'].get('mandalnam'))
        villages_by_dist_name.setdefault((d, mn), []).append(v)

    # 2. Load AC Districts
    ac_dist_map = {}
    with open(ASSEMBLY_PATH, 'r', encoding='utf-8') as f:
        for feat in json.load(f)['features']:
            p = feat['properties']
            num = p.get('ac_no') or p.get('AC_NO')
            dst = p.get('district') or p.get('DIST_NAME')
            if num and dst:
                ac_dist_map[int(num)] = clean_name(dst)

    # 3. Load Constituent Mandals
    with open(MANDAL_DATA_PATH, 'r', encoding='utf-8') as f:
        text = f.read()

    ac_mandals_map = {}
    for ac_no in range(1, 176):
        m = re.search(rf'"{ac_no}":\s*\[(.*?)\]', text, re.DOTALL) or re.search(rf'{ac_no}:\s*\[(.*?)\]', text, re.DOTALL)
        if m:
            names = re.findall(r'"name":\s*"([^"]+)"', m.group(1))
            ac_mandals_map[ac_no] = [n.strip() for n in names]
        else:
            ac_mandals_map[ac_no] = []

    os.makedirs(PUB_BOUNDARIES, exist_ok=True)
    os.makedirs(DIST_BOUNDARIES, exist_ok=True)

    leaks_found = 0
    total_processed = 0

    for ac_no in range(1, 176):
        new_dist = ac_dist_map.get(ac_no, '')
        allowed_old_dists = [clean_name(d) for d in NEW_TO_OLD_DISTRICTS.get(new_dist, [new_dist])]
        c_mandals = ac_mandals_map.get(ac_no, [])

        matched_mandals = []
        matched_villages = []
        seen_m_ids = set()
        seen_v_ids = set()

        for m_name in c_mandals:
            cn = clean_name(m_name)
            norm_cn = norm_spelling(m_name)
            aliases = [clean_name(a) for a in MANDAL_ALIASES.get(cn, [])]

            found_m = []
            # 1. Match within allowed old districts
            for d in allowed_old_dists:
                # Direct match
                if (d, cn) in mandals_by_dist_name:
                    found_m.extend(mandals_by_dist_name[(d, cn)])
                    break
                # Alias match
                alias_hit = False
                for a in aliases:
                    if (d, a) in mandals_by_dist_name:
                        found_m.extend(mandals_by_dist_name[(d, a)])
                        alias_hit = True
                        break
                if alias_hit: break

                # Norm spelling match
                for (dist_k, mn_k), m_list in mandals_by_dist_name.items():
                    if dist_k == d and norm_spelling(mn_k) == norm_cn:
                        found_m.extend(m_list)
                        break
                if found_m: break

                # Base name match (e.g. Srikakulam Rural -> Srikakulam)
                base_cn = re.sub(r'RURAL|URBAN|PART|MANDAL', '', cn)
                if base_cn and (d, base_cn) in mandals_by_dist_name:
                    found_m.extend(mandals_by_dist_name[(d, base_cn)])
                    break

            # 2. Urban cluster match (e.g. Visakhapatnam East/South/North -> Visakhapatnam Urban)
            if not found_m:
                for d in allowed_old_dists:
                    for city in ['VISAKHAPATNAM', 'VIJAYAWADA', 'GUNTUR', 'KURNOOL', 'NELLORE', 'TIRUPATI', 'RAJAHMUNDRY']:
                        if city in cn or city in norm_cn:
                            for (dist_k, mn_k), m_list in mandals_by_dist_name.items():
                                if dist_k == d and city in mn_k:
                                    found_m.extend(m_list)
                            break
                    if found_m: break

            # 3. Fallback: exact match across all districts (strict exact only)
            if not found_m:
                for (dist_k, mn_k), m_list in mandals_by_dist_name.items():
                    if mn_k == cn or mn_k in aliases:
                        found_m.extend(m_list)

            # Deduplicate mandals
            for m in found_m:
                mid = m['properties'].get('objectid')
                if mid not in seen_m_ids:
                    seen_m_ids.add(mid)
                    m_copy = dict(m)
                    m_copy['properties'] = dict(m['properties'])
                    m_copy['properties']['ac_no'] = ac_no
                    # Retain canonical name
                    m_copy['properties']['mandalnam'] = m_name.upper()
                    m_copy['properties']['alt_mandalnam'] = m['properties'].get('mandalnam')
                    matched_mandals.append(m_copy)

                    # Gather villages strictly belonging to this matched mandal in its district
                    m_dist = clean_name(m['properties'].get('dstrctnam'))
                    orig_mn = clean_name(m['properties'].get('mandalnam'))
                    if (m_dist, orig_mn) in villages_by_dist_name:
                        for v in villages_by_dist_name[(m_dist, orig_mn)]:
                            vid = v['properties'].get('objectid')
                            if vid not in seen_v_ids:
                                seen_v_ids.add(vid)
                                v_copy = dict(v)
                                v_copy['properties'] = dict(v['properties'])
                                v_copy['properties']['ac_no'] = ac_no
                                v_copy['properties']['mandalnam'] = m_name.upper()
                                matched_villages.append(v_copy)

        # Check for RAPUR leak
        has_rapur = any(m['properties'].get('alt_mandalnam') == 'RAPUR' for m in matched_mandals)
        if has_rapur and ac_no != 122:
            leaks_found += 1
            print(f"WARNING: AC {ac_no} still had Rapur!")

        # Save to both public and dist
        m_fc = {'type': 'FeatureCollection', 'features': matched_mandals}
        v_fc = {'type': 'FeatureCollection', 'features': matched_villages}

        for folder in [PUB_BOUNDARIES, DIST_BOUNDARIES]:
            m_path = os.path.join(folder, f"ac_{ac_no}_mandals.geojson")
            v_path = os.path.join(folder, f"ac_{ac_no}_villages.geojson")
            with open(m_path, 'w', encoding='utf-8') as f:
                json.dump(m_fc, f, separators=(',', ':'))
            with open(v_path, 'w', encoding='utf-8') as f:
                json.dump(v_fc, f, separators=(',', ':'))

        total_processed += 1

    print(f"\n=======================================================")
    print(f"SUCCESS: Regenerated boundaries for all {total_processed} ACs!")
    print(f"Total phantom RAPUR leaks: {leaks_found} (Expected: 0)")
    print(f"=======================================================")

if __name__ == '__main__':
    clean_statewide_boundaries()
