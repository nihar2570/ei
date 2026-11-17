import json
import re
import math
import os

# Load Chittoor mandals and villages from cache
with open('andhra-dashboard/public/data/boundaries/cache/CHITTOOR_mandals.json', 'r', encoding='utf-8') as f:
    chittoor_mandals = json.load(f)

with open('andhra-dashboard/public/data/boundaries/cache/CHITTOOR_villages.json', 'r', encoding='utf-8') as f:
    chittoor_villages = json.load(f)

target_mandals = {
    'PALAMANER': 'PALAMANER',
    'PEDDAPANJANI': 'PEDDAPANJANI',
    'GANGAVARAM': 'GANGAVARAM',
    'BAIREDDI PALLE': 'BAIREDDIPALLE',
    'VENKATAGIRI KOTA': 'VENKATAGIRIKOTA'
}

matched_m_features = []
matched_v_features = []

for m in chittoor_mandals:
    mn = m['properties'].get('mandalnam', '').strip().upper()
    if mn in target_mandals.values():
        m_copy = dict(m)
        m_copy['properties'] = dict(m['properties'])
        m_copy['properties']['ac_no'] = 174
        matched_m_features.append(m_copy)

for v in chittoor_villages:
    mn = v['properties'].get('mandalnam', '').strip().upper()
    if mn in target_mandals.values():
        v_copy = dict(v)
        v_copy['properties'] = dict(v['properties'])
        v_copy['properties']['ac_no'] = 174
        matched_v_features.append(v_copy)

print(f"Matched {len(matched_m_features)} mandals and {len(matched_v_features)} villages for AC 174.")
print("Mandals:", [m['properties']['mandalnam'] for m in matched_m_features])

# Save ac_174_mandals.geojson and ac_174_villages.geojson
with open('andhra-dashboard/public/data/boundaries/ac_174_mandals.geojson', 'w', encoding='utf-8') as f:
    json.dump({'type': 'FeatureCollection', 'features': matched_m_features}, f)

with open('andhra-dashboard/public/data/boundaries/ac_174_villages.geojson', 'w', encoding='utf-8') as f:
    json.dump({'type': 'FeatureCollection', 'features': matched_v_features}, f)

print("Saved ac_174_mandals.geojson and ac_174_villages.geojson")
