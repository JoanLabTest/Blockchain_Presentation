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
                                <li><a href="${this.basePath}methodology/gouvernance.html">Charte de Gouvernance</a></li>
                                <li><a href="${this.basePath}research/citer-et-integrer.html" style="font-weight: 600; color: #60a5fa;">Citer & Intégrer</a></li>
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
                    <div class="footer-disclaimer" style="text-align: left; font-size: 11px; line-height: 1.6; color: var(--text-muted);">
                        <strong style="color: var(--accent-gold); display: block; margin-bottom: 5px; font-family:'Outfit'; text-transform:uppercase; letter-spacing:1px;">Avertissement Épistémique &amp; Réglementaire :</strong>
                        Le rapport annuel de DCM Core et les observatoires associés représentent un cadre analytique combinant des données empiriques de l'Eurosystème, des modèles quantitatifs et des projections basées sur des scénarios. Tous les indices, paramètres et conclusions sont publiés uniquement à des fins d'information et de recherche. Ils ne constituent pas et ne doivent pas être interprétés comme des services de conseil financier, juridique, d'investissement ou réglementaire.
                    </div>
                    <div class="footer-bottom">
                        <div class="footer-bottom-content">
                            <div class="copyright">© 2026 DCM Core Institute</div>
                            <div class="legal-links">
                                <a href="${this.basePath}mentions-legales.html">Mentions Légales</a>
                                <a href="${this.basePath}cgu.html">CGU</a>
                                <a href="${this.basePath}cgv.html">CGV</a>
                                <a href="${this.basePath}research-policy.html">Politique de Recherche</a>
                                <a href="${this.basePath}methodology/gouvernance.html">Gouvernance</a>
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
