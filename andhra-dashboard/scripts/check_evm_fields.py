import json

cand_data = json.load(open('andhra-dashboard/public/data/andhra_candidates_2024.json', encoding='utf-8'))
for ac in ['2', '7', '23', '35', '36', '40', '53', '57', '65', '100']:
    c = cand_data.get(ac, {})
    cands = c.get('candidates', [])
    w = cands[0] if cands else {}
    r = cands[1] if len(cands) > 1 else {}
    v_info = c.get('voters_info', {})
    w_evm = w.get('evm_votes', w.get('votes'))
    r_evm = r.get('evm_votes', r.get('votes'))
    print(f"AC {ac:3s} ({c.get('ac_name')}): {w.get('name')} ({w.get('party')}) = {w_evm:,} | {r.get('name')} ({r.get('party')}) = {r_evm:,} | EVM Polled = {v_info.get('voted_total'):,}")
