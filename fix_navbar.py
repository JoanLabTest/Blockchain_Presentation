import os

def fix_fr_root():
    path = "index.html"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Fix nav-brand and remove search block from top
    old_top = """        <button class="mobile-menu-toggle" aria-label="Menu Mobile">
            <i class="fas fa-bars"></i>
        </button>
        </a>
        
        <!-- GLOBAL SEARCH (Institutional Autocomplete) -->
        <div class="nav-search">
            <i class="fas fa-search nav-search-icon"></i>
            <input type="text" id="globalSearchInput" class="nav-search-input" placeholder="Recherche MiCA, RWA, Yield...">
            <div id="searchResults" class="search-results"></div>
        </div>"""
    
    new_top = """        <button class="mobile-menu-toggle" aria-label="Menu Mobile">
            <i class="fas fa-bars"></i>
        </button>
        <a class="nav-brand" href="index.html">
            <div class="logo-orb"></div>
            <div class="logo-text">DCM <span>Core Institute</span></div>
        </a>"""
    
    if old_top in content:
        content = content.replace(old_top, new_top)

    # 2. Insert search block before nav-actions
    old_bottom = """        </div>
        <div class="nav-actions">"""
    
    new_bottom = """        </div>
        
        <!-- GLOBAL SEARCH (Institutional Autocomplete) -->
        <div class="nav-search">
            <i class="fas fa-search nav-search-icon"></i>
            <input type="text" id="globalSearchInput" class="nav-search-input" placeholder="Recherche MiCA, RWA, Yield...">
            <div id="searchResults" class="search-results"></div>
        </div>

        <div class="nav-actions">"""
    
    if old_bottom in content and "<!-- GLOBAL SEARCH (Institutional Autocomplete) -->" not in content:
        content = content.replace(old_bottom, new_bottom)
        
    # 3. Fix language switcher EN link
    old_lang = """            <div class="lang-switcher">
                <a href="index.html" class="lang-link active" title="Français">🇫🇷 FR</a>
                <a href="../en/index.html" class="lang-link" title="English">🇬🇧 EN</a>
            </div>"""
    new_lang = """            <div class="lang-switcher">
                <a href="index.html" class="lang-link active" title="Français">🇫🇷 FR</a>
                <a href="en/index.html" class="lang-link" title="English">🇬🇧 EN</a>
            </div>"""
            
    if old_lang in content:
        content = content.replace(old_lang, new_lang)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def fix_fr_sub():
    path = "fr/index.html"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    old_top = """        <button class="mobile-menu-toggle" aria-label="Menu Mobile">
            <i class="fas fa-bars"></i>
        </button>
        </a>
        
        <!-- GLOBAL SEARCH (Institutional Autocomplete) -->
        <div class="nav-search">
            <i class="fas fa-search nav-search-icon"></i>
            <input type="text" id="globalSearchInput" class="nav-search-input" placeholder="Recherche MiCA, RWA, Yield...">
            <div id="searchResults" class="search-results"></div>
        </div>"""
    
    new_top = """        <button class="mobile-menu-toggle" aria-label="Menu Mobile">
            <i class="fas fa-bars"></i>
        </button>
        <a class="nav-brand" href="../index.html">
            <div class="logo-orb"></div>
            <div class="logo-text">DCM <span>Core Institute</span></div>
        </a>"""
    
    if old_top in content:
        content = content.replace(old_top, new_top)

    old_bottom = """        </div>
        <div class="nav-actions">"""
    
    new_bottom = """        </div>
        
        <!-- GLOBAL SEARCH (Institutional Autocomplete) -->
        <div class="nav-search">
            <i class="fas fa-search nav-search-icon"></i>
            <input type="text" id="globalSearchInput" class="nav-search-input" placeholder="Recherche MiCA, RWA, Yield...">
            <div id="searchResults" class="search-results"></div>
        </div>

        <div class="nav-actions">"""
    
    if old_bottom in content and "<!-- GLOBAL SEARCH (Institutional Autocomplete) -->" not in content:
        content = content.replace(old_bottom, new_bottom)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def fix_en():
    path = "en/index.html"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Add mobile menu toggle and remove search
    old_top = """    <nav class="navbar-pro">
        <a class="nav-brand" href="../index.html">
            <div class="logo-orb"></div>
            <div class="logo-text">DCM <span>Core Institute</span></div>
        </a>
        
        <!-- GLOBAL SEARCH (Institutional Autocomplete) -->
        <div class="nav-search">
            <i class="fas fa-search nav-search-icon"></i>
            <input type="text" id="globalSearchInput" class="nav-search-input" placeholder="Search MiCA, RWA, Yield...">
            <div id="searchResults" class="search-results"></div>
        </div>"""
        
    new_top = """    <nav class="navbar-pro">
        <button class="mobile-menu-toggle" aria-label="Menu Mobile">
            <i class="fas fa-bars"></i>
        </button>
        <a class="nav-brand" href="../index.html">
            <div class="logo-orb"></div>
            <div class="logo-text">DCM <span>Core Institute</span></div>
        </a>"""

    if old_top in content:
        content = content.replace(old_top, new_top)
        
    # 2. Add search before actions
    old_bottom = """        </div>
        <div class="nav-actions">"""
        
    new_bottom = """        </div>

        <!-- GLOBAL SEARCH (Institutional Autocomplete) -->
        <div class="nav-search">
            <i class="fas fa-search nav-search-icon"></i>
            <input type="text" id="globalSearchInput" class="nav-search-input" placeholder="Search MiCA, RWA, Yield...">
            <div id="searchResults" class="search-results"></div>
        </div>

        <div class="nav-actions">"""
        
    if old_bottom in content and "<!-- GLOBAL SEARCH (Institutional Autocomplete) -->" not in content:
        content = content.replace(old_bottom, new_bottom)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

fix_fr_root()
fix_fr_sub()
fix_en()
print("Fixes applied successfully.")
