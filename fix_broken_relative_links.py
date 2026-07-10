import os
import glob
import re

# Script to scan en/ and fr/ files and correct common broken relative links in the page body

def fix_links_in_directory(directory, lang):
    files = glob.glob(f'{directory}/**/*.html', recursive=True)
    fixed_count = 0
    
    # Common replacements map based on language
    replacements = {
        # Target -> Replacement (with absolute paths)
        r'href=["\'](\.\./)*regulatory-transparency\.html["\']': f'href="/{lang}/regulatory-transparency.html"',
        r'href=["\'](\.\./)*support-it\.html["\']': f'href="/{lang}/support-it.html"',
        r'href=["\'](\.\./)*api-docs\.html["\']': f'href="/{lang}/api-docs.html"',
        r'href=["\'](\.\./)*pricing-institutional\.html["\']': f'href="/{lang}/academy/pricing.html"',
        r'href=["\'](\.\./)*smart-contracts\.html["\']': f'href="/{lang}/smart-contracts.html"',
        r'href=["\'](\.\./)*governance\.html["\']': f'href="/{lang}/governance.html"',
        r'href=["\'](\.\./)*privacy\.html["\']': f'href="/{lang}/privacy.html"',
        r'href=["\'](\.\./)*cookies\.html["\']': f'href="/{lang}/cookies.html"',
        r'href=["\'](\.\./)*cgu\.html["\']': f'href="/{lang}/cgu.html"',
        
        # Specific folder corrections
        r'href=["\']/fr/about/press\.html["\']': 'href="/fr/about/presse.html"',
        r'href=["\']/fr/about/strategy\.html["\']': 'href="/fr/about/strategie.html"',
        r'href=["\']/fr/about/advisory-board\.html["\']': 'href="/fr/about/conseil-consultatif.html"',
        r'href=["\']/fr/about/editorial-board\.html["\']': 'href="/fr/about/comite-editorial.html"',
        
        # Path depth corrections for signals.html and governance.html (methodology) in navbar/body
        r'href=["\']\.\./\.\./en/intelligence/signals\.html["\']': 'href="/en/intelligence/signals.html"',
        r'href=["\']\.\./\.\./en/methodology/governance\.html["\']': 'href="/en/methodology/governance.html"',
    }
    
    for file_path in files:
        if '.git' in file_path or 'node_modules' in file_path or 'scratch' in file_path:
            continue
            
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        original_content = content
        
        # Apply regex replacements
        for pattern, replacement in replacements.items():
            content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
            
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            fixed_count += 1
            
    print(f"Processed {len(files)} files in /{directory}. Fixed links in {fixed_count} files.")

if __name__ == '__main__':
    print("Fixing broken relative links in localized subdirectories...")
    fix_links_in_directory('en', 'en')
    fix_links_in_directory('fr', 'fr')
