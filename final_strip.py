"""
Final cleanup: remove ALL remaining tracking scripts using sed-like line removal.
Handles edge cases with async="" and type="text/javascript" variants.
"""
import re
import glob

html_files = glob.glob('*.html') + glob.glob('networks/*.html')

# Broader patterns
patterns = [
    # Any script tag loading googletagmanager
    re.compile(r'\s*<script[^>]*src="https://www\.googletagmanager\.com/gtag/js\?id=G-[0-9A-Z]+"[^>]*>\s*</script>\s*', re.DOTALL),
    # Any gtag config block
    re.compile(r'\s*<script[^>]*>\s*window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\];\s*function\s+gtag\(\)\s*\{?\s*dataLayer\.push\(arguments\);?\s*\}?\s*gtag\([^)]*\);\s*gtag\([^)]*\);\s*</script>\s*', re.DOTALL),
    # GA4 comment
    re.compile(r'\s*<!--\s*Google Analytics[^-]*-->\s*', re.DOTALL),
    # Clarity block
    re.compile(r'\s*<!--\s*Microsoft Clarity[^-]*-->\s*<script[^>]*>\s*\(function\s*\(c,\s*l,\s*a,\s*r,\s*i,\s*t,\s*y\)\s*\{[^}]*\}[^)]*\)\(window,\s*document,\s*"clarity",\s*"script",\s*"[^"]*"\);\s*</script>\s*', re.DOTALL),
    # Standalone Clarity comment
    re.compile(r'\s*<!--\s*Microsoft Clarity[^-]*-->\s*', re.DOTALL),
    # Standalone Clarity script  
    re.compile(r'\s*<script[^>]*>\s*\(function\s*\(c,\s*l,\s*a,\s*r,\s*i,\s*t,\s*y\)\s*\{[^}]*\}[^)]*\)\(window,\s*document,\s*"clarity",\s*"script",\s*"[^"]*"\);\s*</script>\s*', re.DOTALL),
]

count = 0
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for pattern in patterns:
        content = pattern.sub('\n', content)
    
    # Clean up multiple blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        count += 1
        print(f"✅ Final cleaned: {file}")

print(f"\n🏁 Done. {count} files final cleaned.")
