import os
import json
import re

def main():
    json_path = "data/tokenized-treasuries.json"
    if not os.path.exists(json_path):
        print(f"❌ Error: {json_path} not found.")
        return

    print(f"Reading data from {json_path}...")
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 1. Extract summary stats
    summary = data["summary"]
    funds = data["funds"]
    
    # Sort funds by AUM descending for leaderboard
    sorted_funds = sorted(funds, key=lambda x: x["aum_usd"], reverse=True)
    max_aum = sorted_funds[0]["aum_usd"] if sorted_funds else 1
    
    # Get total AUM and format
    total_aum_str = f"${summary['total_aum_usd'] / 1e9:.2f}B"  # $7.20B
    sector_aum_str = f"${summary['tokenized_treasury_sector_usd'] / 1e9:.1f}B"  # $11.0B
    rwa_total_str = f"${summary['rwa_market_total_usd'] / 1e9:.1f}B"  # $30.0B
    
    print(f"Computed stats:")
    print(f"  - Total Tracked AUM: {total_aum_str}")
    print(f"  - Treasury Sector: {sector_aum_str}")
    print(f"  - RWA Market Total: {rwa_total_str}")

    # Generate Leaderboard HTML for English
    en_leaderboard_items = []
    for fund in sorted_funds:
        percentage = int((fund["aum_usd"] / max_aum) * 100)
        aum_formatted = f"${fund['aum_usd'] / 1e9:.2f}B" if fund['aum_usd'] >= 1e9 else f"${fund['aum_usd'] / 1e6:.1f}M"
        brand = f"{fund['issuer']} ({fund['ticker']})"
        
        en_leaderboard_items.append(f"""                <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 12px;">
                    <div style="font-size: 11px; color: #64748b; margin-bottom: 5px;">{brand}</div>
                    <div style="font-size: 20px; font-weight: 800; color: #fff;">{aum_formatted}</div>
                    <div style="width: {percentage}%; height: 4px; background: #3b82f6; margin-top: 10px; border-radius: 2px;"></div>
                </div>""")
                
    en_leaderboard_html = "\n".join(en_leaderboard_items)

    # Generate Leaderboard HTML for French
    fr_leaderboard_items = []
    for fund in sorted_funds:
        percentage = int((fund["aum_usd"] / max_aum) * 100)
        aum_formatted = f"${fund['aum_usd'] / 1e9:.2f}B" if fund['aum_usd'] >= 1e9 else f"${fund['aum_usd'] / 1e6:.1f}M"
        brand = f"{fund['issuer']} ({fund['ticker']})"
        
        fr_leaderboard_items.append(f"""                <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 12px;">
                    <div style="font-size: 11px; color: #64748b; margin-bottom: 5px;">{brand}</div>
                    <div style="font-size: 20px; font-weight: 800; color: #fff;">{aum_formatted}</div>
                    <div style="width: {percentage}%; height: 4px; background: #3b82f6; margin-top: 10px; border-radius: 2px;"></div>
                </div>""")
                
    fr_leaderboard_html = "\n".join(fr_leaderboard_items)

    # 2. Update en/observatory/tokenized-markets.html
    en_path = "en/observatory/tokenized-markets.html"
    if os.path.exists(en_path):
        print(f"Updating {en_path}...")
        with open(en_path, "r", encoding="utf-8") as f:
            en_content = f.read()
            
        # Update freshness badge
        en_content = re.sub(
            r'DATA REFRESH: [A-Z]+ \d{4} \| GTSR SOURCE: REAL-TIME',
            'DATA REFRESH: MAY 2026 | GTSR SOURCE: REAL-TIME',
            en_content
        )
        
        # Update metrics panel values using exact target text replacement
        en_target_liquidity = """                    <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 10px;">Global Market Liquidity (incl. Stablecoins)</div>
                <div style="font-family: 'Outfit'; font-size: 42px; font-weight: 800; color: #fff;">$176.2B</div>"""
        
        en_replacement_liquidity = """                    <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 10px;">Global Market Liquidity (incl. Stablecoins)</div>
                <div style="font-family: 'Outfit'; font-size: 42px; font-weight: 800; color: #fff;">$176.2B</div>"""
                
        en_target_securities = """            <div style="border-right: 1px solid rgba(255,255,255,0.1);">
                <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 10px;">Tokenized Securities</div>
                <div style="font-family: 'Outfit'; font-size: 42px; font-weight: 800; color: #fff;">3,420</div>"""
                
        en_replacement_securities = f"""            <div style="border-right: 1px solid rgba(255,255,255,0.1);">
                <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 10px;">Total RWA Market Size</div>
                <div style="font-family: 'Outfit'; font-size: 42px; font-weight: 800; color: #fff;">{rwa_total_str}</div>"""

        en_content = en_content.replace(en_target_liquidity, en_replacement_liquidity)
        en_content = en_content.replace(en_target_securities, en_replacement_securities)
        
        # Update dash cards (Market Size & Tokenized Money)
        en_content = re.sub(
            r'<span class="dash-value">\$162B</span>\s*<span class="dash-label">Tokenized Money Supply \(Stable/CBDC\)</span>',
            '<span class="dash-value">$164.2B</span>\n            <span class="dash-label">Tokenized Money Supply (Stable/CBDC)</span>',
            en_content
        )
        en_content = re.sub(
            r'<span class="dash-value">\$14.2B</span>\s*<span class="dash-label">Tokenized Bonds Market Cap</span>',
            f'<span class="dash-value">{sector_aum_str}</span>\n            <span class="dash-label">Tokenized Treasuries & Bonds Sector</span>',
            en_content
        )
        
        # Update Leaderboard Card using literal string replacement
        en_target_leaderboard = """        <!-- NEW: Top Issuers Analysis -->
        <div class="dash-card" style="grid-column: 1 / -1; --card-accent: var(--accent-obs);" data-aos="fade-up">
            <h3 style="font-family: 'Outfit'; font-size: 18px; color: #fff; margin-bottom: 20px;">Institutional Leaderboard: YTD Volume by Issuer</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 12px;">
                    <div style="font-size: 11px; color: #64748b; margin-bottom: 5px;">Securitize / BlackRock</div>
                    <div style="font-size: 20px; font-weight: 800; color: #fff;">$542.4M</div>
                    <div style="width: 100%; height: 4px; background: #3b82f6; margin-top: 10px; border-radius: 2px;"></div>
                </div>
                <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 12px;">
                    <div style="font-size: 11px; color: #64748b; margin-bottom: 5px;">Franklin Templeton</div>
                    <div style="font-size: 20px; font-weight: 800; color: #fff;">$412.8M</div>
                    <div style="width: 76%; height: 4px; background: #3b82f6; margin-top: 10px; border-radius: 2px;"></div>
                </div>
                <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 12px;">
                    <div style="font-size: 11px; color: #64748b; margin-bottom: 5px;">Société Générale FORGE</div>
                    <div style="font-size: 20px; font-weight: 800; color: #fff;">$384.2M</div>
                    <div style="width: 71%; height: 4px; background: #3b82f6; margin-top: 10px; border-radius: 2px;"></div>
                </div>
                <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 12px;">
                    <div style="font-size: 11px; color: #64748b; margin-bottom: 5px;">WisdomTree Prime</div>
                    <div style="font-size: 20px; font-weight: 800; color: #fff;">$112.5M</div>
                    <div style="width: 21%; height: 4px; background: #3b82f6; margin-top: 10px; border-radius: 2px;"></div>
                </div>
            </div>
        </div>"""
        
        en_replacement_leaderboard = f"""        <!-- NEW: Top Issuers Analysis -->
        <div class="dash-card" style="grid-column: 1 / -1; --card-accent: var(--accent-obs);" data-aos="fade-up">
            <h3 style="font-family: 'Outfit'; font-size: 18px; color: #fff; margin-bottom: 20px;">Institutional Leaderboard: Tokenized Treasury AUM</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
{en_leaderboard_html}
            </div>
        </div>"""

        en_content = en_content.replace(en_target_leaderboard, en_replacement_leaderboard)
        
        # Update Dataset JSON-LD schema using literal string replacement
        en_target_schema = """    <!-- JSON-LD Dataset Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": "Global Tokenized Markets Observatory",
        "description": "Real-time institutional data on tokenized capital markets, digital bonds, and RWA asset capitalization across global DLT infrastructures.",
        "url": "https://dcmcore.com/en/observatory/tokenized-markets.html",
        "keywords": ["RWA", "Tokenization", "Digital Bonds", "Market Capitalization", "DLT"],
        "creator": {
            "@type": "Organization",
            "name": "DCM Core Institute"
        },
        "distribution": {
            "@type": "DataDownload",
            "contentUrl": "https://dcmcore.com/en/api/index.html",
            "encodingFormat": "text/html"
        },
        "temporalCoverage": "2026-03-16/..",
        "identifier": "GTSR-OBS-001"
    }
    </script>"""
        
        en_replacement_schema = """    <!-- JSON-LD Dataset Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "@id": "https://dcmcore.com/en/observatory/tokenized-markets.html#dataset",
        "name": "Global Tokenized Markets Observatory & AUM Telemetry",
        "description": "Real-time institutional data on tokenized capital markets, US treasury bills, digital bonds, and RWA asset capitalization across global DLT infrastructures.",
        "url": "https://dcmcore.com/en/observatory/tokenized-markets.html",
        "keywords": ["RWA", "Tokenization", "Digital Bonds", "US Treasuries", "Market Capitalization", "DLT"],
        "creator": {
            "@type": "Organization",
            "@id": "https://dcmcore.com/#organization"
        },
        "publisher": {
            "@type": "Organization",
            "@id": "https://dcmcore.com/#organization"
        },
        "distribution": {
            "@type": "DataDownload",
            "contentUrl": "https://dcmcore.com/data/tokenized-treasuries.json",
            "encodingFormat": "application/json"
        },
        "temporalCoverage": "2024-03-20/..",
        "identifier": "GTSR-OBS-001",
        "variableMeasured": [
            "Assets Under Management (AUM)",
            "Yield to Maturity (YTM)",
            "Blockchain Allocation Ratio"
        ]
    }
    </script>"""

        en_content = en_content.replace(en_target_schema, en_replacement_schema)

        with open(en_path, "w", encoding="utf-8") as f:
            f.write(en_content)
        print(f"✅ Successfully updated {en_path}")

    # 3. Update fr/observatory/tokenized-markets.html
    fr_path = "fr/observatory/tokenized-markets.html"
    if os.path.exists(fr_path):
        print(f"Updating {fr_path}...")
        with open(fr_path, "r", encoding="utf-8") as f:
            fr_content = f.read()
            
        # Update freshness badge
        fr_content = re.sub(
            r'MAJ DONNÉES : [A-Z]+ \d{4} \| SOURCE GTSR : TEMPS RÉEL',
            'MAJ DONNÉES : MAI 2026 | SOURCE GTSR : TEMPS RÉEL',
            fr_content
        )
        
        # Update metrics panel values using exact target text replacement
        fr_target_liquidity = """                    <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 10px;">Liquidité Globale (incl. Stablecoins)</div>
                    <div style="font-family: 'Outfit'; font-size: 42px; font-weight: 800; color: #fff;">$176.2B</div>"""
        
        fr_replacement_liquidity = """                    <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 10px;">Liquidité Globale (incl. Stablecoins)</div>
                    <div style="font-family: 'Outfit'; font-size: 42px; font-weight: 800; color: #fff;">$176.2B</div>"""
                    
        fr_target_securities = """                <div style="border-right: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 10px;">Titres Tokenisés</div>
                    <div style="font-family: 'Outfit'; font-size: 42px; font-weight: 800; color: #fff;">3,420</div>"""
                    
        fr_replacement_securities = f"""                <div style="border-right: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 10px;">Marché Global RWA</div>
                    <div style="font-family: 'Outfit'; font-size: 42px; font-weight: 800; color: #fff;">{rwa_total_str}</div>"""

        fr_content = fr_content.replace(fr_target_liquidity, fr_replacement_liquidity)
        fr_content = fr_content.replace(fr_target_securities, fr_replacement_securities)
        
        # Update dash cards (Market Size & Tokenized Money)
        fr_content = re.sub(
            r'<span class="dash-value">\$162B</span>\s*<span class="dash-label">Tokenized Money Supply \(Stable/CBDC\)</span>',
            '<span class="dash-value">$164.2B</span>\n            <span class="dash-label">Masse Monétaire Tokenisée (Stable/CBDC)</span>',
            fr_content
        )
        fr_content = re.sub(
            r'<span class="dash-value">\$14.2B</span>\s*<span class="dash-label">Tokenized Bonds Market Cap</span>',
            f'<span class="dash-value">{sector_aum_str}</span>\n            <span class="dash-label">Secteur Obligations & Trésors Tokenisés</span>',
            fr_content
        )
        
        # Update Leaderboard Card using literal string replacement
        fr_target_leaderboard = """        <!-- NEW: Analyse des Principaux Émetteurs -->
        <div class="dash-card" style="grid-column: 1 / -1; --card-accent: var(--accent-obs);" data-aos="fade-up">
            <h3 style="font-family: 'Outfit'; font-size: 18px; color: #fff; margin-bottom: 20px;">Leaderboard Institutionnel : Volume YTD par Émetteur</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 12px;">
                    <div style="font-size: 11px; color: #64748b; margin-bottom: 5px;">Securitize / BlackRock</div>
                    <div style="font-size: 20px; font-weight: 800; color: #fff;">$542.4M</div>
                    <div style="width: 100%; height: 4px; background: #3b82f6; margin-top: 10px; border-radius: 2px;"></div>
                </div>
                <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 12px;">
                    <div style="font-size: 11px; color: #64748b; margin-bottom: 5px;">Franklin Templeton</div>
                    <div style="font-size: 20px; font-weight: 800; color: #fff;">$412.8M</div>
                    <div style="width: 76%; height: 4px; background: #3b82f6; margin-top: 10px; border-radius: 2px;"></div>
                </div>
                <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 12px;">
                    <div style="font-size: 11px; color: #64748b; margin-bottom: 5px;">Société Générale FORGE</div>
                    <div style="font-size: 20px; font-weight: 800; color: #fff;">$384.2M</div>
                    <div style="width: 71%; height: 4px; background: #3b82f6; margin-top: 10px; border-radius: 2px;"></div>
                </div>
                <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 12px;">
                    <div style="font-size: 11px; color: #64748b; margin-bottom: 5px;">WisdomTree Prime</div>
                    <div style="font-size: 20px; font-weight: 800; color: #fff;">$112.5M</div>
                    <div style="width: 21%; height: 4px; background: #3b82f6; margin-top: 10px; border-radius: 2px;"></div>
                </div>
            </div>
        </div>"""
        
        fr_replacement_leaderboard = f"""        <!-- NEW: Analyse des Principaux Émetteurs -->
        <div class="dash-card" style="grid-column: 1 / -1; --card-accent: var(--accent-obs);" data-aos="fade-up">
            <h3 style="font-family: 'Outfit'; font-size: 18px; color: #fff; margin-bottom: 20px;">Leaderboard Institutionnel : AUM des Fonds de Trésorerie</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
{fr_leaderboard_html}
            </div>
        </div>"""

        fr_content = fr_content.replace(fr_target_leaderboard, fr_replacement_leaderboard)
        
        # Update Dataset JSON-LD schema (FR)
        fr_target_schema = """    <!-- JSON-LD Dataset Schema (FR) -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": "Observatoire des Marchés de Capitaux Tokenisés",
        "description": "Observatoire permanent du DCM Core Institute : Données en temps réel sur la capitalisation des actifs RWA, les obligations digitales et les infrastructures DLT.",
        "url": "https://dcmcore.com/fr/observatory/tokenized-markets.html",
        "keywords": ["RWA", "Tokenisation", "Obligations Digitales", "Capitalisation Boursière", "DLT"],
        "creator": {
            "@type": "Organization",
            "name": "DCM Core Institute"
        },
        "distribution": {
            "@type": "DataDownload",
            "contentUrl": "https://dcmcore.com/fr/api/index.html",
            "encodingFormat": "text/html"
        },
        "temporalCoverage": "2026-03-16/..",
        "identifier": "GTSR-OBS-001-FR"
    }
    </script>"""
        
        fr_replacement_schema = """    <!-- JSON-LD Dataset Schema (FR) -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "@id": "https://dcmcore.com/fr/observatory/tokenized-markets.html#dataset",
        "name": "Observatoire des Marchés de Capitaux Tokenisés & Télémétrie AUM",
        "description": "Observatoire permanent du DCM Core Institute : Données en temps réel sur la capitalisation des actifs RWA, les bons du Trésor tokenisés, les obligations digitales et les infrastructures DLT.",
        "url": "https://dcmcore.com/fr/observatory/tokenized-markets.html",
        "keywords": ["RWA", "Tokenisation", "Obligations Digitales", "Bons du Trésor", "Capitalisation Boursière", "DLT"],
        "creator": {
            "@type": "Organization",
            "@id": "https://dcmcore.com/#organization"
        },
        "publisher": {
            "@type": "Organization",
            "@id": "https://dcmcore.com/#organization"
        },
        "distribution": {
            "@type": "DataDownload",
            "contentUrl": "https://dcmcore.com/data/tokenized-treasuries.json",
            "encodingFormat": "application/json"
        },
        "temporalCoverage": "2024-03-20/..",
        "identifier": "GTSR-OBS-001-FR",
        "variableMeasured": [
            "Assets Under Management (AUM)",
            "Yield to Maturity (YTM)",
            "Blockchain Allocation Ratio"
        ]
    }
    </script>"""

        fr_content = fr_content.replace(fr_target_schema, fr_replacement_schema)

        with open(fr_path, "w", encoding="utf-8") as f:
            f.write(fr_content)
        print(f"✅ Successfully updated {fr_path}")

    # 4. Update js/api-docs-engine.js
    js_path = "js/api-docs-engine.js"
    if os.path.exists(js_path):
        print(f"Updating {js_path}...")
        with open(js_path, "r", encoding="utf-8") as f:
            js_content = f.read()

        # Update BlackRock BUIDL AUM in mock data
        js_content = re.sub(
            r'name: "BlackRock BUIDL \(USD Institutional Digital Liquidity\)",\s*issuer: "BlackRock / Securitize",\s*asset_class: "Tokenized Money Market Fund",\s*infrastructure: "Ethereum Mainnet",\s*aum_usd: \d+,',
            'name: "BlackRock BUIDL (USD Institutional Digital Liquidity)",\n                    issuer: "BlackRock / Securitize",\n                    asset_class: "Tokenized Money Market Fund",\n                    infrastructure: "Ethereum Mainnet",\n                    aum_usd: 2580000000,',
            js_content
        )
        
        # Update total summary AUM:
        # total_aum_usd: 2651700000, -> total_aum_usd: 4689300000
        # total_aum_display: "$2.65B", -> total_aum_display: "$4.69B"
        js_content = re.sub(
            r'total_aum_usd: \d+,',
            'total_aum_usd: 4689300000,',
            js_content
        )
        js_content = re.sub(
            r'total_aum_display: "\$\d+\.\d+B",',
            'total_aum_display: "$4.69B",',
            js_content
        )
        
        # Update system status mocks total AUM:
        # gtsr_total_aum_display: "$2.65B+",
        js_content = re.sub(
            r'gtsr_total_aum_display: "\$\d+\.\d+B\+",',
            'gtsr_total_aum_display: "$4.69B+",',
            js_content
        )

        with open(js_path, "w", encoding="utf-8") as f:
            f.write(js_content)
        print(f"✅ Successfully updated {js_path}")

    print("🎉 All targets refreshed successfully!")

    # 5. Git Commit Check (for automated updates)
    try:
        import subprocess
        from datetime import datetime

        # Check if we are inside a Git repository
        git_check = subprocess.run(['git', 'rev-parse', '--is-inside-work-tree'], capture_output=True, text=True)
        if git_check.returncode == 0 and git_check.stdout.strip() == 'true':
            # Check for changes (git diff --quiet returns non-zero if there are unstaged changes)
            result = subprocess.run(['git', 'diff', '--quiet'], capture_output=True)
            if result.returncode != 0:
                # If running in GitHub Actions, let the workflow handle commit and push to avoid conflicts
                if os.environ.get('GITHUB_ACTIONS') == 'true':
                    print("Changes detected. GitHub Actions workflow will handle the commit and push.")
                else:
                    # Stage the modified files
                    subprocess.run(['git', 'add', json_path, en_path, fr_path, js_path])
                    timestamp = datetime.utcnow().strftime('%Y-%m-%d')
                    subprocess.run(['git', 'commit', '-m', f'data: update tokenized treasury AUM {timestamp}'])
                    print(f"✅ Changes committed automatically (AUM {timestamp})")
            else:
                print("No changes — skipping commit")
        else:
            print("Not in a git repository or git not available — skipping commit")
    except Exception as e:
        print(f"⚠️ Git commit check skipped or encountered error: {e}")

if __name__ == "__main__":
    main()
