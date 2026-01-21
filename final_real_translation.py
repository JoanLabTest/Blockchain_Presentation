#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de traduction FINALE basé sur le contenu REEL du fichier
"""

import re

def main():
    print("🔧 Traduction experte basée sur le contenu réel...")
    with open('index-simple_en.html', 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = [
        # --- TAB 1: PRIMAIRE ---
        (r'J-5', 'D-5'),
        (r'J-0', 'D-0'),
        (r'J\+5', 'D+5'),
        (r'H-2', 'H-2'),
        (r'H-0', 'H-0'),
        (r'H\+10m', 'H+10m'),
        (r'Bookbuilding traditionnel\.', 'Traditional Bookbuilding.'),
        (r'Signature manuelle d\'un certificat\s+physique unique stocké au coffre \(CSD\)\.', 
         'Manual signature of a unique physical global note stored in the vault (CSD).'),
        (r'Cascade de virements via Custodians\.', 'Waterfall of transfers via Custodians.'),
        (r'Modèle Digital', 'Digital Model'),
        (r'Négociation identique\.', 'Negotiation identical.'),
        (r'Déploiement du code\. Le "Token" remplace\s+le papier\.', 
         'Code deployment. The "Token" replaces paper.'),
        (r'Livraison P2P instantanée contre cash\.', 'Instant P2P Delivery vs Payment.'),

        # --- TAB 2: SECONDAIRE ---
        (r'La "Chaîne" \(SWIFT\)', 'The "Chain" (SWIFT)'),
        (r'Vendeur ➔ Custodian A \(MT540\) ➔ CSD ➔ Custodian B \(MT541\) ➔ Acheteur', 
         'Seller ➔ Custodian A (MT540) ➔ CSD ➔ Custodian B (MT541) ➔ Buyer'),
        (r'Si un message est perdu, le trade échoue \("Fail"\)\. Délai T\+2\.', 
         'Risk: If a message is lost, the trade fails. T+2 Delay.'),
        (r'L\'Atomic Swap', 'Atomic Swap'),
        (r'Vendeur ↔ Smart Contract ↔ Acheteur', 'Seller ↔ Smart Contract ↔ Buyer'),
        (r'Échange simultané\. Impossible de livrer sans être payé\.\s+T\+0\.', 
         'Revolution: Simultaneous exchange. Impossible to deliver without payment. T+0.'),

        # --- TAB 3: SETTLEMENT (TABLEAU) ---
        (r'Critère', 'Criteria'),
        (r'Conventionnel', 'Conventional'),
        (r'Support Juridique', 'Legal Basis'),
        (r'Global Note \(Papier\)', 'Global Note (Paper)'),
        (r'Code \(Smart Contract\)', 'Code (Smart Contract)'),
        (r'Réconciliation', 'Reconciliation'),
        (r'Manuelle \(3 niveaux\)', 'Manual (3 levels)'),
        (r'Aucune \(Registre Unique\)', 'None (Single Registry)'),
        (r'Délai Règlement', 'Settlement Delay'),
        (r'T\+2 à T\+5', 'T+2 to T+5'),
        (r'T\+0 \(Instantané\)', 'T+0 (Instant)'),
        (r'Risque', 'Risk'),
        (r'Contrepartie', 'Counterparty'),
        (r'Technologique', 'Technological'),
        
        # --- TRADER SCREEN ---
        (r'Yield: <strong>3.15%</strong>', 'Yield: <strong>3.15%</strong>'), # Déjà bon
        
        # --- ROADMAP ---
        (r'Plan d\'Action : Lancer un Pilote Bancaire', 'Action Plan: Launch Banking Pilot'),
        (r'Feuille de route pour une émission inaugurale \(6 mois\)', 'Roadmap for inaugural issuance (6 months)'),
        (r'Cadrage Juridique', 'Legal Framework'),
        (r'Choix du droit \(eWpG Allemagne\)', 'Law selection (eWpG Germany)'),
        (r'Sélection Plateforme', 'Platform Selection'),
        (r'Structuration', 'Structuring'),
        (r'Montant, Maturité, Coupon', 'Amount, Maturity, Coupon'),
        (r'Tech Setup', 'Tech Setup'),
        (r'Wallet, Smart Contract, KYC', 'Wallet, Smart Contract, KYC'),
        (r'Placement', 'Placement'),
        (r'Roadshow Investisseurs', 'Investor Roadshow'),
        (r'Émission T\+0', 'T+0 Issuance'),
        (r'Minting \+ Règlement Instantané', 'Minting + Instant Settlement'),
        
        # --- ROADMAP SIDEBAR ---
        (r'SPÉCIFICITÉS BANCAIRES', 'BANKING SPECIFICS'),
        (r'Confidentialité', 'Confidentiality'),
        (r'Privilégier les réseaux permissionnés \(Canton, Corda\) pour protéger le carnet d\'ordres\.', 
         'Prioritize permissioned networks (Canton, Corda) to protect the order book.'),
        (r'Règlement \(Cash\)', 'Settlement (Cash)'),
        (r'Impératif d\'utiliser la Monnaie Banque Centrale \(Trigger\) pour le risque zéro\.', 
         'Mandatory use of Central Bank Money (Trigger) for zero counterparty risk.'),
        (r'Interopérabilité', 'Interoperability'),
        (r'Anticiper la connexion future avec Euroclear \(D-FMI\) pour la liquidité\.', 
         'Anticipate future connection with Euroclear (D-FMI) for liquidity.')
    ]

    count = 0
    for pattern, replacement in replacements:
        new_content = re.sub(pattern, replacement, content)
        if new_content != content:
            content = new_content
            count += 1
            print(f"✅ Traduit : {replacement[:40]}...")

    with open('index-simple_en.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n🎉 Traduction terminée. {count} blocs corrigés.")

if __name__ == "__main__":
    main()
