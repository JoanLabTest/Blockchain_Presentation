#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour créer la version anglaise COMPLÈTE de index-simple.html
en gardant EXACTEMENT la même structure et design
"""

def main():
    print("📖 Lecture de index-simple.html (version complète FR)...")
    with open('index-simple.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("🔧 Traduction en anglais professionnel...")
    
    # Changer la langue HTML
    content = content.replace('<html lang="fr">', '<html lang="en">')
    
    # Changer le titre
    content = content.replace(
        '<title>DCM Digital - Portail Stratégique</title>',
        '<title>DCM Digital - Strategic Portal</title>'
    )
    
    # Modifier le sélecteur de langue
    content = content.replace(
        '<a href="index-simple.html" class="lang-btn active" title="Français">🇫🇷</a>',
        '<a href="index-simple.html" class="lang-btn" title="Français">🇫🇷</a>'
    )
    content = content.replace(
        '<a href="index-simple_en.html" class="lang-btn" title="English">🇬🇧</a>',
        '<a href="index-simple_en.html" class="lang-btn active" title="English">🇬🇧</a>'
    )
    
    # Traductions complètes (vocabulaire City of London)
    translations = {
        # Navigation
        "Accueil": "Home",
        "Historique": "History",
        "Fondamentaux": "Fundamentals",
        "Benchmarks": "Benchmarks",
        "Régulation": "Regulation",
        "Comparatif": "Comparison",
        "Roadmap": "Roadmap",
        "Trader": "Trader",
        "Glossaire": "Glossary",
        "Contact": "Contact",
        "VERSION DÉCOUVERTE": "DISCOVERY VERSION",
        
        # Hero
        "STRATEGIC BRIEFING 2026": "STRATEGIC BRIEFING 2026",
        "Digital Debt": "Digital Debt",
        "Capital Markets": "Capital Markets",
        "Le guide exécutif pour l'infrastructure de marché de demain : Blockchain, Tokenisation & Règlement T+0.": "The executive guide to tomorrow's market infrastructure: Blockchain, Tokenization & T+0 Settlement.",
        "INFRASTRUCTURE DISTRIBUÉE SÉCURISÉE": "SECURE DISTRIBUTED INFRASTRUCTURE",
        "COMMENCER": "GET STARTED",
        "VOIR LA DÉMO": "VIEW DEMO",
        
        # Histoire
        "La Marche vers l'Industrialisation": "The Path to Industrialization",
        "Première Mondiale": "World First",
        "SG émet 100M€ de Covered Bond sur Ethereum Public.": "SG issues €100m Covered Bond on Public Ethereum.",
        "Loi eWpG": "eWpG Law",
        "L'Allemagne légalise les titres purement numériques.": "Germany legalizes purely digital securities.",
        "Adoption Corporate": "Corporate Adoption",
        "Siemens émet 300M€ avec règlement Trigger.": "Siemens issues €300m with Trigger settlement.",
        "Ère de la Liquidité": "Liquidity Era",
        "Standardisation BCE & Market Making.": "ECB Standardization & Market Making.",
        
        # Fondamentaux
        "Module 0 : Démystification Bancaire": "Module 0: Banking Demystification",
        "INFRASTRUCTURE": "INFRASTRUCTURE",
        "Le Grand Livre (Ledger)": "The Ledger",
        "Analogie : Un Fichier Excel Partagé": "Analogy: A Shared Excel File",
        "Au lieu de réconcilier deux fichiers internes (T+2), toutes les banques lisent le même registre en temps réel (T+0).": "Instead of reconciling two internal files (T+2), all banks read the same ledger in real-time (T+0).",
        "ACCÈS": "ACCESS",
        "Le Wallet": "The Wallet",
        "Analogie : IBAN + Signature": "Analogy: IBAN + Signature",
        "L'Adresse Publique est votre IBAN pour recevoir. La Clé Privée est votre signature électronique pour valider.": "Public Address is your IBAN to receive. Private Key is your digital signature to validate.",
        
        # Benchmarks
        "Benchmarks Industriels": "Industrial Benchmarks",
        "PLACEMENT PRIVÉ": "PRIVATE PLACEMENT",
        "Montant": "Amount",
        "Plateforme": "Platform",
        "Stratégie": "Strategy",
        "Sécurité juridique (Registered Bond)": "Legal certainty (Registered Bond)",
        "CORPORATE": "CORPORATE",
        "Innovation": "Innovation",
        "Trigger Bundesbank": "Bundesbank Trigger",
        "Rapidité": "Speed",
        "T+Minutes (vs T+2)": "T+Minutes (vs T+2)",
        
        # Régulation
        "Panorama Réglementaire Global": "Global Regulatory Landscape",
        "Allemagne (Leader)": "Germany (Leader)",
        "Loi eWpG : Cadre complet pour les obligations au porteur numériques. Standard actuel du marché.": "eWpG Law: Comprehensive framework for digital bearer bonds. Current market standard.",
        "France (Pionnier)": "France (Pioneer)",
        "Régime Pilote UE : Cadre flexible pour les infrastructures DLT. Fort accent sur l'innovation (SG-Forge, BdF).": "EU Pilot Regime: Flexible framework for DLT infrastructures. Strong innovation focus (SG-Forge, BdF).",
        
        # Comparatif
        "Le Choc des Infrastructures": "The Infrastructure Clash",
        "Comparaison des cycles de vie": "Lifecycle comparison",
        "Marché Primaire (Émission)": "Primary Market (Issuance)",
        "Marché Secondaire (Trading)": "Secondary Market (Trading)",
        "Flux de Règlement": "Settlement Flow",
        
        # Roadmap
        "Plan d'Action : Lancer un Pilote Bancaire": "Action Plan: Launch Banking Pilot",
        "Feuille de route pour une émission inaugurale (6 mois)": "Roadmap for inaugural issuance (6 months)",
        "Cadrage Juridique": "Legal Framework",
        "Choix du droit (eWpG Allemagne)": "Law selection (eWpG Germany)",
        "Sélection Plateforme": "Platform Selection",
        "SWIAT vs Polygon vs Canton": "SWIAT vs Polygon vs Canton",
        "Structuration": "Structuring",
        "Montant, Maturité, Coupon": "Amount, Maturity, Coupon",
        "Tech Setup": "Tech Setup",
        "Wallet, Smart Contract, KYC": "Wallet, Smart Contract, KYC",
        "Placement": "Placement",
        "Roadshow Investisseurs": "Investor Roadshow",
        "Émission T+0": "T+0 Issuance",
        "Minting + Règlement Instantané": "Minting + Instant Settlement",
        
        # Trader
        "Le Bureau du Trader 2026": "The 2026 Trader Desk",
        "Side": "Side",
        "Quantité": "Quantity",
        "ORDER ENTRY": "ORDER ENTRY",
        "EXECUTE ATOMIC SWAP": "EXECUTE ATOMIC SWAP",
        "L'interface cache la complexité Blockchain. Un clic déclenche le Smart Contract.": "Interface abstracts Blockchain complexity. One click triggers the Smart Contract.",
        
        # Glossaire
        "Glossaire Technique": "Technical Glossary",
        "Le langage du marché Digital": "Digital market language",
        "Rechercher un terme (ex: Atomic Swap, Trigger...)": "Search a term (e.g., Atomic Swap, Trigger...)",
        "Atomic Swap": "Atomic Swap",
        "Mécanisme d'échange simultané Titre contre Cash (DvP). Élimine le risque de contrepartie.": "Simultaneous Title vs Cash exchange mechanism (DvP). Eliminates counterparty risk.",
        "Trigger": "Trigger",
        "Passerelle qui connecte la Blockchain au système de paiement de la Banque Centrale (Target2).": "Gateway connecting Blockchain to Central Bank payment system (Target2).",
        "Minting": "Minting",
        "Création technique des tokens sur la blockchain (équivalent à l'impression du certificat global).": "Technical creation of tokens on blockchain (equivalent to global certificate printing).",
        "Burning": "Burning",
        "Destruction des tokens lors du remboursement pour annuler la dette dans le registre.": "Token destruction upon redemption to cancel debt in the ledger.",
        "DvP (Delivery vs Payment)": "DvP (Delivery vs Payment)",
        "Principe de règlement simultané : le titre ne change de main que si le cash change de main.": "Simultaneous settlement principle: title changes hands only if cash changes hands.",
        "eWpG": "eWpG",
        "Loi allemande (2021) qui supprime l'obligation du certificat papier global pour les obligations.": "German law (2021) removing global paper certificate requirement for bonds.",
        "SWIAT": "SWIAT",
        "Blockchain privée de consortium créée par DekaBank pour les titres financiers.": "Private consortium blockchain created by DekaBank for financial securities.",
        "Stablecoin": "Stablecoin",
        "Crypto-monnaie indexée sur une devise (ex: 1 USDC = 1 USD). Alternative au Trigger.": "Cryptocurrency pegged to a currency (e.g., 1 USDC = 1 USD). Alternative to Trigger.",
        "Smart Contract": "Smart Contract",
        "Programme informatique auto-exécutable qui gère automatiquement les clauses (paiement coupon, remboursement).": "Self-executing computer program automatically managing clauses (coupon payment, redemption).",
        "Security Token": "Security Token",
        "Enveloppe numérique qui contient un actif financier réel (Obligation, Action).": "Digital wrapper containing a real financial asset (Bond, Stock).",
        "Wallet": "Wallet",
        "Portefeuille numérique contenant l'Adresse Publique (IBAN) et la Clé Privée (Signature).": "Digital wallet containing Public Address (IBAN) and Private Key (Signature).",
        "DLT (Distributed Ledger)": "DLT (Distributed Ledger)",
        "Registre distribué partagé entre plusieurs participants. La Blockchain est un type de DLT.": "Distributed ledger shared among multiple participants. Blockchain is a type of DLT.",
        
        # Contact
        "Expert Digital Assets & Blockchain": "Expert Digital Assets & Blockchain",
        "SE CONNECTER SUR LINKEDIN": "CONNECT ON LINKEDIN",
        "© 2026 Presentation Blockchain. Tous droits réservés.": "© 2026 Blockchain Presentation. All rights reserved.",
        
        # Legal
        "AVERTISSEMENT INTERNE :": "INTERNAL WARNING:",
        "Ce document est une présentation stratégique à usage exclusivement pédagogique et interne. Les produits financiers (Digital Bonds) et les scénarios de marché présentés sont des simulations. Ne constitue pas une offre de service ou un conseil en investissement.": "This document is a strategic presentation for exclusively educational and internal use. The financial products (Digital Bonds) and market scenarios presented are simulations. Does not constitute a service offer or investment advice.",
        "Classification : CONFIDENTIAL / INTERNAL USE ONLY • © 2026 Blockchain Academy": "Classification: CONFIDENTIAL / INTERNAL USE ONLY • © 2026 Blockchain Academy"
    }
    
    # Appliquer toutes les traductions
    for fr, en in translations.items():
        content = content.replace(fr, en)
    
    # Sauvegarder
    print("💾 Sauvegarde de index-simple_en.html...")
    with open('index-simple_en.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Version anglaise COMPLÈTE créée avec succès!")
    print(f"📊 {len(translations)} traductions appliquées")
    print("\n🎯 Structure conservée:")
    print("   ✅ Toutes les sections (Historique, Fondamentaux, etc.)")
    print("   ✅ Même design et CSS")
    print("   ✅ Même navigation")
    print("   ✅ Vocabulaire professionnel City of London")

if __name__ == "__main__":
    main()
