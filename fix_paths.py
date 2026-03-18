import os
import re

def fix_paths(file_path, levels_deep):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    prefix = '../' * levels_deep

    def repl(match):
        attr = match.group(1)
        url = match.group(2)
        
        if url.startswith('http') or url.startswith('//') or url.startswith('#') or url.startswith('data:') or url.startswith('/') or url == '':
            return match.group(0)
            
        if url.startswith('../'):
            return f'{attr}="{prefix}{url}"'
            
        if url.startswith('./'):
            return f'{attr}="{prefix}{url[2:]}"'
            
        return f'{attr}="{prefix}{url}"'

    modified = re.sub(r'(href|src)="([^"]+)"', repl, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(modified)
    
    print(f"Updated paths in {file_path}")

fix_paths('en/learn/index.html', 1)
fix_paths('en/expert/index.html', 1)
fix_paths('en/academy/pro/index.html', 2)
