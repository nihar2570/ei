import json
import os

for ac in range(1, 176):
    f = f'andhra-dashboard/public/data/booths/ac_{ac}.json'
    if not os.path.exists(f): continue
    try:
        with open(f, 'r', encoding='utf-8') as fp:
            blist = json.load(fp)
    except Exception as e:
        print(f"ERROR in AC {ac}: {e}")
