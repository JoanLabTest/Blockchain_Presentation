/**
 * AUDIT LOGGER - Phase 75
 * Manages system logs and audit trails for transparency and compliance.
 */

export const AuditLogger = {

    /**
     * Records a secure audit entry.
     * @param {string} action 
     * @param {string} userRole 
     * @param {Object} details 
     */
    log: (action, userRole, details = {}) => {
        const logs = JSON.parse(localStorage.getItem('dcm_audit_logs')) || [];
        const entry = {
            timestamp: new Date().toISOString(),
            action,
            role: userRole,
            details,
            id: `AUDIT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        };

        logs.unshift(entry);
        localStorage.setItem('dcm_audit_logs', JSON.stringify(logs.slice(0, 100))); // Keep last 100

        console.log(`🔐 Audit Logged: ${action} [${entry.id}]`);
        return entry;
    },

    /**
     * Returns logs filtered by role/access.
     */
    getLogs: (segment) => {
        const logs = JSON.parse(localStorage.getItem('dcm_audit_logs')) || [];
        if (segment === 'enterprise') return logs;
        if (segment === 'pro') return logs.filter(l => l.role !== 'enterprise');
        return []; // Students don't see audit trails
    },

    /**
     * Renders the audit trail in a container.
     */
    renderAuditTrail: (containerId, segment) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const logs = AuditLogger.getLogs(segment);
        if (logs.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-style:italic;">Aucune activité enregistrée.</div>';
            return;
        }

        container.innerHTML = logs.map(log => `
            <div style="display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid var(--border-highlight); font-size:12px;">
                <div>
                    <span style="color:var(--text-muted); font-family:monospace; margin-right:8px;">[${log.timestamp.split('T')[1].split('.')[0]}]</span>
                    <strong style="color:white">${log.action}</strong>
                    <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">ID: ${log.id}</div>
                </div>
                <div style="text-align:right">
                    <span class="status-badge" style="background:rgba(59,130,246,0.1); color:#3b82f6; font-size:10px;">${log.role.toUpperCase()}</span>
                </div>
            </div>
        `).join('');
    },

    /**
     * Exports logs as a transparency report.
     */
    exportTransparencyReport: (segment) => {
        const logs = AuditLogger.getLogs(segment);
        const content = `DCM DIGITAL - DATA TRANSPARENCY REPORT\nGenerated: ${new Date().toLocaleString()}\nSegment: ${segment.toUpperCase()}\n\n` +
            logs.map(log => `[${log.timestamp}] ${log.action} - ID: ${log.id} - Role: ${log.role}`).join('\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dcm_transparency_report_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};
