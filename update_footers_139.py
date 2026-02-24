import os
import glob

footer_snippet = """                    <li><a href="institutional-problem-statement.html">Strategic Vision</a></li>
                    <li><a href="competitive-landscape.html">Competitive Landscape</a></li>
                    <li><a href="governance-os-landing.html">Institutional Governance</a></li>"""

html_files = glob.glob("/Users/joanl/blockchain-presentation/**/*.html", recursive=True)

for file_path in html_files:
    if "components/" in file_path:
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple replace
    new_content = content.replace('<li><a href="institutional-problem-statement.html">Strategic Vision</a></li>\n                    <li><a href="governance-os-landing.html">Institutional Governance</a></li>', footer_snippet)
    
    # Handle subfolders navigation
    subfolder_search = '<li><a href="../institutional-problem-statement.html">Strategic Vision</a></li>\n                    <li><a href="../governance-os-landing.html">Institutional Governance</a></li>'
    subfolder_replace = '<li><a href="../institutional-problem-statement.html">Strategic Vision</a></li>\n                    <li><a href="../competitive-landscape.html">Competitive Landscape</a></li>\n                    <li><a href="../governance-os-landing.html">Institutional Governance</a></li>'
    new_content = new_content.replace(subfolder_search, subfolder_replace)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated footer links in {file_path}")
