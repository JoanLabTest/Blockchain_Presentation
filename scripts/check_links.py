import os
import glob
import re
from urllib.parse import urlparse, unquote

def find_broken_links():
    html_files = glob.glob('**/*.html', recursive=True)
    print(f"Scanning {len(html_files)} HTML files...")
    
    broken_links = []
    total_checked = 0
    
    for file_path in html_files:
        dir_name = os.path.dirname(file_path)
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        except Exception as e:
            continue
            
        # Simple regex to find href attributes
        links = re.findall(r'href=["\']([^"\']+\.html[^"\']*)["\']', content)
        
        for link in links:
            # Clean fragments and queries
            clean_link = link.split('#')[0].split('?')[0]
            if not clean_link or clean_link.startswith(('http', 'mailto:', 'tel:', 'javascript:')):
                continue
            
            total_checked += 1
            
            # URL decoding
            decoded_path = unquote(clean_link)
            
            # Construct target path relative to repository root
            if decoded_path.startswith('/'):
                # Absolute from root
                target_path = decoded_path.lstrip('/')
            else:
                # Relative to current file dir
                target_path = os.path.normpath(os.path.join(dir_name, decoded_path))
            
            if not os.path.exists(target_path):
                broken_links.append((file_path, link, target_path))
                
    print(f"Checked {total_checked} internal links.")
    print(f"Found {len(broken_links)} potentially broken internal links.")
    
    # List unique broken links
    unique_broken = sorted(list(set([b[2] for b in broken_links])))
    print("\nTop missing target paths:")
    for b in unique_broken[:50]:
        print(f" - {b}")
        
    # Log to output for the agent
    with open('broken_links_report.txt', 'w') as rf:
        for source, link, target in broken_links:
            rf.write(f"Source: {source} -> Href: {link} -> Expected Path: {target}\n")

if __name__ == "__main__":
    find_broken_links()
