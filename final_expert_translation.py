#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de traduction FINALE pour les sections Spécificités Bancaires, Tableau et Glossaire
"""

import re

def main():
    print("🔧 Traduction experte des derniers blocs techniques de index-simple_en.html...")
    with open('index-simple_en.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Dictionnaire de traduction EXPERT (Banking & IT)
    corrections = [
        # --- 1. SPÉCIFICITÉS BANCAIRES (ROADMAP SIDEBAR) ---
        (r'SPÉCIFICITÉS BANCAIRES', 'BANKING SPECIFICS'),
        
        # Confidentialité
        (r'Confidentialité', 'Confidentiality'),
        (r'Privilégier les réseaux permissionnés \(Canton, Corda\) pour protéger le carnet d\'ordres\.', 
         'Prioritize permissioned networks (Canton, Corda) to protect the order book.'),
        
        # Règlement
        (r'Règlement \(Cash\)', 'Settlement (Cash)'),
        (r'Impératif d\'utiliser la Monnaie Banque Centrale \(Trigger\) pour le risque zéro\.', 
         'Mandatory use of Central Bank Money (Trigger) for zero counterparty risk.'),
        
        # Interopérabilité
        (r'Interopérabilité', 'Interoperability'),
        (r'Anticiper la connexion future avec Euroclear \(D-FMI\) pour la liquidité\.', 
         'Anticipate future connection with Euroclear (D-FMI) for liquidity.'),

        # --- 2. TABLEAU COMPARATIF (THE INFRASTRUCTURE CLASH) ---
        # En-têtes et Lignes
        (r'Cycle Standard \(T\+2\)', 'Standard Cycle (T+2)'),
        (r'Cycle Blockchain \(T\+0\)', 'Blockchain Cycle (T+0)'),
        
        # Ligne 1 : Émission
        (r'Bookbuilding manuel \(Email/Chat\)', 'Manual Bookbuilding (Email/Chat)'),
        (r'Règlemt\. différé 48h \(Risque\)', 'Deferred Settlement 48h (Risk)'),
        (r'Smart Contract \(Automatisé\)', 'Smart Contract (Automated)'),
        (r'Règlemt\. Atomique \(DvP\)', 'Atomic Settlement (DvP)'),
        
        # Ligne 2 : Vie du Titre
        (r'Agent Payeur \(Manuel\)', 'Paying Agent (Manual)'),
        (r'Réconciliations multiples', 'Multiple Reconciliations'),
        (r'Auto-Exécution \(Code\)', 'Auto-Execution (Code)'),
        (r'Golden Record Unique', 'Single Golden Record'),
        
        # Ligne 3 : Coûts
        (r'Intermédiaires \+\+\+', 'Intermediaries +++'),
        (r'Frais de Custody élevés', 'High Custody Fees'),
        (r'Désintermédiation', 'Disintermediation'),
        (r'Réduction 40-60%', '40-60% Reduction'),

        # --- 3. GLOSSAIRE TECHNIQUE (Vérification et Corrections) ---
        # Certains termes ont peut-être échappé aux regex précédentes
        
        # Atomic Swap
        (r'Mécanisme d\'échange simultané Titre contre Cash \(DvP\)\.', 
         'Simultaneous Title vs Cash exchange mechanism (DvP).'),
        (r'Élimine le risque de contrepartie\.', 'Eliminates counterparty risk.'),
        
        # Autres définitions potentiellement restantes
        (r'Passerelle qui connecte la Blockchain au système de paiement de la Banque Centrale', 
         'Gateway connecting Blockchain to Central Bank payment system'),
        
        (r'Création technique des tokens sur la blockchain', 
         'Technical creation of tokens on blockchain'),
         
        (r'Destruction des tokens lors du remboursement', 
         'Token destruction upon redemption'),
         
        (r'Principe de règlement simultané :', 
         'Simultaneous settlement principle:'),
         
        (r'Registre distribué partagé entre plusieurs participants', 
         'Distributed ledger shared among multiple participants'),
         
         # Placeholder barre de recherche
        (r'Rechercher un terme \(ex: Atomic Swap, Trigger\.\.\.\)', 
         'Search term (e.g. Atomic Swap, Trigger...)'),
    ]

    count = 0
    for pattern, replacement in corrections:
        # Utilisation de regex insensible à la casse pour être sûr de matcher
        new_content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
        if new_content != content:
            content = new_content
            count += 1
            print(f"✅ Traduit : {replacement[:40]}...")

    with open('index-simple_en.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n🎉 Traduction 'Banking Grade' terminée. {count} blocs corrigés.")

if __name__ == "__main__":
    main()
