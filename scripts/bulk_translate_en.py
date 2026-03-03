#!/usr/bin/env python3
import os
import re

EN_DIR = '/Users/joanl/blockchain-presentation/en'

# Extended replacement list
REPLACEMENTS = [
    # Top level
    (r'Essais de Règlement ECB DLT', 'ECB DLT Settlement Trials'),
    (r'Cas d\'Usage Institutionnels Européens', 'European Institutional Use Cases'),
    (r'Les obligations numériques ne sont plus des pilotes isolés', 'Digital bonds are no longer isolated pilots'),
    (r'L\'Eurosystème a intégré des plateformes DLT', 'The Eurosystem has integrated DLT platforms'),
    (r'Volume Émis', 'Issued Volume'),
    (r'Vitesse de Règlement', 'Settlement Speed'),
    (r'Monnaie Banque Centrale', 'Central Bank Money'),
    (r'Transactions DLT Réelles', 'Real DLT Transactions'),
    
    # Tombstones
    (r'Intégration Registre On-chain', 'On-chain Registry Integration'),
    (r'Certificat Trustee uploadé on-chain', 'Trustee Certificate uploaded on-chain'),
    (r'Paiements synchronisés via DLT', 'DLT-synchronized payments'),
    (r'Exécuté dans les essais BCE', 'Executed in ECB trials'),
    (r'Réglé via Trigger Solution', 'Settled via Trigger Solution'),
    (r'Vraie synchronisation T\+0 actif/cash', 'True T+0 asset/cash synchronization'),
    (r'Validation Cover pool prouvée', 'Proven Cover pool validation'),
    (r'Validation stratégique pour couche intelligence DCM', 'Strategic validation for DCM intelligence layer'),
    
    # Infrastructure
    (r'Architecture Synchronisée', 'Synchronized Architecture'),
    (r'Passage du traditionnel Free of Payment', 'Transition from traditional Free of Payment'),
    (r'Échange simultané d\'actifs et d\'espèces', 'Simultaneous exchange of assets and cash'),
    (r'Réseau SWIAT', 'SWIAT Network'),
    (r'Obligations Tokenisées & Registre', 'Tokenized Bonds & Registry'),
    (r'Garantie algorithmique', 'Algorithmic guarantee'),
    
    # Operational Model
    (r'Modèle Opérationnel \(eWpG\)', 'Operational Model (eWpG)'),
    (r'La tokenisation institutionnelle n\'élimine pas les rôles essentiels', 'Institutional tokenization does not eliminate essential roles'),
    (r'Émetteur', 'Issuer'),
    (r'Op\. de Noeud Loc\.', 'Local Node Operator'),
    (r'Coord\. Réseau SWIAT', 'SWIAT Network Coordinator'),
    (r'Dépositaire \(Custodian\)', 'Custodian'),
    (r'Agent Payeur', 'Paying Agent'),
    
    # Network & Specific Pages
    (r'Infra DLT permissionnée utilisée par les institutions', 'Permissioned DLT infra used by institutions'),
    (r'émettre et régler des actifs tokenisés', 'issue and settle tokenized assets'),
    (r'La Mission de SWIAT', 'SWIAT\'s Mission'),
    (r'Apporter les avantages de l\'automatisation DLT', 'Bring the benefits of DLT automation'),
    (r'Réseau Permissionné Bancaire', 'Banking Permissioned Network'),
    (r'Règlement DvP On-Chain', 'On-Chain DvP Settlement'),
    (r'Conformité eWpG Native', 'Native eWpG Compliance'),
    (r'Statut Juridique & Gouvernance', 'Legal Status & Governance'),
    (r'Qui contrôle le réseau \?', 'Who controls the network?'),
    (r'Type de Réseau', 'Network Type'),
    (r'Accès Validateurs', 'Validator Access'),
    (r'Interaction Eurosystème', 'Eurosystem Interaction'),
    (r'Tableau Comparatif', 'Comparison Table'),
    (r'Modèle Opérationnel & Acteurs', 'Operational Model & Actors'),
    (r'Adoption & Cas d\'Usage', 'Adoption & Use Cases'),
    (r'Définit les conditions', 'Defines the conditions'),
    (r'Gère un nœud blockchain', 'Manages a blockchain node'),
    (r'Détient les clés privées', 'Holds private keys'),
    
    # Common UI
    (r'Voir l\'Architecture', 'View Architecture'),
    (r'Essais BCE', 'ECB Trials'),
    (r'Hub Central', 'Central Hub'),
    (r'Cycle de Vie', 'Lifecycle'),
    (r'Comparateur Flux', 'Flux Comparator'),
    (r'Régime Pilote \(UE\)', 'Pilot Regime (EU)'),
    (r'À propos', 'About'),
    (r'Site Corporate', 'Corporate Site'),
    (r'Mentions Légales', 'Legal Mentions'),
    (r'Politique de Confidentialité', 'Privacy Policy'),
    (r'Conditions d\'Utilisation', 'Terms of Use'),
    (r'Politique Cookies', 'Cookie Policy'),
    (r'Tous droits réservés', 'All rights reserved'),
    (r'Plateforme d’analyse dédiée', 'Analysis platform dedicated'),
]

def translate_file(filepath):
    print(f"Translating {os.path.basename(filepath)}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = content
    for pattern, replacement in REPLACEMENTS:
        modified = re.sub(pattern, replacement, modified, flags=re.IGNORECASE)
        
    if modified != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(modified)
        return True
    return False

def main():
    for root, dirs, files in os.walk(EN_DIR):
        for f in files:
            if f.endswith('.html'):
                translate_file(os.path.join(root, f))

if __name__ == "__main__":
    main()
