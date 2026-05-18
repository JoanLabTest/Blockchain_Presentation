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
                            <p>The independent research infrastructure for programmable finance.</p>
                            <a href="https://www.linkedin.com/in/joan-lyczak/" target="_blank" class="linkedin-link" title="LinkedIn">
                                <i class="fab fa-linkedin"></i>
                            </a>
                        </div>
                        <div class="footer-col">
                            <h4>Research</h4>
                            <ul class="footer-links">
                                <li><a href="${this.basePath}research/global-tokenization-report.html">Global Report 2026</a></li>
                                <li><a href="${this.basePath}research-programs/index.html">Programs</a></li>
                                <li><a href="${this.basePath}research-papers/index.html">Working Papers</a></li>
                                <li><a href="${this.basePath}methodology/index.html">Methodology</a></li>
                                <li><a href="${this.basePath}methodology/governance.html">Governance Charter</a></li>
                                <li><a href="${this.basePath}research/cite-and-integrate.html" style="font-weight: 600; color: #60a5fa;">Cite & Integrate</a></li>
                            </ul>
                        </div>
                        <div class="footer-col">
                            <h4>Data & Intel</h4>
                            <ul class="footer-links">
                                <li><a href="${this.basePath}observatory/tokenized-markets.html">Observatory</a></li>
                                <li><a href="${this.basePath}data/tokenized-securities-dataset.html">Open Data</a></li>
                                <li><a href="${this.basePath}indices/index.html">Indices & GDARI</a></li>
                            </ul>
                        </div>
                        <div class="footer-col">
                            <h4>Institution</h4>
                            <ul class="footer-links">
                                <li><a href="${this.basePath}about.html">About</a></li>
                                <li><a href="${this.basePath}about/advisory-board.html">Advisory Board</a></li>
                                <li><a href="${this.basePath}global-forum/index.html">Global Forum</a></li>
                                <li><a href="${this.basePath}fellowships/index.html">Fellowships</a></li>
                                <li><a href="${this.basePath}institutional-collaborations/index.html">Collaborations</a></li>
                                <li><a href="${this.basePath}media/index.html">Media</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer-disclaimer" style="text-align: left; font-size: 11px; line-height: 1.6; color: var(--text-muted);">
                        <strong style="color: var(--accent-gold); display: block; margin-bottom: 5px; font-family:'Outfit'; text-transform:uppercase; letter-spacing:1px;">Epistemic &amp; Regulatory Disclosure:</strong>
                        The DCM Core Annual Report and associated observatories represent an analytical framework combining empirical Eurosystem data, quantitative models, and scenario-based projections. All indexes, parameters, and findings are published solely for information and research purposes. They do not constitute, and shall not be construed as, financial, legal, investment, or regulatory advisory services.
                    </div>
                    <div class="footer-bottom">
                        <div class="footer-bottom-content">
                            <div class="copyright">© 2026 DCM Core Institute</div>
                            <div class="legal-links">
                                <a href="${this.basePath}legal-mentions.html">Legal Mentions</a>
                                <a href="${this.basePath}cgu.html">T&C</a>
                                <a href="${this.basePath}cgv.html">T&S</a>
                                <a href="${this.basePath}terms-of-service.html">ToS</a>
                                <a href="${this.basePath}research-policy.html">Research Policy</a>
                                <a href="${this.basePath}methodology/governance.html">Governance</a>
                                <a href="${this.basePath}methodology/index.html">Methodology</a>
                                <a href="${this.basePath}privacy.html">Privacy</a>
                                <a href="${this.basePath}cookies.html">Cookies</a>
                                <a href="${this.basePath}support-it.html">IT Support</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('global-footer', GlobalFooter);
