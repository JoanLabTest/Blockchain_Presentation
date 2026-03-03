/* GOVERNANCE ENGINE - PHASE 13 */

const Governance = {
    state: {
        signers: [
            { role: "Risk Manager", icon: "fa-chart-line", signed: false },
            { role: "Tech Lead", icon: "fa-code", signed: false },
            { role: "Custodian", icon: "fa-university", signed: false },
            { role: "Legal Head", icon: "fa-balance-scale", signed: false },
            { role: "Community Rep", icon: "fa-users", signed: false }
        ],
        signatures: 0,
        threshold: 3,
        voted: false
    },

    init() {
        this.renderMultisig();
    },

    renderMultisig() {
        const grid = document.getElementById('multisig-grid');
        grid.innerHTML = '';

        this.state.signers.forEach((s, index) => {
            const card = document.createElement('div');
            card.className = `signer-card ${s.signed ? 'signed' : ''}`;
            card.onclick = () => this.toggleSigner(index);
            card.innerHTML = `
                <i class="fas ${s.icon} signer-icon"></i>
                <div style="font-weight:bold; color:white; font-size:12px; margin-bottom:5px;">${s.role}</div>
                <div class="status-badge">${s.signed ? 'SIGNED' : 'WAITING'}</div>
            `;
            grid.appendChild(card);
        });

        this.updateMultisigStatus();
    },

    toggleSigner(index) {
        // Toggle Logic
        this.state.signers[index].signed = !this.state.signers[index].signed;
        this.state.signatures = this.state.signers.filter(s => s.signed).length;

        // Re-render
        this.renderMultisig();
    },

    updateMultisigStatus() {
        const el = document.getElementById('multisig-status');
        const count = this.state.signatures;
        const required = this.state.threshold;

        if (count >= required) {
            el.innerHTML = `<span style="color:#10b981"><i class="fas fa-check-circle"></i> QUORUM REACHED (${count}/${this.state.signers.length})</span> - READY TO EXECUTE`;
            // Trigger visual feedback (optional)
        } else {
            el.innerHTML = `PENDING (${count}/${required} Required)`;
        }
    },

    castVote(direction) {
        if (this.state.voted) {
            alert("Vote already cast from this address.");
            return;
        }

        const barFor = document.getElementById('bar-for');
        const txtFor = document.getElementById('txt-for');

        // Simulate Network Request
        setTimeout(() => {
            if (direction === 'for') {
                barFor.style.width = '82%';
                txtFor.innerText = 'Pour: 82% (10.2M)';
                alert("✅ Vote Confirmé: +150k DCM pour 'Increase Yield'");
            } else {
                // Logic for against
                document.getElementById('bar-against').style.width = '25%';
                document.getElementById('txt-against').innerText = 'Contre: 25% (3.1M)';
                alert("❌ Vote Confirmé: Contre la proposition");
            }
            this.state.voted = true;
        }, 300);
    }
};

document.addEventListener('DOMContentLoaded', () => Governance.init());
