import os
import glob
import xml.etree.ElementTree as ET
from xml.dom import minidom
from datetime import datetime

base_url = "https://dcmcore.com/"

def create_sitemap(files, filename, directory=""):
    urlset = ET.Element('urlset', xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
    
    for f_path in files:
        # Get relative path from the language root (fr/ or en/)
        if directory:
            rel_path = os.path.relpath(f_path, directory)
        else:
            rel_path = f_path
            
        basename = os.path.basename(f_path)
        
        # Exclude administrative or non-indexable files
        if "backup" in basename or "admin" in basename or "login" in basename:
            continue
            
        # Read file to check if it's a redirect
        try:
            with open(f_path, 'r', encoding='utf-8', errors='ignore') as file_obj:
                file_content = file_obj.read()
                if 'http-equiv="refresh"' in file_content or 'http-equiv="Refresh"' in file_content or 'window.location.replace' in file_content:
                    # Skip redirect files from sitemap
                    continue
        except Exception as e:
            print(f"Warning: could not read {f_path} to check for redirects: {e}")
            
        url = ET.SubElement(urlset, 'url')
        loc = ET.SubElement(url, 'loc')
        
        # Normalize relative path to use forward slashes
        rel_path = rel_path.replace("\\", "/")
        
        # Strip index.html for directory-style clean URLs
        if rel_path == "index.html":
            clean_rel_path = ""
        elif rel_path.endswith("/index.html"):
            clean_rel_path = rel_path[:-10] # Remove index.html, keeping the trailing slash
        else:
            clean_rel_path = rel_path
            
        # Build the final URL
        prefix = f"{directory}/" if directory else ""
        loc.text = f"{base_url}{prefix}{clean_rel_path}"
        
        # Add lastmod
        try:
            mtime = os.path.getmtime(f_path)
            lastmod_str = datetime.fromtimestamp(mtime).strftime('%Y-%m-%d')
        except Exception:
            lastmod_str = datetime.now().strftime('%Y-%m-%d')
            
        lastmod = ET.SubElement(url, 'lastmod')
        lastmod.text = lastmod_str
        
        # Determine priority and changefreq
        priority = ET.SubElement(url, 'priority')
        changefreq = ET.SubElement(url, 'changefreq')
        
        if "glossary/" in rel_path or "glossaire/" in rel_path:
            priority.text = "0.6"
            changefreq.text = "weekly"
        elif any(x in rel_path for x in ["settlement-registry", "registre-reglements", "tokenized-markets"]):
            priority.text = "0.9"
            changefreq.text = "weekly"
        elif any(x in rel_path for x in ["buidl/", "digital-euro-infrastructure.html", "state-of-institutional-stablecoins"]):
            priority.text = "1.0"
            changefreq.text = "weekly"
        elif clean_rel_path == "" or clean_rel_path == "index.html":
            priority.text = "1.0"
            changefreq.text = "daily"
        elif any(x in rel_path for x in ["observatory", "research-programs", "insights", "indices"]):
            priority.text = "0.8"
            changefreq.text = "weekly"
        elif any(x in rel_path for x in ["policy-briefs", "policy-library", "research"]):
            priority.text = "0.5"
            changefreq.text = "monthly"
        else:
            priority.text = "0.5"
            changefreq.text = "monthly"
            
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
