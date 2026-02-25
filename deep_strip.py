"""
Deep strip: remove ALL remaining hardcoded GA4 and Clarity scripts from HTML files.
Uses broader regex patterns to catch the original (pre-injection) scripts.
"""
import glob
import re

html_files = glob.glob('*.html') + glob.glob('networks/*.html')

# Pattern for ANY googletagmanager gtag script + its config block
GA4_PATTERN = re.compile(
    r'\s*<script\s+async[="]?["]?\s+src="https://www\.googletagmanager\.com/gtag/js\?id=G-[0-9A-Z]+">\s*</script>\s*'
    r'<script>\s*'
    r"window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\];\s*"
    r"function\s+gtag\(\)\s*\{\s*dataLayer\.push\(arguments\);\s*\}\s*"
    r"gtag\('js',\s*new\s+Date\(\)\);\s*"
    r"gtag\('config',\s*'G-[0-9A-Z]+'\);\s*"
    r'</script>',
    re.DOTALL
)

# Simpler pattern for just the script tag
GA4_SCRIPT_TAG = re.compile(
    r'\s*<script\s+async[="]?["]?\s+src="https://www\.googletagmanager\.com/gtag/js\?id=G-[0-9A-Z]+">\s*</script>',
    re.DOTALL
)

# Pattern for Clarity
CLARITY_PATTERN = re.compile(
    r'\s*<!-- Microsoft Clarity.*?-->\s*'
    r'<script>\s*'
    r"\(function\(c,l,a,r,i,t,y\)\{.*?\}\)\(window,\s*document,\s*\"clarity\",\s*\"script\",\s*\"[a-zA-Z0-9_]+\"\);\s*"
    r'</script>',
    re.DOTALL
)

count = 0
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Remove GA4 full blocks
    content = GA4_PATTERN.sub('', content)
    
    # Remove standalone GA4 script tags (edge cases)
    content = GA4_SCRIPT_TAG.sub('', content)
    
    # Remove Clarity blocks
    content = CLARITY_PATTERN.sub('', content)
    
    # Remove orphaned gtag config blocks (without the async script)
    orphan_gtag = re.compile(
        r'\s*<script>\s*'
        r"window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\];\s*"
        r"function\s+gtag\(\)\s*\{\s*dataLayer\.push\(arguments\);\s*\}\s*"
        r"gtag\('js',\s*new\s+Date\(\)\);\s*"
        r"gtag\('config',\s*'G-[0-9A-Z]+'\);\s*"
        r'</script>',
        re.DOTALL
    )
    content = orphan_gtag.sub('', content)
    
    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        count += 1
        print(f"✅ Deep cleaned: {file}")

print(f"\n🏁 Done. {count} files deep cleaned.")
