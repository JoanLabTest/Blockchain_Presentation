import os
from bs4 import BeautifulSoup
import json

BASE_URL = "https://dcm-digital.com/"
FILES_TO_FIX = [
    "web3-nft-section.html",
    "risk-heatmap-module.html", 
    "legal_pilot_enhanced_section.html",
    "it-architecture-module.html",
    "roadmap-module.html"
]

def generate_json_ld(filename):
    clean_name = filename.replace('.html', '').replace('-', ' ').title()
    schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": f"{clean_name} - DCM Digital",
        "description": f"Explore the {clean_name} module of the DCM Digital Governance OS.",
        "url": f"{BASE_URL}{filename}"
    }
    return json.dumps(schema, indent=2)

for filename in FILES_TO_FIX:
    filepath = os.path.join("/Users/joanl/blockchain-presentation", filename)
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        soup = BeautifulSoup(content, 'html.parser')
        
    # If no head, wrap it in basic html template
    if not soup.find('head'):
        new_html = BeautifulSoup("<!DOCTYPE html><html lang='fr'><head></head><body></body></html>", 'html.parser')
        new_html.body.append(soup)
        soup = new_html
        
    head = soup.find('head')
    clean_name = filename.replace('.html', '').replace('-', ' ').title()
    
    # Add tags
    if not soup.find('title'):
        title_tag = soup.new_tag('title')
        title_tag.string = f"{clean_name} - DCM Digital"
        head.append(title_tag)
        
    desc = soup.new_tag('meta', attrs={'name': 'description', 'content': f"Explore the {clean_name} module of the DCM Digital Governance OS."})
    head.append(desc)
    
    canon = soup.new_tag('link', attrs={'rel': 'canonical', 'href': f"{BASE_URL}{filename}"})
    head.append(canon)
    
    script_tag = soup.new_tag('script', type='application/ld+json')
    script_tag.string = generate_json_ld(filename)
    head.append(script_tag)
    
    html_str = soup.encode("utf-8", formatter=None).decode("utf-8")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html_str)
        
print("Edge cases fixed.")
