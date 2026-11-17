with open('andhra-dashboard/src/data/mandalData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'"174":\s*\[(.*?)\]', text, re.DOTALL)
if m:
    names = re.findall(r'"name":\s*"([^"]+)"', m.group(1))
    print("Mandals in mandalData.ts for 174:", names)
