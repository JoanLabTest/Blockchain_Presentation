import os

TARGET_FILES = [
    'governance-os-landing.html',
    'risk-engine.html',
    'data-certification.html',
    'mrm-hub.html'
]

MEGA_CTA_BLOCK = """
    <!-- MEGA CTA FUNNEL -->
    <section class="mega-cta-section" style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(15, 23, 42, 1)); text-align: center; padding: 60px 20px; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 50px;" data-aos="fade-up">
        <h2 style="font-size: 32px; color: white; margin-bottom: 20px;">Prêt à optimiser votre infrastructure DLT ?</h2>
        <p style="color: #94a3b8; font-size: 18px; max-width: 600px; margin: 0 auto;">Passez de l'exploration technologique à la gouvernance institutionnelle en moins de 30 jours.</p>
        <div style="margin-top: 30px; display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
            <a href="mailto:contact@dcm-digital.com" class="btn-term" style="padding: 15px 30px; font-size: 16px; background: rgba(168, 85, 247, 0.2); border-color: #a855f7; color: white; text-decoration: none;">[ SCHEDULE_DEMO ]</a>
            <a href="pricing-institutional.html" class="btn-term" style="padding: 15px 30px; font-size: 16px; border-color: #cbd5e1; color: #cbd5e1; text-decoration: none;">[ VIEW_ENTERPRISE_PRICING ]</a>
        </div>
    </section>

"""

def inject_cta():
    for filename in TARGET_FILES:
        filepath = os.path.join('/Users/joanl/blockchain-presentation', filename)
        if not os.path.exists(filepath):
            print(f"Skipping {filename} - not found.")
            continue
            
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if "MEGA CTA FUNNEL" in content:
            print(f"Already injected in {filename}")
            continue
            
        # Find the footer to inject before it
        footer_markers = [
            "<!-- UNIFIED SUPER FOOTER -->",
            "<!-- SUPER FOOTER -->",
            "<!-- MAIN FOOTER -->",
            "<footer"
        ]
        
        injected = False
        for marker in footer_markers:
            if marker in content:
                parts = content.split(marker, 1)
                new_content = parts[0] + MEGA_CTA_BLOCK + marker + parts[1]
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Successfully injected CTA into {filename}")
                injected = True
                break
                
        if not injected:
            print(f"Failed to find footer injection point in {filename}")

if __name__ == "__main__":
    inject_cta()
