import json
import re
import os
import glob

# Load APSAC mandals
apsac_mandals = []
for f in glob.glob('andhra-dashboard/public/data/boundaries/cache/*_mandals.json'):
    with open(f, 'r', encoding='utf-8') as fp:
        apsac_mandals.extend(json.load(fp))

apsac_by_clean = {}
for m in apsac_mandals:
    mn = m['properties'].get('mandalnam', '').strip().upper()
    cn = re.sub(r'[^A-Z0-9]', '', mn)
    apsac_by_clean.setdefault(cn, []).append(m)

print(f"Total unique APSAC clean names: {len(apsac_by_clean)}")

def clean_str(s):
    # remove spaces and punctuation
    s = s.upper().replace('SH', 'S').replace('TH', 'T').replace('PALLE', 'PALLI').replace('URBAN', '').replace('RURAL', '')
    return re.sub(r'[^A-Z0-9]', '', s)

unmatched = []
matched_count = 0
total_mandals = 0

for ac_no in range(1, 176):
    b_path = f'andhra-dashboard/public/data/booths/ac_{ac_no}.json'
    if not os.path.exists(b_path): continue
    with open(b_path, 'r', encoding='utf-8') as fp:
        blist = json.load(fp)
    mandals = set(b.get('mandal', '').strip().upper() for b in blist if b.get('mandal'))
    for m in mandals:
        total_mandals += 1
        cn = re.sub(r'[^A-Z0-9]', '', m)
        if cn in apsac_by_clean:
            matched_count += 1
        else:
            # try fuzzy / phonetics
            c_norm = clean_str(m)
            found = [k for k in apsac_by_clean.keys() if clean_str(k) == c_norm]
            if found:
                matched_count += 1
            else:
                unmatched.append((ac_no, m))

print(f"Total mandals tested: {total_mandals}")
print(f"Matched: {matched_count}")
print(f"Unmatched: {len(unmatched)}")
if unmatched:
    print("\nSample unmatched:")
    for u in unmatched[:30]:
        print(f"  AC {u[0]}: '{u[1]}'")
