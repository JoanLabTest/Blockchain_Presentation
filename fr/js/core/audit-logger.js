/**
 * AUDIT LOGGER - v1.0 (Phase 113: Institutional Packaging)
 * Provides centralized logging with SHA-256 cryptographic continuity simulation.
 * Essential for ISAE 3000 / SOC2 compliance tracking.
 */

// Simple pseudo-SHA256 for frontend demo purposes
async function mockHash(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const AuditLogger = {
    // Local storage key for demo
    STORAGE_KEY: 'dcm_audit_trail',

    /**
     * Initializes or retrieves the current audit log
     */
    getLogs: () => {
        const data = localStorage.getItem(AuditLogger.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Core logging function for sensitive actions
     * @param {String} action - The standardized action name (e.g. 'STRESS_TEST_RUN')
     * @param {Object} details - Additional JSON payload context
     */
    log: async (action, details = {}) => {
        const logs = AuditLogger.getLogs();

        // Context Gathering
        const timestamp = new Date().toISOString();
        const role = window.TenantManager ? window.TenantManager.getUserRole() : 'UNKNOWN';
        const userId = `DCM_USER_${role}`; // Mock user ID

        // Cryptographic Continuity (chaining)
        const previousHash = logs.length > 0 ? logs[0].hash : '0000000000000000000000000000000000000000000000000000000000000000';
        const payloadToHash = `${previousHash}|${timestamp}|${userId}|${action}|${JSON.stringify(details)}`;

        const hash = await mockHash(payloadToHash);

        const newLogEntry = {
            timestamp,
            userId,
            role,
            action,
            details,
            hash,
            previousHash
        };

        logs.unshift(newLogEntry); // Prepend

        // Keep last 100 for storage limits in demo
        if (logs.length > 100) logs.pop();

        localStorage.setItem(AuditLogger.STORAGE_KEY, JSON.stringify(logs));
        console.log(`📜 [AuditLogger] Recorded: ${action} | Hash: ${hash.substring(0, 8)}...`);

        // Dispatch for live UI updates
        window.dispatchEvent(new CustomEvent('audit-logged', { detail: newLogEntry }));

        return newLogEntry;
    },

    /**
     * Exports the Audit Trail to a CSV format
     */
    exportCSV: () => {
        const logs = AuditLogger.getLogs();
        if (logs.length === 0) return alert('No logs to export.');

        let csv = 'Timestamp,User,Role,Action,Details,Hash\n';
        logs.forEach(log => {
            const safeDetails = JSON.stringify(log.details).replace(/"/g, '""');
            csv += `${log.timestamp},${log.userId},${log.role},${log.action},"${safeDetails}",${log.hash}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `DCM_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};

// Global Exposure
if (typeof window !== 'undefined') {
    window.AuditLogger = AuditLogger;
}
