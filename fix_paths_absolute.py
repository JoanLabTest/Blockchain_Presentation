import os
import re

files_to_fix = [
    "en/academy/index.html",
    "en/learn/index.html",
    "en/expert/index.html",
    "en/academy/pro/index.html",
    "fr/academy/index.html",
    "fr/learn/index.html",
    "fr/expert/index.html",
    "fr/academy/pro/index.html"
]

base_dir = "/Users/joanl/blockchain-presentation"

def fix_paths(file_path):
    abs_path = os.path.join(base_dir, file_path)
    if not os.path.exists(abs_path):
        print(f"Skipping {file_path} (not found)")
        return

    with open(abs_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Determine depth to handle relative path replacements correctly
    # academy/index.html (depth 1 from lang)
    # academy/pro/index.html (depth 2 from lang)
    
    # Simple regex approach: replace any src="..." or href="..." starting with ../ or ../../
    # with a version starting with /
    
    # 1. Handle ../../ style (double depth)
    content = re.sub(r'(src|href)="(\.\./\.\./)', r'\1="/', content)
    
    # 2. Handle ../ style (single depth)
    # Be careful: if we are in en/academy/, ../ points to en/. 
    # So href="../index.html" should become href="/en/index.html" 
    # OR if it was already pointing to a lang-specific file.
    
    # Actually, the user's advice "Use absolute paths from root (/js/quiz-engine.js)"
    # implies we should point to the root of the domain.
    
    # Let's check the current links:
    # src="../js/global-footer.js" in en/academy/index.html -> should be /js/global-footer.js
    content = re.sub(r'(src|href)="\.\./(?!(en/|fr/))', r'\1="/', content)
    
    # If it points to ../en/ or ../fr/, it means it's switching language or going to a sibling pillar
    # Example: href="../en/research-programs/index.html" in en/academy/index.html
    # Should become "/en/research-programs/index.html"
    content = re.sub(r'(src|href)="\.\./(en/|fr/)', r'\1="/\2', content)

    # Specific fix for the logo link and navigation
    # href="../../index.html" -> "/index.html" (already covered by rule 1)
    
    with open(abs_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed paths in {file_path}")

for f in files_to_fix:
    fix_paths(f)
