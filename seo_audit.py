import os
import glob
from bs4 import BeautifulSoup

def audit_html_files(directory):
    html_files = glob.glob(os.path.join(directory, "**/*.html"), recursive=True)
    issues = {
        "missing_title": [],
        "missing_description": [],
        "missing_canonical": [],
        "missing_json_ld": []
    }
    
    for file_path in html_files:
        if "components/" in file_path or "node_modules/" in file_path:
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            soup = BeautifulSoup(content, 'html.parser')
            
            relative_path = os.path.relpath(file_path, directory)
            
            # Check title
            if not soup.find('title') or not soup.find('title').text.strip():
                issues["missing_title"].append(relative_path)
                
            # Check meta description
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            if not meta_desc or not meta_desc.get('content', '').strip():
                issues["missing_description"].append(relative_path)
                
            # Check canonical link
            canonical = soup.find('link', attrs={'rel': 'canonical'})
            if not canonical or not canonical.get('href', '').strip():
                issues["missing_canonical"].append(relative_path)
                
            # Check JSON-LD
            json_ld = soup.find('script', attrs={'type': 'application/ld+json'})
            if not json_ld:
                issues["missing_json_ld"].append(relative_path)
                
    return issues

if __name__ == "__main__":
    issues = audit_html_files("/Users/joanl/blockchain-presentation")
    
    print("\n=== FINAL SEO AUDIT REPORT ===")
    print(f"\nMissing Title tags: {len(issues['missing_title'])}")
    for path in issues["missing_title"]: print(f"- {path}")
        
    print(f"\nMissing Meta Descriptions: {len(issues['missing_description'])}")
    for path in issues["missing_description"]: print(f"- {path}")
        
    print(f"\nMissing Canonical Links: {len(issues['missing_canonical'])}")
    for path in issues["missing_canonical"]: print(f"- {path}")
        
    print(f"\nMissing JSON-LD: {len(issues['missing_json_ld'])}")
    for path in issues["missing_json_ld"]: print(f"- {path}")
