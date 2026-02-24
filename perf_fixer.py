import os
import glob
from bs4 import BeautifulSoup
import re

def fix_performance(directory):
    html_files = glob.glob(os.path.join(directory, "**/*.html"), recursive=True)
    count_files_modified = 0
    count_images_lazy_loaded = 0
    
    for file_path in html_files:
        if "components/" in file_path or "node_modules/" in file_path:
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            soup = BeautifulSoup(content, 'html.parser')
            
        modified = False
        
        # 1. Add lazy loading to images
        images = soup.find_all('img')
        for img in images:
            if not img.get('loading'):
                img['loading'] = 'lazy'
                count_images_lazy_loaded += 1
                modified = True
                
        # 2. Fix Google Fonts display
        fonts = soup.find_all('link', href=re.compile(r'fonts\.googleapis\.com'))
        for font in fonts:
            href = font.get('href', '')
            if 'display=swap' not in href:
                if '?' in href:
                    font['href'] = href + '&display=swap'
                else:
                    font['href'] = href + '?display=swap'
                modified = True
                
        if modified:
            count_files_modified += 1
            html_str = soup.encode("utf-8", formatter=None).decode("utf-8")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html_str)

    return count_files_modified, count_images_lazy_loaded

if __name__ == "__main__":
    files, images = fix_performance("/Users/joanl/blockchain-presentation")
    print(f"\n✅ Performance Optimizations Complete")
    print(f"- Files modified: {files}")
    print(f"- Images lazy-loaded: {images}")
