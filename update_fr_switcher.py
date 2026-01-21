#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour remplacer le sélecteur JavaScript par des liens HTML dans index-simple.html
"""

def main():
    print("📖 Lecture de index-simple.html...")
    with open('index-simple.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("🔧 Remplacement du sélecteur de langue...")
    
    # Ancien sélecteur JavaScript
    old_switcher = '''            <!-- LANGUAGE SWITCHER -->
            <div class="lang-switch">
                <button class="lang-btn active" onclick="setLanguage('fr')" title="Français">🇫🇷</button>
                <button class="lang-btn" onclick="setLanguage('en')" title="English">🇬🇧</button>
            </div>'''
    
    # Nouveau sélecteur HTML
    new_switcher = '''            <!-- LANGUAGE SWITCHER -->
            <div class="lang-switch">
                <a href="index-simple.html" class="lang-btn active" title="Français">🇫🇷</a>
                <a href="index-simple_en.html" class="lang-btn" title="English">🇬🇧</a>
            </div>'''
    
    content = content.replace(old_switcher, new_switcher)
    
    print("💾 Sauvegarde de index-simple.html...")
    with open('index-simple.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Sélecteur de langue mis à jour!")
    print("\n📊 Résultat:")
    print("   - index-simple.html (FR) → pointe vers index-simple_en.html")
    print("   - index-simple_en.html (EN) → pointe vers index-simple.html")
    print("\n🎉 Boucle parfaite entre les langues!")

if __name__ == "__main__":
    main()
