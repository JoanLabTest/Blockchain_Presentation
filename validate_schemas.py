import os
import glob
import json

base_path = '/Users/joanl/blockchain-presentation/networks/'
html_files = glob.glob(os.path.join(base_path, '*.html'))

print(f"--- VALIDATING JSON-LD SCHEMAS IN {len(html_files)} FILES ---")

all_valid = True

for file_path in html_files:
    file_name = os.path.basename(file_path)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if '<script type="application/ld+json">' in content:
        try:
            # Extract JSON payload
            json_str = content.split('<script type="application/ld+json">')[1].split('</script>')[0].strip()
            # Test parsing
            parsed = json.loads(json_str)
            print(f"[OK] {file_name}: JSON-LD is valid format. (Type: {parsed.get('@type')})")
        except Exception as e:
            print(f"[ERROR] {file_name}: Failed to parse JSON-LD -> {e}")
            all_valid = False
    else:
        print(f"[WARNING] {file_name}: JSON-LD tag not found.")
        all_valid = False

if all_valid:
    print("\nSUCCESS: All schemas are valid JSON formats.")
else:
    print("\nFAILURE: Some schemas are missing or invalid.")
