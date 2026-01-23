#!/usr/bin/env python3
"""
Script to apply unified super footer to remaining pages
"""

import re

# Super footer HTML template
SUPER_FOOTER = '''
    <!-- SUPER FOOTER DE NAVIGATION -->
    <div id="contact" class="footer-contact" style="padding: 60px 40px; background: #0b1121; border-top: 1px solid #334155;">
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; max-width: 1200px; margin: 0 auto; text-align: left;">
            
            <!-- COLONNE 1 : MARQUE -->
            <div>
                <div style="font-weight: 800; font-size: 20px; color: white; margin-bottom: 20px;">
                    DCM <span style="color:#3b82f6">DIGITAL</span>
                </div>
                <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
                    Plateforme stratégique interne dédiée à l'acculturation et l'opérationnalisation des actifs numériques.
                </p>
            </div>

            <!-- COLONNE 2 : PLAN DU SITE -->
            <div>
                <strong style="color: white; display: block; margin-bottom: 20px;">EXPLORER</strong>
                <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; color: #cbd5e1;">
                    <li style="margin-bottom: 10px;"><a href="index.html" style="color: inherit; text-decoration: none;">🏠 Accueil Expert</a></li>
                    <li style="margin-bottom: 10px;"><a href="simple.html" style="color: inherit; text-decoration: none;">🎓 Academy (Débutant)</a></li>
                    <li style="margin-bottom: 10px;"><a href="web3.html" style="color: inherit; text-decoration: none;">🌐 Web3 Banking</a></li>
                    <li style="margin-bottom: 10px;"><a href="flux-comparison.html" style="color: inherit; text-decoration: none;">⚡ Flux & Opérations</a></li>
                    <li style="margin-bottom: 10px;"><a href="quiz.html" style="color: inherit; text-decoration: none;">🏆 Certification Quiz</a></li>
                </ul>
            </div>

            <!-- COLONNE 3 : CONTACT -->
            <div>
                <strong style="color: white; display: block; margin-bottom: 20px;">CONTACT EXPERT</strong>
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div style="width: 40px; height: 40px; background: #1e293b; border-radius: 50%; display: grid; place-items: center; border: 1px solid #3b82f6;">
                        <i class="fa-solid fa-user-tie" style="color: #3b82f6;"></i>
                    </div>
                    <div>
                        <span style="display: block; color: white; font-weight: bold;">Joan Lyczak</span>
                        <a href="https://www.linkedin.com/in/joan-lyczak/" target="_blank" style="color: #94a3b8; font-size: 12px; text-decoration: none;">LinkedIn Profile ↗</a>
                    </div>
                </div>
            </div>

        </div>

        <div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; font-size: 12px; color: #64748b;">
            <p>INTERNAL USE ONLY • © 2026 Digital Debt Capital Markets • v2.4 (Production)</p>
        </div>
    </div>
'''

def apply_footer(filepath):
    """Apply super footer to a file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find and replace footer section
    # Pattern: from <!-- FOOTER or <footer to <!-- DISCLAIMER
    pattern = r'(<!-- FOOTER.*?</footer>|<footer.*?</footer>)'
    
    if re.search(pattern, content, re.DOTALL):
        content = re.sub(pattern, SUPER_FOOTER, content, flags=re.DOTALL)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Applied super footer to {filepath}")
        return True
    else:
        print(f"⚠️ No footer found in {filepath}")
        return False

# Apply to remaining pages
files = [
    'simple.html',
    'flux-comparison.html', 
    'index-simple.html'
]

for file in files:
    apply_footer(file)

print("\n✅ Super footer application complete!")
