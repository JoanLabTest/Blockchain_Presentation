import os
import re
import glob
import xml.etree.ElementTree as ET
from xml.dom import minidom
from datetime import datetime
import subprocess

base_url = "https://dcmcore.com/"


def git_lastmod(path):
    try:
        out = subprocess.run(["git", "log", "-1", "--format=%cs", "--", path],
                             capture_output=True, text=True, check=True).stdout.strip()
        if out:
            return out
    except Exception:
        pass
    return datetime.fromtimestamp(os.path.getmtime(path)).strftime('%Y-%m-%d')

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
        if any(x in basename.lower() for x in ["backup", "admin", "login", "dashboard", "cgu", "cgv", "privacy", "cookies", "terms", "mentions",
                                                   "google", "auth-callback", "update-password", "org-settings", "webhook",
                                                   "quiz-review", "diploma", "certificate", "index_en", "index-simple_en",
                                                   "investor", "series-a", "vc-tear-sheet", "pilot-intake", "legal_pilot_demo"]):
            continue
            
        # Read file to check if it's a redirect or has a noindex tag
        try:
            with open(f_path, 'r', encoding='utf-8', errors='ignore') as file_obj:
                file_content = file_obj.read()
                
                # Check for redirects
                if 'http-equiv="refresh"' in file_content or 'http-equiv="Refresh"' in file_content or 'window.location.replace' in file_content:
                    # Skip redirect files from sitemap
                    continue
                    
                # Check for noindex tag
                if re.search(r'<meta[^>]*name="robots"[^>]*noindex', file_content, re.I):
                    # Skip noindex files from sitemap
                    continue
        except Exception as e:
            print(f"Warning: could not read {f_path} to check metadata: {e}")
            
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
        
        # lastmod = date of the file's last git commit (file mtimes are reset on checkout)
        lastmod_str = git_lastmod(f_path)
        lastmod = ET.SubElement(url, 'lastmod')
        lastmod.text = lastmod_str
        # priority / changefreq intentionally omitted: Google ignores both.

    xml_str = ET.tostring(urlset, encoding='utf-8')
    parsed = minidom.parseString(xml_str)
    with open(filename, "w", encoding='utf-8') as f:
        f.write(parsed.toprettyxml(indent="  "))
    print(f"Generated {filename}")

# Gather files
fr_html = [f for f in glob.glob('fr/**/*.html', recursive=True) if os.path.isfile(f)]
en_html = [f for f in glob.glob('en/**/*.html', recursive=True) if os.path.isfile(f)]

# Generate individual sitemaps
create_sitemap(fr_html, "sitemap-fr.xml", "fr")
create_sitemap(en_html, "sitemap-en.xml", "en")

# Generate Sitemap Index
sitemapindex = ET.Element('sitemapindex', xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
for sm in ["sitemap-fr.xml", "sitemap-en.xml"]:
    sitemap = ET.SubElement(sitemapindex, 'sitemap')
    loc = ET.SubElement(sitemap, 'loc')
    loc.text = f"{base_url}{sm}"

xml_str = ET.tostring(sitemapindex, encoding='utf-8')
parsed = minidom.parseString(xml_str)
with open("sitemap.xml", "w", encoding='utf-8') as f:
    f.write(parsed.toprettyxml(indent="  "))

print("Sitemap Index Generated at sitemap.xml")
