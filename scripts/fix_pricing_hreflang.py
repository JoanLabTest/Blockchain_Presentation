import os
import re

def fix_hreflang(filepath, lang):
    basename = os.path.basename(filepath)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove existing hreflang link tags to avoid duplicates
    content = re.sub(r'<link[^>]*hreflang=[^>]*>\s*', '', content)

    # Prepare new tags
    new_tags = f'''
    <link rel="alternate" hreflang="fr" href="https://dcm-digital.com/fr/{basename}" />
    <link rel="alternate" hreflang="en" href="https://dcm-digital.com/en/{basename}" />
    <link rel="alternate" hreflang="x-default" href="https://dcm-digital.com/fr/{basename}" />
'''
    # Inject before </head>
    content = re.sub(r'(</head>)', new_tags + r'\1', content, count=1, flags=re.IGNORECASE)

    # Note: the root pricing.html should also point to the /fr/ page as default
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Injecting hreflang on updated pricing files...")
for p in ['pricing.html', 'fr/pricing.html', 'en/pricing.html']:
    if os.path.exists(p):
        lang = 'en' if 'en/' in p else 'fr'
        fix_hreflang(p, lang)
print("Done.")
