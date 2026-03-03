#!/usr/bin/env python3
import os
import re

ROOT_DIR = '/Users/joanl/blockchain-presentation'
EN_DIR = os.path.join(ROOT_DIR, 'en')

# Common UI translations
UI_MAP = {
    'Accueil': 'Home',
    'Produit': 'Product',
    'Recherche': 'Research',
    'Infrastructure': 'Infrastructure',
    'Légal': 'Legal',
    'Contact': 'Contact',
    'Tableau de Bord': 'Dashboard',
    'Retour à l\'OS': 'Back to OS',
    'Documentation': 'Documentation',
    'À propos': 'About',
    'Mentions Légales': 'Legal Mentions',
    'Confidentialité': 'Privacy',
    'Cookies': 'Cookies',
}

def sync_file(src_path, dest_dir):
    filename = os.path.basename(src_path)
    dest_path = os.path.join(dest_dir, filename)
    
    if os.path.exists(dest_path):
        # Skip existing for now to avoid overwriting manually translated ones
        return False
    
    print(f"Syncing {filename} to {dest_path}...")
    
    with open(src_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fundamental replacements
    content = content.replace('lang="fr"', 'lang="en"')
    
    # Update Language Switcher (Generic pattern)
    # Search for French flag link and English flag link
    content = content.replace('href="index.html" class="lang-btn active"', 'href="../fr/index.html" class="lang-btn"')
    content = content.replace('href="index_en.html" class="lang-btn"', 'href="#" class="lang-btn active"')
    
    # Simple UI Map replacements
    for fr, en in UI_MAP.items():
        content = content.replace(f'>{fr}<', f'>{en}<')
        content = content.replace(f'"{fr}"', f'"{en}"') # For titles/alt

    # Ensure parent directory exists
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    
    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(content)
    return True

def main():
    # 1. Sync Root HTML to en/
    root_files = [f for f in os.listdir(ROOT_DIR) if f.endswith('.html') and os.path.isfile(os.path.join(ROOT_DIR, f))]
    for f in root_files:
        if f in ['index.html', 'index-simple.html', 'index_en.html', 'index-simple_en.html']: continue 
        sync_file(os.path.join(ROOT_DIR, f), EN_DIR)
        
    # 2. Sync networks/ HTML to en/networks/
    networks_src = os.path.join(ROOT_DIR, 'networks')
    if os.path.exists(networks_src):
        networks_dest = os.path.join(EN_DIR, 'networks')
        for f in os.listdir(networks_src):
            if f.endswith('.html'):
                sync_file(os.path.join(networks_src, f), networks_dest)

if __name__ == "__main__":
    main()
