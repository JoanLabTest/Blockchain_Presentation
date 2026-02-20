import os
import re

def fix_accessibility(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # 1. Add aria-label to buttons if missing
    def add_button_aria(match):
        tag = match.group(0)
        if 'aria-label=' not in tag:
            return tag.replace('<button', '<button aria-label="Bouton"')
        return tag
    content = re.sub(r'<button[^>]*>', add_button_aria, content)

    # 2. Add aria-label to common icon links
    content = re.sub(r'<a[^>]*class="[^"]*social-link[^"]*"[^>]*>', 
                     lambda m: m.group(0).replace('<a', '<a aria-label="Réseau social"') if 'aria-label' not in m.group(0) else m.group(0), content)
    content = re.sub(r'<a[^>]*class="[^"]*nav-link[^"]*"[^>]*>', 
                     lambda m: m.group(0).replace('<a', '<a aria-label="Navigation"') if 'aria-label' not in m.group(0) else m.group(0), content)
    content = re.sub(r'<a[^>]*class="[^"]*toc-link[^"]*"[^>]*>', 
                     lambda m: m.group(0).replace('<a', '<a aria-label="Lien sommaire"') if 'aria-label' not in m.group(0) else m.group(0), content)
    content = re.sub(r'<a[^>]*class="[^"]*back-btn[^"]*"[^>]*>', 
                     lambda m: m.group(0).replace('<a', '<a aria-label="Retour"') if 'aria-label' not in m.group(0) else m.group(0), content)

    # 3. Wrap root container with role="main" (fixing landmark-one-main)
    if 'role="main"' not in content and '<main' not in content:
        content = content.replace('<div class="container">', '<div class="container" role="main">', 1)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed accessibility on {filepath}")

for f in os.listdir('.'):
    if f.endswith('.html'):
        fix_accessibility(f)
print("Accessibility enhancements applied.")
