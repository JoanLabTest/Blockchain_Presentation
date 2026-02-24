import os
import glob
import re

directory = '/Users/joanl/blockchain-presentation'
target_text = r'Plateforme de démonstration éducative. Aucun conseil financier. Les\s*données présentées sont à but illustratif. DCM Digital est un projet de recherche sur les infrastructures de\s*marché.'
replacement_text = r'''DCM Digital est une infrastructure logicielle d'aide à la décision (B2B SaaS). Les simulations de rendement (Yield), d'optimisation de capital (RWA/Capital Charge) et les scénarios de stress-tests (MRM) sont fournis à titre purement indicatif. DCM Digital ne fournit aucun conseil en investissement réglementé (MiFID II) ni aucune garantie de performance ou de couverture absolue.'''

def scrub_footers(dir_path):
    html_files = glob.glob(os.path.join(dir_path, '*.html')) + glob.glob(os.path.join(dir_path, 'networks', '*.html'))
    count = 0
    for file_path in html_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if re.search(target_text, content):
            new_content = re.sub(target_text, replacement_text, content)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            count += 1
            print(f"Scrubbed: {file_path}")
    print(f"Total files updated: {count}")

scrub_footers(directory)
