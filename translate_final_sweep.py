#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de traduction FINAL (Phase 4 + Fixes) pour index_en.html
Couvre : Lifecycle details, Bond Issuance details, Regulation, Products, Resources, Footer
"""

import re

def main():
    print("🚀 Démarrage de la traduction FINALE (Sweep)...")
    content = ""
    try:
        with open('index_en.html', 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print("❌ index_en.html introuvable")
        return

    replacements = [
        # === FIXES SECTION 6 (LIFECYCLE) ===
        (r'Conception', 'Conception'),
        (r'Phase de design et planification', 'Design and planning phase'),
        (r'Définition des objectifs du projet', 'Definition of project objectives'),
        (r'Conception de la tokenomics \(offre, distribution, mécanismes\)', 'Tokenomics design (supply, distribution, mechanics)'),
        (r'Choix de la blockchain support', 'Choice of blockchain network'),
        (r'Rédaction du whitepaper', 'Drafting the whitepaper'),
        
        (r'Développement', 'Development'),
        (r'Création technique du token', 'Technical token creation'),
        (r'Développement du smart contract', 'Smart contract development'),
        (r'Audit de sécurité par des experts', 'Security audit by experts'),
        (r'Tests sur testnet', 'Tests on testnet'),
        (r'Vérification des mécanismes économiques', 'Verification of economic mechanics'),
        
        (r'Émission \(Minting\)', 'Issuance (Minting)'),
        (r'Création initiale des tokens', 'Initial token creation'),
        (r'Déploiement du smart contract sur la blockchain', 'Smart contract deployment on blockchain'),
        (r'Création de l\'offre totale de tokens', 'Creation of total token supply'),
        (r'Allocation aux différentes parties \(équipe, investisseurs, trésorerie\)', 'Allocation to parties (team, investors, treasury)'),
        (r'Mise en place des mécanismes de vesting', 'Setup of vesting mechanisms'),
        
        (r'Distribution', 'Distribution'),
        (r'Mise à disposition du public', 'Public availability'),
        (r'Vente publique initiale', 'Initial Public Offering'),
        (r'Distribution gratuite pour marketing', 'Free distribution for marketing'),
        (r'Récompenses pour fournisseurs de liquidité', 'Rewards for liquidity providers'),
        (r'Déblocage progressif pour l\'équipe', 'Progressive unlocking for the team'),
        
        (r'Circulation', 'Circulation'),
        (r'Utilisation active du token', 'Active token usage'),
        (r'Trading sur les exchanges \(CEX et DEX\)', 'Trading on exchanges (CEX and DEX)'),
        (r'Utilisation dans l\'Ecosystem \(paiements, staking, governance\)', 'Usage in Ecosystem (payments, staking, governance)'),
        (r'Transferts entre utilisateurs', 'Transfers between users'),
        (r'Intégration dans des protocoles DeFi', 'Integration into DeFi protocols'),
        
        (r'Gestion', 'Management'),
        (r'Maintenance et évolution', 'Maintenance and evolution'),
        (r'Votes de gouvernance pour modifications', 'Governance votes for modifications'),
        (r'Mises à jour du protocole', 'Protocol updates'),
        (r'Burn de tokens \(réduction de l\'offre\)', 'Token burning (supply reduction)'),
        (r'Ajustements des paramètres économiques', 'Economic parameter adjustments'),
        
        (r'Extinction', 'Extinction'),
        (r'Fin de vie du token', 'End of token life'),
        (r'Migration vers une nouvelle version', 'Migration to a new version'),
        (r'Fusion avec un autre projet', 'Merger with another project'),
        (r'Arrêt du projet \(échec ou objectif atteint\)', 'Project shutdown (failure or goal reached)'),
        (r'Rachat et destruction des tokens restants', 'Buyback and destruction of remaining tokens'),

        # === FIXES SECTION 7 (BOND ISSUANCE) ===
        (r'Use Case: Bond Issuance Tokenisée', 'Use Case: Tokenized Bond Issuance'),
        (r'Tokenization \+ Smart Contract \+ Émission Digitale', 'Tokenization + Smart Contract + Digital Issuance'),
        (r'Contexte Professionnel', 'Professional Context'),
        (r'Nous allons explorer un cas concret et crédible pour une institution bancaire : l\'émission d\'une\s+obligation tokenisée\. Ce scénario illustre comment la blockchain peut moderniser l\'infrastructure\s+financière traditionnelle tout en préservant le rôle central des institutions financières\.',
         'We will explore a concrete and credible case for a banking institution: the issuance of a tokenized bond. This scenario illustrates how blockchain can modernize traditional financial infrastructure while preserving the central role of financial institutions.'),
        
        (r'Réduire les coûts', 'Reduce Costs'),
        (r'Diminution significative des coûts d\'émission et de gestion', 'Significant reduction in issuance and management costs'),
        (r'Accélérer le settlement', 'Accelerate Settlement'),
        (r'Raccourcir les délais de règlement de plusieurs jours à quelques minutes', 'Shorten settlement times from days to minutes'),
        (r'Améliorer la traçabilité', 'Improve Traceability'),
        (r'Complete Traceability et transparente de toutes les transactions', 'Complete and transparent traceability of all transactions'),
        (r'Tester la blockchain', 'Test Blockchain'),
        (r'Valider l\'infrastructure blockchain en conditions réelles', 'Validate blockchain infrastructure in real conditions'),
        
        (r'HIER \(Papier\)', 'YESTERDAY (Paper)'),
        (r'Création manuelle, Signature physique, Dépôt CSD\.', 'Manual creation, Physical signature, CSD Deposit.'),
        (r'T\+5 Jours', 'T+5 Days'),
        (r'DEMAIN \(Token\)', 'TOMORROW (Token)'),
        (r'Smart Contract, Signature Cryptographique, Registre DLT\.', 'Smart Contract, Cryptographic Signature, DLT Registry.'),
        (r'T\+0 Instantané', 'T+0 Instant'),
        
        (r'Étape 1 : Smart Contract', 'Step 1: Smart Contract'),
        (r'Programmation des règles de l\'obligation', 'Programming bond rules'),
        (r'Conditions contractuelles :', 'Contractual conditions:'),
        (r'Montant, taux d\'intérêt, maturité, fréquence\s+des coupons', 'Amount, interest rate, maturity, coupon frequency'),
        (r'Règles de transfert :', 'Transfer rules:'),
        (r'Restrictions de transfert entre porteurs, KYC/AML\s+intégrés', 'Transfer restrictions between holders, embedded KYC/AML'),
        (r'Calcul automatique des coupons :', 'Automatic coupon calculation:'),
        (r'Paiement des intérêts programmé\s+automatiquement', 'Interest payment programmed automatically'),
        (r'Remboursement automatique :', 'Automatic redemption:'),
        (r'Remboursement du principal à maturité sans\s+intervention manuelle', 'Principal repayment at maturity without manual intervention'),
        
        (r'Étape 2 : Souscription', 'Step 2: Subscription'),
        (r'Processus d\'achat pour l\'investisseur', 'Purchase process for the investor'),
        (r'Canal digital sécurisé :', 'Secure digital channel:'),
        (r'Plateforme web ou mobile avec authentification\s+forte', 'Web or mobile platform with strong authentication'),
        (r'Paiement en monnaie fiat :', 'Fiat currency payment:'),
        (r'Virement bancaire traditionnel \(EUR, USD\)', 'Traditional bank transfer (EUR, USD)'),
        (r'Option paiement tokenisé :', 'Tokenized payment option:'),
        (r'Possibilité d\'utiliser des stablecoins \(USDC,\s+EURC\)', 'Possibility to use stablecoins (USDC, EURC)'),
        (r'Confirmation instantanée :', 'Instant confirmation:'),
        (r'Validation immédiate de la transaction', 'Immediate transaction validation'),
        
        (r'Étape 3 : Émission', 'Step 3: Issuance'),
        (r'Création et attribution des tokens', 'Token creation and allocation'),
        (r'Émission automatique :', 'Automatic issuance:'),
        (r'Le smart contract génère les tokens d\'obligation', 'The smart contract generates bond tokens'),
        (r'Attribution immédiate :', 'Immediate allocation:'),
        (r'Les tokens sont transférés au wallet de\s+l\'investisseur', 'Tokens are transferred to the investor\'s wallet'),
        (r'Enregistrement blockchain :', 'Blockchain recording:'),
        (r'La transaction est inscrite de manière immuable', 'The transaction is immutably recorded'),
        (r'Complete Traceability :', 'Complete Traceability:'),
        (r'Historique permanent de la propriété', 'Permanent ownership history'),
        
        (r'Étape 4 : Gestion Automatisée', 'Step 4: Automated Management'),
        (r'Vie de l\'obligation sur la blockchain', 'Bond lifecycle on the blockchain'),
        (r'Paiement automatique des coupons :', 'Automatic coupon payment:'),
        (r'Intérêts versés selon le calendrier\s+programmé', 'Interests paid according to programmed schedule'),
        (r'Transferts secondaires :', 'Secondary transfers:'),
        (r'Revente possible sur marché secondaire avec\s+traçabilité', 'Resale possible on secondary market with traceability'),
        (r'Reporting en temps réel :', 'Real-time reporting:'),
        (r'Suivi instantané de la position', 'Instant position tracking'),
        (r'Remboursement à maturité :', 'Redemption at maturity:'),
        (r'Restitution automatique du capital', 'Automatic capital restitution'),

        # === SECTION 7.7 (BENCHMARKS FIXES) ===
        (r'Les Industrial Benchmarks', 'Industrial Benchmarks'),
        (r'Cas Réels d\'Émissions Digitales', 'Real Digital Issuance Cases'),
        (r'Sécurité juridique maximale', 'Maximum legal certainty'),
        (r'Nominatif sur registre privé', 'Registered on private ledger'),
        (r'Approche conservatrice privilégiant la conformité réglementaire', 'Conservative approach prioritizing regulatory compliance'),
        (r'Première émission corporate avec règlement quasi-instantané', 'First corporate issuance with near-instant settlement'),
        (r'Interopérabilité multi-plateformes', 'Cross-platform interoperability'),
        (r'Démonstration de l\'interopérabilité blockchain', 'Demonstration of blockchain interoperability'),
        (r'Comparaison des Approches', 'Comparison of Approaches'),
        (r'Critère', 'Criteria'),
        (r'Privée', 'Private'),
        (r'Publique', 'Public'),
        (r'Hybride', 'Hybrid'),
        (r'Traditionnel', 'Traditional'),
        (r'Faible', 'Low'),
        (r'Moyen', 'Medium'),
        (r'Élevé', 'High'),

        # === SECTION 8 (REGULATION) ===
        (r'Panorama Réglementaire Global', 'Global Regulatory Landscape'),
        (r'Où peut-on émettre des Digital Bonds en 2026 \?', 'Where can Digital Bonds be issued in 2026?'),
        (r'ALLEMAGNE', 'GERMANY'),
        (r'MATURITÉ :', 'MATURITY:'),
        (r'Cadre :', 'Framework:'),
        (r'Loi eWpG', 'eWpG Law'),
        (r'Statut :', 'Status:'),
        (r'PRODUCTION', 'PRODUCTION'),
        (r'Suppression totale du certificat papier\. Registres crypto \(Krypto-register\)\s+pleinement reconnus\. Standard de marché\.', 
         'Total elimination of paper certificate. Crypto registers (Krypto-register) fully recognized. Market standard.'),
        
        (r'FRANCE', 'FRANCE'),
        (r'Ordonnance Blockchain \+ Régime Pilote UE\.', 'Blockchain Ordinance + EU Pilot Regime.'),
        (r'AVANCÉ', 'ADVANCED'),
        (r'Cadre très flexible pour le non-coté \(DEEP\) et expérimental pour le coté \(DLT\s+Pilot\)\. Forte innovation \(SG-Forge\)\.', 
         'Very flexible framework for unlisted (DEEP) and experimental for listed (DLT Pilot). Strong innovation (SG-Forge).'),
        
        (r'ROYAUME-UNI', 'UNITED KINGDOM'),
        (r'Digital Securities Sandbox \(DSS\)\.', 'Digital Securities Sandbox (DSS).'),
        (r'PILOTE', 'PILOT'),
        (r'Lancement de la Sandbox en 2024\. Objectif : émettre des "Digital Gilts" \(Dette\s+souveraine\) d\'ici fin 2026\.', 
         'Sandbox launch in 2024. Goal: issue "Digital Gilts" (Sovereign Debt) by end of 2026.'),
        
        (r'ÉTATS-UNIS', 'UNITED STATES'),
        (r'SEC Rules \(Pas de loi spécifique\)\.', 'SEC Rules (No specific law).'),
        (r'FRAGMENTÉ', 'FRAGMENTED'),
        (r'Pas de cadre fédéral unifié\. Les émissions se font via des exemptions \(Reg D/S\)\s+sur des blockchains privées \(Canton\)\.', 
         'No unified federal framework. Issuances done via exemptions (Reg D/S) on private blockchains (Canton).'),
        
        (r'L\'Europe \(Régime Pilote\) possède actuellement l\'avance réglementaire la plus nette au monde\.', 
         'Europe (Pilot Regime) currently has the clearest regulatory lead in the world.'),

        # === SECTION 7.8 (TRADER) ===
        (r'Le Trader Desk 2026', 'The Trader Desk 2026'),
        (r'Simulation : Exécutez un Atomic Swap en temps réel', 'Simulation: Execute a Real-Time Atomic Swap'),
        (r'CONNECTED TO SWIAT MAINNET', 'CONNECTED TO SWIAT MAINNET'),
        (r'Wallet:', 'Wallet:'),
        (r'Cash:', 'Cash:'),
        (r'ISIN: DE000SIE2026DIG', 'ISIN: DE000SIE2026DIG'),
        (r'BID SIZE', 'BID SIZE'),
        (r'BID', 'BID'),
        (r'ASK', 'ASK'),
        (r'ASK SIZE', 'ASK SIZE'),
        (r'YIELD', 'YIELD'),
        (r'COUPON', 'COUPON'),
        (r'SETTLEMENT', 'SETTLEMENT'),
        (r'NEW ORDER', 'NEW ORDER'),
        (r'SIDE', 'SIDE'),
        (r'BUY', 'BUY'),
        (r'SELL', 'SELL'),
        (r'NOMINAL \(€\)', 'NOMINAL (€)'),
        (r'LIMIT PRICE \(%\)', 'LIMIT PRICE (%)'),
        (r'EST\. TOTAL:', 'EST. TOTAL:'),
        (r'EXECUTE \(ATOMIC\)', 'EXECUTE (ATOMIC)'),
        (r'EXÉCUTION EN COURS\.\.\.', 'EXECUTION IN PROGRESS...'),
        (r'Verrouillage Smart Contract', 'Smart Contract Locking'),
        (r'Trigger Bundesbank \(Cash\)', 'Bundesbank Trigger (Cash)'),
        (r'Livraison des Titres', 'Security Delivery'),
        (r'TRADE CONFIRMÉ', 'TRADE CONFIRMED'),
        (r'Settlement ID:', 'Settlement ID:'),
        (r'Fermer', 'Close'),

        # === SECTION 7.5 (COVERED BOND) ===
        (r'Focus Produit : Le Covered Bond Digital', 'Product Focus: Digital Covered Bond'),
        (r'La Rencontre de la Sécurité \(AAA\) et de la Tech \(DLT\)', 'The Meeting of Security (AAA) and Tech (DLT)'),
        (r'Le Principe "Double Recours"', 'The "Double Recourse" Principle'),
        (r'Un Covered Bond \(ou Obligation Sécurisée\) est la dette la plus sûre car l\'investisseur a deux\s+garanties :', 
         'A Covered Bond is the safest debt because the investor has two guarantees:'),
        (r'1\. L\'Émetteur :', '1. The Issuer:'),
        (r'La solvabilité de la banque\.', 'The bank\'s solvency.'),
        (r'2\. Le Cover Pool :', '2. The Cover Pool:'),
        (r'Un panier d\'actifs isolés \(prêts immobiliers\) qui garantit\s+le remboursement en cas de faillite\.', 
         'A basket of isolated assets (mortgage loans) guaranteeing repayment in case of bankruptcy.'),
        (r'Innovation Blockchain :', 'Blockchain Innovation:'),
        (r'Le lien juridique entre le Token et le Panier d\'actifs\s+est inscrit dans le Smart Contract\.', 
         'The legal link between the Token and the Asset Pool is embedded in the Smart Contract.'),
        (r'L\'Anatomie d\'une Émission Type', 'Anatomy of a Typical Issuance'),
        (r'Ségrégation des Actifs', 'Asset Segregation'),
        (r'La banque isole 1 Md€ de prêts immo dans un registre\.', 'The bank isolates €1bn of mortgage loans in a register.'),
        (r'Tokenisation du Pool', 'Pool Tokenization'),
        (r'Un Smart Contract représente la valeur du panier\.', 'A Smart Contract represents the pool\'s value.'),
        (r'Émission du Bond', 'Bond Issuance'),
        (r'Le Token Covered Bond est adossé techniquement au Token Pool\.', 'The Covered Bond Token is technically backed by the Pool Token.'),
        (r'Investisseurs', 'Investors'),
        (r'Achat des Tokens Bonds\. Garantie automatique par code\.', 'Bond Tokens purchase. Automatic code-based guarantee.'),

        # === REMAINING SECTIONS (11, 12, 13, etc) ===
        (r'ESG & Smart Data', 'ESG & Smart Data'),
        (r'La transparence au service de la durabilité', 'Transparency serving sustainability'),
        (r'Compliance & Régulation', 'Compliance & Regulation'),
        (r'La conformité by design', 'Compliance by Design'),
        (r'Business Case & ROI', 'Business Case & ROI'),
        (r'La rentabilité du modèle', 'Model Profitability'),
        (r'Outlook 2026', 'Outlook 2026'),
        (r'Avantages', 'Benefits'),
        (r'Applications', 'Use Cases'),
        (r'Écosystème', 'Ecosystem'),
        (r'Glossaire', 'Glossary'),
        (r'Risques', 'Risks'),
        (r'IT & Intégration', 'IT & Integration'),
        (r'Sources Data Room', 'Sources Data Room'),
        (r'Documentation & Références', 'Documentation & References'),

        # === FOOTER & MENU FIXES ===
        (r'Version Expert - 23 sections', 'Expert Version - 23 sections'),
        (r'Version Découverte - 5 slides', 'Discovery Version - 5 slides'),
        (r'Version Pitch - 6 sections', 'Pitch Version - 6 sections'),
        (r'Testez vos connaissances - 20 questions', 'Test your knowledge - 20 questions'),
        (r'Tous droits réservés\.', 'All rights reserved.'),
        (r'Ce document est une présentation stratégique', 'This document is a strategic presentation'),
    ]

    count = 0
    content_modified = content
    for pattern, replacement in replacements:
        new_content = re.sub(pattern, replacement, content_modified, flags=re.DOTALL | re.IGNORECASE)
        if new_content != content_modified:
            content_modified = new_content
            count += 1
            # print(f"✅ Remplacé : {replacement[:30]}...") 
    
    with open('index_en.html', 'w', encoding='utf-8') as f:
        f.write(content_modified)
    
    print(f"\n🎉 Traduction FINALE terminée : {count} blocs corrigés.")

if __name__ == "__main__":
    main()
