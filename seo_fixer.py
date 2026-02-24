import os
import glob
from bs4 import BeautifulSoup
import json

BASE_URL = "https://dcm-digital.com/" 

def generate_json_ld(filepath, soup):
    filename = os.path.basename(filepath)
    title_tag = soup.find('title')
    title = title_tag.text.strip() if title_tag and title_tag.text.strip() else 'DCM Digital'
    desc = soup.find('meta', attrs={'name': 'description'})
    desc_content = desc.get('content', '').strip() if desc else 'Governance Infrastructure for Digital Assets'

    schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": title,
        "description": desc_content,
        "url": f"{BASE_URL}{filename}"
    }

    if "case-study" in filename or "mrm" in filename or "whitepaper" in filename:
        schema["@type"] = "Article"
    elif "dashboard" in filename or "admin" in filename or "quiz" in filename:
        schema["@type"] = "SoftwareApplication"
        schema["applicationCategory"] = "BusinessApplication"

    return json.dumps(schema, indent=2)


def fix_html_files(directory):
    html_files = glob.glob(os.path.join(directory, "**/*.html"), recursive=True)
    count = 0
    
    for file_path in html_files:
        if "components/" in file_path or "node_modules/" in file_path:
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            soup = BeautifulSoup(content, 'html.parser')
            
        head = soup.find('head')
        if not head:
            continue

        modified = False
        filename = os.path.basename(file_path)
        
        # 1. Fix Title
        if not soup.find('title') or not soup.find('title').text.strip():
            title_tag = soup.new_tag('title')
            clean_name = filename.replace('.html', '').replace('-', ' ').title()
            title_tag.string = f"{clean_name} - DCM Digital"
            head.insert(0, title_tag)
            modified = True
            
        # 2. Fix Meta Description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if not meta_desc or not meta_desc.get('content', '').strip():
            clean_name = filename.replace('.html', '').replace('-', ' ').title()
            if not meta_desc:
                meta_desc = soup.new_tag('meta', attrs={'name': 'description', 'content': f"Explore the {clean_name} module of the DCM Digital Governance OS."})
                head.append(meta_desc)
            else:
                meta_desc['content'] = f"Explore the {clean_name} module of the DCM Digital Governance OS."
            modified = True
            
        # 3. Fix Canonical
        canonical = soup.find('link', attrs={'rel': 'canonical'})
        if not canonical:
            relative_path = os.path.relpath(file_path, directory).replace("\\", "/") 
            canonical = soup.new_tag('link', attrs={'rel': 'canonical', 'href': f"{BASE_URL}{relative_path}"})
            head.append(canonical)
            modified = True
            
        # 4. Fix JSON-LD
        json_ld = soup.find('script', attrs={'type': 'application/ld+json'})
        if not json_ld:
            script_tag = soup.new_tag('script', type='application/ld+json')
            script_tag.string = generate_json_ld(file_path, soup)
            head.append(script_tag)
            modified = True
            
        if modified:
            count += 1
            # Using formatter=None to avoid bs4 weird HTML entity escaping on existing code
            html_str = soup.encode("utf-8", formatter=None).decode("utf-8")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html_str)

    return count

if __name__ == "__main__":
    fixed = fix_html_files("/Users/joanl/blockchain-presentation")
    print(f"Fixed {fixed} files with SEO metadata.")
