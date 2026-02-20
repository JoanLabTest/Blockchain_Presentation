import os
import re

def process_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()

    original_content = content
    filename = os.path.basename(filepath)

    # 1. Add loading="lazy" to images
    def add_lazy(match):
        tag = match.group(0)
        if 'loading=' not in tag:
            return tag.replace('<img ', '<img loading="lazy" ')
        return tag
    
    content = re.sub(r'<img [^>]+>', add_lazy, content)

    # 2. Add hreflang to <head>
    if '<head>' in content and 'hreflang="fr"' not in content:
        url = f"https://joanlabtest.github.io/Blockchain_Presentation/{filename}"
        if filename == 'index.html':
            url = "https://joanlabtest.github.io/Blockchain_Presentation/"
            
        hreflang_tags = f'\n    <link rel="alternate" hreflang="fr" href="{url}">\n    <link rel="alternate" hreflang="x-default" href="{url}">'
        content = content.replace('<head>', f'<head>{hreflang_tags}', 1)

    # 3. Add defer to non-critical external scripts (like Chart.js)
    def defer_script(match):
        tag = match.group(0)
        if 'defer' not in tag and 'async' not in tag:
            return tag.replace('<script ', '<script defer ')
        return tag

    # Targeting Chart.js specifically as requested
    content = re.sub(r'<script [^>]*src="https://cdn.jsdelivr.net/npm/chart.js"[^>]*></script>', defer_script, content)
    # Also AOS animation script
    content = re.sub(r'<script [^>]*src="https://unpkg.com/aos@2.3.1/dist/aos.js"[^>]*></script>', defer_script, content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Optimized {filename}")

if __name__ == "__main__":
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]
    for file in html_files:
        process_html_file(file)
    print("SEO optimization script completed.")
