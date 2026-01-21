#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de traduction Phase 3 pour index_en.html (Use Cases & Products)
"""

import re

def main():
    print("🚀 Démarrage de la traduction Phase 3 (Use Cases & Products)...")
    with open('index_en.html', 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = [
        # SECTION 7: ÉMISSION OBLIGATION (OBLIGATION)
        (r'Cas Pratique : Émission d\'une Obligation', 'Use Case: Bond Issuance'),
        (r'Comparaison avant/après la tokenisation', 'Comparison before/after tokenization'),
        (r'Processus Traditionnel \(Manuel\)', 'Traditional Process (Manual)'),
        (r'T\+2 à T\+5 jours', 'T+2 to T+5 days'),
        (r'Processus Tokenisé \(Automatisé\)', 'Tokenized Process (Automated)'),
        (r'T\+0 \(Instantané\)', 'T+0 (Instant)'),
        (r'Multiples intermédiaires', 'Multiple intermediaries'),
        (r'Réconciliation en temps réel', 'Real-time reconciliation'),
        (r'Risque de contrepartie', 'Counterparty risk'),
        (r'DvP atomique \(Delivery vs Payment\)', 'Atomic DvP (Delivery vs Payment)'),

        # SECTION 8: BENCHMARKS INDUSTRIELS
        (r'Benchmarks Industriels', 'Industrial Benchmarks'),
        (r'Les grandes banques montrent la voie', 'Major banks leading the way'),
        (r'100M€', '€100m'), # Pas besoin de trad, mais contexte
        (r'Règlement :', 'Settlement:'),
        (r'Obligation de Financement de l\'Habitat \(Covered Bond\)', 'Covered Bond'),
        (r'Pilote juridique sur Ethereum Public', 'Legal pilot on Public Ethereum'),
        (r'Papier commercial numérique', 'Digital Commercial Paper'),
        (r'Obligation verte tokenisée sur blockchain privée', 'Green tokenized bond on private blockchain'),

        # SECTION 9: BUREAU DU TRADER
        (r'Bureau du Trader 2026', 'Trader Desk 2026'),
        (r'L\'interface de demain', 'Tomorrow\'s Interface'),
        (r'Carnet d\'ordres unifié', 'Unified Order Book'),
        (r'Visualisation en temps réel de la liquidité globale', 'Real-time visualization of global liquidity'),
        (r'Exécution en un clic', 'One-click Execution'),
        (r'Achat/Vente sans risque de règlement \(Atomic Swap\)', 'Buy/Sell without settlement risk (Atomic Swap)'),
        (r'Gestion de collatéral', 'Collateral Management'),
        (r'Optimisation automatique des paniers de collatéral', 'Automatic optimization of collateral baskets'),

        # SECTION 10: COVERED BONDS
        (r'Focus Produit : Covered Bond', 'Product Focus: Covered Bond'),
        (r'L\'actif idéal pour la tokenisation', 'The ideal asset for tokenization'),
        (r'Pourquoi le Covered Bond \?', 'Why Covered Bonds?'),
        (r'Standardisation élevée', 'High standardization'),
        (r'Actif de haute qualité \(HQLA\)', 'High Quality Liquid Asset (HQLA)'),
        (r'Gros volumes d\'émission', 'Large issuance volumes'),
        (r'Structure Double Recours', 'Double Recourse Structure'),
        (r'Garantie par le bilan de la banque et le panier de couverture', 'Guaranteed by bank balance sheet and cover pool'),

        # SECTION 11: ESG & DATA
        (r'ESG & Smart Data', 'ESG & Smart Data'),
        (r'La transparence au service de la durabilité', 'Transparency serving sustainability'),
        (r'Reporting Automatisé', 'Automated Reporting'),
        (r'Les données ESG sont inscrites directement dans le token', 'ESG data is embedded directly in the token'),
        (r'Green Bonds Vérifiables', 'Verifiable Green Bonds'),
        (r'Preuve d\'impact immuable sur la blockchain', 'Immutable proof of impact on blockchain'),
        (r'Audit en Temps Réel', 'Real-time Audit'),
        (r'Plus besoin d\'attendre les rapports annuels', 'No need to wait for annual reports'),

        # SECTION 12: COMPLIANCE & AML
        (r'Compliance & Régulation', 'Compliance & Regulation'),
        (r'La conformité by design', 'Compliance by Design'),
        (r'KYC Intégré \(Know Your Customer\)', 'Embedded KYC (Know Your Customer)'),
        (r'Le token vérifie l\'identité du porteur avant le transfert', 'Token verifies holder identity before transfer'),
        (r'Liste Blanche \(Whitelist\)', 'Whitelist'),
        (r'Seuls les investisseurs autorisés peuvent détenir le token', 'Only authorized investors can hold the token'),
        (r'Gel des Actifs', 'Asset Freezing'),
        (r'Capacité de geler les fonds en cas d\'enquête', 'Ability to freeze funds during investigations'),
        (r'Reporting Réglementaire', 'Regulatory Reporting'),
        (r'Déclarations automatiques aux régulateurs', 'Automatic declarations to regulators'),

        # SECTION 13: BUSINESS CASE & ROI
        (r'Business Case & ROI', 'Business Case & ROI'),
        (r'La rentabilité du modèle', 'Model Profitability'),
        (r'Économies de Back-Office', 'Back-Office Savings'),
        (r'Réduction de 40% des coûts de réconciliation', '40% reduction in reconciliation costs'),
        (r'Optimisation du Collatéral', 'Collateral Optimization'),
        (r'Vélocité accrue du cash et des titres', 'Increased velocity of cash and securities'),
        (r'Nouveaux Revenus', 'New Revenues'),
        (r'Accès à une base d\'investisseurs élargie 24/7', 'Access to a wider investor base 24/7'),
        (r'Réduction du Risque', 'Risk Reduction'),
        (r'Élimination des défauts de règlement et des pénalités', 'Elimination of settlement failures and penalties'),
    ]

    count = 0
    for pattern, replacement in replacements:
        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL | re.IGNORECASE)
        if new_content != content:
            content = new_content
            count += 1
            print(f"✅ Remplacé : {replacement[:30]}...")

    with open('index_en.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n🎉 Traduction Phase 3 terminée : {count} blocs corrigés.")

if __name__ == "__main__":
    main()
