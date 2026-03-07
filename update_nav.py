import os
import glob
import re

directories = [
    "/Users/joanl/blockchain-presentation/",
    "/Users/joanl/blockchain-presentation/fr/",
    "/Users/joanl/blockchain-presentation/en/",
    "/Users/joanl/blockchain-presentation/observatory/",
    "/Users/joanl/blockchain-presentation/publications/"
]

for dr in directories:
    for filepath in glob.glob(os.path.join(dr, "*.html")):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        if dr == "/Users/joanl/blockchain-presentation/":
            experts_path = "experts/index.html"
        else:
            experts_path = "../experts/index.html"
            
        # Find the About link. It spans multiple lines.
        # Example:
        # <a href="about.html"
        #     style="color:white; text-decoration:none; font-weight:600; font-size:13px; opacity: 0.8; transition: opacity 0.2s;">About</a>
        
        pattern = re.compile(r'(<a\s+href="[^"]*about\.html"[\s\S]*?>\s*(?:About|A propos|À propos)\s*</a>)', re.IGNORECASE)
        
        def replacer(match):
            about_link = match.group(1)
            # Extract style and classes from original to apply to the new one
            style_match = re.search(r'style="([^"]+)"', about_link)
            class_match = re.search(r'class="([^"]+)"', about_link)
            
            attrs = []
            if class_match:
                attrs.append(f'class="{class_match.group(1)}"')
            if style_match:
                attrs.append(f'style="{style_match.group(1)}"')
                
            attr_str = " ".join(attrs) if attrs else 'style="color:white; text-decoration:none; font-weight:600; font-size:13px; opacity: 0.8; transition: opacity 0.2s;"'
            
            # The label should be Experts
            new_link = f'\n            <a href="{experts_path}"\n                {attr_str}>Experts</a>'
            
            return about_link + new_link

        new_content = pattern.sub(replacer, content)
        
        if new_content != content:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {filepath}")
