/**
 * DCM DIGITAL — DEV UNLOCK SCRIPT
 * ============================================
 * ⚠️  DEVELOPMENT / MASTER ACCESS OVERRIDE ⚠️
 * 
 * This script MUST be loaded as the FIRST script on any page.
 * It forces complete admin + enterprise access in dev mode,
 * bypassing all paywall, RBAC, and subscription checks.
 *
 * Master account: joanlyczak@gmail.com
 * ============================================
 */

(function () {
    'use strict';

    const MASTER_EMAIL = 'joanlyczak@gmail.com';
    const MASTER_PROFILE = {
        id: 'master-dev-001',
        name: 'Joan Lyczak',
        email: MASTER_EMAIL,
        role: 'ADMIN',
        org_id: 'dcm-master-org',
        jurisdiction: 'EU (France)',
        subscription_tier: 'enterprise',
        lastLogin: new Date().toISOString()
    };

    // ─── 1. Force all localStorage keys ───────────────────────────────────────
    localStorage.setItem('dcm_user_role', 'ADMIN');
    localStorage.setItem('dcm_active_role', 'enterprise');
    localStorage.setItem('is_super_dev', 'true');
    localStorage.setItem('dcm_org_id', 'dcm-master-org');
    localStorage.setItem('dcm_auth_token', 'dev_master_token_' + Date.now());
    localStorage.setItem('dcm_user_profile', JSON.stringify(MASTER_PROFILE));
    localStorage.setItem('dcm_session_start', Date.now().toString());
    localStorage.setItem('dcm_last_activity', Date.now().toString());

    // Segment / role selectors used by different modules
    localStorage.setItem('dcm_segment', 'enterprise');
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('userTier', 'enterprise');

    // ─── 2. Global DCM_CONFIG object (referenced by session-manager) ──────────
    window.DCM_CONFIG = {
        DEV_MODE: true,
        MASTER_EMAIL: MASTER_EMAIL,
        VERSION: '4.3.0'
    };

    // ─── 3. Override checkAccess globally (called via window.SessionManager) ──
    //   We intercept BEFORE the module is imported, so we use a Proxy approach
    //   on window and patch it post-load too.
    window.__devUnlockCheckAccess = function () { return true; };

    // ─── 4. Patch SessionManager.checkAccess after DOM ready ─────────────────
    function patchSessionManager() {
        if (window.SessionManager && typeof window.SessionManager.checkAccess === 'function') {
            window.SessionManager.checkAccess = function (permission) {
                console.log(`[DEV-UNLOCK] ✅ checkAccess("${permission}") → GRANTED (master override)`);
                return true;
            };
            window.SessionManager.showPaywall = function () {
                console.log('[DEV-UNLOCK] 🚫 showPaywall() suppressed (master override)');
            };
            window.SessionManager.getCurrentUser = function () {
                return MASTER_PROFILE;
            };
            console.info('[DEV-UNLOCK] SessionManager fully patched ✅');
        }
    }

    // ─── 5. Suppress any existing "premium-upgrade-modal" or paywall modals ──
    function suppressPaywallModals() {
        // Remove any already-mounted paywall modals
        ['premium-upgrade-modal', 'upgrade-modal', 'paywall-modal'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });

        // Intercept future modals via MutationObserver
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const id = node.id || '';
                        if (id.includes('paywall') || id.includes('upgrade') || id.includes('premium')) {
                            console.log(`[DEV-UNLOCK] 🚫 Suppressed modal: #${id}`);
                            node.remove();
                        }
                        // Also catch modals without explicit ID that contain upgrade text
                        if (node.innerText && node.innerText.includes('Voir les abonnements Pro')) {
                            console.log('[DEV-UNLOCK] 🚫 Suppressed upgrade modal (text match)');
                            node.remove();
                        }
                    }
                });
            });
        });
        observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
    }

    // ─── 6. Override SegmentManager if loaded ────────────────────────────────
    function patchSegmentManager() {
        if (window.SegmentManager) {
            window.SegmentManager.detectSegment = function () { return 'enterprise'; };
            window.SegmentManager.getSegment = function () { return 'enterprise'; };
        }
    }

    // ─── 7. Override GrowthEngine to prevent upgrade triggers ────────────────
    function patchGrowthEngine() {
        if (window.GrowthEngine) {
            window.GrowthEngine.recordAction = function () { return null; };
            window.GrowthEngine.checkUpgrade = function () { return false; };
        }
        // Prevent future showUpgradeModal calls
        window.showUpgradeModal = function () {
            console.log('[DEV-UNLOCK] 🚫 showUpgradeModal() suppressed');
        };
    }

    // ─── 8. Run patches at multiple lifecycle points ──────────────────────────
    // Immediately
    patchSessionManager();
    patchSegmentManager();
    patchGrowthEngine();

    // After DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            suppressPaywallModals();
            patchSessionManager();
            patchSegmentManager();
            patchGrowthEngine();
        });
    } else {
        suppressPaywallModals();
    }

    // After full load (module scripts finish)
    window.addEventListener('load', () => {
        patchSessionManager();
        patchSegmentManager();
        patchGrowthEngine();
        suppressPaywallModals();
        console.info('[DEV-UNLOCK] 🚀 Full master access active — joanlyczak@gmail.com / ADMIN / Enterprise ✅');
    });

    // Re-patch every 500ms for the first 5s (in case of async module loading)
    let patchCount = 0;
    const patchInterval = setInterval(() => {
        patchSessionManager();
        patchSegmentManager();
        patchGrowthEngine();
        if (++patchCount >= 10) clearInterval(patchInterval);
    }, 500);

})();
