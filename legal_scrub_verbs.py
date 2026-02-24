import os
import glob
import re

directory = '/Users/joanl/blockchain-presentation'

replacements = [
    (r'\b(G|g)arantit\b', r'\1arantit mathématiquement'),
    (r'\b(G|g)arantissant\b', r'visant à garantir'),
    (r'\bél(i|im)ine le risque\b', r'minimise le risque'),
    (r'\bÉlimine le risque\b', r'Minimise le risque'),
    (r'\b(1)00%\ssécurisé\b', r'hautement sécurisé')
]

def scrub_verbs(dir_path):
    html_files = glob.glob(os.path.join(dir_path, '*.html')) + glob.glob(os.path.join(dir_path, 'networks', '*.html'))
    count = 0
    for file_path in html_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        for target, replacement in replacements:
            content = re.sub(target, replacement, content)
            
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            count += 1
            print(f"Scrubbed Verbs in: {file_path}")
            
    print(f"Total files updated for verbs: {count}")

scrub_verbs(directory)
