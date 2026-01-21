#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de traduction PATCH pour index_en.html
Cible : Spécificités Bancaires & Roadmap details
"""

import re

def main():
    print("🚀 Démarrage du PATCH (Roadmap & Banking Specifics)...")
    content = ""
    try:
        with open('index_en.html', 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return

    replacements = [
        # Banking Specifics
        (r'SPÉCIFICITÉS BANCAIRES À ANTICIPER', 'BANKING SPECIFICS TO ANTICIPATE'),
        (r'Confidentialité', 'Confidentiality'),
        (r'Privilégier les réseaux permissionnés \(Canton, Corda\) pour protéger le carnet d\'ordres et\s+les informations sensibles\.', 
         'Prioritize permissioned networks (Canton, Corda) to protect the order book and sensitive information.'),
        (r'Règlement \(Cash\)', 'Settlement (Cash)'),
        (r'Impératif d\'utiliser la Monnaie Banque Centrale \(Trigger\) pour éliminer le risque de\s+contrepartie\.', 
         'Imperative to use Central Bank Money (Trigger) to eliminate counterparty risk.'),
        (r'Interopérabilité', 'Interoperability'),
        (r'Anticiper la connexion future avec Euroclear \(D-FMI\) pour garantir la liquidité du marché\s+secondaire\.', 
         'Anticipate future connection with Euroclear (D-FMI) to guarantee secondary market liquidity.'),
        
        # Timeline
        (r'Timeline Globale : 6 Mois', 'Global Timeline: 6 Months'),
        (r'Kick-off', 'Kick-off'), # Same
        (r'Go-Live', 'Go-Live'), # Same
        
        # Execution Phase Details
        (r'EXÉCUTION', 'EXECUTION'),
        (r'Club Deal :', 'Club Deal:'),
        (r'Pre-sounding avec 2-3 Investors institutionnels\s+\(assureurs, fonds\)\.', 
         'Pre-sounding with 2-3 Institutional Investors (insurers, funds).'),
        (r'D-Day :', 'D-Day:'),
        (r'Minting des tokens, SETTLEMENT T\+0 via Atomic Swap\.', 
         'Token minting, T+0 SETTLEMENT via Atomic Swap.'),
        (r'Post-Trade :', 'Post-Trade:'),
        (r'Regulatory Reporting \(EMIR, SFTR\),\s+réconciliation\.', 
         'Regulatory Reporting (EMIR, SFTR), reconciliation.'),
        (r'Communication :', 'Communication:'),
        (r'Communiqué de presse, retour d\'expérience\.', 'Press release, feedback session.'),
    ]

    count = 0
    content_modified = content
    for pattern, replacement in replacements:
        new_content = re.sub(pattern, replacement, content_modified, flags=re.DOTALL | re.IGNORECASE)
        if new_content != content_modified:
            content_modified = new_content
            count += 1
            print(f"✅ Patché : {replacement[:30]}...") 
    
    with open('index_en.html', 'w', encoding='utf-8') as f:
        f.write(content_modified)
    
    print(f"\n🎉 Patch terminé : {count} blocs corrigés.")

if __name__ == "__main__":
    main()
