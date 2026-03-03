import os
import re

EN_DIR = '/Users/joanl/blockchain-presentation/en'

NEW_FOOTER = """<!-- MAIN FOOTER -->
    <footer class="super-footer">
        <div class="footer-content">
            <div class="footer-grid">
                <!-- 0. BRAND -->
                <div class="footer-brand">
                    <h3><i class="fas fa-cube" style="color:var(--accent-blue)"></i> DCM DIGITAL</h3>
                    <p>Analysis platform dedicated to the tokenization of financial assets and public and institutional blockchain infrastructures.</p>
                    <div class="footer-socials">
                        <a aria-label="LinkedIn" class="social-btn" href="https://www.linkedin.com/in/joan-lyczak/" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                        <a aria-label="GitHub" class="social-btn" href="https://github.com/JoanLabTest/Blockchain_Presentation" target="_blank"><i class="fab fa-github"></i></a>
                        <a aria-label="Twitter" class="social-btn" href="https://x.com/Joan_Lyczak" target="_blank"><i class="fab fa-x-twitter"></i></a>
                    </div>
                </div>
                <!-- 1. PRODUCT -->
                <div class="footer-col">
                    <h4><i class="fas fa-cube" style="font-size:10px; opacity:0.5; margin-right:5px;"></i> Product</h4>
                    <ul class="footer-links">
                        <li><a href="index.html">Central Hub</a></li>
                        <li><a href="sandbox.html">Dashboard</a></li>
                        <li><a href="simple.html">Academy</a></li>
                        <li><a href="guide.html">Expert Guide</a></li>
                        <li><a href="yield-mechanics.html">Simulation Engine</a></li>
                        <li><a href="quiz.html">Certification</a></li>
                        <li><a href="pricing-institutional.html">Pricing</a></li>
                    </ul>
                </div>
                <!-- 2. RESEARCH -->
                <div class="footer-col">
                    <h4><i class="fas fa-book" style="font-size:10px; opacity:0.5; margin-right:5px;"></i> Research</h4>
                    <ul class="footer-links">
                        <li><a href="rwa.html">RWA & DeFi</a></li>
                        <li><a href="yield-mechanics.html">Yield Mechanics</a></li>
                        <li><a href="web3.html">Web3 Infrastructure</a></li>
                        <li><a href="ai-finance.html">AI & Finance</a></li>
                        <li><a href="institutional-problem-statement.html">Strategic Vision</a></li>
                        <li><a href="competitive-landscape.html">Competitive Landscape</a></li>
                        <li><a href="series-a-narrative.html">Series A Deck</a></li>
                        <li><a href="governance-os-landing.html">Institutional Governance</a></li>
                        <li><a href="mrm-hub.html">MRM Hub</a></li>
                        <li><a href="data-certification.html">Data Trust Certif</a></li>
                        <li><a href="case-study-tokenized-bond.html">Quantified Use Case</a></li>
                        <li><a href="economic-model.html">Economic Model</a></li>
                        <li><a href="regulatory-mapping.html">Regulatory Mapping</a></li>
                        <li><a href="legal-matrix.html">Global Matrix</a></li>
                        <li><a href="networks/index.html">Blockchain Networks</a></li>
                    </ul>
                </div>
                <!-- 3. INFRASTRUCTURE -->
                <div class="footer-col">
                    <h4><i class="fas fa-network-wired" style="font-size:10px; opacity:0.5; margin-right:5px;"></i> Infrastructure</h4>
                    <ul class="footer-links">
                        <li><a href="lifecycle.html">Lifecycle</a></li>
                        <li><a href="flux-comparison.html">Flux Comparator</a></li>
                        <li><a href="legal_pilot.html">Pilot Regime (EU)</a></li>
                        <li><a href="sandbox.html">Sandbox</a></li>
                        <li><a href="deployment-architecture.html">Deployment Arch</a></li>
                        <li><a href="networks/swiat.html">SWIAT</a></li>
                        <li><a href="networks/canton.html">Canton Network</a></li>
                    </ul>
                </div>
                <!-- 4. CORPORATE -->
                <div class="footer-col">
                    <h4><i class="fas fa-building" style="font-size:10px; opacity:0.5; margin-right:5px;"></i> Corporate</h4>
                    <ul class="footer-links">
                        <li><a href="methodology.html">Methodology</a></li>
                        <li><a href="current-status.html">Roadmap & Status</a></li>
                        <li><a href="guide.html">Documentation</a></li>
                        <li><a href="index-simple.html">Corporate Site</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="investor-login.html" style="color: #a855f7;"><i class="fas fa-lock" style="font-size: 10px; margin-right: 4px;"></i> Investor Room</a></li>
                        <li><a href="mailto:contact@dcm-digital.com">Contact</a></li>
                    </ul>
                </div>
                <!-- 5. LEGAL -->
                <div class="footer-col">
                    <h4><i class="fas fa-shield-alt" style="font-size:10px; opacity:0.5; margin-right:5px;"></i> Legal</h4>
                    <ul class="footer-links">
                        <li><a href="mentions-legales.html">Legal Mentions</a></li>
                        <li><a href="privacy.html">Privacy Policy</a></li>
                        <li><a href="cgu.html">Terms of Use</a></li>
                        <li><a href="cookies.html">Cookie Policy</a></li>
                        <li><a href="methodology.html#disclaimer">Disclaimer</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-disclaimer" style="margin-top: -20px; font-size: 11px; color: #64748b; line-height: 1.5; padding-bottom: 20px; text-align: left; max-width: 1200px; margin-left: auto; margin-right: auto;">
                <strong>Regulatory Transparency :</strong> DCM Digital quantifies the technological risks of DLT infrastructures. We do not provide any legal, compliance, or investment advice. The regulatory data (DORA, MiCA, Basel III) are used as references for systemic modeling and require independent analysis from your risk departments. <a href="regulatory-transparency.html" style="color: #3b82f6; text-decoration: underline;">Consult our Transparency Framework</a>.
            </div>
            <div class="footer-bottom">
                <div class="footer-bottom-content" style="max-width: 1400px; margin: 0 auto; padding: 0 40px; width: 100%; display: flex; justify-content: space-between; align-items: center;">
                    <div class="copyright">© 2026 DCM Digital • Version 4.3.0</div>
                    <div class="legal-links">
                        <a href="support-it.html">IT Support</a>
                        <a href="api-docs.html">API Documentation</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>"""

def update_footer_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match the entire footer from <!-- MAIN FOOTER --> to </footer>
    pattern = r'<!-- MAIN FOOTER -->.*?</footer>'
    
    if re.search(pattern, content, flags=re.DOTALL):
        modified = re.sub(pattern, NEW_FOOTER, content, flags=re.DOTALL)
        if modified != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(modified)
            print(f"Updated footer in {filepath}")
    else:
        print(f"No footer matched in {filepath}")

def main():
    for root, dirs, files in os.walk(EN_DIR):
        for file in files:
            if file.endswith('.html'):
                update_footer_in_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
