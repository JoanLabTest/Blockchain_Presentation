#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de traduction FINAL et ABSOLU pour le Glossaire
"""

import re

def main():
    print("🔧 Traduction chirurgicale du Glossaire HTML...")
    with open('index-simple_en.html', 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = [
        # Atomic Swap (Mixte -> Anglais pur)
        (r'Mécanisme d\\\'échange simultané Titre contre Cash \(DvP\)\. Eliminates counterparty risk\.', 
         'Simultaneous Title vs Cash exchange mechanism (DvP). Eliminates counterparty risk.'),
        
        # Trigger Solution
        (r'Passerelle de la Bundesbank connectant la Blockchain au système Target2 pour\s+le règlement en monnaie centrale\.', 
         'Bundesbank gateway connecting Blockchain to Target2 system for central bank money settlement.'),
         
        # Smart Contract
        (r'Programme informatique qui automatise le cycle de vie du titre \(Coupons,\s+Remboursement\)\.', 
         'Computer program automating the security lifecycle (Coupons, Redemption).'),
         
        # eWpG
        (r'Loi allemande \(2021\) supprimant le certificat global papier au profit d\'un\s+registre crypto\.', 
         'German law (2021) removing the physical global note in favor of a crypto registry.'),
         
        # Wholesale MNBC
        (r'Monnaie Numérique de Banque Centrale \(Euro Numérique\) pour les règlements\s+interbancaires\.', 
         'Central Bank Digital Currency (Digital Euro) for interbank settlements.'),
         
        # Gas Fee
        (r'Frais de transaction payés au réseau blockchain pour exécuter un Smart\s+Contract\.', 
         'Transaction fees paid to the blockchain network to execute a Smart Contract.'),
         
        # Private Key
        (r'Signature cryptographique secrète permettant de valider une transaction depuis\s+un Wallet\.', 
         'Secret cryptographic signature allowing transaction validation from a Wallet.'),
         
        # HQLA
        (r'High Quality Liquid Assets\. Actifs éligibles aux ratios de liquidité \(LCR\),\s+statut visé par les Digital Bonds\.', 
         'High Quality Liquid Assets. Assets eligible for liquidity ratios (LCR), targeted status for Digital Bonds.'),
         
        # DLT
        (r'Distributed Ledger Technology\. Technologie de registre distribué, terme\s+générique incluant la Blockchain\.', 
         'Distributed Ledger Technology. Generic term including Blockchain.'),
         
        # Minting
        (r'Action de créer \(émettre\) un nouveau token sur la blockchain via un Smart\s+Contract\.', 
         'Action of creating (issuing) a new token on the blockchain via a Smart Contract.'),
         
        # Wallet
        (r'Portefeuille numérique contenant les clés cryptographiques pour gérer les\s+actifs digitaux\.', 
         'Digital wallet containing cryptographic keys to manage digital assets.'),
         
        # T+0
        (r'Règlement instantané le jour même de la transaction \(vs T\+2 pour le modèle\s+classique\)\.', 
         'Instant settlement on the same day as the transaction (vs T+2 for the conventional model).')
    ]

    count = 0
    for pattern, replacement in replacements:
        # Regex avec IGNORECASE et DOTALL (indirectement via \s+)
        new_content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
        if new_content != content:
            content = new_content
            count += 1
            print(f"✅ Traduit : {replacement[:40]}...")

    with open('index-simple_en.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n🎉 Glossaire HTML traduit : {count} définitions corrigées.")

if __name__ == "__main__":
    main()
