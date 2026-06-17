import os
import xml.etree.ElementTree as ET
import re

base_dir = "/Users/joanl/blockchain-presentation"

def analyze_sitemap(sitemap_file):
    print(f"\nAnalyzing sitemap: {sitemap_file}")
    tree = ET.parse(os.path.join(base_dir, sitemap_file))
    root = tree.getroot()
    ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    
    redirect_files = []
    canonical_mismatches = []
    missing_canonicals = []
    
    for url in root.findall('sm:url', ns):
        loc = url.find('sm:loc', ns).text
        # Map loc back to file path
        # Example: https://dcmcore.com/en/buidl.html -> en/buidl.html
        rel_path = loc.replace("https://dcmcore.com/", "")
        
        # If it's a directory like en/buidl/, it matches en/buidl/index.html
        file_path = os.path.join(base_dir, rel_path)
        if loc.endswith("/"):
            file_path = os.path.join(file_path, "index.html")
            
        if not os.path.exists(file_path):
            # Try appending index.html if it doesn't end with html
            if not file_path.endswith(".html"):
                file_path_index = os.path.join(file_path, "index.html")
                if os.path.exists(file_path_index):
                    file_path = file_path_index
                else:
                    print(f"File not found: {file_path} (from {loc})")
                    continue
            else:
                print(f"File not found: {file_path} (from {loc})")
                continue
                
        # Read file to check for meta refresh or canonical tag
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        # Check if it is a redirect page
        if 'http-equiv="refresh"' in content or 'http-equiv="Refresh"' in content or 'window.location.replace' in content:
            redirect_files.append((loc, rel_path))
            
        # Check canonical tag
        canonical_match = re.search(r'<link\s+[^>]*rel=["\']canonical["\'][^>]*href=["\'](.*?)["\']', content, re.IGNORECASE)
        if canonical_match:
            canonical_url = canonical_match.group(1)
            if canonical_url != loc:
                canonical_mismatches.append((loc, canonical_url))
        else:
            missing_canonicals.append(loc)
            
    print(f"Total URLs: {len(root.findall('sm:url', ns))}")
    print(f"Redirect URLs found in sitemap: {len(redirect_files)}")
    for loc, rel in redirect_files[:10]:
        print(f"  - Redirect: {loc} (points to target file {rel})")
    if len(redirect_files) > 10:
        print("  - ...")
        
    print(f"Canonical mismatches: {len(canonical_mismatches)}")
    for loc, canon in canonical_mismatches[:10]:
        print(f"  - Sitemap loc: {loc}\n    Canonical tag: {canon}")
    if len(canonical_mismatches) > 10:
        print("  - ...")
        
    print(f"Missing canonical tags: {len(missing_canonicals)}")
    for loc in missing_canonicals[:10]:
        print(f"  - Missing: {loc}")

analyze_sitemap("sitemap-en.xml")
analyze_sitemap("sitemap-fr.xml")
