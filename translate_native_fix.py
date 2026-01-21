#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de traduction NATIVE SPEAKER (Corrections ciblées finales)
Remplace les blocs français restants par des versions natives parfaites.
"""

import re

def main():
    print("🚀 Démarrage du NATIVE SPEAKER FIX...")
    try:
        with open('index_en.html', 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Erreur lecture fichier: {e}")
        return

    # 1. Section 02 Intro
    # Pattern large pour attraper tout le bloc <p>...Cryptocurrencies sont...</p>
    pattern_02 = r'<p>\s*Cryptocurrencies sont des actifs numériques.*?décentralisés\.\s*</p>'
    replace_02 = """<p>
    Cryptocurrencies are digital assets that use cryptography to secure transactions and control the creation of new units. They operate on decentralized blockchain networks.
</p>"""
    
    # 2. Section 03 Title & Utility Token
    pattern_03_title = r'<h2>Les Token Types</h2>'
    replace_03_title = r'<h2>Token Types</h2>'
    
    # Remplacement du bloc Utility Tokens entier
    pattern_03_utility = r'<div class="card">\s*<span class="card-icon">🔑</span>\s*<h3>Utility Tokens</h3>.*?</div>'
    replace_03_utility = """<div class="card">
                <span class="card-icon">🔑</span>
                <h3>Utility Tokens</h3>
                <p><strong>Function:</strong> Provide access to specific services or features within a blockchain ecosystem.</p>
                <p><strong>Example:</strong> Tokens used to pay for transaction fees, access a decentralized storage platform, or use a specific app.</p>
            </div>"""

    # 3. Section 04 Intro & Benefits Title
    pattern_04_intro = r'<p>La Tokenization représente une révolution.*?finance moderne\.</p>'
    replace_04_intro = """<p>
    Tokenization represents a revolution in the digital representation of assets. This process allows virtually any real-world asset to be transformed into a digital token on a blockchain, opening infinite possibilities for modern finance.
</p>"""
    
    pattern_04_title = r'<h3>📊 Benefits Mesurables de la Tokenization</h3>'
    replace_04_title = r'<h3>📊 Measurable Benefits of Tokenization</h3>'

    # 4. Section 05 Utility List
    # On cible la liste spécifique dans la card tokenization-card utility
    # Attention, il y a deux "Utility Tokens" (Card et Tokenization Types)
    # Le user a demandé la liste "Utility" dans "Section 05: Token Power" (Alimentation)
    pattern_05_list = r'<ul>\s*<li>Payment of transaction fees on a blockchain</li>\s*<li>Access to a decentralized application</li>\s*<li>Utilisation d\'un protocole DeFi</li>\s*<li>Droit d\'utiliser une API ou service cloud décentralisé</li>\s*</ul>'
    replace_05_list = """<ul>
                    <li>Payment of transaction fees on a blockchain</li>
                    <li>Access to a decentralized application</li>
                    <li>Use of a DeFi protocol</li>
                    <li>Right to use an API or decentralized cloud service</li>
                </ul>"""

    # 5. Section 06 Lifecycle Intro
    pattern_06_intro = r'<p>Chaque token suit un Lifecycle structuré.*?projet blockchain\.\s*</p>'
    replace_06_intro = """<p>
    Every token follows a structured lifecycle, from its initial conception to its eventual extinction. Understanding these steps is essential to assess the viability and sustainability of a blockchain project.
</p>"""

    # 6. Section 07 Benchmarks
    # On remplace toute la grille benchmarks-grid pour être sûr
    # Je vais cibler morceau par morceau pour éviter des problèmes de regex massifs ou cibler le grand bloc
    # Le user a donné le code HTML du bloc entier.
    # Je vais remplacer le contenu interne des cartes existantes via des patterns spécifiques pour éviter de casser le layout CSS si les classes changent
    
    # NATIXIS
    natixis_pattern = r'<div class="benchmark-highlight">\s*<span class="highlight-label">Montant</span>\s*<span class="highlight-value">100 M€</span>\s*</div>\s*<ul class="benchmark-details">.*?</ul>'
    natixis_replace = """<div class="benchmark-highlight">
                        <span class="highlight-label">Amount</span>
                        <span class="highlight-value">€100m</span>
                    </div>

                    <ul class="benchmark-details">
                        <li><strong>Platform:</strong> SWIAT (Private)</li>
                        <li><strong>Type:</strong> Digital Covered Bond</li>
                        <li><strong>Strategy:</strong> Maximum Legal Certainty</li>
                    </ul>"""
    
    # SIEMENS
    siemens_pattern = r'<div class="benchmark-highlight">\s*<span class="highlight-label">Montant</span>\s*<span class="highlight-value">300 M€</span>\s*</div>\s*<ul class="benchmark-details">.*?</ul>'
    siemens_replace = """<div class="benchmark-highlight">
                        <span class="highlight-label">Amount</span>
                        <span class="highlight-value">€300m</span>
                    </div>

                    <ul class="benchmark-details">
                        <li><strong>Platform:</strong> Public Blockchain</li>
                        <li><strong>Type:</strong> Digital Corporate Bond</li>
                        <li><strong>Innovation:</strong> Bundesbank Trigger</li>
                    </ul>"""
    
    # SG
    sg_pattern = r'<div class="benchmark-highlight">\s*<span class="highlight-label">Montant</span>\s*<span class="highlight-value">20 M\$</span>\s*</div>\s*<ul class="benchmark-details">.*?</ul>'
    sg_replace = """<div class="benchmark-highlight">
                        <span class="highlight-label">Amount</span>
                        <span class="highlight-value">$20m</span>
                    </div>

                    <ul class="benchmark-details">
                        <li><strong>Platform:</strong> Canton Network</li>
                        <li><strong>Jurisdiction:</strong> United States</li>
                        <li><strong>Focus:</strong> Interoperability</li>
                    </ul>"""
    
    # Executing replacements
    
    replacements_list = [
        (pattern_02, replace_02),
        (pattern_03_title, replace_03_title),
        (pattern_03_utility, replace_03_utility),
        (pattern_04_intro, replace_04_intro),
        (pattern_04_title, replace_04_title),
        (pattern_05_list, replace_05_list),
        (pattern_06_intro, replace_06_intro),
        (natixis_pattern, natixis_replace),
        (siemens_pattern, siemens_replace),
        (sg_pattern, sg_replace),
    ]
    
    count = 0
    new_content = content
    
    for pat, rep in replacements_list:
        # re.DOTALL pour que . matche les newlines
        temp_content = re.sub(pat, rep, new_content, flags=re.DOTALL)
        if temp_content != new_content:
            new_content = temp_content
            count += 1
            print(f"✅ Remplacement effectué pour pattern: {pat[:50]}...")
        else:
             print(f"⚠️ Pattern NON TROUVÉ: {pat[:50]}...")

    if count > 0:
        with open('index_en.html', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"\n🎉 NATIVE SPEAKER FIX terminé : {count} corrections appliquées.")
    else:
        print("\n❌ Aucune correction appliquée.")

if __name__ == "__main__":
    main()
