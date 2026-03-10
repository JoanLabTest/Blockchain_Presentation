import os
import re

FR_NAVBAR_TEMPLATE = """    <nav class="navbar-pro">
        <a class="nav-brand" href="/fr/index.html">
            <div class="logo-orb"></div>
            <div class="logo-text">DCM <span>Core Institute</span></div>
        </a>

        <div class="nav-pillars">
            <!-- Dimension 1: Research Programs -->
            <div class="pillar-item">
                <a href="/fr/research-programs/index.html" class="pillar-link">Programmes de Recherche</a>
                <div class="mega-dropdown">
                    <div class="dropdown-header">Frameworks & Protocoles</div>
                    <a href="/fr/research/programmable-capital-markets/index.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-microchip" style="color:#3b82f6;"></i></div>
                        <div class="link-text"><span class="link-title">Programmable Capital Markets (PCM)</span><span
                                class="link-desc">Framework conceptuel & Architecture technique</span></div>
                    </a>
                    <a href="/fr/research/digital-debt-capital-markets/index.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-file-contract" style="color:#10b981;"></i></div>
                        <div class="link-text"><span class="link-title">Digital Debt Capital Markets (DDCM)</span><span
                                class="link-desc">Standardisation des émissions obligataires</span></div>
                    </a>
                    <a href="/fr/research/state-of-tokenization-2025.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-file-alt" style="color:#f59e0b;"></i></div>
                        <div class="link-text"><span class="link-title">State of Finance 2025</span><span
                                class="link-desc">Rapport annuel prospectif</span></div>
                    </a>
                </div>
            </div>

            <!-- Dimension 2: Ecosystem Maps -->
            <div class="pillar-item">
                <a href="#" class="pillar-link">Écosystème</a>
                <div class="mega-dropdown">
                    <div class="dropdown-header">Cartographie Mondiale</div>
                    <a href="/fr/research/ecosystem-map.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-project-diagram" style="color:#8b5cf6;"></i></div>
                        <div class="link-text"><span class="link-title">Institutional Framework Map</span><span
                                class="link-desc">Institutions, régulateurs & initiatives</span></div>
                    </a>
                    <a href="/fr/research/global-map.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-globe-europe" style="color:#6366f1;"></i></div>
                        <div class="link-text"><span class="link-title">Global Tokenized Map</span><span
                                class="link-desc">Acteurs, protocoles & actifs RWA</span></div>
                    </a>
                </div>
            </div>

            <!-- Dimension 3: Observatory -->
            <div class="pillar-item">
                <a href="/fr/observatory/tokenized-markets.html" class="pillar-link">Observatoire <span class="hot-badge" style="background:var(--accent-report); font-size:8px; vertical-align:middle; margin-left:5px;">LIVE</span></a>
                <div class="mega-dropdown">
                    <div class="dropdown-header">Market Intelligence</div>
                    <a href="/fr/observatory/tokenized-markets.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-chart-line" style="color:#3b82f6;"></i></div>
                        <div class="link-text"><span class="link-title">Markets Observatory</span><span
                                class="link-desc">Monitor de capitalisation & tendances</span></div>
                    </a>
                    <a href="/fr/indices/index.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-compass" style="color:#10b981;"></i></div>
                        <div class="link-text"><span class="link-title">Indices & Benchmarks</span><span
                                class="link-desc">GDARI & Risk Intelligence</span></div>
                    </a>
                </div>
            </div>

            <!-- Dimension 4: Knowledge -->
            <div class="pillar-item">
                <a href="/fr/knowledge/index.html" class="pillar-link">Savoir</a>
                <div class="mega-dropdown">
                    <div class="dropdown-header">Encyclopédie Institutionnelle</div>
                    <a href="/fr/knowledge/index.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-book-open" style="color:#f59e0b;"></i></div>
                        <div class="link-text"><span class="link-title">Knowledge Base</span><span
                                class="link-desc">Glossaire avancé & Concepts clés</span></div>
                    </a>
                    <a href="/fr/methodology/index.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-microscope" style="color:#94a3b8;"></i></div>
                        <div class="link-text"><span class="link-title">Méthodologie</span><span
                                class="link-desc">Standards de recherche DCM</span></div>
                    </a>
                </div>
            </div>

            <!-- Dimension 5: Network & Institute -->
            <div class="pillar-item">
                <a href="/fr/about.html" class="pillar-link">Institut & Réseau</a>
                <div class="mega-dropdown">
                    <div class="dropdown-header">Organisation & Impact</div>
                    <a href="/fr/about.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-university" style="color:#94a3b8;"></i></div>
                        <div class="link-text"><span class="link-title">À propos du DCM Core</span><span
                                class="link-desc">Mission, Gouvernance & Éthique</span></div>
                    </a>
                    <a href="/fr/global-forum/index.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-users" style="color:#94a3b8;"></i></div>
                        <div class="link-text"><span class="link-title">Espace Dialogue</span><span
                                class="link-desc">Forum Mondial, Roundtables & Événements</span></div>
                    </a>
                    <a href="/fr/fellowships/index.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-graduation-cap" style="color:#94a3b8;"></i></div>
                        <div class="link-text"><span class="link-title">Communauté</span><span
                                class="link-desc">Fellowships & Alliances stratégiques</span></div>
                    </a>
                </div>
            </div>
        </div>
        <div class="nav-actions">
            <div class="lang-switcher">
                <a href="{self_link}" class="lang-link active" title="Français">🇫🇷 FR</a>
                <a href="{other_link}" class="lang-link" title="English">🇬🇧 EN</a>
            </div>
            <a href="/fr/login.html" class="auth-btn">Auth</a>
            <button class="connect-btn">Connect</button>
        </div>
    </nav>"""

EN_NAVBAR_TEMPLATE = """    <nav class="navbar-pro">
        <a class="nav-brand" href="/en/index.html">
            <div class="logo-orb"></div>
            <div class="logo-text">DCM <span>Core Institute</span></div>
        </a>

        <div class="nav-pillars">
            <!-- Dimension 1: Research Programs -->
            <div class="pillar-item">
                <a href="/en/research-programs/index.html" class="pillar-link">Research Programs</a>
                <div class="mega-dropdown">
                    <div class="dropdown-header">Frameworks & Protocols</div>
                    <a href="/en/research/programmable-capital-markets/index.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-microchip" style="color:#3b82f6;"></i></div>
                        <div class="link-text"><span class="link-title">Programmable Capital Markets (PCM)</span><span
                                class="link-desc">Conceptual framework & technical architecture</span></div>
                    </a>
                    <a href="/en/research/digital-debt-capital-markets/index.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-file-contract" style="color:#10b981;"></i></div>
                        <div class="link-text"><span class="link-title">Digital Debt Capital Markets (DDCM)</span><span
                                class="link-desc">Standardization of digital bond issuance</span></div>
                    </a>
                    <a href="/en/research/state-of-tokenization-2025.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-file-alt" style="color:#f59e0b;"></i></div>
                        <div class="link-text"><span class="link-title">State of Finance 2025</span><span
                                class="link-desc">Annual strategic report</span></div>
                    </a>
                </div>
            </div>

            <!-- Dimension 2: Ecosystem Maps -->
            <div class="pillar-item">
                <a href="#" class="pillar-link">Ecosystem</a>
                <div class="mega-dropdown">
                    <div class="dropdown-header">Global Cartography</div>
                    <a href="/en/research/ecosystem-map.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-project-diagram" style="color:#8b5cf6;"></i></div>
                        <div class="link-text"><span class="link-title">Institutional Framework Map</span><span
                                class="link-desc">Global institutions, regulators & initiatives</span></div>
                    </a>
                    <a href="/en/research/global-map.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-globe-americas" style="color:#6366f1;"></i></div>
                        <div class="link-text"><span class="link-title">Global Tokenized Map</span><span
                                class="link-desc">Actors, protocols & RWA assets</span></div>
                    </a>
                </div>
            </div>

            <!-- Dimension 3: Observatory -->
            <div class="pillar-item">
                <a href="/en/observatory/tokenized-markets.html" class="pillar-link">Observatory <span class="hot-badge" style="background:var(--accent-report); font-size:8px; vertical-align:middle; margin-left:5px;">LIVE</span></a>
                <div class="mega-dropdown">
                    <div class="dropdown-header">Market Intelligence</div>
                    <a href="/en/observatory/tokenized-markets.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-chart-line" style="color:#3b82f6;"></i></div>
                        <div class="link-text"><span class="link-title">Markets Observatory</span><span
                                class="link-desc">Market cap monitor & trends</span></div>
                    </a>
                    <a href="/en/indices/index.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-compass" style="color:#10b981;"></i></div>
                        <div class="link-text"><span class="link-title">Indices & Benchmarks</span><span
                                class="link-desc">GDARI & Risk Intelligence</span></div>
                    </a>
                </div>
            </div>

            <!-- Dimension 4: Knowledge -->
            <div class="pillar-item">
                <a href="/en/knowledge/index.html" class="pillar-link">Knowledge</a>
                <div class="mega-dropdown">
                    <div class="dropdown-header">Institutional Encyclopedia</div>
                    <a href="/en/knowledge/index.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-book-open" style="color:#f59e0b;"></i></div>
                        <div class="link-text"><span class="link-title">Knowledge Base</span><span
                                class="link-desc">Advanced glossary & key concepts</span></div>
                    </a>
                    <a href="/en/methodology/index.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-microscope" style="color:#94a3b8;"></i></div>
                        <div class="link-text"><span class="link-title">Methodology</span><span
                                class="link-desc">DCM research standards</span></div>
                    </a>
                </div>
            </div>

            <!-- Dimension 5: Network & Institute -->
            <div class="pillar-item">
                <a href="/en/about.html" class="pillar-link">Network & Institute</a>
                <div class="mega-dropdown">
                    <div class="dropdown-header">Organization & Impact</div>
                    <a href="/en/about.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-university" style="color:#94a3b8;"></i></div>
                        <div class="link-text"><span class="link-title">About DCM Core</span><span
                                class="link-desc">Mission, Governance & Ethics</span></div>
                    </a>
                    <a href="/en/global-forum/index.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-users" style="color:#94a3b8;"></i></div>
                        <div class="link-text"><span class="link-title">Dialogue Space</span><span
                                class="link-desc">Global Forum, Roundtables & Events</span></div>
                    </a>
                    <a href="/en/fellowships/index.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-graduation-cap" style="color:#94a3b8;"></i></div>
                        <div class="link-text"><span class="link-title">Community</span><span
                                class="link-desc">Fellowships & Strategic alliances</span></div>
                    </a>
                </div>
            </div>
        </div>

        <div class="nav-actions">
            <div class="lang-switcher">
                <a href="{self_link}" class="lang-link active" title="English">🇬🇧 EN</a>
                <a href="{other_link}" class="lang-link" title="Français">🇫🇷 FR</a>
            </div>
            <a href="/en/login.html" class="auth-btn">Auth</a>
            <button class="connect-btn">Connect</button>
        </div>
    </nav>"""

FR_FOOTER_TEMPLATE = """    <footer class="super-footer">
        <div class="footer-content">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo-orb"></div>
                    <p>L'infrastructure de recherche indépendante pour la finance programmable.</p>
                </div>
                <div class="footer-col">
                    <h4>Recherche</h4>
                    <ul class="footer-links">
                        <li><a href="/fr/research-programs/index.html">Programmes</a></li>
                        <li><a href="/fr/research-papers/index.html">Working Papers</a></li>
                        <li><a href="/fr/methodology/index.html">Méthodologie</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Données</h4>
                    <ul class="footer-links">
                        <li><a href="/fr/observatory/tokenized-markets.html">Observatoire</a></li>
                        <li><a href="/fr/indices/index.html">Indices & GDARI</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Institution</h4>
                    <ul class="footer-links">
                        <li><a href="/fr/about.html">À propos</a></li>
                        <li><a href="/fr/global-forum/index.html">Global Forum</a></li>
                        <li><a href="/fr/fellowships/index.html">Fellowships</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-disclaimer">
                <strong>Avertissement Institutionnel :</strong> Les analyses publiées par le DCM Core Institute sont destinées à des fins de recherche académique et d'intelligence de marché. Elles ne constituent en aucun cas des conseils d'investissement ou des recommandations de conformité.
            </div>
            <div class="footer-bottom">
                <div class="footer-bottom-content">
                    <div class="copyright">© 2026 DCM Core Institute</div>
                    <div class="legal-links">
                        <a href="/fr/mentions-legales.html">Mentions Légales</a>
                        <a href="/fr/cgu.html">CGU</a>
                        <a href="/fr/privacy.html">Confidentialité</a>
                        <a href="/fr/cookies.html">Cookies</a>
                        <a href="/fr/support-it.html">Support IT</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>"""

EN_FOOTER_TEMPLATE = """    <footer class="super-footer">
        <div class="footer-content">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo-orb"></div>
                    <p>The independent research infrastructure for programmable finance.</p>
                </div>
                <div class="footer-col">
                    <h4>Research</h4>
                    <ul class="footer-links">
                        <li><a href="/en/research-programs/index.html">Programs</a></li>
                        <li><a href="/en/research-papers/index.html">Working Papers</a></li>
                        <li><a href="/en/methodology/index.html">Methodology</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Data</h4>
                    <ul class="footer-links">
                        <li><a href="/en/observatory/tokenized-markets.html">Observatory</a></li>
                        <li><a href="/en/indices/index.html">Indices & GDARI</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Institution</h4>
                    <ul class="footer-links">
                        <li><a href="/en/about.html">About</a></li>
                        <li><a href="/en/global-forum/index.html">Global Forum</a></li>
                        <li><a href="/en/fellowships/index.html">Fellowships</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-disclaimer">
                <strong>Institutional Disclaimer:</strong> Analyses published by DCM Core Institute are intended for academic research and market intelligence purposes. They do not constitute investment advice or compliance recommendations.
            </div>
            <div class="footer-bottom">
                <div class="footer-bottom-content">
                    <div class="copyright">© 2026 DCM Core Institute</div>
                    <div class="legal-links">
                        <a href="/en/legal-mentions.html">Legal Mentions</a>
                        <a href="/en/terms-of-use.html">Terms of Use</a>
                        <a href="/en/privacy.html">Privacy Policy</a>
                        <a href="/en/cookies.html">Cookie Policy</a>
                        <a href="/en/support-it.html">IT Support</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>"""

TARGET_DIRS = ['RESEARCH-PROGRAMS', 'RESEARCH', 'OBSERVATORY', 'INDICES', 'KNOWLEDGE', 'METHODOLOGY', 'FELLOWSHIPS', 'GLOBAL-FORUM', 'FR', 'EN']

def process_file(filepath):
    print(f"Processing: {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Detect language
    is_fr = '/fr/' in filepath
    is_en = '/en/' in filepath
    
    if not (is_fr or is_en):
        # Fallback to subdirectory check if full path doesn't have it
        parts = filepath.split('/')
        if 'fr' in parts: is_fr = True
        elif 'en' in parts: is_en = True

    if is_fr:
        template = FR_NAVBAR_TEMPLATE
        self_prefix = '/fr/'
        other_prefix = '/en/'
    elif is_en:
        template = EN_NAVBAR_TEMPLATE
        self_prefix = '/en/'
        other_prefix = '/fr/'
    else:
        print(f"   Skipping (Unknown language): {filepath}")
        return

    # Determin relative path to other version
    relative_path = filepath
    # Strip base directory if needed
    if relative_path.startswith('./'): relative_path = relative_path[2:]
    
    # Try to find the other version
    path_suffix = relative_path[relative_path.find(self_prefix) + 4:]
    other_version_path = other_prefix + path_suffix
    
    # Verify if other version exists (relative to script execution or absolute)
    # Actually, root-relative links in the template are fine as long as they are correct.
    # The script is likely executed at root.
    
    self_link = self_prefix + path_suffix
    other_link = other_version_path
    
    # Special case for index.html at root
    if self_link == "/fr/index.html" or self_link == "/en/index.html":
        pass # already good

    formatted_nav = template.format(self_link=self_link, other_link=other_link)
    
    # CSS Management: Ensure styles-megamenu.css is present and styles-navigation.css is removed
    # Find the language root folder (fr or en)
    parts = filepath.split(os.sep)
    if 'fr' in parts:
        lang_root_idx = parts.index('fr')
    elif 'en' in parts:
        lang_root_idx = parts.index('en')
    else:
        print(f"   Skipping (No lang root found in path): {filepath}")
        return

    # Calculate levels to go up to reach lang root
    levels_up = len(parts) - lang_root_idx - 2
    rel_to_lang_root = "../" * levels_up if levels_up > 0 else "./"

    megamenu_path = f"{rel_to_lang_root}styles-megamenu.css"
    footer_css_path = f"{rel_to_lang_root}styles-footer.css"
    
    # Head detection and CSS injection
    head_match = re.search(r'<head(.*?)>(.*?)</head>', content, flags=re.DOTALL | re.IGNORECASE)
    if head_match:
        opening_tag = f'<head{head_match.group(1)}>'
        head_content = head_match.group(2)
        
        # Add megamenu if missing
        if "styles-megamenu.css" not in head_content:
            css_link = f'\n    <link href="{megamenu_path}" rel="stylesheet" />'
            content = content.replace('</head>', f'{css_link}\n</head>')
        else:
            # Update existing link if path is wrong
            content = re.sub(r'<link [^>]*href="[^"]*styles-megamenu\.css"[^>]*>', f'<link href="{megamenu_path}" rel="stylesheet" />', content)
            
        # Add footer styles if missing
        if "styles-footer.css" not in head_content:
            css_link = f'\n    <link href="{footer_css_path}" rel="stylesheet" />'
            content = content.replace('</head>', f'{css_link}\n</head>')
        else:
            content = re.sub(r'<link [^>]*href="[^"]*styles-footer\.css"[^>]*>', f'<link href="{footer_css_path}" rel="stylesheet" />', content)

        # Remove styles-navigation.css if present to avoid conflicts
        content = re.sub(r'<link [^>]*href="[^"]*styles-navigation\.css"[^>]*>', '', content)

    # Replacement logic for Navbar
    new_content = re.sub(r'<nav class="navbar-pro">.*?</nav>', formatted_nav, content, flags=re.DOTALL)
    if new_content == content:
        new_content = re.sub(r'<header class="app-header simplified-header">.*?</header>', formatted_nav, content, flags=re.DOTALL)
    if new_content == content:
        # Broaden regex for quiz-nav to handle style attributes
        new_content = re.sub(r'<nav class="quiz-nav".*?>.*?</nav>', formatted_nav, new_content, flags=re.DOTALL)

    # Dark Theme Injection for Working Papers (wp-*.html)
    if re.search(r'wp-\d{4}-\d{2}\.html', filepath):
        if "var(--bg-dark)" not in new_content:
            print(f"   Applying Dark Theme to document: {filepath}")
            dark_theme_styles = """
    <style>
        :root { --inst-blue: #3b82f6; --bg-dark: #020617; --card-dark: #0f172a; --border: rgba(255,255,255,0.1); }
        body { background-color: var(--bg-dark); color: #e2e8f0; }
        .paper-container { background: var(--card-dark) !important; color: #e2e8f0 !important; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .paper-header { border-bottom-color: var(--border) !important; }
        .paper-title { color: #fff !important; }
        .paper-author { color: #94a3b8 !important; }
        .paper-abstract { background: rgba(59, 130, 246, 0.05) !important; border-left-color: var(--inst-blue) !important; color: #cbd5e1 !important; }
        .paper-content { color: #cbd5e1 !important; }
        .paper-content h3 { color: #fff !important; }
        .paper-content p { color: #94a3b8 !important; }
        .navbar-pro { backdrop-filter: blur(10px); background: rgba(2, 6, 23, 0.8) !important; }
    </style>"""
            if '</head>' in new_content:
                new_content = new_content.replace('</head>', f'{dark_theme_styles}\n</head>')

    # Replacement logic for Footer
    footer_template = FR_FOOTER_TEMPLATE if is_fr else EN_FOOTER_TEMPLATE
    rel_root = ("../" * (len(parts) - lang_root_idx - 1)) if (len(parts) - lang_root_idx - 1) > 0 else "./"
    formatted_footer = footer_template.replace('href="/fr/', f'href="{rel_root}fr/').replace('href="/en/', f'href="{rel_root}en/')
    
    if '<footer class="super-footer">' in new_content:
        new_content = re.sub(r'<footer class="super-footer">.*?</footer>', formatted_footer, new_content, flags=re.DOTALL)
    else:
        # Insert before </body> if missing
        print(f"   Inserting missing footer in {filepath}")
        if '</body>' in new_content:
            new_content = new_content.replace('</body>', f'\n{formatted_footer}\n</body>')
        else:
            new_content += f'\n{formatted_footer}'
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"   Success: {filepath}")

def main():
    root_dir = '.'
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Filter for target directories
        dir_name_up = dirpath.upper()
        if any(target in dir_name_up for target in TARGET_DIRS):
            for filename in filenames:
                if filename.endswith('.html'):
                    filepath = os.path.join(dirpath, filename)
                    process_file(filepath)
    
    # Also handle root level about.html if it exists in fr/ and en/
    fr_about = './fr/about.html'
    en_about = './en/about.html'
    if os.path.exists(fr_about): process_file(fr_about)
    if os.path.exists(en_about): process_file(en_about)

if __name__ == "__main__":
    main()
