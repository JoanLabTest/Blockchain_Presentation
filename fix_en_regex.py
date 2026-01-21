#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de nettoyage FINAL pour index-simple_en.html
Utilise des regex pour capturer le texte multi-lignes
"""

import re

def main():
    print("🔧 Nettoyage final de index-simple_en.html...")
    with open('index-simple_en.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Liste des corrections avec regex (pour gérer les sauts de ligne \s+)
    corrections = [
        # HERO / INTRO
        (r'SG émet 100M€ d\'OFH sur Ethereum Public\.', 'SG issues €100m Covered Bond on Public Ethereum.'),
        
        # HISTORIQUE
        (r'L\'Allemagne légalise le titre purement\s+digital\.', 'Germany legalizes purely digital securities.'),
        (r'Siemens émet 300M€ avec Trigger\.', 'Siemens issues €300m with Trigger settlement.'),
        (r'ECB Standardization & Market Making\.', 'ECB Standardization & Market Making.'), # Déjà bon
        
        # FONDAMENTAUX
        (r'Analogie : <strong>Un Fichier Excel Partagé</strong>', 'Analogy: <strong>A Shared Excel File</strong>'),
        (r'Au lieu de réconcilier deux fichiers internes \(T\+2\), toutes les banques lisent le même\s+registre en temps réel \(T\+0\)\.', 
         'Instead of reconciling two internal files (T+2), all banks read the same ledger in real-time (T+0).'),
        (r'Analogie : <strong>IBAN \+ Signature</strong>', 'Analogy: <strong>IBAN + Signature</strong>'),
        (r'L\'Adresse Publique est votre IBAN pour recevoir\. La Clé Privée est votre signature\s+électronique pour valider\.', 
         'Public Address is your IBAN to receive. Private Key is your digital signature to validate.'),
         
        # BENCHMARKS
        (r'SWIAT \(Privée\)', 'SWIAT (Private)'),
        (r'Sécurité juridique \(Nominatif\)', 'Legal certainty (Registered)'),
        (r'Vitesse :', 'Speed:'),
        (r'T\+Minutes \(vs T\+2\)', 'T+Minutes (vs T+2)'),
        
        # REGULATION
        (r'Cadre complet pour titres au porteur digitaux\. C\'est le standard\s+de marché actuel\.', 
         'Comprehensive framework for digital bearer bonds. Current market standard.'),
        (r'Cadre flexible pour les infrastructures DLT\. Forte\s+innovation \(SG-Forge, Banque de France\)\.', 
         'Flexible framework for DLT infrastructures. Strong innovation focus (SG-Forge, BdF).'),
         
        # CONTACT
        (r'VOIR\s+LA DÉMO', 'VIEW DEMO'),
    ]

    count = 0
    for pattern, replacement in corrections:
        # Utiliser re.sub avec flags=re.DOTALL pour que . matche les newlines si besoin, 
        # mais ici \s+ suffit pour les espaces/new lines
        new_content = re.sub(pattern, replacement, content)
        if new_content != content:
            content = new_content
            count += 1
            print(f"✅ Corrigé : {replacement[:30]}...")

    with open('index-simple_en.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n🎉 Total corrections appliquées : {count}")

if __name__ == "__main__":
    main()
