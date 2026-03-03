import os
import re

def update_file(filename, modifications):
    if not os.path.exists(filename):
        print(f"File not found: {filename}")
        return
        
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    for target, replacement in modifications:
        content = re.sub(target, replacement, content, count=1, flags=re.DOTALL)
        
    if content != original_content:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated Phase 2 modifications in {filename}")
    else:
        pass

# --- 1. PHASE 2 FOR /FR/ DIRECTORY ---

EXPORT_BTN_FR = """
            <div style="margin-top: 25px; margin-bottom: 25px;" data-aos="fade-up" data-aos-delay="400">
                <button onclick="alert('Export PDF Board-Ready généré.')" style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 12px 24px; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);"><i class="far fa-file-pdf"></i> Export Board PDF</button>
            </div>
"""
# regulatory-mapping
update_file('fr/regulatory-mapping.html', [
    (r'(<div class="disclaimer-badge".*?</div>)', r'\1' + EXPORT_BTN_FR)
])
# governance-os-landing
update_file('fr/governance-os-landing.html', [
    (r'(<p style="font-size: 20px;">.*?</p>)', r'\1' + EXPORT_BTN_FR)
])
# series-a-narrative
update_file('fr/series-a-narrative.html', [
    (r'(<p class="slide-p">\s*Résultat : Un risque en capital incalculable.*?</p>)', r'\1' + EXPORT_BTN_FR)
])

# economic-model
ACV_ROW_FR = """
            <div class="tiering-row" style="background: rgba(168, 85, 247, 0.1); border-top: 1px solid rgba(168, 85, 247, 0.3);">
                <div class="feature-name"><i class="fas fa-coins text-purple-400"></i> Estimated ACV</div>
                <div class="feature-value feature-text" style="color: var(--tier-base);">~50k€ - 75k€</div>
                <div class="feature-value feature-text" style="color: var(--tier-pro);">~120k€ - 180k€</div>
                <div class="feature-value feature-text font-bold text-white" style="text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);">250k€+</div>
            </div>
        </div>"""
update_file('fr/economic-model.html', [
    (r'<div class="tier-col tier-base">Essential \(PoC\)</div>', r'<div class="tier-col tier-base">Tier 3 (Emerging/SMB)</div>'),
    (r'<div class="tier-col tier-pro">Professional</div>', r'<div class="tier-col tier-pro">Tier 2 (Regional)</div>'),
    (r'<div class="tier-col tier-ent">Enterprise \(Scale\)</div>', r'<div class="tier-col tier-ent">Tier 1 (Global Systemic)</div>'),
    (r'</div>\s*<!-- PRICING BENCHMARK -->', ACV_ROW_FR + '\n        <!-- PRICING BENCHMARK -->')
])

# pricing-institutional.html
update_file('fr/pricing-institutional.html', [
    (r'<div class="arch-title">Strategic Pilot</div>', r'<div class="arch-title">Tier 3 (Emerging/SMB)</div>'),
    (r'<div class="arch-price">90-Day Intake</div>', r'<div class="arch-price">~50k€ - 75k€<span style="font-size: 14px; font-weight: normal; color: var(--text-muted); display: block;">Estimated ACV</span></div>'),
    (r'<div class="arch-title">Standard Hub</div>', r'<div class="arch-title">Tier 2 (Regional)</div>'),
    (r'<div class="arch-price">Core License</div>', r'<div class="arch-price">~120k€ - 180k€<span style="font-size: 14px; font-weight: normal; color: var(--text-muted); display: block;">Estimated ACV</span></div>'),
    (r'<div class="arch-title">Sovereign Enterprise</div>', r'<div class="arch-title">Tier 1 (Global Systemic)</div>'),
    (r'<div class="arch-price">Full Infrastructure</div>', r'<div class="arch-price">250k€+<span style="font-size: 14px; font-weight: normal; color: var(--text-muted); display: block;">Estimated ACV</span></div>')
])

# social proof
SOCIAL_PROOF_BANNER_FR = """
        <!-- SOCIAL PROOF BANNER -->
        <div style="background: rgba(15, 23, 42, 0.8); border-top: 1px solid rgba(59, 130, 246, 0.3); border-bottom: 1px solid rgba(59, 130, 246, 0.3); padding: 15px 0; text-align: center; font-size: 14px; font-weight: 600; color: #94a3b8; display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;">
            <span><i class="fas fa-handshake text-blue-400 mr-2"></i> In discussion with EU Tier-1 institutions</span>
            <span class="hidden md:inline">|</span>
            <span><i class="fas fa-shield-halved text-emerald-400 mr-2"></i> Research & institutional framework aligned with MiCA & DORA</span>
        </div>
"""
SOCIAL_QUOTE_FR = """
        <div data-aos="fade-up" style="max-width: 800px; margin: 40px auto 0; text-align: center; font-style: italic; color: #cbd5e1; font-size: 16px; border-left: 3px solid #3b82f6; padding-left: 20px; text-align: left;">
            "DCM est la seule plateforme traduisant les événements bruts DLT en métriques de Modélisation des Risques (MRM) prêtes pour le Conseil d'Administration." <br><span style="font-weight: 700; color: #3b82f6; font-style: normal; font-size: 14px; margin-top: 8px; display: inline-block;">— Chief Risk Officer, Top 5 EU Bank</span>
        </div>
"""
update_file('fr/index.html', [
    (r'(</nav>)', r'\1\n' + SOCIAL_PROOF_BANNER_FR),
    (r'(</div>\s*<div class="hero-image-container")', SOCIAL_QUOTE_FR + r'\n\1')
])
update_file('fr/governance-os-landing.html', [
    (r'(</nav>)', r'\1\n' + SOCIAL_PROOF_BANNER_FR),
    (r'(<div class="hero-ctas"[^>]*>.*?</div>)', r'\1\n' + SOCIAL_QUOTE_FR)
])

# --- 2. HREFLANG FIX FOR ALL HTML FILES in /fr and /en ---

def fix_hreflang(filepath, lang):
    basename = os.path.basename(filepath)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove existing hreflang link tags to avoid duplicates
    content = re.sub(r'<link[^>]*hreflang=[^>]*>\s*', '', content)

    # Prepare new tags
    new_tags = f'''
    <link rel="alternate" hreflang="fr" href="https://dcm-digital.com/fr/{basename}" />
    <link rel="alternate" hreflang="en" href="https://dcm-digital.com/en/{basename}" />
    <link rel="alternate" hreflang="x-default" href="https://dcm-digital.com/fr/{basename}" />
'''
    # Inject before </head>
    content = re.sub(r'(</head>)', new_tags + r'\1', content, count=1, flags=re.IGNORECASE)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
for d in ['fr', 'en']:
    if not os.path.exists(d):
        continue
    for f in os.listdir(d):
        if f.endswith('.html'):
            fix_hreflang(os.path.join(d, f), d)
print("Hreflang tags injected successfully in all files in /fr and /en.")
