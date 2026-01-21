#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour mettre à jour le Footer Legal en Anglais Pur
"""

import re

def main():
    print("🔧 Mise à jour du Footer Legal en Anglais...")
    with open('index-simple_en.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Le bloc à remplacer (avec potentiellement des espaces/sauts de ligne variables)
    # On utilise un regex flexible pour attraper le bloc "legal-footer" actuel
    
    # Nouveau contenu HTML exact demandé par le user
    new_footer = """<div class="legal-footer">
        <p>
            <strong>INTERNAL DISCLAIMER:</strong> This document is a strategic presentation for educational and internal use only.
            Financial products (Digital Bonds) and market scenarios presented are simulations.
            Does not constitute a service offer or investment advice.
            <br>
            <span style="opacity: 0.6; font-size: 10px;">Classification: CONFIDENTIAL / INTERNAL USE ONLY • © 2026 DCM Digital Desk</span>
        </p>
    </div>"""

    # Regex pour trouver l'ancien footer, peu importe son contenu exact tant qu'il est entre <div class="legal-footer"> et </div>
    pattern = r'<div class="legal-footer">.*?</div>'
    
    # Remplacement
    new_content = re.sub(pattern, new_footer, content, flags=re.DOTALL)
    
    if new_content != content:
        # Sauvegarde
        with open('index-simple_en.html', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("✅ Footer Legal mis à jour avec succès !")
    else:
        print("⚠️ Impossible de trouver le bloc .legal-footer via regex. Tentative de remplacement direct...")
        # Fallback au cas où le regex échoue (peu probable avec DOTALL)

if __name__ == "__main__":
    main()
