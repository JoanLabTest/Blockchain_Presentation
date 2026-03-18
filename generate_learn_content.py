import os

def create_page(lang, filename, title, description, content_html, lang_link_html, back_link):
    if lang == 'en':
        lang_switcher = f"""
            <div class="lang-switcher">
                <a href="../../fr/learn/{lang_link_html}" class="lang-link">FR</a>
                <a href="" class="lang-link active">EN</a>
            </div>"""
        nav_elements = f"""
            <a href="../../en/login.html" class="auth-btn">Auth</a>
            <button class="connect-btn" onclick="openWalletModal()">Connect</button>
        """
        back_btn = f"""<a href="{back_link}" class="hub-return-btn"><i class="fas fa-arrow-left"></i> Back to Academy</a>"""
        lang_attr = "en"
    else:
        lang_switcher = f"""
            <div class="lang-switcher">
                <a href="" class="lang-link active">FR</a>
                <a href="../../en/learn/{lang_link_html}" class="lang-link">EN</a>
            </div>"""
        nav_elements = f"""
            <a href="../../fr/login.html" class="auth-btn">Connexion</a>
            <button class="connect-btn" onclick="openWalletModal()">Connecter</button>
        """
        back_btn = f"""<a href="{back_link}" class="hub-return-btn"><i class="fas fa-arrow-left"></i> Retour à l'Academy</a>"""
        lang_attr = "fr"

    html_content = f"""<!DOCTYPE html>
<html lang="{lang_attr}">
<head>
    <meta charset="utf-8" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <title>{title} | DCM Core Academy</title>
    <meta name="description" content="{description}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet" />
    <link href="../../styles.css" rel="stylesheet" />
    <link href="../styles-footer.css" rel="stylesheet" />
    <script src="../js/global-footer.js"></script>
    <link href="../../css/navigation-hub.css" rel="stylesheet" />
    <script src="../../js/navigation-hub.js"></script>
    <style>
        body {{ background-color: #020617; color: #cbd5e1; font-family: 'Inter', sans-serif; margin: 0; padding-top: 70px; }}
        .article-container {{ max-width: 800px; margin: 60px auto; padding: 0 20px; }}
        .article-header {{ text-align: center; margin-bottom: 50px; }}
        .article-title {{ font-family: 'Outfit', sans-serif; font-size: 48px; color: white; margin-bottom: 20px; }}
        .article-content h2 {{ color: white; font-size: 28px; margin-top: 40px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; }}
        .article-content p {{ font-size: 18px; line-height: 1.7; margin-bottom: 20px; }}
        .card-box {{ background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 30px; margin: 30px 0; }}
        .hub-return-btn {{ display: inline-flex; align-items: center; gap: 8px; color: #3b82f6; text-decoration: none; font-weight: 600; margin-bottom: 30px; }}
        .hub-return-btn:hover {{ text-decoration: underline; }}
    </style>
</head>
<body>
    <nav class="navbar-pro">
        <a class="nav-brand" href="../../index.html">
            <div class="logo-orb"></div>
            <div class="logo-text">DCM <span>Core Institute</span></div>
        </a>
        <div class="nav-actions">
            {lang_switcher}
            {nav_elements}
        </div>
    </nav>

    <div class="article-container">
        {back_btn}
        <div class="article-header">
            <h1 class="article-title">{title}</h1>
            <p style="font-size:20px; color:#94a3b8;">{description}</p>
        </div>
        <div class="article-content">
            {content_html}
        </div>
    </div>
    <global-footer base-path="../../"></global-footer>
</body>
</html>"""

    filepath = os.path.join(f"{lang}/learn", filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Created: {filepath}")

# 1. WHAT IS A TOKEN
create_page(
    'en', 'what-is-a-token.html', 'What is a Token?', 'Understanding the fundamental unit of programmable finance.',
    """<h2>Introduction</h2><p>A token is a digital representation of value or rights issued on a blockchain...</p>
    <div class="card-box"><h3>Key Properties</h3><p>Programmability, immutability, and instant settlement.</p></div>""",
    'what-is-a-token.html', 'index.html'
)
create_page(
    'fr', 'qu-est-ce-qu-un-token.html', """Qu'est-ce qu'un Token ?""", """Comprendre l'unité fondamentale de la finance programmable.""",
    """<h2>Introduction</h2><p>Un token est une représentation numérique de valeur ou de droits émise sur une blockchain...</p>
    <div class="card-box"><h3>Propriétés Clés</h3><p>Programmabilité, immutabilité et règlement instantané.</p></div>""",
    'what-is-a-token.html', 'index.html'
)

# 2. NFT EXPLAINED
create_page(
    'en', 'nft-explained.html', 'NFTs Explained', 'The strategic use of Non-Fungible Tokens in institutional finance.',
    """<h2>Beyond Art</h2><p>While known for digital art, NFTs in finance represent unique assets like real estate deeds or bespoke derivatives...</p>""",
    'nft-explique.html', 'index.html'
)
create_page(
    'fr', 'nft-explique.html', """Les NFT (Jetons Non-Fongibles)""", """L'usage stratégique des jetons non-fongibles dans la finance institutionnelle.""",
    """<h2>Au-delà de l'Art</h2><p>Bien que connus pour l'art numérique, les NFT en finance représentent des actifs uniques comme des actes de propriété ou des produits dérivés sur-mesure...</p>""",
    'nft-explained.html', 'index.html'
)

# 3. DEFI EXPLAINED
create_page(
    'en', 'defi-explained.html', 'DeFi Explained', 'An introduction to Decentralized Finance (DeFi) protocols.',
    """<h2>Automated Markets</h2><p>DeFi removes intermediaries by using smart contracts to execute trades, loans, and yield generation...</p>""",
    'defi-explique.html', 'index.html'
)
create_page(
    'fr', 'defi-explique.html', """La DeFi Expliquée""", """Une introduction aux protocoles de Finance Décentralisée (DeFi).""",
    """<h2>Marchés Automatisés</h2><p>La DeFi supprime les intermédiaires en utilisant des smart contracts pour exécuter les échanges, les prêts et la génération de rendement...</p>""",
    'defi-explained.html', 'index.html'
)

# 4. CBDC EXPLAINED
create_page(
    'en', 'cbdc-explained.html', 'CBDCs Explained', 'The role of Central Bank Digital Currencies in global markets.',
    """<h2>Sovereign Digital Money</h2><p>CBDCs represent a liability of the central bank, providing a digital settlement layer equivalent to cash...</p>""",
    'mnbc-explique.html', 'index.html'
)
create_page(
    'fr', 'mnbc-explique.html', """Les MNBC (Monnaies Numériques de Banque Centrale)""", """Le rôle des devises souveraines numériques sur les marchés mondiaux.""",
    """<h2>Monnaie Numérique Souveraine</h2><p>Les MNBC représentent un passif de la banque centrale, fournissant une couche de règlement numérique équivalente aux espèces...</p>""",
    'cbdc-explained.html', 'index.html'
)
