/**
 * NAVIGATION MANAGER - v1.0
 * Dynamically renders the sidebar based on user segment and feature flags.
 */

import { checkFeature } from '../core/feature-flags.js';

export const NavigationManager = {

    // Core Links (Available to all)
    CORE_LINKS: [
        { id: 'nav-home', name: 'Accueil Hub', link: 'index.html', icon: 'fa-home' },
        { id: 'nav-dash', name: 'Dashboard', link: 'dashboard.html', icon: 'fa-chart-line', active: true },
    ],

    // Specialized Modules
    MODULE_LINKS: [
        { id: 'nav-review', name: 'Review & Time', link: 'quiz-review.html', icon: 'fa-history' },
        { id: 'nav-quiz', name: 'Quiz & Tests', link: 'quiz.html', icon: 'fa-graduation-cap' },
        { id: 'nav-legal', name: 'Legal Matrix', link: 'legal-matrix.html', icon: 'fa-balance-scale' },
        { id: 'nav-mica', name: 'Simulateur MiCA', link: 'mica-simulator.html', icon: 'fa-shield-halved' },
        { id: 'nav-compare', name: 'Comparateur', link: 'comparateur.html', icon: 'fa-code-compare' },
        { id: 'nav-yield', name: 'Laboratoire Yield', link: 'yield-mechanics.html', icon: 'fa-flask' },
    ],

    // Premium/SaaS Actions
    PREMIUM_ACTIONS: [
        { id: 'nav-report', name: 'Générer Rapport', action: 'generateReport()', icon: 'fa-file-pdf', feature: 'REPORT_EXPORT' },
        { id: 'nav-manager', name: 'Manager Mode', type: 'toggle', feature: 'MANAGER_VIEW', toggleId: 'managerToggle', onchange: 'toggleManagerMode()' },
        { id: 'nav-whitelabel', name: 'White Label', type: 'toggle', feature: 'whiteLabel', toggleId: 'whiteLabelToggle', premiumLabel: 'PRO', onchange: 'DashboardEngine.toggleWhiteLabel(this.checked)' }
    ],

    /**
     * Renders the sidebar into the target element.
     * @param {string} segment 
     * @param {HTMLElement} target 
     */
    renderSidebar: (segment, target) => {
        if (!target) return;

        let html = '';

        // 1. Render Core Links
        html += NavigationManager.CORE_LINKS.map(item => `
            <li><a href="${item.link}" class="nav-item ${item.active ? 'active' : ''}"><i class="fas ${item.icon}"></i> ${item.name}</a></li>
        `).join('');

        // 2. Render Module Links
        html += NavigationManager.MODULE_LINKS.map(item => `
            <li><a href="${item.link}" class="nav-item"><i class="fas ${item.icon}"></i> ${item.name}</a></li>
        `).join('');

        // 3. Render Premium/SaaS Section
        html += `<div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 10px; text-transform: uppercase; color: #64748b; margin-bottom: 10px; letter-spacing: 1px; padding-left:15px;">Espace SaaS</div>`;

        html += NavigationManager.PREMIUM_ACTIONS.map(item => {
            const isEnabled = checkFeature(segment, item.feature);
            const style = isEnabled ? '' : 'opacity:0.5; filter:grayscale(1); pointer-events:none;';
            const title = isEnabled ? '' : 'title="Passer au plan PRO pour débloquer"';

            if (item.type === 'toggle') {
                return `
                    <div class="nav-item" style="${style}" ${title}>
                        <i class="fas fa-toggle-on"></i> ${item.name} ${item.premiumLabel ? `<span style="font-size:9px; background:var(--accent-blue); padding:1px 4px; border-radius:3px; margin-left:5px;">${item.premiumLabel}</span>` : ''}
                        <label class="switch" style="margin-left:auto; width:34px; height:20px;">
                            <input type="checkbox" id="${item.toggleId}" onchange="${item.onchange}" ${!isEnabled ? 'disabled' : ''}>
                            <span class="slider round"></span>
                        </label>
                    </div>
                `;
            } else {
                return `
                    <li onclick="${item.action}" class="nav-item" style="cursor:pointer; color: var(--accent-blue); ${style}" ${title}>
                        <i class="fas ${item.icon}"></i> ${item.name}
                    </li>
                `;
            }
        }).join('');

        html += `</div>`;

        // 4. Footer Links
        html += `
            <li style="margin-top:auto;">
                <a href="pricing.html" class="nav-item" style="color:#f59e0b">
                    <i class="fas fa-crown"></i> Abonnement & Tarifs
                </a>
            </li>
            <li>
                <a href="#" class="nav-item" style="color:var(--accent-red)" onclick="SessionManager.logout()">
                    <i class="fas fa-sign-out-alt"></i> Déconnexion
                </a>
            </li>
        `;

        target.innerHTML = html;
    }
};
