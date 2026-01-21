#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FINAL COMPREHENSIVE TRANSLATION - Navigation, Hero, Timeline, Key Sections
Applies user-provided professional translations for all remaining sections
"""

import re

def main():
    print("🚀 Starting FINAL COMPREHENSIVE TRANSLATION...")
    
    try:
        with open('index_en.html', 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Error: {e}")
        return

    # Comprehensive replacements for all sections
    replacements = [
        # === NAVIGATION ===
        (r'<a href="#hero">Accueil</a>', '<a href="#hero">Home</a>'),
        (r'<button class="dropbtn">Fondamentaux</button>', '<button class="dropbtn">Fundamentals</button>'),
        (r'<a href="#blockchain">Démystification</a>', '<a href="#blockchain">Demystification</a>'),
        (r'<a href="#tokens">Types de Tokens</a>', '<a href="#tokens">Token Types</a>'),
        (r'<a href="#tokenisation">Tokenisation</a>', '<a href="#tokenisation">Tokenization</a>'),
        (r'<a href="#cycle">Cycle de Vie</a>', '<a href="#cycle">Lifecycle</a>'),
        (r'<button class="dropbtn">Cas d\'Usage</button>', '<button class="dropbtn">Use Cases</button>'),
        (r'<a href="#obligation">Émission Obligataire</a>', '<a href="#obligation">Bond Issuance</a>'),
        (r'<a href="#benchmarks">Benchmarks Marché</a>', '<a href="#benchmarks">Market Benchmarks</a>'),
        (r'<a href="#trader">Bureau du Trader</a>', '<a href="#trader">Trading Desk</a>'),
        (r'<button class="dropbtn">Produits</button>', '<button class="dropbtn">Products</button>'),
        (r'<a href="#covered-bond">Covered Bonds</a>', '<a href="#covered-bond">Covered Bonds</a>'),
        (r'<a href="#esg-data">ESG & Données</a>', '<a href="#esg-data">ESG & Data</a>'),
        (r'<a href="#compliance">Conformité & AML</a>', '<a href="#compliance">Compliance & AML</a>'),
        (r'<a href="#roi">Business Case & ROI</a>', '<a href="#roi">Business Case & ROI</a>'),
        (r'<button class="dropbtn">Ressources</button>', '<button class="dropbtn">Resources</button>'),
        (r'<a href="#ecosysteme">Écosystème</a>', '<a href="#ecosysteme">Ecosystem</a>'),
        (r'<a href="#risks">Gestion des Risques</a>', '<a href="#risks">Risk Management</a>'),
        (r'<a href="#it-arch">IT & Intégration</a>', '<a href="#it-arch">IT & Integration</a>'),
        
        # === HERO SECTION ===
        (r'Un voyage au cœur de la révolution financière numérique', 
         'A journey into the heart of the digital financial revolution'),
        (r'Comprendre la Blockchain & les Cryptomonnaies',
         'Understanding Blockchain & Cryptocurrencies'),
        (r'Guide professionnel complet pour maîtriser la blockchain.*?Progression pédagogique adaptée aux débutants',
         'Complete professional guide to mastering blockchain, from theory to concrete trading floor Use Cases. Educational progression adapted for beginners'),
        (r'Commencer l\'Exploration', 'Start Exploration'),
        
        # === TIMELINE SECTION ===
        (r'Le Chemin vers l\'Industrialisation', 'The Path to Industrialization'),
        (r'Une Décennie d\'Innovation \(2017 - 2026\)', 'A Decade of Innovation (2017 - 2026)'),
        (r'Expérimentation', 'Experimentation'),
        (r'Première Mondiale', 'World Premiere'),
        (r'Le Cadre Légal', 'The Legal Framework'),
        (r'Adoption Corporate', 'Corporate Adoption'),
        (r'L\'Ère Secondaire', 'The Secondary Era'),
        (r'Ce n\'est pas une bulle, c\'est une tendance de fond',
         'This is not a bubble, it is a fundamental trend'),
        (r'9 ans d\'évolution continue.*?fondations juridiques, techniques et commerciales',
         '9 years of continuous evolution, from R&D to industrialization. Each step consolidated the legal, technical, and commercial foundations'),
        
        # === DEMYSTIFICATION MODULE ===
        (r'Module 0 : Démystifier le "Crypto"', 'Module 0: Demystifying "Crypto"'),
        (r'Traduire la Tech en Langage Bancaire', 'Translating Tech into Banking Language'),
        (r'Qu\'est-ce que la Blockchain \?', 'What is Blockchain?'),
        (r'Ce n\'est rien d\'autre qu\'un <strong>Registre Distribué</strong>',
         'It is nothing more than a <strong>Distributed Ledger</strong>'),
        (r'L\'Analogie :</strong> Aujourd\'hui.*?mon Excel avec le vôtre',
         'The Analogy:</strong> Today, every bank has its own Excel file. To make a transfer, we must reconcile my Excel with yours'),
        (r'La Disruption :</strong> Avec la Blockchain.*?Plus besoin de réconciliation',
         'The Disruption:</strong> With Blockchain, we all share <strong>the same Excel file</strong> (Google Sheet) in real-time. No more reconciliation needed'),
        (r'Qu\'est-ce qu\'un Wallet \?', 'What is a Wallet?'),
        (r'C\'est votre <strong>Compte Bancaire \+ Votre Signature</strong>',
         'It is your <strong>Bank Account + Your Signature</strong>'),
        (r'Adresse Publique = IBAN', 'Public Address = IBAN'),
        (r'Vous pouvez la donner à n\'importe qui pour recevoir des fonds',
         'You can give it to anyone to receive funds'),
        (r'Clé Privée = Signature Numérique',
         'Private Key = Digital Signature'),
        (r'C\'est le code secret unique pour valider un virement.*?Custodians comme Fireblocks\)',
         'It is the unique secret code to validate a transfer. If you lose it, you lose access (hence the importance of Custodians like Fireblocks)'),
        (r'Confusion à éviter absolument :', 'Confusion to absolutely avoid:'),
        (r'Ne pas confondre \*\*Cryptomonnaies\*\*.*?plus efficacement',
         'Do not confuse **Cryptocurrencies** (Bitcoin, Ether) which are volatile speculative assets, with **Digital Assets** (Security Tokens) which are infrastructures to exchange banking assets (Bonds, Cash) more efficiently'),
        (r'Cryptomonnaies', 'Cryptocurrencies'),
        (r'Actifs Numériques', 'Digital Assets'),
        (r'Bitcoin, Ethereum = Spéculatif', 'Bitcoin, Ethereum = Speculative'),
        (r'Obligations, Cash = Infrastructure', 'Bonds, Cash = Infrastructure'),
        
        # === TRADER DESK ===
        (r'Le Bureau du Trader', 'The Trader\'s Desk'),
        (r'Qu\'est-ce qui change pour le Front Office \?', 'What changes for the Front Office?'),
        (r'TERMINAL DCM DIGITAL', 'DCM DIGITAL TERMINAL'),
        (r'MARCHÉ EN DIRECT', 'MARKET LIVE'),
        (r'ACTIF :', 'ASSET:'),
        (r'SENS :', 'SIDE:'),
        (r'ACHAT', 'BUY'),
        (r'VENTE', 'SELL'),
        (r'NOMINAL \(€\) :', 'NOMINAL (€):'),
        (r'PRIX LIMITE \(%\) :', 'LIMIT PRICE (%):'),
        (r'TOTAL EST\. :', 'EST. TOTAL:'),
        (r'EXÉCUTER \(ATOMIC\)', 'EXECUTE (ATOMIC)'),
        (r'EXÉCUTION EN COURS\.\.\.', 'EXECUTION IN PROGRESS...'),
        (r'Verrouillage Smart Contract', 'Smart Contract Locking'),
        (r'Trigger Bundesbank \(Cash\)', 'Bundesbank Trigger (Cash)'),
        (r'Livraison Titres', 'Securities Delivery'),
        (r'TRADE CONFIRMÉ', 'TRADE CONFIRMED'),
        
        # === COVERED BONDS ===
        (r'Focus Produit : Digital Covered Bond', 'Product Focus: Digital Covered Bond'),
        (r'Rencontre de la Sécurité \(AAA\) et de la Tech \(DLT\)',
         'Meeting of Safety (AAA) and Tech (DLT)'),
        (r'Le Principe du "Double Recours"', 'The "Double Recourse" Principle'),
        (r'Un Covered Bond est la dette la plus sûre car l\'investisseur a deux garanties',
         'A Covered Bond is the safest debt because the investor has two guarantees'),
        (r'L\'Émetteur :</strong> La solvabilité de la banque',
         'The Issuer:</strong> The bank\'s solvency'),
        (r'Le Cover Pool :</strong> Un panier d\'actifs ségrégués.*?en cas de faillite',
         'The Cover Pool:</strong> A segregated basket of assets (mortgages) guaranteeing repayment in case of bankruptcy'),
        (r'Innovation Blockchain :</strong> Le lien juridique.*?directement dans le Smart Contract',
         'Blockchain Innovation:</strong> The legal link between the Token and the Asset Pool is inscribed directly in the Smart Contract'),
        (r'Ségrégation des Actifs', 'Asset Segregation'),
        (r'La banque isole 1 Md€ d\'hypothèques dans un registre',
         'The bank isolates €1bn of mortgages in a registry'),
        (r'Création du "Jumeau Numérique" sur la Blockchain',
         'Creation of the "Digital Twin" on the Blockchain'),
        (r'Investisseur \(AAA\)', 'Investor (AAA)'),
        (r'Détient le token = Détient la créance sécurisée',
         'Holds the token = Holds the secured claim'),
        
        # === FOOTER ===
        (r'Expert Actifs Numériques & Blockchain', 'Expert Digital Assets & Blockchain'),
        (r'SE CONNECTER SUR LINKEDIN', 'CONNECT ON LINKEDIN'),
        (r'Retour en haut', 'Back to top'),
        (r'Assistant IA Blockchain', 'AI Blockchain Assistant'),
        (r'Bonjour ! Je suis votre assistant IA\. Posez-moi une question sur les Digital Bonds, le Settlement ou la Réglementation',
         'Hello! I am your AI assistant. Ask me a question about Digital Bonds, Settlement, or Regulations'),
    ]

    count = 0
    new_content = content
    
    for pattern, replacement in replacements:
        temp = re.sub(pattern, replacement, new_content, flags=re.DOTALL | re.IGNORECASE)
        if temp != new_content:
            new_content = temp
            count += 1
            print(f"✅ Applied: {replacement[:60]}...")
    
    # Write back
    with open('index_en.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"\n🎉 FINAL COMPREHENSIVE TRANSLATION Complete: {count} replacements applied")

if __name__ == "__main__":
    main()
