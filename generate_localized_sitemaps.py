import os
import glob
import xml.etree.ElementTree as ET
from xml.dom import minidom

base_url = "https://dcmcore.com/"

# Files to map with priorities
high_priority = [
    "index.html",
    "institutional-problem-statement.html",
    "why-now.html",
    "series-a-narrative.html",
    "governance-os.html",
    "mrm-hub.html",
    "buidl.html",
    "yield-mechanics.html",
    "pricing.html",
    "whitepaper-gate.html",
    "knowledge/index.html",
    "methodology/index.html",
    "research/programmable-capital-markets/index.html",
    "research/programmable-capital-markets/smart-bond-framework.html",
    "research/programmable-capital-markets/smart-derivative-contracts.html",
    "observatory/tokenized-markets.html",
    "research/tokenized-capital-markets-report-2026.html",
    "research/rapport-mondial-tokenisation-2026.html",
    "research-programs/index.html"
]

medium_priority = [
    "regulatory-mapping.html",
    "legal-matrix.html",
    "case-study-tokenized-bond.html",
    "risk-register.html",
    "guide.html",
    "dashboard.html",
    "sandbox.html",
    "research/ecosystem-map.html",
    "research/global-map.html"
]

def create_sitemap(files, filename, directory=""):
    urlset = ET.Element('urlset', xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
    
    for f_path in files:
        # Get relative path from the language root (fr/ or en/)
        if directory:
            rel_path = os.path.relpath(f_path, directory)
        else:
            rel_path = f_path
            
        basename = os.path.basename(f_path)
        if "backup" in basename or "quiz" in basename or "admin" in basename or "login" in basename:
            continue
            
        url = ET.SubElement(urlset, 'url')
        loc = ET.SubElement(url, 'loc')
        
        # Build the final URL
        prefix = f"{directory}/" if directory else ""
        loc.text = f"{base_url}{prefix}{rel_path}"
        
        priority = ET.SubElement(url, 'priority')
        # Check if basename OR the relative path is in priorities
        if basename in high_priority or rel_path in high_priority:
            priority.text = "1.0"
        elif basename in medium_priority or rel_path in medium_priority:
            priority.text = "0.8"
        else:
            priority.text = "0.5"
            
    xml_str = ET.tostring(urlset, encoding='utf-8')
    parsed = minidom.parseString(xml_str)
    with open(filename, "w", encoding='utf-8') as f:
        f.write(parsed.toprettyxml(indent="  "))
    print(f"Generated {filename}")

# Gather files
root_html = [f for f in glob.glob('*.html') if os.path.isfile(f)]
fr_html = [f for f in glob.glob('fr/**/*.html', recursive=True) if os.path.isfile(f)]
en_html = [f for f in glob.glob('en/**/*.html', recursive=True) if os.path.isfile(f)]

# Generate individual sitemaps
create_sitemap(root_html, "sitemap-root.xml")
create_sitemap(fr_html, "sitemap-fr.xml", "fr")
create_sitemap(en_html, "sitemap-en.xml", "en")

# Generate Sitemap Index
sitemapindex = ET.Element('sitemapindex', xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
for sm in ["sitemap-root.xml", "sitemap-fr.xml", "sitemap-en.xml"]:
    sitemap = ET.SubElement(sitemapindex, 'sitemap')
    loc = ET.SubElement(sitemap, 'loc')
    loc.text = f"{base_url}{sm}"

xml_str = ET.tostring(sitemapindex, encoding='utf-8')
parsed = minidom.parseString(xml_str)
with open("sitemap.xml", "w", encoding='utf-8') as f:
    f.write(parsed.toprettyxml(indent="  "))

print("Sitemap Index Generated at sitemap.xml")
