import os
import glob
import re

base_dir = "/Users/joanl/blockchain-presentation"

def check_canonicals():
    html_files = glob.glob(os.path.join(base_dir, "**/*.html"), recursive=True)
    
    issues = []
    
    for file_path in html_files:
        if "node_modules" in file_path or "nvm-master" in file_path or ".git" in file_path:
            continue
            
        rel_path = os.path.relpath(file_path, base_dir)
        
        # Read file
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        # Skip redirect files
        if 'http-equiv="refresh"' in content or 'http-equiv="Refresh"' in content or 'window.location.replace' in content:
            continue
            
        # Find canonical
        canonical_match = re.search(r'<link\s+[^>]*rel=["\']canonical["\'][^>]*href=["\'](.*?)["\']', content, re.IGNORECASE)
        if not canonical_match:
            issues.append((rel_path, "Missing canonical tag"))
            continue
            
        canonical_url = canonical_match.group(1)
        
        # Validate canonical URL
        # Must start with https://dcmcore.com/
        if not canonical_url.startswith("https://dcmcore.com/"):
            issues.append((rel_path, f"Canonical does not start with https://dcmcore.com/: {canonical_url}"))
            continue
            
        canonical_path = canonical_url.replace("https://dcmcore.com/", "")
        
        # Now check if the canonical path is valid for GitHub Pages
        # On GitHub Pages, a path like "en/strategies/usyc-tokenized-treasury" is invalid because it has no .html extension and no trailing slash.
        # Valid cases:
        # 1. Ends with .html (e.g. en/strategies/usyc-tokenized-treasury.html) and matches the file path
        # 2. Ends with / (e.g. en/buidl/) and there is a matching directory/index.html (e.g. en/buidl/index.html)
        # 3. It is empty (root) or just "fr/" or "en/" and matches index.html
        
        if canonical_path.endswith(".html"):
            # Should match rel_path
            expected_rel = canonical_path
            if rel_path != expected_rel:
                issues.append((rel_path, f"Canonical mismatch: points to {canonical_url} but file is {rel_path}"))
        elif canonical_path.endswith("/") or canonical_path == "":
            # Should have index.html
            expected_rel = os.path.join(canonical_path, "index.html") if canonical_path else "index.html"
            # Normalize path separators
            expected_rel = expected_rel.replace("\\", "/")
            if rel_path != expected_rel:
                issues.append((rel_path, f"Canonical mismatch: points to directory style {canonical_url} but file is {rel_path}"))
        else:
            # Extensionless and no trailing slash - invalid on GitHub Pages!
            issues.append((rel_path, f"Invalid extensionless canonical URL (no trailing slash): {canonical_url}"))
            
    print(f"Total files checked: {len(html_files)}")
    print(f"Total issues found: {len(issues)}")
    for rel, msg in issues:
        print(f"File: {rel} -> {msg}")

check_canonicals()
