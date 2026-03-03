/**
 * ONBOARDING WIZARD - v1.0 (Phase 109)
 * Guides new Institutional users through the Multi-tenant Cockpit.
 */

export const OnboardingWizard = {
    steps: [
        { target: '#active-org-name', title: 'Contexte Organisationnel', content: 'Ceci est votre organisation active. Toutes les données sont isolées à ce niveau.' },
        { target: '#tenant-indicator', title: 'Isolation Proof', content: 'Ce badge garantit que vous visualisez uniquement les données de votre institution.' },
        { target: '#nav-org', title: 'Gestion d\'Équipe', content: 'Invitez vos collaborateurs et gérez leurs rôles ici (Admin, Analyste Risk).' },
        { target: '#nav-reports', title: 'Reporting Institutionnel', content: 'Générez vos bundles certifiés pour la Compliance en un clic.' },
        { target: '#nav-workflows', title: 'Automatisations', content: 'Configurez vos alertes de sensibilité et vos audits planifiés.' }
    ],

    currentStep: 0,

    start: () => {
        if (localStorage.getItem('dcm_onboarding_completed')) return;
        console.log('🚀 Starting Onboarding Wizard...');
        OnboardingWizard.showStep(0);
    },

    showStep: (index) => {
        const step = OnboardingWizard.steps[index];
        if (!step) {
            OnboardingWizard.complete();
            return;
        }

        const el = document.querySelector(step.target);
        if (!el) {
            OnboardingWizard.showStep(index + 1);
            return;
        }

        // Simple Overlay for Demo
        const overlay = document.createElement('div');
        overlay.id = 'onboarding-overlay';
        overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 10000; display: flex;
            justify-content: center; align-items: center; pointer-events: none;
        `;

        const box = document.createElement('div');
        box.style = `
            background: #0f172a; border: 1px solid #3b82f6; border-radius: 16px;
            padding: 25px; max-width: 400px; color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            pointer-events: auto; position: relative;
        `;

        box.innerHTML = `
            <div style="font-weight:800; color:#3b82f6; margin-bottom:10px;">${step.title}</div>
            <div style="font-size:14px; color:#94a3b8; line-height:1.5; margin-bottom:20px;">${step.content}</div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:11px; color:#64748b;">Etape ${index + 1}/${OnboardingWizard.steps.length}</div>
                <button id="next-onboarding" style="background:#3b82f6; color:white; border:none; padding:8px 20px; border-radius:8px; cursor:pointer; font-weight:700;">Suivant</button>
            </div>
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        document.getElementById('next-onboarding').onclick = () => {
            document.getElementById('onboarding-overlay').remove();
            OnboardingWizard.showStep(index + 1);
        };
    },

    complete: () => {
        localStorage.setItem('dcm_onboarding_completed', 'true');
        console.log('✅ Onboarding completed.');
    }
};

// Auto-start if enterprise
if (typeof window !== 'undefined') {
    window.OnboardingWizard = OnboardingWizard;
    window.addEventListener('load', () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('segment') === 'enterprise') {
            setTimeout(OnboardingWizard.start, 2000);
        }
    });
}
