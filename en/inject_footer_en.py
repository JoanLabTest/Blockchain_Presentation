import os
import glob
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Calculate depth to root for base-path and script path
    # Root is /en/
    relative_path = os.path.relpath(filepath, '/Users/joanl/blockchain-presentation/en')
    depth = relative_path.count('/')
    
    prefix = '../' * depth
    if depth == 0:
        prefix = ''

    # 1. Inject script in <head> if not already there
    script_tag = f'<script src="{prefix}js/global-footer.js"></script>'
    if 'global-footer.js' not in content:
        content = re.sub(r'(</head>)', f'    {script_tag}\n\\1', content, flags=re.IGNORECASE)

    # 2. Replace existing <footer> block
    footer_pattern = re.compile(r'<footer[^>]*>.*?</footer>', re.DOTALL | re.IGNORECASE)
    
    replacement = f'<global-footer base-path="{prefix}"></global-footer>'
    
    if footer_pattern.search(content):
        content = footer_pattern.sub(replacement, content, count=1)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

html_files = glob.glob('/Users/joanl/blockchain-presentation/en/**/*.html', recursive=True)
count = 0
for f in html_files:
    if '.gemini' in f: continue
    process_file(f)
    count += 1

print(f"Replaced EN footer in {count} files.")
