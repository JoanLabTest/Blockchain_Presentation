import os
import glob
import xml.etree.ElementTree as ET
from xml.dom import minidom

base_url = "https://dcmcore.com/"

# Files to map
# Prioritizing the newly created institutional narrative files
high_priority = [
    "index.html",
    "institutional-problem-statement.html",
    "why-now.html",
    "competitive-landscape.html",
    "series-a-narrative.html",
    "governance-os-landing.html",
    "mrm-hub.html",
    "economic-model.html"
]

medium_priority = [
    "data-certification.html",
    "regulatory-mapping.html",
    "legal-matrix.html",
    "case-study-tokenized-bond.html",
    "risk-register.html",
    "regulatory-transparency.html",
    "guide.html",
    "dashboard.html",
    "sandbox.html",
    "pricing-institutional.html"
]

all_html_files = glob.glob('*.html') + glob.glob('networks/*.html')

# Generate XML
urlset = ET.Element('urlset', xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

for root_file in all_html_files:
    if "backup" in root_file or "simple" in root_file or "quiz" in root_file or "admin" in root_file:
        continue # skip unnecessary files for indexing
    
    url = ET.SubElement(urlset, 'url')
    loc = ET.SubElement(url, 'loc')
    loc.text = base_url + root_file.replace('\\', '/')
    
    priority = ET.SubElement(url, 'priority')
    
    if root_file in high_priority:
        priority.text = "1.0"
    elif root_file in medium_priority:
        priority.text = "0.8"
    else:
        priority.text = "0.5"

xml_str = ET.tostring(urlset, encoding='utf-8')
parsed = minidom.parseString(xml_str)
pretty_xml = parsed.toprettyxml(indent="  ")

# the minidom print adds an extra xml declaration, we keep it.
with open("sitemap.xml", "w", encoding='utf-8') as f:
    f.write(pretty_xml)

print("Sitemap generated.")
