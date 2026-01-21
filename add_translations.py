#!/usr/bin/env python3
"""
Script pour finaliser le système bilingue de index-simple.html
Ajoute toutes les clés de traduction manquantes et les attributs data-i18n
"""

# Nouvelles clés à ajouter au dictionnaire FR
fr_keys = {
    # Roadmap
    "road_phase1": "Cadrage Juridique",
    "road_phase1_desc": "Choix du droit (eWpG Allemagne)",
    "road_phase2": "Sélection Plateforme",
    "road_phase2_desc": "SWIAT vs Polygon vs Canton",
    "road_phase3": "Structuration",
    "road_phase3_desc": "Montant, Maturité, Coupon",
    "road_phase4": "Tech Setup",
    "road_phase4_desc": "Wallet, Smart Contract, KYC",
    "road_phase5": "Placement",
    "road_phase5_desc": "Roadshow Investisseurs",
    "road_phase6": "Émission T+0",
    "road_phase6_desc": "Minting + Règlement Instantané",
    
    # Glossary
    "gloss_atomic_def": "Mécanisme d'échange simultané Titre contre Cash (DvP). Élimine le risque de contrepartie.",
    "gloss_trigger_def": "Passerelle qui connecte la Blockchain au système de paiement de la Banque Centrale (Target2).",
    "gloss_minting_def": "Création technique des tokens sur la blockchain (équivalent à l'impression du certificat global).",
    "gloss_burning_def": "Destruction des tokens lors du remboursement pour annuler la dette dans le registre.",
    "gloss_dvp_def": "Principe de règlement simultané : le titre ne change de main que si le cash change de main.",
    "gloss_ewpg_def": "Loi allemande (2021) qui supprime l'obligation du certificat papier global pour les obligations.",
    "gloss_swiat_def": "Blockchain privée de consortium créée par DekaBank pour les titres financiers.",
    "gloss_stablecoin_def": "Crypto-monnaie indexée sur une devise (ex: 1 USDC = 1 USD). Alternative au Trigger.",
    "gloss_smart_def": "Programme informatique auto-exécutable qui gère automatiquement les clauses (paiement coupon, remboursement).",
    "gloss_token_def": "Enveloppe numérique qui contient un actif financier réel (Obligation, Action).",
    "gloss_wallet_def": "Portefeuille numérique contenant l'Adresse Publique (IBAN) et la Clé Privée (Signature).",
    "gloss_dlt_def": "Registre distribué partagé entre plusieurs participants. La Blockchain est un type de DLT."
}

# Nouvelles clés EN
en_keys = {
    # Roadmap
    "road_phase1": "Legal Framework",
    "road_phase1_desc": "Law selection (eWpG Germany)",
    "road_phase2": "Platform Selection",
    "road_phase2_desc": "SWIAT vs Polygon vs Canton",
    "road_phase3": "Structuring",
    "road_phase3_desc": "Amount, Maturity, Coupon",
    "road_phase4": "Tech Setup",
    "road_phase4_desc": "Wallet, Smart Contract, KYC",
    "road_phase5": "Placement",
    "road_phase5_desc": "Investor Roadshow",
    "road_phase6": "T+0 Issuance",
    "road_phase6_desc": "Minting + Instant Settlement",
    
    # Glossary
    "gloss_atomic_def": "Simultaneous Title vs Cash exchange mechanism (DvP). Eliminates counterparty risk.",
    "gloss_trigger_def": "Gateway connecting Blockchain to Central Bank payment system (Target2).",
    "gloss_minting_def": "Technical creation of tokens on blockchain (equivalent to global certificate printing).",
    "gloss_burning_def": "Token destruction upon redemption to cancel debt in the ledger.",
    "gloss_dvp_def": "Simultaneous settlement principle: title changes hands only if cash changes hands.",
    "gloss_ewpg_def": "German law (2021) removing global paper certificate requirement for bonds.",
    "gloss_swiat_def": "Private consortium blockchain created by DekaBank for financial securities.",
    "gloss_stablecoin_def": "Cryptocurrency pegged to a currency (e.g., 1 USDC = 1 USD). Alternative to Trigger.",
    "gloss_smart_def": "Self-executing computer program automatically managing clauses (coupon payment, redemption).",
    "gloss_token_def": "Digital wrapper containing a real financial asset (Bond, Stock).",
    "gloss_wallet_def": "Digital wallet containing Public Address (IBAN) and Private Key (Signature).",
    "gloss_dlt_def": "Distributed ledger shared among multiple participants. Blockchain is a type of DLT."
}

print("Clés FR à ajouter:", len(fr_keys))
print("Clés EN à ajouter:", len(en_keys))
print("\nTotal nouvelles clés:", len(fr_keys) + len(en_keys))
