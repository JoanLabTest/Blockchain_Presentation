import os
import glob
import re

def process_file(filepath, is_fr):
    with open(filepath, 'r') as f:
        content = f.read()

    # The previous sed changed href="/fr/X" to href="/X" in fr/*.html
    # And href="/en/X" to href="/X" in en/*.html
    # We want to replace:
    # In FR files:
    # href="/X" -> href="X"   (if X is not en/...)
    # href="/en/X" -> href="../en/X"
    # href="../fr/X" -> href="X"
    
    if is_fr:
        # Revert the sed damage
        # It changed href="/fr/something" to href="/something"
        # Since it's in fr/, we want relative, which is href="something"
        # Let's cleanly reconstruct
        
        # 1. Any href="/en/something" -> href="../en/something"
        content = re.sub(r'href="/en/([^"]*)"', r'href="../en/\1"', content)
        
        # 2. Any href="/something" (that is not /en/) -> href="something"
        # Wait, the nav-brand might be href="/"? 
        content = re.sub(r'href="/([^"/][^"]*)"', r'href="\1"', content)
        
        # 3. Any href="../fr/something" -> href="something"
        content = re.sub(r'href="\.\./fr/([^"]*)"', r'href="\1"', content)
        
        # 4. Any href="/fr/something" -> href="something"
        content = re.sub(r'href="/fr/([^"]*)"', r'href="\1"', content)

    else:
        # In EN files:
        
        # 1. Any href="/fr/something" -> href="../fr/something"
        content = re.sub(r'href="/fr/([^"]*)"', r'href="../fr/\1"', content)
        
        # 2. Any href="/something" (that is not /fr/) -> href="something"
        content = re.sub(r'href="/([^"/][^"]*)"', r'href="\1"', content)
        
        # 3. Any href="../en/something" -> href="something"
        content = re.sub(r'href="\.\./en/([^"]*)"', r'href="\1"', content)
        
        # 4. Any href="/en/something" -> href="something"
        content = re.sub(r'href="/en/([^"]*)"', r'href="\1"', content)

    with open(filepath, 'w') as f:
        f.write(content)

for f in glob.glob('/Users/joanl/blockchain-presentation/fr/*.html'):
    process_file(f, True)

for f in glob.glob('/Users/joanl/blockchain-presentation/en/*.html'):
    process_file(f, False)
