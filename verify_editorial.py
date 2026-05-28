import os
import re
import json
import sys

def test_file_exists_and_content(filepath):
    if not os.path.exists(filepath):
        print(f"❌ File does not exist: {filepath}")
        return None
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"❌ Error reading {filepath}: {e}")
        return None

def verify_file(filepath):
    print(f"\n==================================================")
    print(f"🔍 Verifying: {filepath}")
    print(f"==================================================")
    
    content = test_file_exists_and_content(filepath)
    if content is None:
        return False
        
    success = True
    
    # 1. Verify Canonical
    canonical_match = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"\s*/?>|<link\s+href="([^"]+)"\s+rel="canonical"\s*/?>', content)
    if not canonical_match:
        print("❌ No canonical tag found.")
        success = False
    else:
        canonical_url = canonical_match.group(1) or canonical_match.group(2)
        expected_canonical = f"https://dcmcore.com/{filepath}"
        if canonical_url != expected_canonical:
            print(f"❌ Canonical mismatch: found '{canonical_url}', expected '{expected_canonical}'")
            success = False
        else:
            print(f"✅ Canonical URL is correct: {canonical_url}")
            
    # 2. Verify hreflang alternates if present
    alternate_matches = re.findall(r'<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"\s*/?>|<link\s+href="([^"]+)"\s+rel="alternate"\s+hreflang="([^"]+)"\s*/?>', content)
    if alternate_matches:
        print(f"ℹ️ Found {len(alternate_matches)} alternate hreflang tags:")
        for m in alternate_matches:
            lang = m[0] or m[3]
            href = m[1] or m[2]
            print(f"   - {lang}: {href}")
    else:
        print("⚠️ No alternate hreflang tags found.")

    # 3. Find and verify JSON-LD schemas
    schema_blocks = re.findall(r'<script\s+type="application/ld\+json"\s*>(.*?)</script>', content, flags=re.DOTALL)
    if not schema_blocks:
        print("❌ No JSON-LD schema block found.")
        success = False
    else:
        print(f"Found {len(schema_blocks)} JSON-LD schema blocks.")
        for idx, block in enumerate(schema_blocks):
            try:
                # Parse JSON directly
                data = json.loads(block.strip())
                print(f"   [Block {idx+1}] Parsed successfully.")
                
                # Normalize to a list for easier processing
                items = data if isinstance(data, list) else [data]
                
                for item in items:
                    item_type = item.get("@type")
                    print(f"   - Entity Type: {item_type}")
                    
                    if item_type == "Person":
                        # Check ORCID in sameAs
                        same_as = item.get("sameAs", [])
                        orcid = "https://orcid.org/0009-0006-2584-3990"
                        if orcid in same_as:
                            print(f"     ✅ ORCID verified in sameAs: {orcid}")
                        else:
                            print(f"     ❌ ORCID '{orcid}' NOT found in sameAs: {same_as}")
                            success = False
                            
                    elif item_type in ["WebPage", "ProfilePage"]:
                        # Check dates
                        date_pub = item.get("datePublished")
                        date_mod = item.get("dateModified")
                        print(f"     - datePublished: {date_pub}")
                        print(f"     - dateModified: {date_mod}")
                        
                        if not date_pub:
                            print("     ❌ Missing datePublished")
                            success = False
                        elif date_pub not in ["2026-05-27", "2026-05-28"]:
                            print(f"     ❌ Unexpected datePublished: {date_pub}")
                            success = False
                            
                        if not date_mod:
                            print("     ❌ Missing dateModified")
                            success = False
                        elif date_mod != "2026-05-28":
                            print(f"     ❌ Unexpected dateModified (expected 2026-05-28): {date_mod}")
                            success = False
                            
                        # Check publisher/author organization id linkage
                        publisher = item.get("publisher", {})
                        publisher_id = publisher.get("@id") if isinstance(publisher, dict) else None
                        
                        author = item.get("author", {})
                        author_id = author.get("@id") if isinstance(author, dict) else None
                        
                        org_id = "https://dcmcore.com/#organization"
                        
                        # WebPage usually has publisher pointing to organization
                        # ProfilePage has mainEntity, author, etc.
                        if item_type == "WebPage":
                            if publisher_id == org_id:
                                print(f"     ✅ Publisher references correct organization: {org_id}")
                            else:
                                print(f"     ❌ Publisher ID mismatch: found '{publisher_id}', expected '{org_id}'")
                                success = False
                                
            except json.JSONDecodeError as jde:
                print(f"   ❌ Block {idx+1} failed to parse as JSON: {jde}")
                success = False
                
    return success

def main():
    files_to_verify = [
        "en/about/editorial-standards.html",
        "fr/a-propos/charte-editoriale.html",
        "en/methodology/index.html",
        "fr/methodology/index.html",
        "en/about/joan-lyczak.html",
        "fr/a-propos/joan-lyczak.html"
    ]
    
    overall_success = True
    for f in files_to_verify:
        if not verify_file(f):
            overall_success = False
            
    print("\n==================================================")
    if overall_success:
        print("🏆 VERIFICATION SUCCESSFUL: All files resolved, canonicals match, and schemas are fully valid!")
        sys.exit(0)
    else:
        print("❌ VERIFICATION FAILED: Please review the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
