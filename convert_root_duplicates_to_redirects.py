import os
import glob

# Script to convert duplicate root-level HTML pages into clean canonical redirects

base_dir = "/Users/joanl/blockchain-presentation"

template = """<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url={target_url}">
    <link rel="canonical" href="{canonical_url}">
    <title>Redirecting...</title>
    <script>
        window.location.replace("{target_url}");
    </script>
</head>
<body>
    <p>If you are not redirected automatically, follow this <a href="{target_url}">link</a>.</p>
</body>
</html>"""

# Define explicit manual redirections for files that don't match simple filename mapping
manual_redirects = {
    "index.html": "/fr/index.html",
    "simple.html": "/fr/learn/",
    "buidl.html": "/fr/buidl/", # Redirect to clean directory URL
    "quiz.html": "/fr/academy/pro/",
}

def clean_root_duplicates():
    # Find all HTML files in the root folder
    root_html_files = [f for f in glob.glob('*.html') if os.path.isfile(f)]
    
    # Exclude files that must NOT be converted to redirects
    exclude_files = {
        "404.html",
        "google03ad9983118ea159.html",
    }
    
    converted_count = 0
    
    for filename in root_html_files:
        if filename in exclude_files:
            continue
            
        # Determine the target URL
        if filename in manual_redirects:
            target_url = manual_redirects[filename]
        else:
            # Check if it has a counterpart in /fr/
            fr_counterpart = os.path.join("fr", filename)
            # If it doesn't exist, check inside subfolders or default to fr/about etc.
            # But wait, does it exist in the root?
            # Let's map it: e.g. about.html -> /fr/about.html
            target_url = f"/fr/{filename}"
            
        canonical_url = f"https://dcmcore.com{target_url}"
        
        # Write clean redirect content
        file_path = os.path.join(base_dir, filename)
        content = template.format(target_url=target_url, canonical_url=canonical_url)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
            
        print(f"Converted duplicate root file to clean redirect: {filename} -> {target_url}")
        converted_count += 1
        
    print(f"\nSuccessfully converted {converted_count} root-level duplicate files to redirects.")

if __name__ == '__main__':
    clean_root_duplicates()
