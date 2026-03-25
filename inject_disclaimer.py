import os

en_disclaimer = """
    <div class="research-disclaimer">
        <strong>Research Methodology Note:</strong> The metrics presented (e.g., Sharpe ~1.1) 
        are derived from DCM Core proprietary simulation models (2021-2025 backtest). 
        They do not represent guaranteed past performance and are intended for 
        institutional research purposes only.
    </div>
"""

fr_disclaimer = """
    <div class="research-disclaimer">
        <strong>Note Méthodologique :</strong> Les indicateurs présentés (ex: Sharpe ~1.1) 
        sont issus de modèles de simulation propriétaire DCM Core (backtest 2021-2025). 
        Ils ne constituent pas des performances passées garanties et sont destinés 
        à un usage de recherche institutionnelle uniquement.
    </div>
"""

directories = [
    'en/strategies', 'en/frameworks',
    'fr/strategies', 'fr/frameworks'
]

for directory in directories:
    if not os.path.exists(directory): continue
    for filename in os.listdir(directory):
        if filename.endswith('.html'):
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check if disclaimer already exists
            if 'research-disclaimer' in content: continue
            
            # Use appropriate language
            disclaimer = fr_disclaimer if directory.startswith('fr') else en_disclaimer
            
            # Inject before ai-direct-answer or at top of main
            if '<div class="ai-direct-answer">' in content:
                content = content.replace('<div class="ai-direct-answer">', disclaimer + '<div class="ai-direct-answer">')
            elif '<main' in content and '>' in content.split('<main')[1]:
                # Inject at start of main
                parts = content.split('<main', 1)
                main_tag, rest = parts[1].split('>', 1)
                content = parts[0] + '<main' + main_tag + '>' + disclaimer + rest
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
print("Disclaimer injection complete.")
