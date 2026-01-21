#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LIBRARY SECTION COPY & FINAL FRENCH ELIMINATION
Copies Library section from FR and eliminates all remaining French text
"""

import re

def main():
    print("🚀 Starting LIBRARY COPY & FINAL FRENCH ELIMINATION...")
    
    # Read both files
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            fr_content = f.read()
        with open('index_en.html', 'r', encoding='utf-8') as f:
            en_content = f.read()
    except Exception as e:
        print(f"❌ Error: {e}")
        return

    # Extract Library section from French version
    library_pattern = r'<!-- Section 9\.6: Bibliothèque & Sources -->.*?</section>'
    library_match = re.search(library_pattern, fr_content, re.DOTALL)
    
    if library_match:
        library_section_fr = library_match.group(0)
        print("✅ Found Library section in French version")
        
        # Translate the Library section
        library_section_en = library_section_fr
        library_replacements = [
            (r'<!-- Section 9\.6: Bibliothèque & Sources -->', '<!-- Section 9.6: Library & Sources -->'),
            (r'Bibliothèque & Sources', 'Reference Library'),
            (r'Data Room : Accédez aux textes de loi et rapports institutionnels',
             'Official sources and documentation'),
            (r'Rapport BCE - Wholesale DLT', 'ECB Report - Wholesale DLT'),
            (r'Le cadre européen pour les infrastructures de marché basées sur la blockchain',
             'The European framework for blockchain-based market infrastructures'),
            (r'Consulter sur ECB\.europa\.eu', 'Read on ECB.europa.eu'),
            (r'Cas d\'Usage Siemens', 'Siemens Case Study'),
            (r'Communiqué de presse officiel sur la première émission corporate avec Trigger',
             'Official press release on the first corporate issuance with Trigger settlement'),
            (r'Consulter sur Siemens\.com', 'Read on Siemens.com'),
            (r'Règlement MiCA \(UE\)', 'MiCA Regulation (EU)'),
            (r'Le cadre réglementaire européen pour les crypto-actifs',
             'The European regulatory framework for crypto-assets'),
            (r'Consulter sur ESMA\.europa\.eu', 'Read on ESMA.europa.eu'),
            (r'Sources Vérifiées', 'Verified Sources'),
            (r'Tous les documents sont issus d\'autorités officielles.*?Cette présentation s\'appuie sur des faits, pas des opinions',
             'All documents originate from official authorities (BaFin, ECB, ESMA) or verifiable press releases. This presentation relies on facts, not opinions'),
        ]
        
        for pattern, replacement in library_replacements:
            library_section_en = re.sub(pattern, replacement, library_section_en, flags=re.DOTALL)
        
        # Check if Library section exists in English version
        if re.search(r'<!-- Section 9\.6.*?-->', en_content):
            # Replace existing Library section
            en_content = re.sub(
                r'<!-- Section 9\.6.*?</section>',
                library_section_en,
                en_content,
                flags=re.DOTALL
            )
            print("✅ Replaced existing Library section in English version")
        else:
            # Insert before Glossary section
            glossary_pos = en_content.find('<!-- Section 10: Glossary')
            if glossary_pos > 0:
                en_content = en_content[:glossary_pos] + '\n    ' + library_section_en + '\n\n    ' + en_content[glossary_pos:]
                print("✅ Inserted Library section before Glossary")
    
    # Final comprehensive French elimination
    final_replacements = [
        # Common French words
        (r'\bdonnées\b', 'data'),
        (r'\bDonnées\b', 'Data'),
        (r'\bémission\b', 'issuance'),
        (r'\bÉmission\b', 'Issuance'),
        (r'\brèglement\b', 'settlement'),
        (r'\bRèglement\b', 'Settlement'),
        (r'\bactifs\b', 'assets'),
        (r'\bActifs\b', 'Assets'),
        (r'\binvestisseur\b', 'investor'),
        (r'\bInvestisseur\b', 'Investor'),
        (r'\bbanque\b', 'bank'),
        (r'\bBanque\b', 'Bank'),
        (r'\bmarché\b', 'market'),
        (r'\bMarché\b', 'Market'),
        (r'\brisque\b', 'risk'),
        (r'\bRisque\b', 'Risk'),
        (r'\bcoût\b', 'cost'),
        (r'\bCoût\b', 'Cost'),
        (r'\bcoûts\b', 'costs'),
        (r'\bCoûts\b', 'Costs'),
        (r'\bprix\b', 'price'),
        (r'\bPrix\b', 'Price'),
        (r'\bvaleur\b', 'value'),
        (r'\bValeur\b', 'Value'),
        (r'\btaux\b', 'rate'),
        (r'\bTaux\b', 'Rate'),
        (r'\btemps réel\b', 'real-time'),
        (r'\bTemps Réel\b', 'Real-Time'),
        (r'\btemps-réel\b', 'real-time'),
    ]
    
    count = 0
    for pattern, replacement in final_replacements:
        temp = re.sub(pattern, replacement, en_content, flags=re.IGNORECASE)
        if temp != en_content:
            en_content = temp
            count += 1
    
    # Write back
    with open('index_en.html', 'w', encoding='utf-8') as f:
        f.write(en_content)
    
    print(f"\n🎉 LIBRARY COPY & FRENCH ELIMINATION Complete: {count} additional replacements applied")

if __name__ == "__main__":
    main()
