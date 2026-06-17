import os
import glob
import re

base_dir = "/Users/joanl/blockchain-presentation"

def fix_seo():
    html_files = glob.glob(os.path.join(base_dir, "**/*.html"), recursive=True)
    
    redirect_count = 0
    missing_count = 0
    mismatch_count = 0
    fixed_count = 0
    
    for file_path in html_files:
        if "node_modules" in file_path or "nvm-master" in file_path or ".git" in file_path or "scratch" in file_path:
            continue
            
        rel_path = os.path.relpath(file_path, base_dir)
        rel_path = rel_path.replace("\\", "/") # Normalize Windows paths if any
        
        # Read file
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        # Check if redirect
        if 'http-equiv="refresh"' in content or 'http-equiv="Refresh"' in content or 'window.location.replace' in content:
            redirect_count += 1
            continue
            
        # Determine correct canonical URL
        if rel_path == "index.html":
            canonical_url = "https://dcmcore.com/"
        elif rel_path.endswith("/index.html"):
            dir_path = rel_path[:-10] # Remove index.html
            canonical_url = f"https://dcmcore.com/{dir_path}"
        else:
            canonical_url = f"https://dcmcore.com/{rel_path}"
            
        # Let's inspect canonical tag in content
        canonical_pattern = re.compile(r'<link\s+[^>]*rel=["\']canonical["\'][^>]*href=["\'](.*?)["\']\s*/?>', re.IGNORECASE)
        canonical_match = canonical_pattern.search(content)
        
        updated_content = content
        
        if not canonical_match:
            # Missing canonical!
            missing_count += 1
            canonical_tag = f'\n    <link rel="canonical" href="{canonical_url}" />'
            
            # Find a place to inject: right after <head>
            head_match = re.search(r'<head\b[^>]*>', content, re.IGNORECASE)
            if head_match:
                insert_pos = head_match.end()
                updated_content = content[:insert_pos] + canonical_tag + content[insert_pos:]
            else:
                # If no <head>, search for <html> or start of file
                html_match = re.search(r'<html\b[^>]*>', content, re.IGNORECASE)
                if html_match:
                    insert_pos = html_match.end()
                    updated_content = content[:insert_pos] + canonical_tag + content[insert_pos:]
                else:
                    updated_content = canonical_tag + "\n" + content
        else:
            current_canonical = canonical_match.group(1)
            # Special case for fr/intelligence/hub.html
            if rel_path == "fr/intelligence/hub.html":
                canonical_url = "https://dcmcore.com/fr/intelligence/hub.html"
                
            # If current canonical is not equal to correct canonical
            if current_canonical != canonical_url:
                mismatch_count += 1
                # Replace canonical tag
                old_tag = canonical_match.group(0)
                new_tag = f'<link rel="canonical" href="{canonical_url}" />'
                updated_content = content.replace(old_tag, new_tag)
                
        # Also clean up alternate links for strategies and academy pro
        # 1. For strategies, replace the extensionless alternate links with .html links
        strategies_mappings = {
            "https://dcmcore.com/en/strategies/usyc-tokenized-treasury": "https://dcmcore.com/en/strategies/usyc-tokenized-treasury.html",
            "https://dcmcore.com/fr/strategies/usyc-tresor-tokenise": "https://dcmcore.com/fr/strategies/usyc-tresor-tokenise.html",
            "https://dcmcore.com/en/strategies/blackrock-ethb-staked-ethereum-etf": "https://dcmcore.com/en/strategies/blackrock-ethb-staked-ethereum-etf.html",
            "https://dcmcore.com/fr/strategies/blackrock-ethb-staked-ethereum-etf": "https://dcmcore.com/fr/strategies/blackrock-ethb-staked-ethereum-etf.html",
            "https://dcmcore.com/en/strategies/covered-call-etf": "https://dcmcore.com/en/strategies/covered-call-etf.html",
            "https://dcmcore.com/fr/strategies/etf-covered-call": "https://dcmcore.com/fr/strategies/etf-covered-call.html",
        }
        
        # 2. For academy pro / quiz redirects, fix alternate links pointing to quiz.html
        quiz_mappings = {
            "https://dcmcore.com/en/quiz.html": "https://dcmcore.com/en/academy/pro/",
            "https://dcmcore.com/fr/quiz.html": "https://dcmcore.com/fr/academy/pro/",
            "https://dcmcore.com/quiz.html": "https://dcmcore.com/en/academy/pro/",
        }
        
        # Apply mappings to alternate hreflangs
        for old_url, new_url in list(strategies_mappings.items()) + list(quiz_mappings.items()):
            # Search for <link rel="alternate" ... href="old_url" ... />
            # Or simply replace the URL string inside <link ...> blocks
            # To be safe, we can do a regex find and replace for hreflang links
            pattern = re.compile(r'(<link\s+[^>]*href=["\'])' + re.escape(old_url) + r'(["\'][^>]*>)', re.IGNORECASE)
            updated_content = pattern.sub(r'\g<1>' + new_url + r'\g<2>', updated_content)

        # For fr/intelligence/hub.html, fix the duplicate/wrong hreflang="fr" tag
        if rel_path == "fr/intelligence/hub.html":
            # Let's inspect its hreflangs:
            # <link rel="alternate" hreflang="fr" href="https://dcmcore.com/en/intelligence/hub.html"/>
            # <link rel="alternate" hreflang="fr" href="https://dcmcore.com/fr/intelligence/hub.html"/>
            # We want to replace the first one with hreflang="en"
            wrong_hreflang = '<link rel="alternate" hreflang="fr" href="https://dcmcore.com/en/intelligence/hub.html"/>'
            correct_hreflang = '<link rel="alternate" hreflang="en" href="https://dcmcore.com/en/intelligence/hub.html"/>'
            updated_content = updated_content.replace(wrong_hreflang, correct_hreflang)
            
        if updated_content != content:
            fixed_count += 1
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
                
    print(f"Total redirects skipped: {redirect_count}")
    print(f"Total missing canonicals fixed: {missing_count}")
    print(f"Total mismatched canonicals fixed: {mismatch_count}")
    print(f"Total files written/fixed: {fixed_count}")

fix_seo()
