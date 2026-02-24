import os
import glob
import re

html_files = glob.glob("/Users/joanl/blockchain-presentation/**/*.html", recursive=True)

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match the specific block in the footer
    # Root level
    root_pattern = re.compile(r'<li><a href="(?:institutional-problem-statement\.html|competitive-landscape\.html|series-a-narrative\.html)">.*?</a></li>\s*<li><a href="(?:institutional-problem-statement\.html|competitive-landscape\.html|series-a-narrative\.html)">.*?</a></li>\s*<li><a href="governance-os-landing\.html">Institutional Governance</a></li>')
    root_pattern_fallback = re.compile(r'<li><a href="institutional-problem-statement\.html">Strategic Vision</a></li>\s*<li><a href="governance-os-landing\.html">Institutional Governance</a></li>')
    
    root_replacement = """<li><a href="institutional-problem-statement.html">Strategic Vision</a></li>
                    <li><a href="competitive-landscape.html">Competitive Landscape</a></li>
                    <li><a href="series-a-narrative.html">Series A Deck</a></li>
                    <li><a href="governance-os-landing.html">Institutional Governance</a></li>"""
    
    # Subfolder level
    sub_pattern = re.compile(r'<li><a href="\.\./(?:institutional-problem-statement\.html|competitive-landscape\.html|series-a-narrative\.html)">.*?</a></li>\s*<li><a href="\.\./(?:institutional-problem-statement\.html|competitive-landscape\.html|series-a-narrative\.html)">.*?</a></li>\s*<li><a href="\.\./governance-os-landing\.html">Institutional Governance</a></li>')
    sub_pattern_fallback = re.compile(r'<li><a href="\.\./institutional-problem-statement\.html">Strategic Vision</a></li>\s*<li><a href="\.\./governance-os-landing\.html">Institutional Governance</a></li>')
    
    sub_replacement = """<li><a href="../institutional-problem-statement.html">Strategic Vision</a></li>
                    <li><a href="../competitive-landscape.html">Competitive Landscape</a></li>
                    <li><a href="../series-a-narrative.html">Series A Deck</a></li>
                    <li><a href="../governance-os-landing.html">Institutional Governance</a></li>"""
    
    new_content = content
    if sub_pattern.search(new_content) or sub_pattern_fallback.search(new_content):
        new_content = sub_pattern.sub(sub_replacement, new_content)
        new_content = sub_pattern_fallback.sub(sub_replacement, new_content)
    elif root_pattern.search(new_content) or root_pattern_fallback.search(new_content):
        new_content = root_pattern.sub(root_replacement, new_content)
        new_content = root_pattern_fallback.sub(root_replacement, new_content)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated footer links in {file_path}")
