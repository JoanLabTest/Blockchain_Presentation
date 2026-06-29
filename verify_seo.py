import os
import re
import json
import xml.etree.ElementTree as ET

def test_file_exists(path):
    assert os.path.exists(path), f"File not found: {path}"
    print(f"✓ File exists: {path}")

def test_redirect(path, target):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Check meta refresh
    assert f'url={target}' in content or f'URL={target}' in content, f"Redirect meta tag not found in {path}"
    # Check JS fallback
    assert f'window.location.replace("{target}")' in content or f"window.location.replace('{target}')" in content, f"Redirect JS fallback not found in {path}"
    print(f"✓ Redirect validation passed for {path} -> {target}")

def check_html_metadata(path, expected_title_part, expected_desc_part):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Title tag check
    title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
    assert title_match, f"No title tag found in {path}"
    title = title_match.group(1)
    assert expected_title_part.lower() in title.lower(), f"Expected title part '{expected_title_part}' not found in '{title}' in {path}"
    
    # Description meta tag check
    desc_match = re.search(r'<meta\s+[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']', content, re.IGNORECASE) or \
                 re.search(r'<meta\s+[^>]*content=["\'](.*?)["\']\s+[^>]*name=["\']description["\']', content, re.IGNORECASE)
    assert desc_match, f"No description meta tag found in {path}"
    desc = desc_match.group(1)
    assert expected_desc_part.lower() in desc.lower(), f"Expected desc part '{expected_desc_part}' not found in description in {path}"
    
    # Canonical link check
    canonical_match = re.search(r'<link\s+[^>]*rel=["\']canonical["\'][^>]*href=["\'](.*?)["\']', content, re.IGNORECASE)
    assert canonical_match, f"No canonical link found in {path}"
    
    print(f"✓ Metadata and Canonical checked for {path}")

def check_schema_markup(path, expected_types):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all JSON-LD blocks
    json_ld_blocks = re.findall(r'<script\s+[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', content, re.DOTALL | re.IGNORECASE)
    assert len(json_ld_blocks) > 0, f"No JSON-LD schema found in {path}"
    
    found_types = set()
    for block in json_ld_blocks:
        try:
            data = json.loads(block.strip())
            if isinstance(data, list):
                for item in data:
                    if "@type" in item:
                        found_types.add(item["@type"])
            elif isinstance(data, dict):
                if "@type" in data:
                    found_types.add(data["@type"])
        except Exception as e:
            print(f"Warning: JSON-LD parse failed in {path}: {e}")
            
    for t in expected_types:
        assert t in found_types, f"Schema type {t} not found in {path} (found: {found_types})"
    print(f"✓ Schema validation passed for {path} (Types: {found_types})")

def check_sitemaps():
    # Check sitemap files
    for sitemap_file in ["sitemap-en.xml", "sitemap-fr.xml"]:
        tree = ET.parse(sitemap_file)
        root = tree.getroot()
        
        # XML Namespace mapping
        ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        
        url_count = 0
        for url in root.findall('sm:url', ns):
            loc = url.find('sm:loc', ns).text
            priority = url.find('sm:priority', ns).text
            
            url_count += 1
            # Priority checks
            if "glossary/" in loc or "glossaire/" in loc:
                assert priority == "0.6", f"Incorrect glossary priority for {loc}: {priority}"
            elif "settlement-registry" in loc or "registre-reglements" in loc or "tokenized-markets" in loc:
                assert priority == "0.9", f"Incorrect registry priority for {loc}: {priority}"
            elif any(x in loc for x in ["buidl/", "digital-euro-infrastructure.html", "state-of-institutional-stablecoins"]):
                assert priority == "1.0", f"Incorrect monograph priority for {loc}: {priority}"
                
        print(f"✓ Sitemap {sitemap_file} verified with {url_count} URLs")

def check_hreflang_reciprocity(en_path, fr_path, en_url, fr_url):
    with open(en_path, 'r', encoding='utf-8') as f:
        en_content = f.read()
    with open(fr_path, 'r', encoding='utf-8') as f:
        fr_content = f.read()

    # Find alternates
    en_alts = re.findall(r'<link\s+[^>]*rel=["\']alternate["\'][^>]*hreflang=["\'](.*?)["\'][^>]*href=["\'](.*?)["\']', en_content, re.IGNORECASE)
    fr_alts = re.findall(r'<link\s+[^>]*rel=["\']alternate["\'][^>]*hreflang=["\'](.*?)["\'][^>]*href=["\'](.*?)["\']', fr_content, re.IGNORECASE)

    en_dict = {lang: href for lang, href in en_alts}
    fr_dict = {lang: href for lang, href in fr_alts}

    assert en_dict.get("en") == en_url, f"EN page hreflang='en' got {en_dict.get('en')}, expected {en_url}"
    assert en_dict.get("fr") == fr_url, f"EN page hreflang='fr' got {en_dict.get('fr')}, expected {fr_url}"
    assert fr_dict.get("en") == en_url, f"FR page hreflang='en' got {fr_dict.get('en')}, expected {en_url}"
    assert fr_dict.get("fr") == fr_url, f"FR page hreflang='fr' got {fr_dict.get('fr')}, expected {fr_url}"
    
    # Check x-default
    assert en_dict.get("x-default") == en_url, f"EN page x-default got {en_dict.get('x-default')}, expected {en_url}"
    assert fr_dict.get("x-default") == en_url, f"FR page x-default got {fr_dict.get('x-default')}, expected {en_url}"

    print(f"✓ Hreflang reciprocity validated for {en_path} ↔ {fr_path}")

def run_all_tests():
    print("Starting SEO & GEO Validation...")
    
    # 1. Redirect tests
    test_redirect("en/buidl.html", "/en/buidl/")
    test_redirect("fr/buidl.html", "/fr/buidl/")
    
    # 2. Metadata, Canonical & i18n link tests
    check_html_metadata("en/buidl/index.html", "BUIDL", "BlackRock")
    check_html_metadata("fr/buidl/index.html", "BUIDL", "BlackRock")
    check_html_metadata("en/observatory/digital-euro-infrastructure.html", "Wholesale", "wholesale")
    check_html_metadata("fr/observatory/digital-euro-infrastructure.html", "Gros", "gros")
    check_html_metadata("en/insights/mica/mica-enforcement-july2026.html", "MiCA Day Zero", "Enforcement")
    check_html_metadata("fr/insights/mica/entree-en-vigueur-mica-juillet2026.html", "Day Zero MiCA", "vigueur")
    check_html_metadata("en/about/architecture-map.html", "Architecture Map", "blueprint")
    check_html_metadata("fr/a-propos/carte-architecture.html", "Carte de l'Architecture", "couches")
    
    # Hreflang Reciprocity checks
    check_hreflang_reciprocity(
        "en/insights/mica/mica-enforcement-july2026.html",
        "fr/insights/mica/entree-en-vigueur-mica-juillet2026.html",
        "https://dcmcore.com/en/insights/mica/mica-enforcement-july2026.html",
        "https://dcmcore.com/fr/insights/mica/entree-en-vigueur-mica-juillet2026.html"
    )
    check_hreflang_reciprocity(
        "en/about/architecture-map.html",
        "fr/a-propos/carte-architecture.html",
        "https://dcmcore.com/en/about/architecture-map.html",
        "https://dcmcore.com/fr/a-propos/carte-architecture.html"
    )
    
    # 3. Structured data Schema tests
    check_schema_markup("en/buidl/index.html", ["ResearchArticle"])
    check_schema_markup("fr/buidl/index.html", ["ResearchArticle"])
    check_schema_markup("en/observatory/digital-euro-infrastructure.html", ["ResearchArticle", "FAQPage"])
    check_schema_markup("en/observatory/settlement-registry.html", ["Dataset"])
    check_schema_markup("fr/observatory/registre-reglements.html", ["Dataset"])
    check_schema_markup("en/insights/mica/mica-enforcement-july2026.html", ["NewsArticle", "TechArticle", "FAQPage", "BreadcrumbList"])
    check_schema_markup("fr/insights/mica/entree-en-vigueur-mica-juillet2026.html", ["NewsArticle", "TechArticle", "FAQPage", "BreadcrumbList"])
    check_schema_markup("en/about/architecture-map.html", ["WebPage"])
    check_schema_markup("fr/a-propos/carte-architecture.html", ["WebPage"])
    
    # 4. Glossary verification
    check_schema_markup("en/glossary/what-is-tokenized-treasury.html", ["ResearchArticle", "FAQPage"])
    check_schema_markup("fr/glossaire/qu-est-ce-que-la-tresorerie-tokenisee.html", ["ResearchArticle", "FAQPage"])
    
    # 5. Sitemap checks
    check_sitemaps()
    
    print("\nALL SEO & GEO VALIDATION TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_all_tests()
