#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de traduction MASSIVE pour index_en.html (Blockchain Pro)
"""

import re

def main():
    print("🚀 Démarrage de la traduction de index_en.html...")
    with open('index_en.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # ====== 1. NAVIGATION & HEADERS ======
    replacements = [
        # Titre Page
        (r'DCM Digital - Portail Stratégique 2026', 'DCM Digital - Strategic Portal 2026'),
        (r'Guide complet et professionnel sur la blockchain', 'Complete professional guide on blockchain'),
        
        # Menu Navigation
        (r'Version Expert - 23 sections', 'Expert Version - 23 sections'),
        (r'Version Découverte - 5 slides', 'Discovery Version - 5 slides'),
        (r'Version Pitch - 6 sections', 'Pitch Version - 6 sections'),
        (r'Testez vos connaissances - 20 questions', 'Test your knowledge - 20 questions'),
        (r'Accueil', 'Home'),
        (r'Fondamentaux <i', 'Fundamentals <i'),
        (r'Démystification', 'Demystification'),
        (r'Types de Tokens', 'Token Types'),
        (r'Tokenisation', 'Tokenization'),
        (r'Cycle de Vie', 'Lifecycle'),
        (r'Cas Pratiques <i', 'Use Cases <i'),
        (r'Émission Obligation', 'Bond Issuance'),
        (r'Benchmarks Industriels', 'Industrial Benchmarks'),
        (r'Bureau du Trader', 'Trader Desk'),
        (r'Produits <i', 'Products <i'),
        (r'Ressources <i', 'Resources <i'),
        (r'Écosystème', 'Ecosystem'),
        (r'Glossaire', 'Glossary'),
        (r'Risques', 'Risks'),
        (r'IT & Intégration', 'IT & Integration'),
        (r'Applications', 'Applications'),
        (r'Outlook 2026', 'Outlook 2026'),
        (r'Avantages', 'Benefits'),
        
        # HERO SECTION
        (r'Un voyage au cœur de la révolution financière numérique', 
         'A journey into the heart of the digital financial revolution'),
        (r'Comprendre la Blockchain et les Cryptomonnaies', 
         'Understanding Blockchain & Cryptocurrencies'),
        (r'Guide professionnel complet pour maîtriser la blockchain, de la théorie aux applications\s+concrètes en salle de marché\. Une progression pédagogique adaptée aux débutants\.',
         'Complete professional guide to mastering blockchain, from theory to concrete trading floor applications. Educational progression adapted for beginners.'),
        (r'Commencer l\'exploration', 'Start Exploration'),
        
        # HISTORY SECTION
        (r'La Marche vers l\'Industrialisation', 'The Path to Industrialization'),
        (r'Une décennie d\'innovation \(2017 - 2026\)', 'A Decade of Innovation (2017 - 2026)'),
        (r'L\'Expérimentation', 'Experimentation'),
        (r'Premiers prototypes \(Sandbox\)\. La Banque\s+de France lance le projet MADRE\.', 
         'First prototypes (Sandbox). Bank of France launches Project MADRE.'),
        (r'La 1ère\s+Mondiale', 'World First'),
        (r'Société Générale émet 100M€ d\'OFH sur\s+Ethereum Public\. Preuve de concept juridique\.', 
         'Societe Generale issues €100m Covered Bond on Public Ethereum. Legal proof of concept.'),
        (r'Le Cadre\s+Légal', 'The Legal Framework'),
        (r'L\'Allemagne vote la loi\s+<strong>eWpG</strong>\. Le "Crypto-Titre" devient légal\. Fin du papier obligatoire\.', 
         'Germany passes the <strong>eWpG</strong> law. "Crypto-Securities" become legal. End of mandatory paper.'),
        (r'L\'Adoption\s+Corporate', 'Corporate Adoption'),
        (r'Siemens émet 300M€ avec règlement\s+Trigger\. Le marché sort du laboratoire bancaire\.', 
         'Siemens issues €300m with Trigger settlement. Market exits the banking lab.'),
        (r'L\'Ère\s+Secondaire', 'The Secondary Era'),
        (r'Standardisation du Trigger BCE et\s+liquidité via les Market Makers \(KfW\)\. Le marché devient liquide\.', 
         'ECB Trigger standardization & liquidity via Market Makers (KfW). The market becomes liquid.'),
        (r'Ce n\'est pas une bulle, c\'est une tendance de fond', 'It is not a bubble, it is a fundamental trend'),
        (r'9 ans d\'évolution\s+continue, de la R&D à l\'industrialisation\. Chaque étape a consolidé les fondations juridiques,\s+techniques et commerciales\.', 
         '9 years of continuous evolution, from R&D to industrialization. Each step consolidated legal, technical, and commercial foundations.'),

        # MODULE 0: DÉMYSTIFICATION
        (r'Module 0 : Démystifier la "Crypto"', 'Module 0: Demystifying "Crypto"'),
        (r'Traduire la Tech en langage Bancaire', 'Translating Tech into Banking Language'),
        (r'1\. C\'est quoi la Blockchain \?', '1. What is Blockchain?'),
        (r'Ce n\'est rien d\'autre qu\'un <strong>Grand Livre Comptable\s+\(Ledger\)</strong>\.', 
         'It is nothing more than a <strong>Ledger</strong>.'),
        (r'L\'Analogie :', 'Analogy:'),
        (r'Aujourd\'hui, chaque banque a son propre fichier Excel\. Pour faire un virement, on doit\s+réconcilier mon Excel avec le vôtre\.', 
         'Today, every bank has its own Excel file. To make a transfer, we must reconcile my Excel with yours.'),
        (r'La Rupture :', 'The Disruption:'),
        (r'Avec la Blockchain, nous partageons tous <strong>le même fichier Excel</strong> \(Google\s+Sheet\) en temps réel\. Plus besoin de réconciliation\.', 
         'With Blockchain, we all share <strong>the same Excel file</strong> (Google Sheet) in real-time. No more reconciliation needed.'),
        
        (r'2\. C\'est quoi un Wallet \?', '2. What is a Wallet?'),
        (r'C\'est votre <strong>Compte Bancaire \+ Votre Signature</strong>\.', 
         'It is your <strong>Bank Account + Your Signature</strong>.'),
        (r'Adresse Publique = IBAN :', 'Public Address = IBAN:'),
        (r'Vous pouvez la donner à tout le monde pour recevoir des fonds\.', 
         'You can give it to anyone to receive funds.'),
        (r'Clé Privée = Signature Électronique :', 'Private Key = Electronic Signature:'),
        (r'C\'est le code secret unique qui permet de valider un virement\. Si vous la perdez, vous\s+perdez l\'accès \(d\'où l\'importance des Custodians comme Fireblocks\)\.', 
         'It is the unique secret code to validate a transfer. If you lose it, you lose access (hence the importance of Custodians like Fireblocks).'),

        (r'La confusion à éviter absolument :', 'Confusion to absolutely avoid:'),
        (r'Il ne faut pas confondre les <strong class="crypto-term">Crypto-monnaies</strong> \(Bitcoin, Ether\)\s+qui sont des actifs spéculatifs volatils, avec les <strong class="digital-term">Digital\s+Assets</strong>\s+\(Security Tokens\) qui sont des infrastructures pour échanger des actifs bancaires \(Obligations,\s+Cash\)\s+de manière plus efficace\.', 
         'Do not confuse <strong class="crypto-term">Cryptocurrencies</strong> (Bitcoin, Ether) which are volatile speculative assets, with <strong class="digital-term">Digital Assets</strong> (Security Tokens) which are infrastructures to exchange banking assets (Bonds, Cash) more efficiently.'),
        (r'Bitcoin, Ethereum = Spéculatif', 'Bitcoin, Ethereum = Speculative'),
        (r'Obligations, Cash = Infrastructure', 'Bonds, Cash = Infrastructure'),

        # SECTION 1: BLOCKCHAIN FUNDAMENTALS
        (r'Qu\'est-ce que la Blockchain \?', 'What is Blockchain?'),
        (r'Les fondamentaux de la technologie qui révolutionne la finance', 'Fundamentals of the technology revolutionizing finance'),
        (r'Une technologie de registre distribué', 'A Distributed Ledger Technology'),
        (r'La blockchain est une base de données distribuée qui enregistre les transactions de manière sécurisée,\s+transparente et immuable\. Chaque bloc contient un ensemble de transactions validées et est lié\s+cryptographiquement au bloc précédent, formant ainsi une chaîne inaltérable\.', 
         'Blockchain is a distributed database recording transactions securely, transparently, and immutably. Each block contains a set of validated transactions and is cryptographically linked to the previous block, forming an unalterable chain.'),
        
        (r'Réseau décentralisé mondial', 'Global Decentralized Network'),
        (r'Absence de contrôle central - le pouvoir est distribué entre tous les\s+participants du réseau', 
         'No central control - power is distributed among all network participants'),
        (r'Sécurité cryptographique', 'Cryptographic Security'),
        (r'Protection avancée des données par des algorithmes mathématiques complexes\s+impossibles à falsifier', 
         'Advanced data protection via complex mathematical algorithms impossible to forge'),
        (r'Transactions peer-to-peer', 'Peer-to-Peer Transactions'),
        (r'Échanges directs entre utilisateurs sans intermédiaire bancaire traditionnel', 
         'Direct exchanges between users without traditional banking intermediaries'),
        (r'Transparence totale', 'Total Transparency'),
        (r'Tous les participants peuvent vérifier l\'historique complet des transactions', 
         'All participants can verify the full transaction history'),
        (r'Immutabilité', 'Immutability'),
        (r'Une fois enregistrées, les transactions ne peuvent être modifiées ou\s+supprimées', 
         'Once recorded, transactions cannot be modified or deleted'),
        (r'Traçabilité complète', 'Complete Traceability'),
        (r'Historique permanent et consultable de tous les mouvements d\'actifs', 
         'Permanent and searchable history of all asset movements'),

        # SECTION 2: CRYPTOCURRENCIES
        (r'Les Cryptomonnaies', 'Cryptocurrencies'),
        (r'L\'argent numérique du futur', 'Digital Money of the Future'),
        (r'Les cryptomonnaies sont des actifs numériques qui utilisent la cryptographie pour sécuriser les\s+transactions et contrôler la création de nouvelles unités\. Elles fonctionnent sur des réseaux blockchain\s+décentralisés\.', 
         'Cryptocurrencies are digital assets using cryptography to secure transactions and control the creation of new units. They operate on decentralized blockchain networks.'),
        (r'Moyen de Paiement', 'Means of Payment'),
        (r'Alternative aux monnaies traditionnelles pour effectuer des transactions rapides et sécurisées à\s+l\'échelle mondiale, sans frontières ni intermédiaires\.', 
         'Alternative to traditional currencies for fast, secure global transactions, without borders or intermediaries.'),
        (r'Réserve de Valeur', 'Store of Value'),
        (r'Actif numérique pouvant servir de protection contre l\'inflation et de diversification de patrimoine,\s+similaire à l\'or numérique\.', 
         'Digital asset acting as an inflation hedge and wealth diversification, similar to digital gold.'),
        (r'Infrastructure Financière', 'Financial Infrastructure'),
        (r'Support pour applications financières décentralisées \(DeFi\) offrant prêts, épargne, investissements\s+et services bancaires sans banque\.', 
         'Foundation for Decentralized Finance (DeFi) applications offering loans, savings, investments, and banking services without banks.'),
        (r'Autonomie Financière', 'Financial Autonomy'),
        (r'Contrôle total sur vos actifs sans dépendre d\'institutions bancaires traditionnelles\. Vous êtes votre\s+propre banque\.', 
         'Total control over your assets without relying on traditional banking institutions. You are your own bank.'),
        (r'INFRASTRUCTURE DISTRIBUÉE SÉCURISÉE', 'SECURE DISTRIBUTED INFRASTRUCTURE'),
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
    
    print(f"\n🎉 Traduction Phase 1 terminée : {count} blocs corrigés.")

if __name__ == "__main__":
    main()
