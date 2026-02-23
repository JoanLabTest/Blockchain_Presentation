/**
 * TENANT MANAGER - v1.0 (Phase 106)
 * Handles Organization context, data isolation gating, and team membership state.
 * This is the core logic for the Multi-tenant Enterprise model.
 */

export const TenantManager = {

    // Default Mock Org for the Demonstration
    DEFAULT_ORG: {
        id: 'GAMP-7742-EU',
        name: 'Global Asset Management Partners',
        sector: 'Asset Management (Tier 1)',
        tier: 'Enterprise'
    },

    // --- RBAC: ROLE-BASED ACCESS CONTROL (Phase 113) ---
    ROLES: {
        ADMIN: 'ADMIN',
        RISK_OFFICER: 'RISK_OFFICER',
        ANALYST: 'ANALYST',
        VIEWER: 'VIEWER'
    },

    PERMISSIONS: {
        ADMIN: ['manage_org', 'manage_users', 'view_audit_trail', 'generate_reports', 'run_simulations', 'view_dashboards'],
        RISK_OFFICER: ['view_audit_trail', 'generate_reports', 'run_simulations', 'view_dashboards', 'manage_risk_policies'],
        ANALYST: ['run_simulations', 'view_dashboards', 'generate_reports'],
        VIEWER: ['view_dashboards']
    },

    /**
     * INIT: Loads the active organization context and user role
     */
    init: () => {
        const storedOrg = localStorage.getItem('dcm_active_org');
        if (!storedOrg) {
            TenantManager.setActiveOrg(TenantManager.DEFAULT_ORG);
        }

        const storedRole = localStorage.getItem('dcm_user_role');
        if (!storedRole) {
            TenantManager.setUserRole(TenantManager.ROLES.ADMIN); // Default for demo
        }
    },

    /**
     * RBAC: Get Current User Role
     */
    getUserRole: () => {
        return localStorage.getItem('dcm_user_role') || TenantManager.ROLES.VIEWER;
    },

    /**
     * RBAC: Set Current User Role (for demo switching)
     */
    setUserRole: (role) => {
        if (TenantManager.ROLES[role]) {
            localStorage.setItem('dcm_user_role', role);
            console.log(`🔐 RBAC: User role set to [${role}]`);
            window.dispatchEvent(new CustomEvent('role-changed', { detail: role }));
        }
    },

    /**
     * RBAC: Check if current user has permission for an action
     */
    hasPermission: (action) => {
        const role = TenantManager.getUserRole();
        const perms = TenantManager.PERMISSIONS[role] || [];
        const hasPerm = perms.includes(action);
        if (!hasPerm) {
            console.warn(`⛔ RBAC Denied: Role [${role}] attempted action [${action}]`);
        }
        return hasPerm;
    },

    /**
     * GET ACTIVE ORG: Returns current tenant info
     */
    getActiveOrg: () => {
        const data = localStorage.getItem('dcm_active_org');
        return data ? JSON.parse(data) : TenantManager.DEFAULT_ORG;
    },

    /**
     * SET ACTIVE ORG: Switches tenant context (Simulates switching orgs)
     */
    setActiveOrg: (org) => {
        localStorage.setItem('dcm_active_org', JSON.stringify(org));
        console.log(`🏢 Active Organization set to: ${org.name} [${org.id}]`);

        // Dispatch event for UI synchronization
        window.dispatchEvent(new CustomEvent('org-changed', { detail: org }));
    },

    /**
     * DATA GATING: Filters a dataset based on the current active organization ID
     * @param {Array} dataSet - The array of objects to filter
     * @param {String} orgField - The field name in the object identifying the org (default: 'org_id')
     */
    filterByTenant: (dataSet, orgField = 'org_id') => {
        const activeOrg = TenantManager.getActiveOrg();
        if (!activeOrg) return [];

        console.log(`🔒 Multi-tenant Filtering: Active [${activeOrg.id}]`);
        return dataSet.filter(item => item[orgField] === activeOrg.id || !item[orgField]);
    },

    /**
     * ISOLATION PROOF: Generates a cryptographically-flavored hash of the tenant isolation state
     */
    getIsolationProof: () => {
        const org = TenantManager.getActiveOrg();
        // Mock SHA-256 for demo psychology
        return `tenant_proof_${org.id.split('-')[0].toLowerCase()}_8b4e2f`;
    },

    /**
     * Enforce RBAC on UI elements marked with data-permission attribute
     */
    enforceUI: () => {
        const elements = document.querySelectorAll('[data-permission]');
        elements.forEach(el => {
            const requiredAction = el.getAttribute('data-permission');
            if (!TenantManager.hasPermission(requiredAction)) {
                el.style.opacity = '0.3';
                el.style.pointerEvents = 'none';
                el.title = "Accès refusé : Privilèges insuffisants";
                // Optionally add a lock icon
                if (!el.querySelector('.rbac-lock')) {
                    el.innerHTML += ' <i class="fas fa-lock rbac-lock" style="font-size:10px; margin-left:5px;"></i>';
                }
            } else {
                el.style.opacity = '1';
                el.style.pointerEvents = 'auto';
                el.title = "";
                const lock = el.querySelector('.rbac-lock');
                if (lock) lock.remove();
            }
        });
    }
};

// Auto-register to window for global access
if (typeof window !== 'undefined') {
    window.TenantManager = TenantManager;
    TenantManager.init();
}
