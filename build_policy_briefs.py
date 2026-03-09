import os
import re

# Read the HTML templates
with open('policy-briefs/index.html', 'r', encoding='utf-8') as f:
    en_index = f.read()

with open('policy-briefs/index-fr.html', 'r', encoding='utf-8') as f:
    fr_index = f.read()

with open('policy-briefs/pb-001-template.html', 'r', encoding='utf-8') as f:
    en_pb = f.read()

with open('policy-briefs/pb-001-template-fr.html', 'r', encoding='utf-8') as f:
    fr_pb = f.read()

# Define standardized components
nav_en = """    <nav class="navbar-pro">
        <a class="nav-brand" href="../../index.html">
            <div class="logo-orb"></div>
            <div class="logo-text">DCM <span>Core Institute</span></div>
        </a>
        <div class="nav-actions">
            <div class="lang-switcher">
                <a href="../../fr/policy-briefs/index.html" class="lang-link">FR</a>
                <a href="../../en/policy-briefs/index.html" class="lang-link active">EN</a>
            </div>
            <a href="../../en/login.html" class="auth-btn">Auth</a>
            <button class="connect-btn">Connect</button>
        </div>
    </nav>"""

nav_fr = """    <nav class="navbar-pro">
        <a class="nav-brand" href="../../index.html">
            <div class="logo-orb"></div>
            <div class="logo-text">DCM <span>Core Institut</span></div>
        </a>
        <div class="nav-actions">
            <div class="lang-switcher">
                <a href="../../fr/policy-briefs/index.html" class="lang-link active">FR</a>
                <a href="../../en/policy-briefs/index.html" class="lang-link">EN</a>
            </div>
            <a href="../../fr/login.html" class="auth-btn">Auth</a>
            <button class="connect-btn">Connecter</button>
        </div>
    </nav>"""

footer_en = """    <footer class="super-footer">
        <div class="footer-content">
            <div class="footer-bottom">
                <div class="copyright">© 2026 DCM Core Institute</div>
                <div class="legal-links">
                    <a href="../../en/about/index.html">Research Independence</a>
                    <a href="../../en/about/index.html">Contact Unit</a>
                </div>
            </div>
        </div>
    </footer>"""

footer_fr = """    <footer class="super-footer">
        <div class="footer-content">
            <div class="footer-bottom">
                <div class="copyright">© 2026 DCM Core Institut</div>
                <div class="legal-links">
                    <a href="../../fr/about/index.html">Indépendance de la Recherche</a>
                    <a href="../../fr/about/index.html">Contacter l'Unité</a>
                </div>
            </div>
        </div>
    </footer>"""

def fix_links(html, is_fr):
    # Fix CSS links
    html = html.replace('../fr/styles.css', '../../styles.css')
    html = html.replace('../fr/styles-megamenu.css', '../../styles-megamenu.css')
    html = html.replace('../fr/styles-footer.css', '../../styles-footer.css')
    # Use standard nav and footer
    html = re.sub(r'<nav class="navbar-pro">.*?</nav>', nav_fr if is_fr else nav_en, html, flags=re.DOTALL)
    html = re.sub(r'<footer class="super-footer">.*?</footer>', footer_fr if is_fr else footer_en, html, flags=re.DOTALL)
    
    # Fix internal links (very basic substitution)
    html = html.replace('../research-papers', '../../en/research-papers')
    html = html.replace('../observatory', '../../en/observatory')
    
    return html

en_index_fixed = fix_links(en_index, False)
fr_index_fixed = fix_links(fr_index, True)

# Create output dirs
os.makedirs('en/policy-briefs', exist_ok=True)
os.makedirs('fr/policy-briefs', exist_ok=True)

with open('en/policy-briefs/index.html', 'w', encoding='utf-8') as f:
    f.write(en_index_fixed)
with open('fr/policy-briefs/index.html', 'w', encoding='utf-8') as f:
    f.write(fr_index_fixed)

# Now generate PB pages
pb_meta = [
    ('04', 'Implementing DORA: Operational Resilience Standards', 'Mise en œuvre de DORA : Normes de résilience opérationnelle'),
    ('03', 'Offline CBDC Portability: Assessing the Risk Matrix', 'Portabilité des MNBC hors ligne : Évaluation de la matrice de risque'),
    ('02', 'Synthetic Stablecoins & Global Systemic Risk', 'Stablecoins synthétiques & Risque systémique mondial'),
    ('01', 'MiCA Phase 2: Transitional Provisions for CASPs', 'MiCA Phase 2 : Dispositions transitoires pour les CASP')
]

for pb_id, title_en, title_fr in pb_meta:
    # EN version
    html_en = en_pb.replace('PB-2026-01', f'PB-2026-{pb_id}')
    html_en = html_en.replace('Prudential Standards for Fiat-Referenced Stablecoins Under MiCA framework', title_en)
    # Add nav and footer to PB template
    html_en = html_en.replace('<body>', f'<body>\n{nav_en}')
    html_en = html_en.replace('</body>', f'{footer_en}\n</body>')
    html_en = html_en.replace('../../styles.css', '../../styles.css') # Add CSS links
    # Actually PB template has missing CSS links, let's inject them in head
    css_links = """    <link href="../../styles.css" rel="stylesheet" />
    <link href="../../styles-megamenu.css" rel="stylesheet" />
    <link href="../../styles-footer.css" rel="stylesheet" />"""
    html_en = html_en.replace('<!-- Font Awesome -->', f'{css_links}\n    <!-- Font Awesome -->')
    html_en = html_en.replace('href="index.html"', 'href="index.html" class="auth-btn"')
    
    # FR version
    html_fr = fr_pb.replace('PB-2026-01', f'PB-2026-{pb_id}')
    html_fr = html_fr.replace('Normes prudentielles pour les stablecoins se référant à des monnaies fiduciaires sous le cadre MiCA', title_fr)
    html_fr = html_fr.replace('<body>', f'<body>\n{nav_fr}')
    html_fr = html_fr.replace('</body>', f'{footer_fr}\n</body>')
    html_fr = html_fr.replace('<!-- Font Awesome -->', f'{css_links}\n    <!-- Font Awesome -->')
    
    with open(f'en/policy-briefs/pb-2026-{pb_id}.html', 'w', encoding='utf-8') as f:
        f.write(html_en)
    with open(f'fr/policy-briefs/pb-2026-{pb_id}.html', 'w', encoding='utf-8') as f:
        f.write(html_fr)

print("Policy Briefs generated.")
