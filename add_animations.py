#!/usr/bin/env python3
"""
Script pour ajouter les classes d'animation aux sections clés
"""

import re

def add_animation_classes(filepath):
    """Ajoute les classes d'animation aux sections spécifiques"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modifications = [
        # Section 08 - Risks & Compliance: Ajouter style="--card-index: X" aux risk-cards
        {
            'pattern': r'(<div class="risk-card")',
            'replacement': r'\1 style="--card-index: 0; position: relative;"',
            'count': 1
        },
        # Ajouter stagger-animation au grid des risques
        {
            'pattern': r'(<div style="display: grid; grid-template-columns: repeat\(auto-fit, minmax\(400px, 1fr\)\); gap: 30px;">)',
            'replacement': r'\1\n            <div class="stagger-animation">',
            'count': 1,
            'section': 'risks'
        },
    ]
    
    # Appliquer les modifications
    for mod in modifications:
        if 'count' in mod:
            content = re.sub(mod['pattern'], mod['replacement'], content, count=mod.get('count', 0))
        else:
            content = re.sub(mod['pattern'], mod['replacement'], content)
    
    # Sauvegarder
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Animations ajoutées avec succès!")

if __name__ == "__main__":
    add_animation_classes('index.html')
