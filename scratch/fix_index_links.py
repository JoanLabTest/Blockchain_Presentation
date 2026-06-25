import os

def fix_index(file_path, mappings):
    if not os.path.exists(file_path):
        print(f"File {file_path} not found.")
        return
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split the file by '<div class="brief-card">'
    parts = content.split('<div class="brief-card">')
    new_parts = [parts[0]]
    updated_count = 0
    for part in parts[1:]:
        matched = False
        for keyword, target in mappings.items():
            if keyword in part:
                part = part.replace('href="#"', f'href="{target}"', 1)
                print(f"Updated link in {file_path} for '{keyword}' -> '{target}'")
                updated_count += 1
                matched = True
                break
        new_parts.append(part)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('<div class="brief-card">'.join(new_parts))
    print(f"Finished {file_path}. Updated {updated_count} cards.")

fix_index("en/policy-briefs/index.html", {
    "Implementing DORA": "pb-2026-04.html",
    "Offline CBDC Portability": "pb-2026-03.html",
    "Synthetic Stablecoins": "pb-2026-02.html",
    "MiCA Phase 2": "pb-2026-01.html"
})

fix_index("fr/policy-briefs/index.html", {
    "Mise en œuvre de DORA": "pb-2026-04.html",
    "Portabilité des MNBC": "pb-2026-03.html",
    "Stablecoins synthétiques": "pb-2026-02.html",
    "MiCA Phase 2": "pb-2026-01.html"
})
