import os
import re
import glob

def inject_hreflang(filepath):
    # Only process html files
    if not filepath.endswith('.html'): return
    
    basename = os.path.basename(filepath)
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Remove any existing hreflang tags to prevent duplicates
        content = re.sub(r'<link[^>]*hreflang=[^>]*>\s*', '', content)
        
        # Prepare the fresh tags
        new_tags = f'''
    <link rel="alternate" hreflang="fr" href="https://dcm-digital.com/fr/{basename}" />
    <link rel="alternate" hreflang="en" href="https://dcm-digital.com/en/{basename}" />
    <link rel="alternate" hreflang="x-default" href="https://dcm-digital.com/fr/{basename}" />
'''
        # Inject directly before </head>
        # Case insensitive match for </head>
        content, count = re.subn(r'(</head>)', new_tags + r'\1', content, count=1, flags=re.IGNORECASE)
        
        if count > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
                
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

# Process files in root, fr/, and en/
directories = ['.', 'fr', 'en']

total_processed = 0
for directory in directories:
    if os.path.exists(directory):
        for filename in os.listdir(directory):
            filepath = os.path.join(directory, filename)
            if os.path.isfile(filepath) and filepath.endswith('.html'):
                inject_hreflang(filepath)
                total_processed += 1

print(f"Successfully processed and injected hreflang tags into {total_processed} HTML files across root, /fr, and /en.")
