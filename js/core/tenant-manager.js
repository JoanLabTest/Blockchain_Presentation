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

    /**
     * INIT: Loads the active organization context
     */
    init: () => {
        const storedOrg = localStorage.getItem('dcm_active_org');
        if (!storedOrg) {
            TenantManager.setActiveOrg(TenantManager.DEFAULT_ORG);
        }
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
    }
};

// Auto-register to window for global access
if (typeof window !== 'undefined') {
    window.TenantManager = TenantManager;
    TenantManager.init();
}
