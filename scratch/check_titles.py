import os
import re

files = [
    ("en/buidl/index.html", "en"),
    ("fr/buidl/index.html", "fr"),
    ("en/insights/mica/mica-compliance-banks.html", "en"),
    ("fr/insights/mica/conformite-mica-banques.html", "fr"),
    ("en/research/programmable-capital-markets/unified-ledger.html", "en"),
    ("fr/research/programmable-capital-markets/unified-ledger.html", "fr"),
    ("en/yield-mechanics.html", "en"),
    ("fr/yield-mechanics.html", "fr"),
    ("en/policy-briefs/pb-2026-03.html", "en"),
    ("fr/policy-briefs/pb-2026-03.html", "fr"),
]

for file_path, lang in files:
    if not os.path.exists(file_path):
        print(f"File {file_path} not found.")
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
    h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.IGNORECASE | re.DOTALL)
    
    title = title_match.group(1).strip() if title_match else "NONE"
    h1 = re.sub(r'<[^>]+>', '', h1_match.group(1)).strip() if h1_match else "NONE"
    # normalize spaces
    h1 = " ".join(h1.split())
    print(f"Path: {file_path}")
    print(f"  Title: {title}")
    print(f"  H1:    {h1}")
