import glob
import re

html_files = glob.glob("/Users/joanl/blockchain-presentation/**/*.html", recursive=True)

for file_path in html_files:
    if "components/" in file_path:
        continue

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Root level pattern
    root_pattern = re.compile(r'<li><a href="economic-model\.html">Economic Model</a></li>\s*<li><a href="data-certification\.html">Data Trust Certif</a></li>')
    root_replacement = """<li><a href="economic-model.html">Economic Model</a></li>
                    <li><a href="risk-engine.html">Risk Engine 3.0</a></li>
                    <li><a href="data-certification.html">Data Trust Certif</a></li>"""
    
    # Subfolder level pattern
    sub_pattern = re.compile(r'<li><a href="\.\./economic-model\.html">Economic Model</a></li>\s*<li><a href="\.\./data-certification\.html">Data Trust Certif</a></li>')
    sub_replacement = """<li><a href="../economic-model.html">Economic Model</a></li>
                    <li><a href="../risk-engine.html">Risk Engine 3.0</a></li>
                    <li><a href="../data-certification.html">Data Trust Certif</a></li>"""
    
    new_content = content
    if sub_pattern.search(new_content):
        new_content = sub_pattern.sub(sub_replacement, new_content)
    elif root_pattern.search(new_content):
        new_content = root_pattern.sub(root_replacement, new_content)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated footer links in {file_path}")
