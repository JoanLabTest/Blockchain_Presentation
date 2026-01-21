#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FINAL ESG & REMAINING FRENCH CLEANUP
Fixes the last French remnants in ESG and other sections
"""

import re

def main():
    print("🚀 Starting FINAL ESG & FRENCH CLEANUP...")
    
    try:
        with open('index_en.html', 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Error: {e}")
        return

    # Final cleanup replacements
    replacements = [
        # === ESG SECTION - Problem List ===
        (r'Données statiques et périmées', 'Static data: Often outdated'),
        (r'Difficile à vérifier pour l\'investisseur', 'Hard to verify: Difficult for investors to audit'),
        (r'Risque de double comptabilisation', 'Double counting risk: Same impact claimed twice'),
        
        # === ESG SECTION - Solution List ===
        (r'Reporting Temps Réel :', 'Real-Time Reporting:'),
        (r'L\'usine Siemens envoie ses données carbone\s+directement dans le Token', 
         'The Siemens factory sends carbon data directly into the Token'),
        (r'Auditabilité :', 'Auditability:'),
        (r'L\'investisseur voit l\'Carbon Footprint sur son dashboard',
         'The investor views the Carbon Footprint directly on their dashboard'),
        (r'COUPON Dynamique :', 'Dynamic Coupon:'),
        (r'Le Smart Contract peut baisser automatiquement le taux si les objectifs écologiques sont atteints',
         'The Smart Contract can automatically lower the interest rate if ecological targets are met'),
        
        # === ESG Vision Box ===
        (r'Vision 2027 :</strong> L\'obligation ne sera plus seulement un instrument de dette, mais un instrument "Dette \+ Impact Vérifié"',
         'Vision 2027:</strong> The bond will no longer be just a debt instrument, but a "Debt + Verified Impact" instrument'),
        
        # === ESG Benefits Cards ===
        (r'Temps Réel', 'Real Time'),
        (r'Données ESG mises à jour en continu', 'ESG data updated continuously'),
        (r'Vérifiable', 'Verifiable'),
        (r'Piste d\'audit complète et immuable', 'Complete and immutable audit trail'),
        (r'Précis', 'Precise'),
        (r'Pas de double comptage possible', 'No double counting possible'),
        (r'Automatisé', 'Automated'),
        (r'Coupons ajustés selon la performance', 'Coupons adjusted based on performance'),
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
    
    print(f"\n🎉 FINAL ESG & FRENCH CLEANUP Complete: {count} corrections applied")

if __name__ == "__main__":
    main()
