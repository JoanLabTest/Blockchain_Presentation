import os
import glob
import re

GTM_HEAD = """<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-52J5C3HC');</script>
<!-- End Google Tag Manager -->"""

GTM_BODY = """<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-52J5C3HC"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->"""

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if GTM is already installed
    if 'GTM-52J5C3HC' in content:
        return

    # Insert GTM_HEAD right after the opening <head> tag
    content = re.sub(r'(<head[^>]*>)', r'\1\n' + GTM_HEAD, content, count=1, flags=re.IGNORECASE)

    # Insert GTM_BODY right after the opening <body> tag
    content = re.sub(r'(<body[^>]*>)', r'\1\n' + GTM_BODY, content, count=1, flags=re.IGNORECASE)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Process all HTML files in the repository
html_files = glob.glob('/Users/joanl/blockchain-presentation/**/*.html', recursive=True)

modified_count = 0
for f in html_files:
    # Optional: skip certain directories like tmp or node_modules if they exist
    if '.gemini' in f or 'node_modules' in f:
        continue
    process_file(f)
    modified_count += 1

print(f"Processed {modified_count} HTML files.")
