#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ULTIMATE PROFESSIONAL FIX - Comprehensive French elimination
Ensures 100% professional financial English
"""

import re

def main():
    print("🚀 Starting ULTIMATE PROFESSIONAL FIX...")
    
    try:
        with open('index_en.html', 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        return

    # Comprehensive replacement dictionary
    replacements = [
        # === REMAINING FRENCH LABELS ===
        (r'Définition\s*:', 'Definition:'),
        (r'Plateforme\s*:', 'Platform:'),
        (r'Stratégie\s*:', 'Strategy:'),
        (r'Montant', 'Amount'),
        (r'Juridiction\s*:', 'Jurisdiction:'),
        
        # === SECTION TITLES ===
        (r'Conception', 'Conception'),  # Already English but check context
        (r'Development du smart contract', 'Smart contract development'),
        (r'Ecosystem blockchain', 'blockchain ecosystem'),
        
        # === BENCHMARKS SECTION - Detailed ===
        (r'highlight-label">Montant', 'highlight-label">Amount'),
        (r'Blockchain Public', 'Public Blockchain'),
        
        # === TOKENIZATION CARDS ===
        (r'<p><strong>Définition\s*:</strong>', '<p><strong>Definition:</strong>'),
        
        # === MISC FRENCH PHRASES ===
        (r'donnent accès à', 'provide access to'),
        (r'Donnent accès à', 'Provide access to'),
        (r'au sein d\'un', 'within a'),
        (r'Ecosystem', 'ecosystem'),  # Fix capitalization
        
        # === SPECIFIC REMAINING ISSUES ===
        # From benchmarks - these might have been missed
        (r'<strong>Plateforme\s*:</strong>', '<strong>Platform:</strong>'),
        (r'<strong>Type\s*:</strong>', '<strong>Type:</strong>'),
        (r'<strong>Stratégie\s*:</strong>', '<strong>Strategy:</strong>'),
        (r'<strong>Innovation\s*:</strong>', '<strong>Innovation:</strong>'),
        (r'<strong>Juridiction\s*:</strong>', '<strong>Jurisdiction:</strong>'),
        (r'<strong>Focus\s*:</strong>', '<strong>Focus:</strong>'),
        
        # === UTILITY TOKEN CARD (Section 3) ===
        (r'Donnent accès à des services ou fonctionnalités spécifiques au sein d\'un\s+Ecosystem blockchain',
         'Provide access to specific services or features within a blockchain ecosystem'),
        
        # === DEVELOPMENT TIMELINE ===
        (r'Development du smart contract', 'Smart contract development'),
        
        # === BUYBACK ===
        (r'BUYback', 'Buyback'),
        
        # === CASE FIXES ===
        (r'UNITED STATES', 'United States'),
        (r'Distribution,', 'distribution,'),
        
        # === FLOW TYPOS ===
        (r'fLow', 'flow'),
        (r'overfLow', 'overflow'),
        (r'AlLow', 'Allow'),
        (r'YIELD', 'yield'),
        (r'COUPON', 'coupon'),
        (r'SETTLEMENT', 'settlement'),
        
        # === HIGHLIGHT TYPO ===
        (r'Highlight', 'highlight'),
        (r'benchmark-Highlight', 'benchmark-highlight'),
        (r'Highlight-label', 'highlight-label'),
        (r'Highlight-value', 'highlight-value'),
    ]

    count = 0
    new_content = content
    
    for pattern, replacement in replacements:
        temp = re.sub(pattern, replacement, new_content, flags=re.IGNORECASE if pattern.lower() == pattern else 0)
        if temp != new_content:
            new_content = temp
            count += 1
            print(f"✅ Fixed: {pattern[:40]}... → {replacement[:40]}...")
    
    # Write back
    with open('index_en.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"\n🎉 ULTIMATE FIX Complete: {count} corrections applied")
    print("\n📊 Final Quality Check:")
    
    # Quality check - search for common French words
    french_indicators = ['Définition', 'Plateforme', 'Stratégie', 'Montant', 'Juridiction', 
                        'donnent', 'au sein', 'Development du']
    
    remaining = []
    for indicator in french_indicators:
        if indicator in new_content:
            remaining.append(indicator)
    
    if remaining:
        print(f"⚠️  Still found: {', '.join(remaining)}")
    else:
        print("✅ No French indicators detected!")

if __name__ == "__main__":
    main()
