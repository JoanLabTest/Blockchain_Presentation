import os
import re
import json
import math
from collections import Counter, defaultdict

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
    text = re.sub('<[^>]*>', '', html_content)
    text = re.sub('\s+', ' ', text).strip()
    return text

def extract_content(html):
    items = []
    section_pattern = re.compile(r'<section[^>]*id=["\']([^"\']+)["\'][^>]*>(.*?)</section>', re.DOTALL | re.IGNORECASE)
    
    for match in section_pattern.finditer(html):
        section_id = match.group(1)
        section_content = match.group(2)
        h2_match = re.search(r'<h2[^>]*>(.*?)</h2>', section_content, re.IGNORECASE | re.DOTALL)
        title = clean_text(h2_match.group(1)) if h2_match else f"Section {section_id}"
        
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

# --- TF-IDF ENGINE ---
def calculate_tfidf_weights(index_items):
    print("   📊 Computing TF-IDF Scores...")
    
    # 1. Tokenize & Count Docs
    doc_freq = Counter()
    total_docs = len(index_items)
    doc_terms = []

    for item in index_items:
        # Simple tokenizer: lowercase, alpha only
        tokens = set(re.findall(r'\b[a-z]{3,}\b', item['fullText'].lower()))
        doc_terms.append(tokens)
        for t in tokens:
            doc_freq[t] += 1

    # 2. Calculate Score per Doc
    for i, item in enumerate(index_items):
        tokens = re.findall(r'\b[a-z]{3,}\b', item['fullText'].lower())
        term_count = len(tokens)
        if term_count == 0: continue
        
        tf_map = Counter(tokens)
        doc_score = 0
        
        for term, count in tf_map.items():
            tf = count / term_count
            idf = math.log(total_docs / (1 + doc_freq[term]))
            doc_score += tf * idf
        
        # Normalize score to 1-15 scale
        # Heuristic boost: longer, richer text gets higher score
        weight = min(15, max(1, int(doc_score * 50)))
        item['weight'] = weight

    return index_items

# --- KNOWLEDGE GRAPH BUILDER ---
def build_knowledge_graph(index_items):
    print("   🔗 Building Knowledge Graph...")
    
    for i, item_a in enumerate(index_items):
        related = []
        tags_a = set(item_a.get('tags', []))
        tokens_a = set(re.findall(r'\b[a-z]{4,}\b', item_a['title'].lower()))
        
        for j, item_b in enumerate(index_items):
            if i == j: continue
            
            tags_b = set(item_b.get('tags', []))
            tokens_b = set(re.findall(r'\b[a-z]{4,}\b', item_b['title'].lower()))
            
            # Intersection Logic
            tag_overlap = len(tags_a.intersection(tags_b))
            title_overlap = len(tokens_a.intersection(tokens_b))
            
            # Connection Strength Threshold
            score = (tag_overlap * 2) + (title_overlap * 5)
            
            if score >= 4: # e.g., 2 shared tags OR 1 shared title word
                related.append({
                    'id': item_b['id'],
                    'title': item_b['title'],
                    'score': score
                })
        
        # Sort by relevance and distinctness
        related.sort(key=lambda x: x['score'], reverse=True)
        item_a['related'] = [r['id'] for r in related[:3]] # Top 3 links

    return index_items

def main():
    print("🚀 Starting Research OS Index Generation (TF-IDF + Graph)...")
    master_index = []
    base_dir = os.getcwd()
    
    # 1. Extraction
    for file_name in TARGET_FILES:
        file_path = os.path.join(base_dir, file_name)
        if os.path.exists(file_path):
            print(f"   Matches found in {file_name}...")
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
                    'weight': 5 # Initial placeholder
                })

    # 2. Merge Manual Items (High Priority)
    final_index = master_index
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                existing = json.load(f)
                manual = [i for i in existing if i.get('weight', 0) > 9 and 'related' not in i] # High-value manual items, prevent re-processing issues
                print(f"   Merging {len(manual)} Manual High-Value Items...")
                # Dedupe: Remove auto-generated versions if manual exists
                manual_ids = {m['id'] for m in manual}
                final_index = manual + [i for i in master_index if i['id'] not in manual_ids]
        except: pass

    # 3. Apply Research OS Algorithms
    final_index = calculate_tfidf_weights(final_index)
    final_index = build_knowledge_graph(final_index)

    # 4. Save
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(final_index, f, indent=4)
        
    print(f"✅ Research OS Index Generated: {len(final_index)} nodes with Graph Connections.")

if __name__ == "__main__":
    main()
