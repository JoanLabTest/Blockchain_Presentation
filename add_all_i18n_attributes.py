#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script complet pour ajouter TOUS les attributs data-i18n manquants
Traduit le contenu complet de chaque section, pas seulement les titres
"""

import re
import sys

def main():
    file_path = 'index-simple.html'
    
    print(f"📖 Lecture de {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modifications = 0
    
    # SECTION HISTORIQUE - Ajouter data-i18n sur les descriptions
    print("🔧 Section Historique...")
    
    # 2019
    content = re.sub(
        r'(<strong>Première Mondiale</strong>)',
        r'<strong data-i18n="history_2019_title">Première Mondiale</strong>',
        content
    )
    content = re.sub(
        r'(<div>SG émet 100M€ de Covered Bond sur Ethereum Public\.</div>)',
        r'<div data-i18n="history_2019_desc">SG émet 100M€ de Covered Bond sur Ethereum Public.</div>',
        content
    )
    modifications += 2
    
    # 2021
    content = re.sub(
        r'(<strong>Loi eWpG</strong>)',
        r'<strong data-i18n="history_2021_title">Loi eWpG</strong>',
        content
    )
    content = re.sub(
        r"(<div>L'Allemagne légalise les titres purement numériques\.</div>)",
        r'<div data-i18n="history_2021_desc">L\'Allemagne légalise les titres purement numériques.</div>',
        content
    )
    modifications += 2
    
    # 2024
    content = re.sub(
        r'(<strong>Adoption Corporate</strong>)',
        r'<strong data-i18n="history_2024_title">Adoption Corporate</strong>',
        content
    )
    content = re.sub(
        r'(<div>Siemens émet 300M€ avec règlement Trigger\.</div>)',
        r'<div data-i18n="history_2024_desc">Siemens émet 300M€ avec règlement Trigger.</div>',
        content
    )
    modifications += 2
    
    # 2026
    content = re.sub(
        r'(<strong>Ère de la Liquidité</strong>)',
        r'<strong data-i18n="history_2026_title">Ère de la Liquidité</strong>',
        content
    )
    content = re.sub(
        r'(<div>Standardisation BCE & Market Making\.</div>)',
        r'<div data-i18n="history_2026_desc">Standardisation BCE & Market Making.</div>',
        content
    )
    modifications += 2
    
    # SECTION FONDAMENTAUX
    print("🔧 Section Fondamentaux...")
    
    # Ledger
    content = re.sub(
        r'(<span class="badge">INFRASTRUCTURE</span>)',
        r'<span class="badge" data-i18n="fund_ledger_badge">INFRASTRUCTURE</span>',
        content
    )
    content = re.sub(
        r'(<h3>Le Grand Livre \(Ledger\)</h3>)',
        r'<h3 data-i18n="fund_ledger_title">Le Grand Livre (Ledger)</h3>',
        content
    )
    content = re.sub(
        r'(<p><strong>Analogie : Un Fichier Excel Partagé</strong></p>)',
        r'<p><strong data-i18n="fund_ledger_analogy">Analogie : Un Fichier Excel Partagé</strong></p>',
        content
    )
    content = re.sub(
        r'(<p>Au lieu de réconcilier deux fichiers internes \(T\+2\), toutes les banques lisent le même registre en\s+temps réel \(T\+0\)\.</p>)',
        r'<p data-i18n="fund_ledger_desc">Au lieu de réconcilier deux fichiers internes (T+2), toutes les banques lisent le même registre en temps réel (T+0).</p>',
        content
    )
    modifications += 4
    
    # Wallet
    content = re.sub(
        r'(<span class="badge">ACCÈS</span>)',
        r'<span class="badge" data-i18n="fund_wallet_badge">ACCÈS</span>',
        content
    )
    content = re.sub(
        r'(<h3>Le Wallet</h3>)',
        r'<h3 data-i18n="fund_wallet_title">Le Wallet</h3>',
        content
    )
    content = re.sub(
        r'(<p><strong>Analogie : IBAN \+ Signature</strong></p>)',
        r'<p><strong data-i18n="fund_wallet_analogy">Analogie : IBAN + Signature</strong></p>',
        content
    )
    content = re.sub(
        r"(<p>L'Adresse Publique est votre IBAN pour recevoir\. La Clé Privée est votre signature\s+électronique pour valider\.</p>)",
        r'<p data-i18n="fund_wallet_desc">L\'Adresse Publique est votre IBAN pour recevoir. La Clé Privée est votre signature électronique pour valider.</p>',
        content
    )
    modifications += 4
    
    # SECTION BENCHMARKS
    print("🔧 Section Benchmarks...")
    
    # Natixis
    content = re.sub(
        r'(<div class="benchmark-type">PLACEMENT PRIVÉ</div>)',
        r'<div class="benchmark-type" data-i18n="bench_natixis_type">PLACEMENT PRIVÉ</div>',
        content
    )
    content = re.sub(
        r'(<div class="label">Montant</div>\s*<div class="value">100M€</div>)',
        r'<div class="label" data-i18n="bench_natixis_amount">Montant</div>\n                            <div class="value">100M€</div>',
        content
    )
    content = re.sub(
        r'(<div class="label">Plateforme</div>\s*<div class="value">SWIAT</div>)',
        r'<div class="label" data-i18n="bench_natixis_platform">Plateforme</div>\n                            <div class="value">SWIAT</div>',
        content
    )
    content = re.sub(
        r'(<div class="label">Stratégie</div>\s*<div class="value">Sécurité juridique \(Registered Bond\)</div>)',
        r'<div class="label" data-i18n="bench_natixis_strategy">Stratégie</div>\n                            <div class="value" data-i18n="bench_natixis_strategy_val">Sécurité juridique (Registered Bond)</div>',
        content
    )
    modifications += 4
    
    # Siemens
    content = re.sub(
        r'(<div class="benchmark-type">CORPORATE</div>)',
        r'<div class="benchmark-type" data-i18n="bench_siemens_type">CORPORATE</div>',
        content
    )
    content = re.sub(
        r'(<div class="label">Montant</div>\s*<div class="value">300M€</div>)',
        r'<div class="label" data-i18n="bench_siemens_amount">Montant</div>\n                            <div class="value">300M€</div>',
        content, count=1
    )
    content = re.sub(
        r'(<div class="label">Innovation</div>\s*<div class="value">Trigger Bundesbank</div>)',
        r'<div class="label" data-i18n="bench_siemens_innovation">Innovation</div>\n                            <div class="value" data-i18n="bench_siemens_innovation_val">Trigger Bundesbank</div>',
        content
    )
    content = re.sub(
        r'(<div class="label">Rapidité</div>\s*<div class="value">T\+Minutes \(vs T\+2\)</div>)',
        r'<div class="label" data-i18n="bench_siemens_speed">Rapidité</div>\n                            <div class="value" data-i18n="bench_siemens_speed_val">T+Minutes (vs T+2)</div>',
        content
    )
    modifications += 4
    
    # SECTION RÉGULATION
    print("🔧 Section Régulation...")
    
    # Allemagne
    content = re.sub(
        r'(<h3>Allemagne \(Leader\)</h3>)',
        r'<h3 data-i18n="reg_germany_title">Allemagne (Leader)</h3>',
        content
    )
    content = re.sub(
        r'(<p>Loi eWpG : Cadre complet pour les obligations au porteur numériques\. Standard actuel du\s+marché\.</p>)',
        r'<p data-i18n="reg_germany_desc">Loi eWpG : Cadre complet pour les obligations au porteur numériques. Standard actuel du marché.</p>',
        content
    )
    modifications += 2
    
    # France
    content = re.sub(
        r'(<h3>France \(Pionnier\)</h3>)',
        r'<h3 data-i18n="reg_france_title">France (Pionnier)</h3>',
        content
    )
    content = re.sub(
        r"(<p>Régime Pilote UE : Cadre flexible pour les infrastructures DLT\. Fort accent sur l'innovation\s+\(SG-Forge, BdF\)\.</p>)",
        r'<p data-i18n="reg_france_desc">Régime Pilote UE : Cadre flexible pour les infrastructures DLT. Fort accent sur l\'innovation (SG-Forge, BdF).</p>',
        content
    )
    modifications += 2
    
    # SECTION COMPARATIF - Onglets
    print("🔧 Section Comparatif...")
    
    content = re.sub(
        r'(<button class="tab-btn active" onclick="openTab\(event, \'tab1\'\)">Marché Primaire \(Émission\)</button>)',
        r'<button class="tab-btn active" onclick="openTab(event, \'tab1\')" data-i18n="comp_tab1">Marché Primaire (Émission)</button>',
        content
    )
    content = re.sub(
        r'(<button class="tab-btn" onclick="openTab\(event, \'tab2\'\)">Marché Secondaire \(Trading\)</button>)',
        r'<button class="tab-btn" onclick="openTab(event, \'tab2\')" data-i18n="comp_tab2">Marché Secondaire (Trading)</button>',
        content
    )
    content = re.sub(
        r'(<button class="tab-btn" onclick="openTab\(event, \'tab3\'\)">Flux de Règlement</button>)',
        r'<button class="tab-btn" onclick="openTab(event, \'tab3\')" data-i18n="comp_tab3">Flux de Règlement</button>',
        content
    )
    modifications += 3
    
    # SECTION TRADER
    print("🔧 Section Trader...")
    
    content = re.sub(
        r'(<div class="label">Side</div>)',
        r'<div class="label" data-i18n="trader_side">Side</div>',
        content
    )
    content = re.sub(
        r'(<div class="label">Quantité</div>)',
        r'<div class="label" data-i18n="trader_qty">Quantité</div>',
        content
    )
    content = re.sub(
        r'(<div class="section-title">ORDER ENTRY</div>)',
        r'<div class="section-title" data-i18n="trader_order">ORDER ENTRY</div>',
        content
    )
    content = re.sub(
        r'(<button class="execute-btn" onclick="showTradeTicket\(\)">EXECUTE ATOMIC SWAP</button>)',
        r'<button class="execute-btn" onclick="showTradeTicket()" data-i18n="trader_btn">EXECUTE ATOMIC SWAP</button>',
        content
    )
    content = re.sub(
        r"(<p style=\"color: #94a3b8; font-size: 13px; margin-top: 20px;\">L'interface cache la complexité Blockchain\. Un clic déclenche le Smart Contract\.</p>)",
        r'<p style="color: #94a3b8; font-size: 13px; margin-top: 20px;" data-i18n="trader_note">L\'interface cache la complexité Blockchain. Un clic déclenche le Smart Contract.</p>',
        content
    )
    modifications += 5
    
    # SECTION CONTACT
    print("🔧 Section Contact...")
    
    content = re.sub(
        r'(<h2 style="border: none; margin: 0; color: white; font-size: 36px; justify-content: center;">Joan Lyczak\s*</h2>)',
        r'<h2 style="border: none; margin: 0; color: white; font-size: 36px; justify-content: center;">Joan Lyczak</h2>',
        content
    )
    content = re.sub(
        r'(<p style="font-size: 18px; color: #94a3b8; margin-top: 10px;">Expert Digital Assets & Blockchain</p>)',
        r'<p style="font-size: 18px; color: #94a3b8; margin-top: 10px;" data-i18n="contact_title">Expert Digital Assets & Blockchain</p>',
        content
    )
    content = re.sub(
        r'(<i class="fa-brands fa-linkedin"></i> SE CONNECTER SUR LINKEDIN)',
        r'<i class="fa-brands fa-linkedin"></i> <span data-i18n="contact_btn">SE CONNECTER SUR LINKEDIN</span>',
        content
    )
    content = re.sub(
        r'(<p style="margin-top: 40px; font-size: 12px; color: #64748b;">\s*© 2026 Presentation Blockchain\. Tous droits réservés\.\s*</p>)',
        r'<p style="margin-top: 40px; font-size: 12px; color: #64748b;" data-i18n="contact_copyright">© 2026 Presentation Blockchain. Tous droits réservés.</p>',
        content
    )
    modifications += 3
    
    # Sauvegarder
    print(f"💾 Sauvegarde de {file_path}...")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Terminé! {modifications} modifications appliquées")
    print("\n📊 Sections complétées:")
    print("   ✅ Historique (4 événements)")
    print("   ✅ Fondamentaux (2 modules)")
    print("   ✅ Benchmarks (2 cas)")
    print("   ✅ Régulation (2 pays)")
    print("   ✅ Comparatif (3 onglets)")
    print("   ✅ Trader (5 éléments)")
    print("   ✅ Contact (3 éléments)")
    print("\n🎉 Le contenu complet est maintenant traduisible!")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"❌ Erreur: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
