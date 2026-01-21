#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de traduction SNAP LIST (Corrections demandées par l'utilisateur)
Cible : ROI Simulator, Plan d'action, Risques détails, Headers manquants.
"""

import re

def main():
    print("🚀 Démarrage du SNAG LIST FIX (Derniers détails)...")
    try:
        with open('index_en.html', 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        print("❌ Erreur lecture fichier")
        return

    replacements = [
        # === ROI SIMULATOR ===
        (r'Simulateur de ROI', 'ROI Simulator'),
        (r'Calculez vos économies opérationnelles', 'Calculate your operational savings'),
        (r'Paramètres d\'Émission', 'Issuance Parameters'),
        (r'Volume d\'Émission \(€\)', 'Issuance Volume (€)'),
        (r'Durée \(Années\)', 'Duration (Years)'),
        (r'5 ans', '5 years'),
        (r'Coûts Actuels \(bps/an\)', 'Current Costs (bps/yr)'),
        (r'Hypothèses', 'Assumptions'),
        (r'Réduction de 40% des frais de custody', '40% reduction in custody fees'),
        (r'Réduction de 80% des frais d\'agent payeur', '80% reduction in paying agent fees'),
        (r'Automatisation via Smart Contract', 'Automation via Smart Contract'),
        (r'Calculer le ROI', 'Calculate ROI'),
        (r'Résultats Estimés', 'Estimated Results'),
        (r'Économie Totale :', 'Total Savings:'),
        (r'Nouveau Coût :', 'New Cost:'),
        (r'Gain de Marge :', 'Margin Gain:'),

        # === HEADERS & SECTIONS ===
        (r'Le Langage de la Blockchain', 'The Blockchain Language'),
        (r'Bibliothèque & Sources Officielles', 'Library & Official Sources'),
        (r'Bibliothèque & Sources', 'Library & Sources'),
        (r'Accédez aux textes de loi et rapports institutionnels', 'Access laws and institutional reports'),
        (r'Les documents de référence pour approfondir', 'Reference documents for deep dive'),
        (r'L\'Ecosystem des Acteurs', 'Actor Ecosystem'),
        (r'La chaîne de valeur complète', 'The complete value chain'),
        (r'Use Cases Concrètes', 'Concrete Use Cases'),
        (r'La blockchain transforme de nombreux secteurs', 'Blockchain transforms many sectors'),
        (r'Les Benefits de la Blockchain', 'The Benefits of Blockchain'),
        (r'Pourquoi cette technologie transforme la finance', 'Why this technology transforms finance'),
        (r'Plan d\'Action : Lancer un PILOT Bancaire', 'Action Plan: Launch a Banking PILOT'),
        (r'Feuille de route pour une émission inaugurale \(6 mois\)', 'Roadmap for an inaugural issuance (6 months)'),
        (r'Compliance & Regulation', 'Compliance & Regulation'),
        (r'AML/KYC : Plus sûr que le système Traditional', 'AML/KYC: Safer than the Traditional system'),
        (r'Outlook 2026 : Le Pivot Stratégique', 'Outlook 2026: The Strategic Pivot'),
        (r'Les Catalyseurs de l\'Industrialisation', 'Catalysts for Industrialization'),
        (r'Architecture IT & Integration', 'IT Architecture & Integration'),
        (r'Comment connecter la Blockchain à notre "Legacy" \?', 'How to connect Blockchain to our "Legacy"?'),
        (r'Blockchain & Données ESG', 'Blockchain & ESG Data'),

        # === RISK MANAGEMENT DESCRIPTIONS (DETAILS) ===
        # Credit Risk
        (r'Le sous-jacent \(Dette Siemens/Natixis\) reste inchangé\. La notation AAA est maintenue par Moody\'s\.', 
         'The underlying (Siemens/Natixis Debt) remains unchanged. AAA rating is maintained by Moody\'s.'),
        # Settlement Risk
        (r'Grâce au modèle DvP Atomique \(T\+0\), le risque principal \(défaut de livraison\) disparaît totalement\.', 
         'Thanks to the Atomic DvP (T+0) model, the principal risk (delivery default) disappears completely.'),
        # Legal Risk
        (r'Le cadre est clair en DE/FR \(eWpG\), mais l\'Interoperability transfrontalière reste complexe juridiquement\.', 
         'The framework is clear in DE/FR (eWpG), but cross-border Interoperability remains legally complex.'),
        # Liquidity Risk
        (r'C\'est le point noir\. Les marchés secondaires sont encore FRAGMENTEDs\. Difficile de revendre de gros blocs rapidement sans décote\.', 
         'This is the main pain point. Secondary markets are still FRAGMENTED. Difficult to resell large blocks quickly without a discount.'),
        
        # === MISC FIXES ===
        (r'RISK MANAGEMENT', 'RISK MANAGEMENT'), # Deja bon mais pour check
        (r'Low', 'Low'), 
        (r'Medium', 'Medium'),
        (r'High', 'High'),
        (r'NULL', 'NULL'),
    ]

    count = 0
    content_modified = content
    for pattern, replacement in replacements:
        # Utilisation de re.sub avec ignore case
        new_content = re.sub(pattern, replacement, content_modified, flags=re.DOTALL | re.IGNORECASE)
        
        # Simple string replace fallback si regex fail a cause des caractères speciaux
        if new_content == content_modified:
             # Nettoyage pattern pour mode simple (enlever backslashes de regex)
             simple_pattern = pattern.replace(r'\(', '(').replace(r'\)', ')').replace(r'\.', '.').replace(r'\?', '?')
             if simple_pattern in content_modified:
                 new_content = content_modified.replace(simple_pattern, replacement)

        if new_content != content_modified:
            content_modified = new_content
            count += 1
            print(f"✅ Corrigé : {replacement[:40]}...") 
    
    with open('index_en.html', 'w', encoding='utf-8') as f:
        f.write(content_modified)
    
    print(f"\n🎉 SNAG LIST FIX terminé : {count} blocs corrigés.")

if __name__ == "__main__":
    main()
