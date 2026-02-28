/**
 * NAVIGATION ORCHESTRATOR — v1.0 (Phase 95)
 * Central Hub for Segmented Routing, Deep Linking, and Institutional Pathing.
 * Refactors fragmented redirects into a cohesive "Gatekeeper" system.
 */

const NavigationOrchestrator = {

    // --- APP ROUTES CONFIG ---
    SEGMENTS: ['student', 'pro', 'enterprise', 'free', 'institutional', 'Guest', 'guest'],

    /**
     * INIT: Called on page load
     */
    init: () => {
        console.log('🧭 Navigation Orchestrator initialized.');

        const run = () => {
            if (window.TenantManager) {
                window.TenantManager.init();
            }

            // Listen for verified profile readiness (Phase 115)
            window.addEventListener('dcm-profile-ready', (e) => {
                console.log('🔄 Profile Verified: Re-syncing Navigation...');
                NavigationOrchestrator.handleSegmentTransition(e.detail.subscription_tier || 'student');
            });

            const params = NavigationOrchestrator.getQueryParams();

            // Detect segment from URL or LocalStorage fallback
            const savedRole = localStorage.getItem('dcm_active_role') || localStorage.getItem('dcm_segment') || 'student';
            const activeSegment = params.segment || savedRole;

            // 1. Handle Segment Handoff/Init
            NavigationOrchestrator.handleSegmentTransition(activeSegment);

            // 2. Handle Dashboard Deep Linking
            if (window.location.pathname.includes('dashboard.html')) {
                NavigationOrchestrator.applyDashboardState(params);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', run);
        } else {
            run();
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
        // Normalize segment and check validity
        const normalized = segment === 'guest' ? 'Guest' : segment;
        if (!NavigationOrchestrator.SEGMENTS.includes(normalized)) return;

        const org = window.TenantManager ? window.TenantManager.getActiveOrg() : { id: 'N/A' };
        console.log(`🎯 Routing Triggered: Segment [${normalized.toUpperCase()}] | Organization [${org.id}]`);

        // Update SessionManager (if available globally) or LocalStorage
        if (window.SessionManager) {
            window.SessionManager.setSessionRole(normalized);
        } else {
            localStorage.setItem('dcm_active_role', normalized);
        }

        // Apply visual theme immediately to <body> to prevent blink
        document.body.setAttribute('data-segment', normalized);

        if (window.NavigationManager) {
            const sidebarContainer = document.getElementById('dcm-sidebar-container') || document.querySelector('.sidebar');
            const sideMenu = document.getElementById('side-nav-menu');

            if (sidebarContainer || sideMenu) {
                console.log('🏗️ Sidebar Rendering Triggered...');

                const verifiedTier = window.SessionManager?.__verifiedProfile?.subscription_tier;
                const activeRole = verifiedTier || normalized;

                // Priority 1: side-nav-menu (for pages like dashboard.html with legacy structure)
                if (sideMenu && (sideMenu.children.length === 0 || sideMenu.innerHTML.replace(/<!--[\s\S]*?-->/g, "").trim() === '')) {
                    window.NavigationManager.renderSidebar(activeRole, sideMenu);
                }
                // Priority 2: sidebarContainer (for new standard pages where the whole sidebar is dynamic)
                else if (sidebarContainer && (sidebarContainer.children.length === 0 || sidebarContainer.innerHTML.replace(/<!--[\s\S]*?-->/g, "").trim() === '')) {
                    window.NavigationManager.renderSidebar(activeRole, sidebarContainer);
                }

                if (window.DashboardEngine) {
                    window.DashboardEngine.applyRoleVisibility(normalized);
                }
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
