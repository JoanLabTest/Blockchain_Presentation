#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de correction finale et totale pour index-simple_en.html et les switchers
"""

def main():
    # ==========================================
    # 1. CORRECTION DE LA VERSION ANGLAISE
    # ==========================================
    print("🔧 Correction complète du contenu de index-simple_en.html...")
    with open('index-simple_en.html', 'r', encoding='utf-8') as f:
        en_content = f.read()

    # Dictionnaire de remplacement PRECIS basé sur le contenu actuel du fichier
    replacements = {
        # HISTORIQUE
        'SG émet 100M€ d\'OFH sur Ethereum Public.': 'SG issues €100m Covered Bond on Public Ethereum.',
        'L\'Allemagne légalise le titre purement digital.': 'Germany legalizes purely digital securities.',
        'Siemens émet 300M€ avec Trigger.': 'Siemens issues €300m with Trigger settlement.',
        'La 1ère Mondiale': 'World First',
        'Liquidité': 'Liquidity',
        
        # FONDAMENTAUX
        'Analogie : <strong>Un Fichier Excel Partagé</strong>': 'Analogy: <strong>A Shared Excel File</strong>',
        'Au lieu de réconcilier deux fichiers internes (T+2), toutes les banques lisent le même registre en temps réel (T+0).': 'Instead of reconciling two internal files (T+2), all banks read the same ledger in real-time (T+0).',
        'Analogie : <strong>IBAN + Signature</strong>': 'Analogy: <strong>IBAN + Signature</strong>',
        'L\'Adresse Publique est votre IBAN pour recevoir. La Clé Privée est votre signature électronique pour valider.': 'Public Address is your IBAN to receive. Private Key is your digital signature to validate.',
        
        # BENCHMARKS
        'SWIAT (Privée)': 'SWIAT (Private)',
        'Sécurité juridique (Nominatif)': 'Legal certainty (Registered)',
        'Vitesse :': 'Speed:',
        'T+Minutes (vs T+2)': 'T+Minutes (vs T+2)',
        
        # REGULATION
        'Cadre complet pour titres au porteur digitaux. C\'est le standard de marché actuel.': 'Comprehensive framework for digital bearer bonds. Current market standard.',
        'Cadre flexible pour les infrastructures DLT. Forte innovation (SG-Forge, Banque de France).': 'Flexible framework for DLT infrastructures. Strong innovation focus (SG-Forge, BdF).',
        
        # COMPARATIF
        'Marché Primaire (Émission)': 'Primary Market (Issuance)',
        'Marché Secondaire (Trading)': 'Secondary Market (Trading)',
        'Flux de Règlement': 'Settlement Flow',
        
        # ROADMAP
        'Cadrage Juridique': 'Legal Framework',
        'Choix du droit (eWpG Allemagne)': 'Law selection (eWpG Germany)',
        'Sélection Plateforme': 'Platform Selection',
        'Structuration': 'Structuring',
        'Montant, Maturité, Coupon': 'Amount, Maturity, Coupon',
        'Placement': 'Placement',
        'Roadshow Investisseurs': 'Investor Roadshow',
        'Émission T+0': 'T+0 Issuance',
        'Minting + Règlement Instantané': 'Minting + Instant Settlement',
        
        # GLOSSAIRE
        'Mécanisme d\'échange simultané Titre contre Cash (DvP). Élimine le risque de contrepartie.': 'Simultaneous Title vs Cash exchange mechanism (DvP). Eliminates counterparty risk.',
        'Passerelle qui connecte la Blockchain au système de paiement de la Banque Centrale (Target2).': 'Gateway connecting Blockchain to Central Bank payment system (Target2).',
        'Création technique des tokens sur la blockchain (équivalent à l\'impression du certificat global).': 'Technical creation of tokens on blockchain (equivalent to global certificate printing).',
        'Destruction des tokens lors du remboursement pour annuler la dette dans le registre.': 'Token destruction upon redemption to cancel debt in the ledger.',
        'Principe de règlement simultané : le titre ne change de main que si le cash change de main.': 'Simultaneous settlement principle: title changes hands only if cash changes hands.',
        'Loi allemande (2021) qui supprime l\'obligation du certificat papier global pour les obligations.': 'German law (2021) removing global paper certificate requirement for bonds.',
        'Blockchain privée de consortium créée par DekaBank pour les titres financiers.': 'Private consortium blockchain created by DekaBank for financial securities.',
        'Crypto-monnaie indexée sur une devise (ex: 1 USDC = 1 USD). Alternative au Trigger.': 'Cryptocurrency pegged to a currency (e.g., 1 USDC = 1 USD). Alternative to Trigger.',
        'Programme informatique auto-exécutable qui gère automatiquement les clauses (paiement coupon, remboursement).': 'Self-executing computer program automatically managing clauses (coupon payment, redemption).',
        'Enveloppe numérique qui contient un actif financier réel (Obligation, Action).': 'Digital wrapper containing a real financial asset (Bond, Stock).',
        'Portefeuille numérique contenant l\'Adresse Publique (IBAN) et la Clé Privée (Signature).': 'Digital wallet containing Public Address (IBAN) and Private Key (Signature).',
        'Registre distribué partagé entre plusieurs participants. La Blockchain est un type de DLT.': 'Distributed ledger shared among multiple participants. Blockchain is a type of DLT.',
        'Rechercher un terme (ex: Atomic Swap, Trigger...)': 'Search a term (e.g., Atomic Swap, Trigger...)',
        
        # TRADER
        'Quantité': 'Quantity',
        'L\'interface cache la complexité Blockchain. Un clic déclenche le Smart Contract.': 'Interface abstracts Blockchain complexity. One click triggers the Smart Contract.'
    }

    # Appliquer remplacements
    count = 0
    for fr, en in replacements.items():
        if fr in en_content:
            en_content = en_content.replace(fr, en)
            count += 1
    
    # Correction SPÉCIALE pour le switcher de index-simple_en.html
    # Il doit avoir le drapeau GB actif
    wrong_switcher_en = '<a href="index-simple_en.html" class="lang-btn" title="English">🇬🇧</a>'
    correct_switcher_en = '<a href="index-simple_en.html" class="lang-btn active" title="English">🇬🇧</a>'
    
    if wrong_switcher_en in en_content:
        en_content = en_content.replace(wrong_switcher_en, correct_switcher_en)
        print("✅ Switcher EN corrigé (GB active)")

    with open('index-simple_en.html', 'w', encoding='utf-8') as f:
        f.write(en_content)
    
    print(f"✅ {count} traductions appliquées sur index-simple_en.html")


    # ==========================================
    # 2. CORRECTION DE LA VERSION FRANÇAISE
    # ==========================================
    print("\n🔧 Correction du switcher de index-simple.html (FR)...")
    with open('index-simple.html', 'r', encoding='utf-8') as f:
        fr_content = f.read()
    
    # Le switcher FR doit avoir le drapeau FR actif et GB inactif
    # Vérification et correction
    
    # Cas 1: Si GB est actif par erreur (ce qu'on a vu)
    wrong_gb_active = '<a href="index-simple_en.html" class="lang-btn active" title="English">🇬🇧</a>'
    correct_gb_inactive = '<a href="index-simple_en.html" class="lang-btn" title="English">🇬🇧</a>'
    
    if wrong_gb_active in fr_content:
        fr_content = fr_content.replace(wrong_gb_active, correct_gb_inactive)
        print("✅ Drapeau GB désactivé sur la page FR")

    # Cas 2: Si FR n'est pas actif
    wrong_fr_inactive = '<a href="index-simple.html" class="lang-btn" title="Français">🇫🇷</a>'
    correct_fr_active = '<a href="index-simple.html" class="lang-btn active" title="Français">🇫🇷</a>'
    
    if wrong_fr_inactive in fr_content:
        fr_content = fr_content.replace(wrong_fr_inactive, correct_fr_active)
        print("✅ Drapeau FR activé sur la page FR")

    with open('index-simple.html', 'w', encoding='utf-8') as f:
        f.write(fr_content)

    print("\n🎉 Terminé ! Les deux fichiers sont synchronisés et traduits.")

if __name__ == "__main__":
    main()
