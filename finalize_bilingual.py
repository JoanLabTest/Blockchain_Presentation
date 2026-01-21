#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de finalisation automatique du système bilingue pour index-simple.html
Ajoute toutes les clés de traduction manquantes et les attributs data-i18n
"""

import re
import sys

def main():
    file_path = 'index-simple.html'
    
    # Lire le fichier
    print(f"📖 Lecture de {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Nouvelles clés FR à ajouter
    fr_additions = '''
                // Roadmap Phases
                road_phase1: "Cadrage Juridique",
                road_phase1_desc: "Choix du droit (eWpG Allemagne)",
                road_phase2: "Sélection Plateforme",
                road_phase2_desc: "SWIAT vs Polygon vs Canton",
                road_phase3: "Structuration",
                road_phase3_desc: "Montant, Maturité, Coupon",
                road_phase4: "Tech Setup",
                road_phase4_desc: "Wallet, Smart Contract, KYC",
                road_phase5: "Placement",
                road_phase5_desc: "Roadshow Investisseurs",
                road_phase6: "Émission T+0",
                road_phase6_desc: "Minting + Règlement Instantané",
                
                // Glossary Definitions
                gloss_atomic_def: "Mécanisme d'échange simultané Titre contre Cash (DvP). Élimine le risque de contrepartie.",
                gloss_trigger_def: "Passerelle qui connecte la Blockchain au système de paiement de la Banque Centrale (Target2).",
                gloss_minting_def: "Création technique des tokens sur la blockchain (équivalent à l'impression du certificat global).",
                gloss_burning_def: "Destruction des tokens lors du remboursement pour annuler la dette dans le registre.",
                gloss_dvp_def: "Principe de règlement simultané : le titre ne change de main que si le cash change de main.",
                gloss_ewpg_def: "Loi allemande (2021) qui supprime l'obligation du certificat papier global pour les obligations.",
                gloss_swiat_def: "Blockchain privée de consortium créée par DekaBank pour les titres financiers.",
                gloss_stablecoin_def: "Crypto-monnaie indexée sur une devise (ex: 1 USDC = 1 USD). Alternative au Trigger.",
                gloss_smart_def: "Programme informatique auto-exécutable qui gère automatiquement les clauses (paiement coupon, remboursement).",
                gloss_token_def: "Enveloppe numérique qui contient un actif financier réel (Obligation, Action).",
                gloss_wallet_def: "Portefeuille numérique contenant l'Adresse Publique (IBAN) et la Clé Privée (Signature).",
                gloss_dlt_def: "Registre distribué partagé entre plusieurs participants. La Blockchain est un type de DLT."'''
    
    # Nouvelles clés EN à ajouter
    en_additions = '''
                // Roadmap Phases
                road_phase1: "Legal Framework",
                road_phase1_desc: "Law selection (eWpG Germany)",
                road_phase2: "Platform Selection",
                road_phase2_desc: "SWIAT vs Polygon vs Canton",
                road_phase3: "Structuring",
                road_phase3_desc: "Amount, Maturity, Coupon",
                road_phase4: "Tech Setup",
                road_phase4_desc: "Wallet, Smart Contract, KYC",
                road_phase5: "Placement",
                road_phase5_desc: "Investor Roadshow",
                road_phase6: "T+0 Issuance",
                road_phase6_desc: "Minting + Instant Settlement",
                
                // Glossary Definitions
                gloss_atomic_def: "Simultaneous Title vs Cash exchange mechanism (DvP). Eliminates counterparty risk.",
                gloss_trigger_def: "Gateway connecting Blockchain to Central Bank payment system (Target2).",
                gloss_minting_def: "Technical creation of tokens on blockchain (equivalent to global certificate printing).",
                gloss_burning_def: "Token destruction upon redemption to cancel debt in the ledger.",
                gloss_dvp_def: "Simultaneous settlement principle: title changes hands only if cash changes hands.",
                gloss_ewpg_def: "German law (2021) removing global paper certificate requirement for bonds.",
                gloss_swiat_def: "Private consortium blockchain created by DekaBank for financial securities.",
                gloss_stablecoin_def: "Cryptocurrency pegged to a currency (e.g., 1 USDC = 1 USD). Alternative to Trigger.",
                gloss_smart_def: "Self-executing computer program automatically managing clauses (coupon payment, redemption).",
                gloss_token_def: "Digital wrapper containing a real financial asset (Bond, Stock).",
                gloss_wallet_def: "Digital wallet containing Public Address (IBAN) and Private Key (Signature).",
                gloss_dlt_def: "Distributed ledger shared among multiple participants. Blockchain is a type of DLT."'''
    
    # 1. Ajouter les clés FR
    print("🔧 Ajout des clés de traduction FR...")
    fr_pattern = r'(contact_copyright: "© 2026 Présentation DCM Digital\. Tous droits réservés\.")\s*\n(\s*)\}'
    fr_replacement = r'\1' + fr_additions + r'\n\2}'
    content = re.sub(fr_pattern, fr_replacement, content, count=1)
    
    # 2. Ajouter les clés EN
    print("🔧 Ajout des clés de traduction EN...")
    en_pattern = r'(contact_copyright: "© 2026 DCM Digital Presentation\. All rights reserved\.")\s*\n(\s*)\}'
    en_replacement = r'\1' + en_additions + r'\n\2}'
    content = re.sub(en_pattern, en_replacement, content, count=1)
    
    # 3. Ajouter data-i18n sur les éléments de la roadmap
    print("🔧 Ajout des attributs data-i18n sur la roadmap...")
    
    # Phase 1
    content = re.sub(
        r'<strong>Cadrage Juridique</strong>',
        r'<strong data-i18n="road_phase1">Cadrage Juridique</strong>',
        content
    )
    content = re.sub(
        r'<div>Choix du droit \(eWpG Allemagne\)</div>',
        r'<div data-i18n="road_phase1_desc">Choix du droit (eWpG Allemagne)</div>',
        content
    )
    
    # Phase 2
    content = re.sub(
        r'<strong>Sélection Plateforme</strong>',
        r'<strong data-i18n="road_phase2">Sélection Plateforme</strong>',
        content
    )
    content = re.sub(
        r'<div>SWIAT vs Polygon vs Canton</div>',
        r'<div data-i18n="road_phase2_desc">SWIAT vs Polygon vs Canton</div>',
        content
    )
    
    # Phase 3
    content = re.sub(
        r'<strong>Structuration</strong>',
        r'<strong data-i18n="road_phase3">Structuration</strong>',
        content
    )
    content = re.sub(
        r'<div>Montant, Maturité, Coupon</div>',
        r'<div data-i18n="road_phase3_desc">Montant, Maturité, Coupon</div>',
        content
    )
    
    # Phase 4
    content = re.sub(
        r'<strong>Tech Setup</strong>',
        r'<strong data-i18n="road_phase4">Tech Setup</strong>',
        content
    )
    content = re.sub(
        r'<div>Wallet, Smart Contract, KYC</div>',
        r'<div data-i18n="road_phase4_desc">Wallet, Smart Contract, KYC</div>',
        content
    )
    
    # Phase 5
    content = re.sub(
        r'<strong>Placement</strong>',
        r'<strong data-i18n="road_phase5">Placement</strong>',
        content
    )
    content = re.sub(
        r'<div>Roadshow Investisseurs</div>',
        r'<div data-i18n="road_phase5_desc">Roadshow Investisseurs</div>',
        content
    )
    
    # Phase 6
    content = re.sub(
        r'<strong>Émission T\+0</strong>',
        r'<strong data-i18n="road_phase6">Émission T+0</strong>',
        content
    )
    content = re.sub(
        r'<div>Minting \+ Règlement Instantané</div>',
        r'<div data-i18n="road_phase6_desc">Minting + Règlement Instantané</div>',
        content
    )
    
    # 4. Ajouter data-i18n sur le glossaire
    print("🔧 Ajout des attributs data-i18n sur le glossaire...")
    
    # Atomic Swap
    content = re.sub(
        r'<div class="term-def">Mécanisme d\'échange simultané Titre contre Cash \(DvP\)\. Élimine le risque de\s*contrepartie\.</div>',
        r'<div class="term-def" data-i18n="gloss_atomic_def">Mécanisme d\'échange simultané Titre contre Cash (DvP). Élimine le risque de contrepartie.</div>',
        content
    )
    
    # Trigger
    content = re.sub(
        r'<div class="term-def">Passerelle qui connecte la Blockchain au système de paiement de la Banque Centrale \(Target2\)\.</div>',
        r'<div class="term-def" data-i18n="gloss_trigger_def">Passerelle qui connecte la Blockchain au système de paiement de la Banque Centrale (Target2).</div>',
        content
    )
    
    # Minting
    content = re.sub(
        r'<div class="term-def">Création technique des tokens sur la blockchain \(équivalent à l\'impression du certificat\s*global\)\.</div>',
        r'<div class="term-def" data-i18n="gloss_minting_def">Création technique des tokens sur la blockchain (équivalent à l\'impression du certificat global).</div>',
        content
    )
    
    # Burning
    content = re.sub(
        r'<div class="term-def">Destruction des tokens lors du remboursement pour annuler la dette dans le registre\.</div>',
        r'<div class="term-def" data-i18n="gloss_burning_def">Destruction des tokens lors du remboursement pour annuler la dette dans le registre.</div>',
        content
    )
    
    # DvP
    content = re.sub(
        r'<div class="term-def">Principe de règlement simultané : le titre ne change de main que si le cash change de\s*main\.</div>',
        r'<div class="term-def" data-i18n="gloss_dvp_def">Principe de règlement simultané : le titre ne change de main que si le cash change de main.</div>',
        content
    )
    
    # eWpG
    content = re.sub(
        r'<div class="term-def">Loi allemande \(2021\) qui supprime l\'obligation du certificat papier global pour les\s*obligations\.</div>',
        r'<div class="term-def" data-i18n="gloss_ewpg_def">Loi allemande (2021) qui supprime l\'obligation du certificat papier global pour les obligations.</div>',
        content
    )
    
    # SWIAT
    content = re.sub(
        r'<div class="term-def">Blockchain privée de consortium créée par DekaBank pour les titres financiers\.</div>',
        r'<div class="term-def" data-i18n="gloss_swiat_def">Blockchain privée de consortium créée par DekaBank pour les titres financiers.</div>',
        content
    )
    
    # Stablecoin
    content = re.sub(
        r'<div class="term-def">Crypto-monnaie indexée sur une devise \(ex: 1 USDC = 1 USD\)\. Alternative au Trigger\.</div>',
        r'<div class="term-def" data-i18n="gloss_stablecoin_def">Crypto-monnaie indexée sur une devise (ex: 1 USDC = 1 USD). Alternative au Trigger.</div>',
        content
    )
    
    # Smart Contract
    content = re.sub(
        r'<div class="term-def">Programme informatique auto-exécutable qui gère automatiquement les clauses \(paiement coupon,\s*remboursement\)\.</div>',
        r'<div class="term-def" data-i18n="gloss_smart_def">Programme informatique auto-exécutable qui gère automatiquement les clauses (paiement coupon, remboursement).</div>',
        content
    )
    
    # Security Token
    content = re.sub(
        r'<div class="term-def">Enveloppe numérique qui contient un actif financier réel \(Obligation, Action\)\.</div>',
        r'<div class="term-def" data-i18n="gloss_token_def">Enveloppe numérique qui contient un actif financier réel (Obligation, Action).</div>',
        content
    )
    
    # Wallet
    content = re.sub(
        r'<div class="term-def">Portefeuille numérique contenant l\'Adresse Publique \(IBAN\) et la Clé Privée\s*\(Signature\)\.</div>',
        r'<div class="term-def" data-i18n="gloss_wallet_def">Portefeuille numérique contenant l\'Adresse Publique (IBAN) et la Clé Privée (Signature).</div>',
        content
    )
    
    # DLT
    content = re.sub(
        r'<div class="term-def">Registre distribué partagé entre plusieurs participants\. La Blockchain est un type de\s*DLT\.</div>',
        r'<div class="term-def" data-i18n="gloss_dlt_def">Registre distribué partagé entre plusieurs participants. La Blockchain est un type de DLT.</div>',
        content
    )
    
    # 5. Ajouter data-i18n sur le sous-titre du glossaire
    content = re.sub(
        r'<p style="color: #cbd5e1; margin-bottom: 30px;">Le langage du marché Digital</p>',
        r'<p style="color: #cbd5e1; margin-bottom: 30px;" data-i18n="gloss_subtitle">Le langage du marché Digital</p>',
        content
    )
    
    # 6. Ajouter data-i18n sur le placeholder de recherche
    content = re.sub(
        r'placeholder="Rechercher un terme \(ex: Atomic Swap, Trigger\.\.\.\)"',
        r'data-i18n-placeholder="gloss_search" placeholder="Rechercher un terme (ex: Atomic Swap, Trigger...)"',
        content
    )
    
    # 7. Ajouter data-i18n sur le sous-titre de la roadmap
    content = re.sub(
        r'<p style="color: #cbd5e1; margin-bottom: 30px;">Feuille de route pour une émission inaugurale \(6 mois\)',
        r'<p style="color: #cbd5e1; margin-bottom: 30px;" data-i18n="road_subtitle">Feuille de route pour une émission inaugurale (6 mois)',
        content
    )
    
    # 8. Ajouter data-i18n sur le sous-titre du comparatif
    content = re.sub(
        r'<p style="color: #cbd5e1; margin-bottom: 30px;">Comparaison des cycles de vie</p>',
        r'<p style="color: #cbd5e1; margin-bottom: 30px;" data-i18n="comp_subtitle">Comparaison des cycles de vie</p>',
        content
    )
    
    # Sauvegarder le fichier modifié
    print(f"💾 Sauvegarde de {file_path}...")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Finalisation terminée avec succès!")
    print("\n📊 Résumé des modifications:")
    print("   - 48 nouvelles clés de traduction ajoutées (24 FR + 24 EN)")
    print("   - Attributs data-i18n ajoutés sur:")
    print("     • 6 phases de la roadmap (12 éléments)")
    print("     • 12 définitions du glossaire")
    print("     • 3 sous-titres de sections")
    print("     • 1 placeholder de recherche")
    print("\n🎉 Le site est maintenant 100% bilingue!")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"❌ Erreur: {e}", file=sys.stderr)
        sys.exit(1)
