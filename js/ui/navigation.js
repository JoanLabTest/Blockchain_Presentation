/**
 * NAVIGATION MANAGER - v2.0 (Phase 96)
 * Dynamically renders the sidebar based on the 4-Pillar Institutional Architecture.
 * Supports: Core, Governance, Toolkit, Academic.
 */

import { checkFeature } from '../core/feature-flags.js';

export const NavigationManager = {

    // --- PILLAR DEFINITIONS ---
    PILLARS: {
        CORE: {
            name: 'Core Intelligence',
            icon: 'fa-brain',
            links: [
                { id: 'nav-dash', name: 'Dashboard', link: 'dashboard.html', icon: 'fa-chart-pie', active: true },
                { id: 'nav-rwa', name: 'RWA Vertical', link: 'rwa-analytics.html', icon: 'fa-layer-group', feature: 'ORG_MANAGEMENT' },
                { id: 'nav-risk', name: 'Risk Engine', link: 'dashboard.html?tab=risk', icon: 'fa-shield-virus' },
                { id: 'nav-yield', name: 'Yield Lab', link: 'yield-mechanics.html', icon: 'fa-flask-vial' }
            ]
        },
        GOVERNANCE: {
            name: 'Governance & Trust',
            icon: 'fa-gavel',
            links: [
                { id: 'nav-mica', name: 'Simulateur MiCA', link: 'mica-simulator.html', icon: 'fa-scale-balanced' },
                { id: 'nav-validation', name: 'Model Validation', link: 'dashboard.html?tab=validation', icon: 'fa-microscope', feature: 'ORG_MANAGEMENT' },
                { id: 'nav-audit', name: 'Audit Trails', link: 'dashboard.html?tab=audit', icon: 'fa-fingerprint', feature: 'AUDIT_VIEW' },
                { id: 'nav-reports', name: 'Rapports Certifiés', link: 'dashboard.html?tab=reports', icon: 'fa-file-signature', feature: 'ORG_MANAGEMENT' },
                { id: 'nav-org', name: 'Paramètres Org', link: 'org-settings.html', icon: 'fa-users-gear', feature: 'ORG_MANAGEMENT' },
                { id: 'nav-security', name: 'Security Center', link: 'security.html', icon: 'fa-lock' }
            ]
        },
        TOOLKIT: {
            name: 'Professional Toolkit',
            icon: 'fa-toolbox',
            links: [
                { id: 'nav-roi', name: 'ROI Calculator', link: 'flux-comparison.html', icon: 'fa-calculator' },
                { id: 'nav-sandbox', name: 'Dev Sandbox', link: 'sandbox.html', icon: 'fa-terminal' },
                { id: 'nav-workflows', name: 'Workflows', link: 'workflow-center.html', icon: 'fa-bolt', feature: 'ORG_MANAGEMENT' },
                { id: 'nav-compare', name: 'Market Benchmarks', link: 'comparateur.html', icon: 'fa-code-compare' }
            ]
        },
        ACADEMIC: {
            name: 'Academy & Certification',
            icon: 'fa-graduation-cap',
            links: [
                { id: 'nav-academy', name: 'Learning Path', link: 'students.html', icon: 'fa-book-open' },
                { id: 'nav-quiz', name: 'Examen Certifiant', link: 'quiz.html', icon: 'fa-award' },
                { id: 'nav-review', name: 'Mon Historique', link: 'quiz-review.html', icon: 'fa-clock-rotate-left' }
            ]
        }
    },

    /**
     * Renders the sidebar into the target element.
     */
    renderSidebar: (segment, target) => {
        if (!target) return;

        const hubAnchors = {
            student: '#learning',
            pro: '#toolkit',
            enterprise: '#governance',
            Guest: '#core'
        };
        const anchor = hubAnchors[segment] || '';

        let html = `
            <li><a href="index.html${anchor}" class="nav-item"><i class="fas fa-home"></i> Retour au Hub</a></li>
        `;

        // Determine which pillars to show/prioritize based on segment
        const segmentConfigs = {
            student: ['ACADEMIC', 'CORE'],
            pro: ['TOOLKIT', 'CORE', 'GOVERNANCE'],
            enterprise: ['GOVERNANCE', 'CORE', 'TOOLKIT'],
            Guest: ['CORE', 'ACADEMIC']
        };

        const activePillars = segmentConfigs[segment] || ['CORE', 'ACADEMIC'];

        activePillars.forEach(pillarKey => {
            const pillar = NavigationManager.PILLARS[pillarKey];

            html += `
                <div class="nav-section-header" style="margin-top: 25px; padding: 0 15px; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px;">
                    <i class="fas ${pillar.icon}" style="margin-right: 8px; opacity: 0.5;"></i> ${pillar.name}
                </div>
            `;

            pillar.links.forEach(item => {
                // Feature Gating
                const isEnabled = !item.feature || checkFeature(segment, item.feature);
                const style = isEnabled ? '' : 'opacity:0.4; filter:grayscale(1); cursor:not-allowed;';
                const title = isEnabled ? '' : 'title="Module réservé au plan supérieur"';

                html += `
                    <li>
                        <a href="${isEnabled ? item.link : '#'}" 
                           class="nav-item ${item.active ? 'active' : ''}" 
                           style="${style}" 
                           ${title}
                           ${item.id ? `id="${item.id}"` : ''}
                           data-tab="${item.link.includes('?tab=') ? item.link.split('tab=')[1] : ''}">
                            <i class="fas ${item.icon}"></i> ${item.name}
                            ${!isEnabled ? '<i class="fas fa-lock" style="margin-left:auto; font-size:10px;"></i>' : ''}
                        </a>
                    </li>
                `;
            });
        });

        // Add Footer Logic (Logout, Settings)
        html += `
            <div style="margin-top:auto; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05);">
                <li>
                    <a href="pricing.html" class="nav-item" style="color:var(--accent-gold)">
                        <i class="fas fa-crown"></i> UPGRADE PLAN
                    </a>
                </li>
                <li>
                    <a href="#" class="nav-item" style="color:var(--accent-red)" onclick="SessionManager.logout()">
                        <i class="fas fa-sign-out-alt"></i> Déconnexion
                    </a>
                </li>
            </div>
        `;

        target.innerHTML = html;
    }
};
