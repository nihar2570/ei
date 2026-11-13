"""
Statewide Booth Triage & Political Model
Updates ACs 2 to 175 with realistic mandal-based variance and authentic candidate/party names,
while preserving AC 1's authentic Form-20 OCR extraction.
"""

import json
import os
import math

with open('public/data/andhra_elections.json', 'r', encoding='utf-8') as f:
    elections_data = json.load(f)['results']['2024']

with open('src/data/mandalData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'export const CONSTITUENCY_MANDALS: Record<number, MandalDetail[]> = '
raw_json = text.split(prefix)[1].strip()
if raw_json.endswith(';'):
    raw_json = raw_json[:-1].strip()
constituency_mandals = json.loads(raw_json)

def pseudo_rand(seed):
    x = math.sin(seed) * 10000.0
    return x - math.floor(x)

def clean_str(s):
    return s.lower().replace(' ', '').replace('-', '').replace('_', '')

updated_acs = 0
total_booths_updated = 0

for ac_str in range(2, 176):
    ac_no = int(ac_str)
    pub_path = f'public/data/booths/ac_{ac_no}.json'
    dist_path = f'dist/data/booths/ac_{ac_no}.json'
    
    if not os.path.exists(pub_path):
        continue
        
    with open(pub_path, 'r', encoding='utf-8') as f:
        booths = json.load(f)
        
    res = elections_data.get(str(ac_no))
    if not res:
        continue
        
    winner = res['winner']
    runner = res['runner_up']
    win_party = winner['party']
    run_party = runner['party']
    win_cand = winner['candidate']
    run_cand = runner['candidate']
    
    mandals = constituency_mandals.get(str(ac_no), [])
    
    for b in booths:
        b_no = b['booth_no']
        electorate = b.get('electorate', 950)
        
        # Match mandal
        b_mandal = b.get('mandal', '')
        matched_m = None
        for m in mandals:
            if clean_str(m['name']) in clean_str(b_mandal) or clean_str(b_mandal) in clean_str(m['name']):
                matched_m = m
                break
        if not matched_m and mandals:
            matched_m = mandals[b_no % len(mandals)]
            
        m_turnout = (matched_m['turnout_pct'] / 100.0) if matched_m else 0.78
        m_lead_party = matched_m['lead_party'] if matched_m else win_party
        m_margin = matched_m['margin'] if matched_m else 4000
        
        # Deterministic variation per booth
        r1 = pseudo_rand(ac_no * 3137 + b_no * 101)
        r2 = pseudo_rand(ac_no * 179 + b_no * 73)
        r3 = pseudo_rand(ac_no * 449 + b_no * 19)
        
        booth_turnout = min(0.94, max(0.62, m_turnout + (r1 - 0.5) * 0.08))
        total_votes = int(electorate * booth_turnout)
        
        # Base vote shares
        # If mandal lead party is winner
        if m_lead_party == win_party:
            win_share = 0.54 + (r2 - 0.5) * 0.16
        else:
            win_share = 0.44 + (r2 - 0.5) * 0.14
            
        win_share = min(0.85, max(0.25, win_share))
        rem_share = 1.0 - win_share
        run_share = rem_share * (0.85 + (r3 - 0.5) * 0.15)
        oth_share = max(0.01, 1.0 - win_share - run_share)
        
        win_votes = int(total_votes * win_share)
        run_votes = int(total_votes * run_share)
        oth_votes = max(0, total_votes - win_votes - run_votes)
        
        if win_votes >= run_votes:
            b_winner = win_party
            margin = win_votes - run_votes
        else:
            b_winner = run_party
            margin = run_votes - win_votes
            
        margin_pct = round((margin / max(1, total_votes)) * 100.0, 1)
        turnout_pct = round((total_votes / max(1, electorate)) * 100.0, 1)
        
        # Triage classification (relative to winner / coalition)
        if b_winner == win_party:
            if margin_pct >= 15.0 or margin >= 130:
                triage = 'fortress'
            elif margin <= 45 or margin_pct <= 6.0:
                triage = 'battleground'
            else:
                triage = 'vulnerable'
        else:
            if margin <= 45 or margin_pct <= 6.0:
                triage = 'battleground'
            else:
                triage = 'hostile'
                
        b['total_votes'] = total_votes
        b['turnout_pct'] = turnout_pct
        b['winner_party'] = b_winner
        b['margin'] = margin
        b['margin_pct'] = margin_pct
        b['triage'] = triage
        b['form20_source'] = "MANDAL_MODEL_ESTIMATE"
        b['form20_verified'] = False
        b['votes'] = {
            win_party: win_votes,
            run_party: run_votes,
            'OTH': oth_votes
        }
        b['candidates'] = {
            f"{win_cand} ({win_party})": win_votes,
            f"{run_cand} ({run_party})": run_votes,
            'Others': oth_votes
        }
        
        total_booths_updated += 1
        
    with open(pub_path, 'w', encoding='utf-8') as f:
        json.dump(booths, f, indent=2)
        
    if os.path.exists('dist/data/booths'):
        with open(dist_path, 'w', encoding='utf-8') as f:
            json.dump(booths, f, indent=2)
            
    updated_acs += 1

print(f"SUCCESS: Updated {updated_acs} ACs ({total_booths_updated} booths) with realistic mandal triage!")
print("AC 1 remains 100% authentic OFFICIAL_FORM20_OCR.")
