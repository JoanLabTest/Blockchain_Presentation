/**
 * DASHBOARD TOUR MODULE - Phase 60
 * Interactive guided tour for new users.
 */

export const DashboardTour = {
    enterpriseSteps: [
        {
            target: '#audit-trail-container',
            title: '🔗 Intégrité Cryptographique',
            content: 'Démontrez à vos régulateurs que vos logs sont immuables. Chaque action est chaînée par hash SHA-256.',
            position: 'top'
        },
        {
            target: 'button[onclick*="exportTransparencyReport"]',
            title: '📜 Rapport de Transparence',
            content: 'Générez en un clic un dossier d\'audit prêt pour le régulateur (MiCA Art. 81).',
            position: 'top'
        },
        {
            target: 'button[onclick*="notarizeChain"]',
            title: '⚓ Ancrage Externe',
            content: 'Notarisez l\'état du système vers un hub externe pour une preuve de non-répudiation absolue.',
            position: 'top'
        },
        {
            target: '#managerToggle',
            title: '🏢 Gouvernance Multi-Org',
            content: 'Isolez strictement les données de vos différentes filiales grâce à notre architecture RLS.',
            position: 'left'
        }
    ],

    currentStep: 0,
    isEnterpriseMode: false,

    init: function () {
        if (localStorage.getItem('dcm_tour_completed')) return;

        // Wait for page load and charts to be ready
        setTimeout(() => {
            this.start();
        }, 2000);
    },

    start: function () {
        this.currentStep = 0;
        this.isEnterpriseMode = false;
        this.createOverlay();
        this.showStep();
    },

    startEnterpriseDemo: function () {
        this.currentStep = 0;
        this.isEnterpriseMode = true;
        this.createOverlay();
        this.showStep();
    },

    createOverlay: function () {
        if (document.getElementById('tour-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'tour-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 9998;
            pointer-events: none;
            transition: all 0.3s;
        `;

        const card = document.createElement('div');
        card.id = 'tour-card';
        card.style.cssText = `
            position: fixed;
            z-index: 9999;
            background: #1e293b;
            border: 1px solid ${this.isEnterpriseMode ? 'var(--accent-cyan)' : '#3b82f6'};
            border-radius: 12px;
            padding: 20px;
            width: 300px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            color: white;
            pointer-events: auto;
        `;

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h4 id="tour-title" style="margin:0; color:${this.isEnterpriseMode ? 'var(--accent-cyan)' : '#3b82f6'}; font-size:16px;"></h4>
                ${this.isEnterpriseMode ? '<span style="font-size:10px; background:rgba(0,255,255,0.1); color:var(--accent-cyan); padding:2px 6px; border-radius:4px;">ENTERPRISE</span>' : ''}
            </div>
            <p id="tour-content" style="margin:0 0 20px 0; font-size:14px; color:#94a3b8; line-height:1.5;"></p>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <button id="tour-skip" style="background:none; border:none; color:#64748b; font-size:12px; cursor:pointer;">Passer</button>
                <button id="tour-next" style="background:${this.isEnterpriseMode ? 'var(--accent-cyan)' : '#3b82f6'}; border:none; color:black; padding:8px 16px; border-radius:6px; font-weight:700; cursor:pointer;">Suivant</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(card);

        document.getElementById('tour-skip').onclick = () => this.end();
        document.getElementById('tour-next').onclick = () => this.next();
    },

    showStep: function () {
        const stepList = this.isEnterpriseMode ? this.enterpriseSteps : this.steps;
        const step = stepList[this.currentStep];
        const target = document.querySelector(step.target);

        if (!target) {
            this.next();
            return;
        }

        const rect = target.getBoundingClientRect();
        const card = document.getElementById('tour-card');
        const overlay = document.getElementById('tour-overlay');

        // Update Text
        document.getElementById('tour-title').innerText = step.title;
        document.getElementById('tour-content').innerText = step.content;

        // Highlight effect via clip-path
        const padding = 10;
        overlay.style.background = 'rgba(0,0,0,0.8)';
        overlay.style.clipPath = `polygon(
            0% 0%, 0% 100%, 
            ${rect.left - padding}px 100%, 
            ${rect.left - padding}px ${rect.top - padding}px, 
            ${rect.right + padding}px ${rect.top - padding}px, 
            ${rect.right + padding}px ${rect.bottom + padding}px, 
            ${rect.left - padding}px ${rect.bottom + padding}px, 
            ${rect.left - padding}px 100%, 
            100% 100%, 100% 0%
        )`;

        // Position Card
        let top = rect.bottom + 20;
        let left = rect.left + (rect.width / 2) - 150;

        if (step.position === 'top') top = rect.top - 200;
        if (step.position === 'bottom') top = rect.bottom + 20;
        if (step.position === 'left') {
            top = rect.top;
            left = rect.left - 320;
        }
        if (step.position === 'right') {
            top = rect.top;
            left = rect.right + 20;
        }

        // Screen boundary safety
        if (left < 20) left = 20;
        if (left + 300 > window.innerWidth) left = window.innerWidth - 320;

        card.style.top = `${top}px`;
        card.style.left = `${left}px`;
        card.style.opacity = '1';

        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },

    next: function () {
        this.currentStep++;
        const stepList = this.isEnterpriseMode ? this.enterpriseSteps : this.steps;
        if (this.currentStep >= stepList.length) {
            this.end();
        } else {
            this.showStep();
        }
    },

    end: function () {
        localStorage.setItem('dcm_tour_completed', 'true');
        const card = document.getElementById('tour-card');
        const overlay = document.getElementById('tour-overlay');
        if (card) card.remove();
        if (overlay) overlay.remove();
    }
};

window.DashboardTour = DashboardTour;
export default DashboardTour;
