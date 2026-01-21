#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GLOSSARY & SPECIFIC SECTIONS FIX
Fixes remaining French in Glossary and ensures all sections are present
"""

import re

def main():
    print("🚀 Starting GLOSSARY & SECTIONS FIX...")
    
    try:
        with open('index_en.html', 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Error: {e}")
        return

    # Specific fixes for Glossary and other sections
    replacements = [
        # === GLOSSARY FIXES ===
        (r'anNULLé', 'cancelled'),
        (r'Supprime le Counterparty risk', 'Eliminates Counterparty Risk'),
        (r'Counterparty risk', 'Counterparty Risk'),
        (r'Traditional \(ex:', 'traditional (e.g.,'),
        (r'Wholesale MNBC', 'Wholesale CBDC'),
        (r'Monnaie Numérique de Banque Centrale', 'Central Bank Digital Currency'),
        (r'clés Privates et Publics', 'Private and Public Keys'),
        (r'Privates et Publics', 'Private and Public'),
        (r'nœuds du réseau', 'nodes in the network'),
        (r's\'accorder sur l\'état', 'agree on the state'),
        
        # === SECTION TITLES ===
        (r'Les définitions indispensables pour comprendre la mécanique',
         'Essential definitions to understand the mechanics'),
        (r'Au-delà du settlement: Total Transparency',
         'Beyond settlement: Total Transparency'),
        (r'Au-delà du SETTLEMENT: La Total Transparency',
         'Beyond settlement: Total Transparency'),
        
        # === COMPLIANCE & REGULATION ===
        (r'AML/KYC : Plus sûr que le système Traditional',
         'AML/KYC: Safer than the Traditional System'),
        
        # === OUTLOOK 2026 ===
        (r'Les Catalyseurs de l\'Industrialisation',
         'Catalysts for Industrialization'),
        
        # === RISK MAPPING ===
        (r'Analyse d\'impact pour le Desk',
         'Impact Analysis for the Desk'),
        
        # === MISC FRENCH REMNANTS ===
        (r'Portefeuille numérique permettant de',
         'Digital portfolio used to'),
        (r'Science du chiffrement des données',
         'Science of data encryption'),
        (r'Mécanisme permettant à tous les',
         'Mechanism allowing all'),
        (r'Registre distribué permettant l\'enregistrement',
         'Distributed register allowing the recording'),
        (r'Programme informatique autonome qui exécute',
         'Autonomous computer program that executes'),
        (r'Passerelle technique \(API\) permettant à une blockchain',
         'Technical gateway (API) allowing a blockchain'),
        (r'Processus technique de création des tokens',
         'Technical process of creating tokens'),
        (r'Mécanisme d\'échange simultané où le titre',
         'Simultaneous exchange mechanism where the security'),
    ]

    count = 0
    new_content = content
    
    for pattern, replacement in replacements:
        temp = re.sub(pattern, replacement, new_content, flags=re.DOTALL)
        if temp != new_content:
            new_content = temp
            count += 1
            print(f"✅ Fixed: {replacement[:60]}...")
    
    # Write back
    with open('index_en.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"\n🎉 GLOSSARY & SECTIONS FIX Complete: {count} corrections applied")
    
    # Check for remaining French
    french_indicators = ['anNULLé', 'Privates', 'Publics', 'nœuds', 's\'accorder', 
                        'permettant', 'Mécanisme', 'Portefeuille', 'Passerelle']
    
    remaining = []
    for indicator in french_indicators:
        if indicator in new_content:
            remaining.append(indicator)
    
    if remaining:
        print(f"\n⚠️  Still found: {', '.join(remaining[:5])}")
    else:
        print("\n✅ All targeted French indicators eliminated!")

if __name__ == "__main__":
    main()
