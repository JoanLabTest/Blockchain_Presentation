import os
import glob
from bs4 import BeautifulSoup
import re

def audit_performance(directory):
    html_files = glob.glob(os.path.join(directory, "**/*.html"), recursive=True)
    report = {
        "missing_lazy_load": [],
        "large_images": [],
        "font_display": []
    }
    
    for file_path in html_files:
        if "components/" in file_path or "node_modules/" in file_path:
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            soup = BeautifulSoup(content, 'html.parser')
            relative_path = os.path.relpath(file_path, directory)

        # 1. Missing Lazy Load on Images
        images = soup.find_all('img')
        for img in images:
            if not img.get('loading') == 'lazy':
                if relative_path not in report["missing_lazy_load"]:
                    report["missing_lazy_load"].append(relative_path)
                
        # 2. Font Display optimization check
        fonts = soup.find_all('link', href=re.compile(r'fonts\.googleapis\.com'))
        for font in fonts:
            if 'display=swap' not in font.get('href', ''):
                if relative_path not in report["font_display"]:
                    report["font_display"].append(relative_path)

    return report

if __name__ == "__main__":
    rep = audit_performance("/Users/joanl/blockchain-presentation")
    
    print("\n=== PERFORMANCE AUDIT REPORT ===")
    print(f"\nFiles missing 'loading=\"lazy\"' on <img> tags: {len(rep['missing_lazy_load'])}")
    for file in rep['missing_lazy_load'][:10]: print(f"- {file}")
    if len(rep['missing_lazy_load']) > 10: print("  ... and others")
        
    print(f"\nFiles missing '&display=swap' in Google Fonts: {len(rep['font_display'])}")
    for file in rep['font_display']: print(f"- {file}")

