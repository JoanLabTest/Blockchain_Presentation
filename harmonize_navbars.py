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

TARGET_DIRS = ['RESEARCH-PROGRAMS', 'RESEARCH', 'OBSERVATORY', 'INDICES', 'KNOWLEDGE', 'METHODOLOGY', 'FELLOWSHIPS', 'GLOBAL-FORUM']

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
    # Calculate relative path to fr/ folder
    rel_base = os.path.relpath(".", os.path.dirname(filepath))
    if rel_base == ".":
        rel_to_fr = "fr/"
    else:
        # Check if we are inside fr/
        parts = filepath.split(os.sep)
        if "fr" in parts:
            fr_idx = parts.index("fr")
            rel_to_fr = os.path.sep.join([".." for _ in range(len(parts) - fr_idx - 2)] + [""])
            if rel_to_fr == "": rel_to_fr = "./"
        else:
            rel_to_fr = os.path.join(rel_base, "fr/")

    megamenu_path = os.path.join(rel_to_fr, "styles-megamenu.css").replace("\\", "/")
    footer_css_path = os.path.join(rel_to_fr, "styles-footer.css").replace("\\", "/")
    
    # Check if head exists
    head_match = re.search(r'<head>.*?</head>', content, flags=re.DOTALL)
    if head_match:
        head_content = head_match.group(0)
        
        # Add megamenu if missing
        if "styles-megamenu.css" not in head_content:
            css_link = f'\n    <link href="{megamenu_path}" rel="stylesheet" />'
            new_head = head_content.replace('</head>', f'{css_link}\n</head>')
            content = content.replace(head_content, new_head)
            head_content = new_head
            
        # Add footer styles if missing
        if "styles-footer.css" not in head_content:
            css_link = f'\n    <link href="{footer_css_path}" rel="stylesheet" />'
            new_head = head_content.replace('</head>', f'{css_link}\n</head>')
            content = content.replace(head_content, new_head)
            head_content = new_head

        # Remove styles-navigation.css if present to avoid conflicts
        if "styles-navigation.css" in head_content:
            new_head = re.sub(r'<link [^>]*href="[^"]*styles-navigation\.css"[^>]*>', '', head_content)
            content = content.replace(head_content, new_head)

    # Replacement logic: find <nav class="navbar-pro">...</nav> or <header class="app-header simplified-header">...</header>
    # Note: Regex needs to be broad to catch variation in formatting
    new_content = re.sub(r'<nav class="navbar-pro">.*?</nav>', formatted_nav, content, flags=re.DOTALL)
    if new_content == content:
        new_content = re.sub(r'<header class="app-header simplified-header">.*?</header>', formatted_nav, content, flags=re.DOTALL)
    
    if new_content == content:
        # Try finding <header> or other common nav patterns if navbar-pro isn't found
        print(f"   Warning: navbar-pro not found in {filepath}. Trying broader match.")
        # If it fails, maybe the class is different or it's wrapped in a header
        # Let's try to just find the top of the body and insert if not found? 
        # No, better to be surgical.
        
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
