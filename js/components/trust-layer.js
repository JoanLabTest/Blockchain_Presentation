class TrustLayer {
    constructor() {
        this.logos = [
            { name: "Global Custodian (Research)", type: "Citation" },
            { name: "Tier-1 Investment Bank", type: "Pilot TFIN-01" },
            { name: "EU Regulatory Board (Assoc)", type: "Compliance" },
            { name: "Sovereign Wealth Fund", type: "Institutional Reference" }
        ];
    }

    render(container, isFR = false) {
        const title = isFR ? "Cité dans les Rapports & Utilisé par les Analystes" : "Cited in Reports & Used by Analysts";
        const meta = isFR ? "DCM Core Standard v1.0.4 - Preuve d'Adoption" : "DCM Core Standard v1.0.4 - Adoption Proof";

        container.innerHTML = `
            <div class="trust-layer-widget">
                <div class="tl-header">
                    <div class="tl-title">${title}</div>
                    <div class="tl-meta">${meta}</div>
                </div>
                <div class="tl-grid">
                    ${this.logos.map(logo => `
                        <div class="tl-item">
                            <div class="tl-logo-placeholder">
                                <i class="fas fa-landmark"></i>
                                <span>${logo.name}</span>
                            </div>
                            <div class="tl-tag">${logo.type}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="tl-audit-button">
                    <i class="fas fa-shield-halved"></i> Audit de Référence Complet (DCM Research Council)
                </div>
            </div>
        `;
    }
}

// Global Export
window.TrustLayer = new TrustLayer();
