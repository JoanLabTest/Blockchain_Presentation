"""
Strip static GA4/Hotjar scripts from all HTML files 
and inject cookie-consent.js + security meta tags instead.
"""
import glob
import re

# Files to process
html_files = glob.glob('*.html') + glob.glob('networks/*.html')

GA4_BLOCK = re.compile(
    r'\s*<!-- Google Analytics \(GA4\) -->\s*'
    r'<script async src="https://www\.googletagmanager\.com/gtag/js\?id=G-486THQXM9D"></script>\s*'
    r'<script>\s*'
    r"window\.dataLayer = window\.dataLayer \|\| \[\];\s*"
    r"function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*"
    r"gtag\('js', new Date\(\)\);\s*"
    r"gtag\('config', 'G-486THQXM9D'\);\s*"
    r'</script>',
    re.DOTALL
)

HOTJAR_BLOCK = re.compile(
    r'\s*<!-- Hotjar Tracking Code -->\s*'
    r'<script>\s*'
    r"\(function\(h,o,t,j,a,r\)\{.*?\}\)\(window,document,'https://static\.hotjar\.com/c/hotjar-','\.js\?sv='\);\s*"
    r'</script>',
    re.DOTALL
)

CONSENT_SCRIPT = '    <script src="js/cookie-consent.js"></script>'
CONSENT_SCRIPT_NETWORKS = '    <script src="../js/cookie-consent.js"></script>'

SECURITY_METAS = '''    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta name="referrer" content="strict-origin-when-cross-origin">'''

count = 0
for file in html_files:
    if "backup" in file or "old" in file:
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Remove GA4 block
    content = GA4_BLOCK.sub('', content)

    # Remove Hotjar block  
    content = HOTJAR_BLOCK.sub('', content)

    # Determine correct path for script
    script_tag = CONSENT_SCRIPT_NETWORKS if file.startswith('networks/') else CONSENT_SCRIPT

    # Inject cookie-consent.js if not already present and if </head> exists
    if 'cookie-consent.js' not in content and '</head>' in content:
        content = content.replace('</head>', f'{script_tag}\n</head>')

    # Inject security meta tags if not already present
    if 'X-Content-Type-Options' not in content and '</head>' in content:
        content = content.replace('</head>', f'{SECURITY_METAS}\n</head>')

    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        count += 1
        print(f"✅ Processed: {file}")

print(f"\n🏁 Done. {count} files updated.")
