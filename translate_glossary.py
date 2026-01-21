#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de traduction ULTIME pour le Glossaire Technique
"""

import re

def main():
    print("🔧 Traduction finale du Glossaire Technique...")
    with open('index-simple_en.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Liste des traductions EXACTES pour le glossaire
    # Basée sur la structure réelle du fichier
    glossary_replacements = [
        # Titre et Sous-titre
        (r'Le langage du marché Digital', 'The Language of the Digital Market'),
        
        # Termes et Définitions
        
        # Atomic Swap
        (r'Mécanisme d\'échange simultané Titre contre Cash \(DvP\)\. Élimine le risque de contrepartie\.', 
         'Simultaneous Title vs Cash exchange mechanism (DvP). Eliminites counterparty risk.'),
         
        # Trigger
        (r'Passerelle qui connecte la Blockchain au système de paiement de la Banque Centrale \(Target2\)\.', 
         'Gateway bridging Blockchain to the Central Bank payment system (Target2).'),
         
        # Minting
        (r'Création technique des tokens sur la blockchain \(équivalent à l\'impression du certificat global\)\.', 
         'Technical creation of tokens on the blockchain (equivalent to printing the global note).'),
         
        # Burning
        (r'Destruction des tokens lors du remboursement pour annuler la dette dans le registre\.', 
         'Destruction of tokens upon redemption to cancel debt in the ledger.'),
         
        # DvP
        (r'Principe de règlement simultané : le titre ne change de main que si le cash change de main\.', 
         'Simultaneous settlement principle: title changes hands only if cash changes hands.'),
         
        # eWpG
        (r'Loi allemande \(2021\) qui supprime l\'obligation du certificat papier global pour les obligations\.', 
         'German law (2021) removing the requirement for a physical global note for bonds.'),
         
        # SWIAT
        (r'Blockchain privée de consortium créée par DekaBank pour les titres financiers\.', 
         'Private consortium blockchain created by DekaBank for financial securities.'),
         
        # Stablecoin
        (r'Crypto-monnaie indexée sur une devise \(ex: 1 USDC = 1 USD\)\. Alternative au Trigger\.', 
         'Cryptocurrency pegged to a fiat currency (e.g. 1 USDC = 1 USD). Alternative to Trigger.'),
         
        # Smart Contract
        (r'Programme informatique auto-exécutable qui gère automatiquement les clauses \(paiement coupon, remboursement\)\.', 
         'Self-executing computer program that automatically manages clauses (coupon payment, redemption).'),
         
        # Security Token
        (r'Enveloppe numérique qui contient un actif financier réel \(Obligation, Action\)\.', 
         'Digital wrapper containing a real financial asset (Bond, Equity).'),
         
        # Wallet
        (r'Portefeuille numérique contenant l\'Adresse Publique \(IBAN\) et la Clé Privée \(Signature\)\.', 
         'Digital wallet containing Public Address (IBAN) and Private Key (Signature).'),
         
        # DLT
        (r'Registre distribué partagé entre plusieurs participants\. La Blockchain est un type de DLT\.', 
         'Distributed Ledger shared among multiple participants. Blockchain is a type of DLT.')
    ]

    count = 0
    for pattern, replacement in glossary_replacements:
        # Regex avec IGNORECASE pour être plus robuste
        new_content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
        if new_content != content:
            content = new_content
            count += 1
            print(f"✅ Glossaire traduit : {pattern[:30]}...")
    
    # Correction supplémentaire : Champ de recherche
    search_fr = 'Rechercher un terme (ex: Atomic Swap, Trigger...)'
    search_en = 'Search term (e.g. Atomic Swap, Trigger...)'
    if search_fr in content:
        content = content.replace(search_fr, search_en)
        count += 1
        print("✅ Champ de recherche traduit")

    with open('index-simple_en.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n🎉 Glossaire 100% traduit ({count} éléments). Site EN terminé.")

if __name__ == "__main__":
    main()
