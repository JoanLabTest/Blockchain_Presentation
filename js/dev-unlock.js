/**
 * DCM DIGITAL — DEV UNLOCK SCRIPT v2.0
 * ============================================
 * ⚠️  MASTER ACCESS — CONDITIONAL ONLY ⚠️
 *
 * This script no longer unconditionally writes to localStorage.
 * Master mode is ONLY activated when joanlyczak@gmail.com is
 * authentificated via a confirmed Supabase session.
 *
 * For all other users, this script is a no-op.
 * ============================================
 */

(function () {
    'use strict';

    const MASTER_EMAIL = 'joanlyczak@gmail.com';

    // ─── Global config flag (read-only, does NOT set any auth) ────────────────
    window.DCM_CONFIG = window.DCM_CONFIG || {
        DEV_MODE: false,
        MASTER_EMAIL: MASTER_EMAIL,
        VERSION: '4.4.0'
    };

    // ─── Master activation (called ONLY after Supabase auth confirmation) ─────
    window.__activateMasterMode = function (confirmedEmail) {
        if (confirmedEmail !== MASTER_EMAIL) {
            console.warn('[DEV-UNLOCK] activateMasterMode called with non-master email — ignored.');
            return;
        }

        console.info('[DEV-UNLOCK] 🚀 Master access UI patches activated.');
        window.DCM_CONFIG.DEV_MODE = true;

        // Set runtime flags (session-scoped, no persistence)
        sessionStorage.setItem('dcm_master_active', 'true');

        // Apply UI-only patches (No RBAC patching allowed anymore)
        _patchSegmentManager();
        _patchGrowthEngine();
        _suppressPaywallModals();
    };

    // ─── Master deactivation (clean state on logout/user switch) ──────────────
    window.__deactivateMasterMode = function () {
        console.info('[DEV-UNLOCK] 🧹 Deactivating master UI patches.');
        window.DCM_CONFIG.DEV_MODE = false;
        sessionStorage.removeItem('dcm_master_active');

        // Revert UI patches if possible (simplest way is page refresh on logout)
        // but we clear the observer here.
        if (window.__masterObserver) {
            window.__masterObserver.disconnect();
            window.__masterObserver = null;
        }
    };

    // ─── Checks if current user is master (verified at runtime only) ──────────
    window.__isMasterSession = function () {
        return sessionStorage.getItem('dcm_master_active') === 'true';
    };

    // ─── Suppress paywall modals for master users ─────────────────────────────
    function _suppressPaywallModals() {
        if (!window.__isMasterSession()) return;

        ['premium-upgrade-modal', 'upgrade-modal', 'paywall-modal'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });

        if (window.__masterObserver) window.__masterObserver.disconnect();

        window.__masterObserver = new MutationObserver((mutations) => {
            if (!window.__isMasterSession()) return;
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const id = node.id || '';
                        if (id.includes('paywall') || id.includes('upgrade') || id.includes('premium')) {
                            node.remove();
                        }
                        if (node.innerText && node.innerText.includes('Voir les abonnements Pro')) {
                            node.remove();
                        }
                    }
                });
            });
        });

        if (document.body) window.__masterObserver.observe(document.body, { childList: true, subtree: true });
    }

    function _patchSegmentManager() {
        if (!window.__isMasterSession()) return;
        if (window.SegmentManager) {
            // Keep original methods if we want to revert, but enterprise dashboard 
            // usually reloads on segment change.
            window.SegmentManager.getSegment = function () { return 'enterprise'; };
        }
    }

    function _patchGrowthEngine() {
        if (!window.__isMasterSession()) return;
        if (window.GrowthEngine) {
            window.GrowthEngine.recordAction = function () { return null; };
            window.GrowthEngine.checkUpgrade = function () { return false; };
        }
        window.showUpgradeModal = function () {
            if (window.__isMasterSession()) {
                console.log('[DEV-UNLOCK] 🚫 showUpgradeModal() suppressed (master)');
            }
        };
    }

    // ─── Re-apply patches if master session is already active (page refresh) ──
    window.addEventListener('load', () => {
        if (window.__isMasterSession()) {
            console.info('[DEV-UNLOCK] Master session detected on load — re-applying UI patches.');
            _patchSegmentManager();
            _patchGrowthEngine();
            _suppressPaywallModals();
        }
    });

})();
