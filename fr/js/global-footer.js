class GlobalFooter extends HTMLElement {
    constructor() {
        super();
        this.basePath = this.getAttribute('base-path') || '';
    }

    connectedCallback() {
        this.innerHTML = `
            <footer class="super-footer">
                <div class="footer-content">
                    <div class="footer-grid">
                        <div class="footer-brand">
                            <div class="logo-orb"></div>
                            <h3>DCM Core Institute</h3>
                            <p>L'infrastructure de recherche indépendante pour la finance programmable.</p>
                            <a href="https://www.linkedin.com/in/joan-lyczak/" target="_blank" class="linkedin-link" title="LinkedIn">
                                <i class="fab fa-linkedin"></i>
                            </a>
                        </div>
                        <div class="footer-col">
                            <h4>Recherche</h4>
                            <ul class="footer-links">
                                <li><a href="${this.basePath}research/rapport-mondial-tokenisation-2026.html">Rapport Mondial 2026</a></li>
                                <li><a href="${this.basePath}research-programs/index.html">Programmes</a></li>
                                <li><a href="${this.basePath}research-papers/index.html">Working Papers</a></li>
                                <li><a href="${this.basePath}methodology/index.html">Méthodologie</a></li>
                            </ul>
                        </div>
                        <div class="footer-col">
                            <h4>Données</h4>
                            <ul class="footer-links">
                                <li><a href="${this.basePath}observatory/tokenized-markets.html">Observatoire</a></li>
                                <li><a href="${this.basePath}data/jeu-de-donnees-actifs-tokenises.html">Open Data</a></li>
                                <li><a href="${this.basePath}indices/index.html">Indices & GDARI</a></li>
                            </ul>
                        </div>
                        <div class="footer-col">
                            <h4>Institution</h4>
                            <ul class="footer-links">
                                <li><a href="${this.basePath}about.html">À propos</a></li>
                                <li><a href="${this.basePath}about/conseil-consultatif.html">Conseil Consultatif</a></li>
                                <li><a href="${this.basePath}global-forum/index.html">Global Forum</a></li>
                                <li><a href="${this.basePath}fellowships/index.html">Fellowships</a></li>
                                <li><a href="${this.basePath}collaborations.html">Collaborations</a></li>
                                <li><a href="${this.basePath}media/index.html">Médias</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer-disclaimer">
                        <strong>Avertissement Institutionnel :</strong> Les analyses publiées par le DCM Core Institute sont
                        destinées à des fins de recherche académique et d'intelligence de marché. Elles ne constituent en aucun
                        cas des conseils d'investissement ou des recommandations de conformité.
                    </div>
                    <div class="footer-bottom">
                        <div class="footer-bottom-content">
                            <div class="copyright">© 2026 DCM Core Institute</div>
                            <div class="legal-links">
                                <a href="${this.basePath}mentions-legales.html">Mentions Légales</a>
                                <a href="${this.basePath}cgu.html">CGU</a>
                                <a href="${this.basePath}cgv.html">CGV</a>
                                <a href="${this.basePath}tos.html">ToS</a>
                                <a href="${this.basePath}research-policy.html">Politique de Recherche</a>
                                <a href="${this.basePath}governance.html">Gouvernance</a>
                                <a href="${this.basePath}research-methodology.html">Méthodologie</a>
                                <a href="${this.basePath}privacy.html">Confidentialité</a>
                                <a href="${this.basePath}cookies.html">Cookies</a>
                                <a href="${this.basePath}support-it.html">Support IT</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('global-footer', GlobalFooter);
