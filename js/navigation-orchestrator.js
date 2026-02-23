/**
 * NAVIGATION ORCHESTRATOR — v1.0 (Phase 95)
 * Central Hub for Segmented Routing, Deep Linking, and Institutional Pathing.
 * Refactors fragmented redirects into a cohesive "Gatekeeper" system.
 */

export const NavigationOrchestrator = {

    // --- APP ROUTES CONFIG ---
    SEGMENTS: ['student', 'pro', 'enterprise', 'Guest'],

    /**
     * INIT: Called on page load
     */
    init: () => {
        console.log('🧭 Navigation Orchestrator initialized.');

        // Initialize Multi-tenancy (Phase 106)
        if (window.TenantManager) {
            window.TenantManager.init();
        }

        const params = NavigationOrchestrator.getQueryParams();

        // 1. Handle Segment Handoff
        if (params.segment) {
            NavigationOrchestrator.handleSegmentTransition(params.segment);
        }

        // 2. Handle Dashboard Deep Linking
        if (window.location.pathname.includes('dashboard.html')) {
            NavigationOrchestrator.applyDashboardState(params);
        }

        // 3. Listen for History Navigation (Phase 101)
        window.addEventListener('popstate', () => {
            const nextParams = NavigationOrchestrator.getQueryParams();
            if (nextParams.segment) {
                NavigationOrchestrator.handleSegmentTransition(nextParams.segment);
            }
            if (window.location.pathname.includes('dashboard.html')) {
                NavigationOrchestrator.applyDashboardState(nextParams);
            }
        });
    },

    /**
     * EXPOSE PARAMS: Parse URL search strings
     */
    getQueryParams: () => {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            segment: urlParams.get('segment'),
            tab: urlParams.get('tab'),
            module: urlParams.get('module'),
            view: urlParams.get('view')
        };
    },

    /**
     * SEGMENT HANDOFF: Persists the persona role to SessionManager/LocalStorage
     */
    handleSegmentTransition: (segment) => {
        if (!NavigationOrchestrator.SEGMENTS.includes(segment)) return;

        const org = window.TenantManager ? window.TenantManager.getActiveOrg() : { id: 'N/A' };
        console.log(`🎯 Routing Triggered: Segment [${segment.toUpperCase()}] | Organization [${org.id}]`);

        // Update SessionManager (if available globally) or LocalStorage
        if (window.SessionManager) {
            window.SessionManager.setSessionRole(segment);
        } else {
            localStorage.setItem('dcm_active_role', segment);
        }

        // Apply visual theme immediately to <body> to prevent blink
        document.body.setAttribute('data-segment', segment);

        // Sync Dashboard UI components (Phase 101)
        if (window.location.pathname.includes('dashboard.html')) {
            if (window.NavigationManager) {
                window.NavigationManager.renderSidebar(segment, document.getElementById('side-nav-menu'));
            }
            if (window.DashboardEngine) {
                window.DashboardEngine.applyRoleVisibility(segment);
            }
        }
    },

    /**
     * DASHBOARD STATE: Deep-links into specific Dashboard tabs or modules
     */
    applyDashboardState: (params) => {
        const run = () => {
            // A. Tab Activation
            if (params.tab) {
                NavigationOrchestrator.triggerDashboardTab(params.tab);
            }

            // B. Module Highlighting
            if (params.module) {
                NavigationOrchestrator.focusModule(params.module);
            }
        };

        if (document.readyState === 'complete') {
            run();
        } else {
            window.addEventListener('load', run);
        }
    },

    /**
     * TRIGGER TAB: Clicks the correct sidebar item programmatically
     */
    triggerDashboardTab: (tabId) => {
        const tabElement = document.querySelector(`.nav-item[data-tab="${tabId}"]`) ||
            document.getElementById(`nav-${tabId}`);

        if (tabElement) {
            console.log(`🚀 Deep Linking: Activating Tab [${tabId}]`);

            // SPA Transition Effect
            const main = document.querySelector('.main-content');
            if (main) main.classList.add('tab-switching');

            setTimeout(() => {
                tabElement.click();
                if (main) main.classList.remove('tab-switching');
            }, 300);

        } else {
            console.warn(`⚠️ Deep Link Failure: Tab [${tabId}] not found in current segment view.`);
        }
    },

    /**
     * FOCUS MODULE: Scrolls to and highlights a specific widget
     */
    focusModule: (moduleId) => {
        const module = document.getElementById(moduleId) || document.querySelector(`[data-module="${moduleId}"]`);
        if (module) {
            module.scrollIntoView({ behavior: 'smooth', block: 'center' });
            module.style.border = '2px solid var(--accent-blue)';
            module.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.4)';
            setTimeout(() => {
                module.style.transition = 'all 2s';
                module.style.border = '';
                module.style.boxShadow = '';
            }, 3000);
        }
    },

    /**
     * UTILS: Institutional Link Generator
     */
    generateLink: (path, segment, tab = null) => {
        let url = `${path}?segment=${segment}`;
        if (tab) url += `&tab=${tab}`;
        return url;
    }
};

// AUTO-INIT if script is loaded
if (typeof window !== 'undefined') {
    window.NavigationOrchestrator = NavigationOrchestrator;
    NavigationOrchestrator.init();
}
