import os
import glob
import re

ACADEMY_LINK_FR = """                    <a href="methodology/index.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-microscope" style="color:#94a3b8;"></i></div>
                        <div class="link-text"><span class="link-title">Méthodologie</span><span
                                class="link-desc">Standards de recherche DCM</span></div>
                    </a>
                    <a href="academy.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-graduation-cap" style="color:#3b82f6;"></i></div>
                        <div class="link-text"><span class="link-title">Academy</span><span
                                class="link-desc">Formation institutionnelle</span></div>
                    </a>"""

ACADEMY_LINK_EN = """                    <a href="methodology/index.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-microscope" style="color:#94a3b8;"></i></div>
                        <div class="link-text"><span class="link-title">Methodology</span><span
                                class="link-desc">DCM Research Standards</span></div>
                    </a>
                    <a href="academy.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-graduation-cap" style="color:#3b82f6;"></i></div>
                        <div class="link-text"><span class="link-title">Academy</span><span
                                class="link-desc">Institutional Certification</span></div>
                    </a>"""

def process_file(filepath, is_fr):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Determine what string to target. It varies by depth, but methodology is consistent inside Knowledge mega-dropdown
    # Actually, the base path depends on the depth of the file relative to the root.
    # It might be `href="methodology/index.html"` or `href="../methodology/index.html"` or `href="../../methodology/index.html"`
    
    # Let's use regex to find the methodology link and insert Academy after it.
    
    if is_fr:
        academy_block = """
                    <a href="{prefix}academy.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-graduation-cap" style="color:#3b82f6;"></i></div>
                        <div class="link-text"><span class="link-title">Academy</span><span
                                class="link-desc">Formation institutionnelle</span></div>
                    </a>"""
    else:
        academy_block = """
                    <a href="{prefix}academy.html" class="dropdown-link">
                        <div class="link-icon"><i class="fas fa-graduation-cap" style="color:#3b82f6;"></i></div>
                        <div class="link-text"><span class="link-title">Academy</span><span
                                class="link-desc">Institutional Certification</span></div>
                    </a>"""

    # We need to find the `href="XYZmethodology/index.html"` to determine the `XYZ` prefix.
    # Regex for Methodology link:
    pattern = r'(<a href="([^"]*)methodology/index\.html" class="dropdown-link">\s*<div class="link-icon"><i class="fas fa-microscope" style="color:#94a3b8;"></i></div>\s*<div class="link-text">.*?</div>\s*</a>)'
    
    match = re.search(pattern, content, re.DOTALL)
    if match:
        full_match = match.group(1)
        prefix = match.group(2) # e.g. "", "../", "../../"
        # Only inject if academy is not already there
        if "academy.html" not in content[match.end():match.end()+300]:
            replacement = full_match + academy_block.format(prefix=prefix)
            content = content.replace(full_match, replacement)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
    return False

fr_files = glob.glob('/Users/joanl/blockchain-presentation/fr/**/*.html', recursive=True)
en_files = glob.glob('/Users/joanl/blockchain-presentation/en/**/*.html', recursive=True)

count = 0
for f in fr_files:
    if '.gemini' in f: continue
    if process_file(f, True): count += 1

for f in en_files:
    if '.gemini' in f: continue
    if process_file(f, False): count += 1

print(f"Added Academy to {count} files.")
