import os
import re
import json

# CONFIG
TARGET_FILES = [
    'index.html',
    'pos-economics.html',
    'smart-contracts.html',
    'yield-mechanics.html',
    'legal_pilot.html',
    'ai-finance.html',
    'guide.html',
    'simple.html'
]

OUTPUT_FILE = 'search-index.json'

CATEGORY_RULES = {
    'pos-economics.html': 'RISK',
    'smart-contracts.html': 'TECH',
    'yield-mechanics.html': 'MACRO',
    'legal_pilot.html': 'LEGAL',
    'ai-finance.html': 'TECH',
    'guide.html': 'TOOL',
    'simple.html': 'TOOL',
    'index.html': 'GOV'
}

AUTO_TAGS = {
    'risk': ['#Risk', '#Danger'],
    'liquidity': ['#Liquidity', '#Market'],
    'staking': ['#Staking', '#PoS'],
    'contract': ['#SmartContract', '#Code'],
    'legal': ['#Regulation', '#Compliance'],
    'security': ['#Security', '#Audit'],
    'yield': ['#Yield', '#APY'],
    'ai': ['#AI', '#Tech'],
    'token': ['#Tokenization', '#RWA']
}

def clean_text(html_content):
    if not html_content:
        return ""
    # Remove tags
    text = re.sub('<[^>]*>', '', html_content)
    # Remove extra spaces
    text = re.sub('\s+', ' ', text).strip()
    return text

def extract_content(html):
    items = []
    
    # Extract Sections with ID
    # Regex to find <section id="...">...</section>
    # Note: Regex parsing HTML is fragile but sufficient for this controlled codebase
    section_pattern = re.compile(r'<section[^>]*id=["\']([^"\']+)["\'][^>]*>(.*?)</section>', re.DOTALL | re.IGNORECASE)
    
    for match in section_pattern.finditer(html):
        section_id = match.group(1)
        section_content = match.group(2)
        
        # Extract H2
        h2_match = re.search(r'<h2[^>]*>(.*?)</h2>', section_content, re.IGNORECASE | re.DOTALL)
        title = clean_text(h2_match.group(1)) if h2_match else f"Section {section_id}"
        
        # Extract Paragraphs
        p_pattern = re.compile(r'<p[^>]*>(.*?)</p>', re.DOTALL | re.IGNORECASE)
        full_text = ""
        for p_match in p_pattern.finditer(section_content):
            full_text += clean_text(p_match.group(1)) + " "
            
        full_text = full_text.strip()
        
        if len(full_text) > 20:
            items.append({
                'id': section_id,
                'title': title,
                'content': full_text[:150] + "...",
                'fullText': full_text
            })
            
    return items

def generate_tags(text):
    tags = []
    lower_text = text.lower()
    for key, val in AUTO_TAGS.items():
        if key in lower_text:
            tags.extend(val)
    return list(set(tags))

def main():
    print("🚀 Starting Automatic Index Generation (Python)...")
    master_index = []
    
    base_dir = os.getcwd()
    
    for file_name in TARGET_FILES:
        file_path = os.path.join(base_dir, file_name)
        if os.path.exists(file_path):
            print(f"Processing {file_name}...")
            with open(file_path, 'r', encoding='utf-8') as f:
                html = f.read()
                
            sections = extract_content(html)
            
            for section in sections:
                category = CATEGORY_RULES.get(file_name, 'TECH')
                tags = generate_tags(section['fullText'])
                
                master_index.append({
                    'id': f"{file_name.replace('.html','')}-{section['id']}",
                    'title': section['title'],
                    'page': file_name,
                    'anchor': f"#{section['id']}",
                    'category': category,
                    'type': 'Auto-Index',
                    'tags': tags,
                    'content': section['content'],
                    'fullText': section['fullText'],
                    'weight': 5
                })
        else:
            print(f"File not found: {file_name}")

    # Merge with Manual Items
    try:
        final_index = []
        if os.path.exists(OUTPUT_FILE):
            with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                existing_index = json.load(f)
                print(f"Loaded {len(existing_index)} existing manual items.")
                # Keep manual items (weight > 5)
                manual_items = [i for i in existing_index if i.get('weight', 0) > 5]
                final_index = manual_items + master_index
        else:
            final_index = master_index
            
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(final_index, f, indent=4)
            
        print(f"✅ Successfully generated index with {len(final_index)} items.")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
