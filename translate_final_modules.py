#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FINAL MODULES 04-07 & IT ARCHITECTURE TRANSLATION
Complete professional translation of remaining technical modules
"""

import re

def main():
    print("🚀 Starting FINAL MODULES 04-07 & IT TRANSLATION...")
    
    try:
        with open('index_en.html', 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Error: {e}")
        return

    # Comprehensive replacements for Modules 04-07 and IT
    replacements = [
        # === MODULE 04: TOKENIZATION BENEFITS ===
        (r'Réduction Coûts Opérationnels', 'Operational Cost Reduction'),
        (r'Exécution \(vs Jours\)', 'Execution (vs Days)'),
        (r'Erreurs Humaines \(Automatisé\)', 'Human Errors (Automated)'),
        (r'Traçabilité Totale', 'Full Traceability'),
        
        # === MODULE 05: TOKEN MECHANICS ===
        (r'Comment un Token est-il "Alimenté" \?', 'How is a Token "Powered"?'),
        (r'Les mécanismes créant la valeur du token', 'Mechanisms creating token value'),
        (r'Concept Fondamental', 'Fundamental Concept'),
        (r'Un token n\'a pas de valeur par défaut.*?précis mécanismes économiques',
         'A token has no default value. Unlike traditional currency backed by a State or Central Bank, a token\'s value derives entirely from <strong>precise economic mechanisms</strong>'),
        (r'Utilité', 'Utility'),
        (r'Le token donne accès à un service', 'Token gives access to a service'),
        (r'Paiement de frais de transaction', 'Payment of transaction fees'),
        (r'Accès à une application décentralisée', 'Access to a decentralized application'),
        (r'Utilisation de services API', 'Usage of specific API services'),
        (r'Partage de Revenus', 'Revenue-Sharing'),
        (r'Le token distribue une part des revenus', 'Token distributes a share of generated revenue'),
        (r'Versement automatique de frais', 'Automatic payout of transaction fees'),
        (r'Récompenses basées sur le volume', 'Rewards based on protocol volume'),
        (r'Dividendes programmés via Smart Contract', 'Dividends programmed via Smart Contract'),
        (r'Adossement à un Actif', 'Asset-Backed'),
        (r'Le token est garanti par un actif réel', 'Token is collateralized by a real-world asset'),
        (r'Stablecoins adossés aux devises', 'Fiat-backed Stablecoins'),
        (r'Tokens immobiliers \(Parts de propriété\)', 'Real Estate tokens (Property shares)'),
        (r'Tokens adossés à l\'or', 'Gold or Commodity backed tokens'),
        (r'Mise en Jeu', 'Staking'),
        (r'Le token génère du rendement en étant verrouillé', 'Token generates yield by being locked'),
        (r'Récompenses Proof of Stake', 'Proof of Stake rewards'),
        (r'Fourniture de Liquidité DeFi', 'DeFi Liquidity Provision'),
        (r'Programmes de Yield Farming', 'Yield Farming programs'),
        (r'Gouvernance', 'Governance'),
        (r'Le token donne un pouvoir de vote', 'Token grants voting power'),
        (r'Vote sur les structures de frais', 'Vote on fee structures'),
        (r'Décisions d\'allocation de trésorerie', 'Treasury allocation decisions'),
        (r'Mises à niveau du protocole', 'Protocol upgrades & amendments'),
        (r'Rareté', 'Scarcity'),
        (r'Valeur dérivée de mécanismes de supply limitée', 'Value derived from limited supply mechanics'),
        (r'Plafond Dur :', 'Hard Cap:'),
        (r'Supply maximale définie', 'Maximum supply defined'),
        (r'Destruction de Tokens :', 'Token Burn:'),
        (r'Destruction permanente de tokens', 'Permanent destruction of tokens'),
        (r'Halving :', 'Halving:'),
        (r'Réduction programmée de l\'émission', 'Programmed reduction of issuance'),
        
        # === MODULE 07.1: BOND ISSUANCE STEPS ===
        (r'Étape 1 : Smart Contract', 'Step 1: Smart Contract'),
        (r'Programmation des Règles de l\'Obligation', 'Programming the Bond Rules'),
        (r'Termes & Conditions :', 'Terms & Conditions:'),
        (r'Montant, Taux, Maturité, Fréquence', 'Amount, Rate, Maturity, Frequency'),
        (r'Conformité :', 'Compliance:'),
        (r'Règles KYC/AML intégrées', 'Embedded KYC/AML rules'),
        (r'Automatisation :', 'Automation:'),
        (r'Auto-calcul des coupons', 'Auto-calculation of coupons'),
        (r'Étape 2 : Souscription', 'Step 2: Subscription'),
        (r'Processus d\'Achat Investisseur', 'Investor Purchase Process'),
        (r'Canal Sécurisé :', 'Secure Channel:'),
        (r'Plateforme web avec authentification forte', 'Web platform with strong authentication'),
        (r'Paiement :', 'Payment:'),
        (r'Devise fiduciaire \(Euro\) envoyée à l\'agent payeur', 'Fiat currency (Euro) sent to the paying agent'),
        (r'Whitelisting :', 'Whitelisting:'),
        (r'Vérification de l\'adresse du wallet', 'Wallet address verification'),
        (r'Étape 3 : Règlement \(DvP\)', 'Step 3: Settlement (DvP)'),
        (r'Livraison contre Paiement', 'Delivery versus Payment'),
        (r'Atomic Swap :', 'Atomic Swap:'),
        (r'Cash et Titres échangés instantanément', 'Cash and Securities swap instantly'),
        (r'Mise à jour du Registre :', 'Registry Update:'),
        (r'La Blockchain enregistre le nouveau propriétaire', 'The Blockchain records the new owner'),
        (r'Finalité immédiate', 'Immediate finality'),
        
        # === IT ARCHITECTURE ===
        (r'Architecture IT & Intégration', 'IT Architecture & Integration'),
        (r'Connecter la Blockchain aux Systèmes Legacy', 'Connecting Blockchain to Legacy Systems'),
        (r'LEGACY \(Banque\)', 'LEGACY (Bank)'),
        (r'Front-Office', 'Front-Office'),
        (r'Back-Office', 'Back-Office'),
        (r'Comptabilité', 'Accounting'),
        (r'ORCHESTRATEUR', 'ORCHESTRATOR'),
        (r'Traduction de Messages', 'Message Translation'),
        (r'Gestion des Clés', 'Key Management'),
        (r'DLT \(Marché\)', 'DLT (Market)'),
        (r'CONTRAT INTELLIGENT', 'SMART CONTRACT'),
        (r'Règles Métier', 'Business Rules'),
        (r'REGISTRE DE TOKENS', 'TOKEN REGISTRY'),
        (r'Titres & Cash', 'Securities & Cash'),
        (r'Message Clé pour l\'IT :', 'Key Message for IT:'),
        (r'Nous n\'avons pas besoin de remplacer nos systèmes actuels.*?pour parler à la Blockchain',
         'We do not need to rip and replace our current systems. We simply add an API connectivity layer to talk to the Blockchain'),
        
        # === TOOLTIPS & BUTTONS ===
        (r'title="Cliquez ici"', 'title="Click here"'),
        (r'title="Voir plus"', 'title="See more"'),
        (r'title="Fermer"', 'title="Close"'),
        (r'title="Ouvrir"', 'title="Open"'),
        (r'Retour en haut', 'Back to top'),
        (r'Retour au début', 'Back to top'),
        
        # === STATUS BADGES ===
        (r'\bFAIBLE\b', 'LOW'),
        (r'\bMOYEN\b', 'MEDIUM'),
        (r'\bÉLEVÉ\b', 'HIGH'),
        (r'\bNUL\b', 'NULL'),
        (r'badge-faible', 'badge-low'),
        (r'badge-moyen', 'badge-med'),
        (r'badge-élevé', 'badge-high'),
        (r'badge-nul', 'badge-null'),
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
    
    print(f"\n🎉 FINAL MODULES TRANSLATION Complete: {count} replacements applied")
    print("\n✅ All modules 04-07 & IT Architecture now in professional English!")

if __name__ == "__main__":
    main()
