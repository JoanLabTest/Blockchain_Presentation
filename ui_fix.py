import os
import glob

footer_html = """    <footer class="super-footer">
        <div class="footer-content">
            <div class="footer-grid">
                <!-- BRAND -->
                <div class="footer-brand">
                    <h3><i class="fas fa-cube" style="color:var(--accent-blue)"></i> DCM DIGITAL</h3>
                    <p>La plateforme de référence pour maîtriser la tokenisation des actifs financiers et les
                        infrastructures DLT.</p>
                    <div class="footer-socials">
                        <a href="https://github.com/JoanLabTest/Blockchain_Presentation" class="social-btn"><i
                                class="fab fa-github"></i></a>
                        <a href="https://www.linkedin.com/in/joan-lyczak/" class="social-btn"><i
                                class="fab fa-linkedin-in"></i></a>
                        <a href="#" class="social-btn"><i class="fab fa-twitter"></i></a>
                    </div>
                </div>

                <!-- EXPLORER -->
                <div class="footer-col">
                    <h4>Explorer</h4>
                    <ul class="footer-links">
                        <li><a href="index.html"><i class="fas fa-home" style="font-size:10px; opacity:0.5;"></i> Hub Central</a></li>
                        <li><a href="simple.html"><i class="fas fa-graduation-cap" style="font-size:10px; opacity:0.5;"></i> Academy (Débutant)</a></li>
                        <li><a href="guide.html"><i class="fas fa-book" style="font-size:10px; opacity:0.5;"></i> Guide Expert (Pro)</a></li>
                        <li><a href="lifecycle.html"><i class="fas fa-project-diagram" style="font-size:10px; opacity:0.5;"></i> Cycle de Vie (Live)</a></li>
                        <li><a href="flux-comparison.html"><i class="fas fa-exchange-alt" style="font-size:10px; opacity:0.5;"></i> Comparateur Flux</a></li>
                        <li><a href="legal_pilot.html"><i class="fas fa-scale-balanced" style="font-size:10px; opacity:0.5;"></i> Régime Pilote (UE)</a></li>
                        <li><a href="sandbox.html"><i class="fas fa-terminal" style="font-size:10px; opacity:0.5;"></i> Sandbox (Dev)</a></li>
                    </ul>
                </div>

                <!-- RESOURCES -->
                <div class="footer-col">
                    <h4>Ressources</h4>
                    <ul class="footer-links">
                        <li><a href="rwa.html">RWA & DeFi</a></li>
                        <li><a href="buidl.html">BUIDL Research</a></li>
                        <li><a href="yield-mechanics.html">Yield Mechanics</a></li>
                        <li><a href="web3.html">Web3 Infrastructure</a></li>
                        <li><a href="ai-finance.html">AI & Finance</a></li>
                        <li><a href="quiz.html">Certification</a></li>
                        <li><a href="index-simple.html">Site Corporate</a></li>
                    </ul>
                </div>

                <!-- LEGAL -->
                <div class="footer-col" data-aos="fade-up" data-aos-delay="300">
                    <h4>Ressources</h4>
                    <ul class="footer-links">
                        <li><a href="governance.html"><i class="fas fa-shield-alt"></i> Gouvernance</a></li>
                        <li><a href="legal-matrix.html"><i class="fas fa-globe"></i> Global Matrix</a></li>
                        <li><a href="methodology.html">Méthodologie</a></li>
                        <li><a href="guide.html">Documentation</a></li>
                        <li><a href="simple.html">Academy</a></li>
                    </ul>
                </div>
                <div style="margin-top: 20px; font-size: 11px; color: #64748b; line-height: 1.5;">
                    <strong>Disclaimer :</strong> Plateforme de démonstration éducative. Aucun conseil financier.
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <div class="copyright">
                © 2026 DCM Digital • Internal Use Only • Version 2.5 (Yield Update)
            </div>
            <div class="legal-links">
                <a href="#">Support IT</a>
                <a href="#">Documentation API</a>
            </div>
        </div>
    </footer>"""

os.makedirs('/Users/joanl/blockchain-presentation/components', exist_ok=True)
with open('/Users/joanl/blockchain-presentation/components/footer.html', 'w') as f:
    f.write(footer_html)

# Fix JS particles in all HTML files
for file in glob.glob('/Users/joanl/blockchain-presentation/networks/*.html'):
    with open(file, 'r') as f:
        content = f.read()
    
    # Fix canvas id
    content = content.replace('<canvas id="particles-js"></canvas>', '<canvas id="hubCanvas"></canvas>')
    
    # Remove third-party particles.min.js
    content = content.replace('<script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>', '')
    content = content.replace('<script defer src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>', '')
    
    with open(file, 'w') as f:
        f.write(content)
        
print("Successfully fixed backgrounds and created footer.html!")
