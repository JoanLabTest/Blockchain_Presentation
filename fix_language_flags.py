#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour corriger les drapeaux de langue dans les deux versions
"""

def fix_language_switcher():
    print("🔧 Correction des sélecteurs de langue...")
    
    # 1. Corriger la version FR
    print("\n📝 Version FR (index-simple.html)...")
    with open('index-simple.html', 'r', encoding='utf-8') as f:
        fr_content = f.read()
    
    # Dans la version FR, le drapeau FR doit être actif et pointer vers lui-même
    # Le drapeau EN doit pointer vers index-simple_en.html
    fr_switcher_old = '''            <!-- LANGUAGE SWITCHER -->
            <div class="lang-switch">
                <a href="index-simple.html" class="lang-btn active" title="Français">🇫🇷</a>
                <a href="index-simple_en.html" class="lang-btn" title="English">🇬🇧</a>
            </div>'''
    
    # Vérifier si c'est déjà correct
    if fr_switcher_old in fr_content:
        print("   ✅ Version FR déjà correcte")
    else:
        print("   ⚠️ Version FR nécessite une correction")
        # Essayer de trouver et corriger
        fr_content = fr_content.replace(
            '<a href="index-simple.html" class="lang-btn" title="Français">🇫🇷</a>',
            '<a href="index-simple.html" class="lang-btn active" title="Français">🇫🇷</a>'
        )
        fr_content = fr_content.replace(
            '<a href="index-simple_en.html" class="lang-btn active" title="English">🇬🇧</a>',
            '<a href="index-simple_en.html" class="lang-btn" title="English">🇬🇧</a>'
        )
    
    with open('index-simple.html', 'w', encoding='utf-8') as f:
        f.write(fr_content)
    
    # 2. Corriger la version EN
    print("\n📝 Version EN (index-simple_en.html)...")
    with open('index-simple_en.html', 'r', encoding='utf-8') as f:
        en_content = f.read()
    
    # Dans la version EN, le drapeau EN doit être actif
    # Le drapeau FR doit pointer vers index-simple.html
    en_switcher_correct = '''            <!-- LANGUAGE SWITCHER -->
            <div class="lang-switch">
                <a href="index-simple.html" class="lang-btn" title="Français">🇫🇷</a>
                <a href="index-simple_en.html" class="lang-btn active" title="English">🇬🇧</a>
            </div>'''
    
    # Remplacer le mauvais sélecteur
    en_switcher_wrong = '''            <!-- LANGUAGE SWITCHER -->
            <div class="lang-switch">
                <a href="index-simple.html" class="lang-btn active" title="Français">🇫🇷</a>
                <a href="index-simple_en.html" class="lang-btn" title="English">🇬🇧</a>
            </div>'''
    
    if en_switcher_wrong in en_content:
        print("   🔧 Correction du sélecteur EN...")
        en_content = en_content.replace(en_switcher_wrong, en_switcher_correct)
    elif en_switcher_correct in en_content:
        print("   ✅ Version EN déjà correcte")
    else:
        print("   ⚠️ Sélecteur EN non trouvé, correction manuelle...")
        # Correction manuelle
        en_content = en_content.replace(
            '<a href="index-simple.html" class="lang-btn active" title="Français">🇫🇷</a>',
            '<a href="index-simple.html" class="lang-btn" title="Français">🇫🇷</a>'
        )
        en_content = en_content.replace(
            '<a href="index-simple_en.html" class="lang-btn" title="English">🇬🇧</a>',
            '<a href="index-simple_en.html" class="lang-btn active" title="English">🇬🇧</a>'
        )
    
    with open('index-simple_en.html', 'w', encoding='utf-8') as f:
        f.write(en_content)
    
    print("\n✅ Correction terminée!")
    print("\n📊 Résultat:")
    print("   🇫🇷 FR: Drapeau FR actif, clic sur 🇬🇧 → index-simple_en.html")
    print("   🇬🇧 EN: Drapeau EN actif, clic sur 🇫🇷 → index-simple.html")
    print("\n🎯 Navigation fluide et professionnelle établie!")

if __name__ == "__main__":
    fix_language_switcher()
