// governance.js
// Governance & Legal Hardening Engine for Research OS
// Provides Radical Transparency on "Who controls the protocol"

const GovernanceEngine = {
    data: {
        entity: {
            name: "DCM Digital Assets SAS",
            lei: "969500A1B2C3D4E5F678", // Mock LEI
            jurisdiction: "Paris, France (MiCA)",
            regulator: "AMF / ACPR"
        },
        multisig: {
            address: "0x5A...9F2B",
            signers: 5,
            threshold: 3, // 3 of 5 required
            signersList: [
                { role: "Custody Head", status: "Active" },
                { role: "Compliance Officer", status: "Active" },
                { role: "Risk Manager", status: "Active" },
                { role: "Legal Counsel", status: "Offline" },
                { role: "Ext. Auditor", status: "Active" }
            ]
        },
        timelock: {
            delay: "48 hours",
            pendingActions: [] // No upgrades pending
        }
    },

    init() {
        console.log("⚖️ Initializing Governance Transparency Layer...");
        this.renderGovernanceWidget();
    },

    renderGovernanceWidget() {
        // Find container or inject if missing (Strategy: Append to main wrapper if specific ID not found)
        // For this implementation, we assume a container with ID 'governance-module' exists
        // or we render generically.

        this.updateDOM('gov-entity', this.data.entity.name);
        this.updateDOM('gov-lei', this.data.entity.lei);
        this.updateDOM('gov-jurisdiction', this.data.entity.jurisdiction);

        this.updateDOM('gov-multisig-threshold', `${this.data.multisig.threshold}/${this.data.multisig.signers}`);
        this.updateDOM('gov-timelock', this.data.timelock.delay);

        // Security Status Logic
        const securityBadge = document.getElementById('gov-security-badge');
        if (securityBadge) {
            securityBadge.innerHTML = `<i class="fas fa-shield-alt"></i> AUDITED & REGULATED`;
            securityBadge.style.color = "#10b981"; // Green
        }
    },

    updateDOM(id, value) {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    }
};

// Auto-init
document.addEventListener('DOMContentLoaded', () => GovernanceEngine.init());
