import { supabase } from '../supabase-client.js';

export const AuditLogger = {

    /**
     * Generates a SHA-256 hash for an audit entry, optionally chaining it.
     */
    _generateHash: async (data, prevHash = null) => {
        const payload = { ...data };
        if (prevHash) payload.prev_hash = prevHash;

        const msgBuffer = new TextEncoder().encode(JSON.stringify(payload));
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    log: async (action, userRole, details = {}) => {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        const orgId = localStorage.getItem('dcm_org_id');

        // Fetch Last Hash for Chaining (Phase 83)
        const { data: lastLogs } = await supabase
            .from('audit_logs')
            .select('node_hash')
            .order('timestamp', { ascending: false })
            .limit(1);

        const prevHash = lastLogs && lastLogs.length > 0 ? lastLogs[0].node_hash : 'GENESIS';

        const entry = {
            timestamp: new Date().toISOString(),
            action,
            user_id: userId,
            org_id: orgId,
            metadata: { ...details, role: userRole },
            severity: details.severity || 'INFO',
            prev_hash: prevHash
        };

        // Generate Chained Integrity Hash
        entry.node_hash = await AuditLogger._generateHash(entry, prevHash);

        const { data, error } = await supabase
            .from('audit_logs')
            .insert([entry])
            .select();

        if (error) {
            console.error("❌ Audit Logging Error:", error.message);
            // Fallback to local storage if DB fails (offline mode)
            const logs = JSON.parse(localStorage.getItem('dcm_audit_logs')) || [];
            logs.unshift({ ...entry, id: `LOCAL-${Date.now()}` });
            localStorage.setItem('dcm_audit_logs', JSON.stringify(logs.slice(0, 50)));
        } else {
            console.log(`🔐 Audit Logged (Server): ${action} [${data[0].id}]`);
        }

        return data ? data[0] : entry;
    },

    getLogs: async (segment) => {
        if (segment === 'student') return [];

        const { data, error } = await supabase
            .from('audit_logs')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(100);

        if (error) {
            console.warn("⚠️ Could not fetch remote logs, using local cache:", error.message);
            return JSON.parse(localStorage.getItem('dcm_audit_logs')) || [];
        }

        // Map for UI compatibility
        return data.map(l => ({
            ...l,
            role: l.metadata?.role || 'User',
            details: l.metadata
        }));
    },

    renderAuditTrail: async (containerId, segment) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const logs = await AuditLogger.getLogs(segment);
        if (!logs || logs.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-style:italic;">Aucune activité enregistrée.</div>';
            return;
        }

        container.innerHTML = logs.map(log => `
            <div style="display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid var(--border-highlight); font-size:12px;">
                <div style="max-width: 70%;">
                    <span style="color:var(--text-muted); font-family:monospace; margin-right:8px;">[${log.timestamp.split('T')[1].split('.')[0]}]</span>
                    <strong style="color:white">${log.action}</strong>
                    <div style="font-size:10px; color:var(--text-muted); margin-top:4px; word-break: break-all;">HASH: ${log.node_hash?.substring(0, 16)}...</div>
                </div>
                <div style="text-align:right">
                    <span class="status-badge" style="background:rgba(59,130,246,0.1); color:#3b82f6; font-size:10px;">${(log.role || 'USER').toUpperCase()}</span>
                </div>
            </div>
        `).join('');
    },

    exportTransparencyReport: async (segment) => {
        const logs = await AuditLogger.getLogs(segment);
        const content = `DCM DIGITAL - INSTITUTIONAL DATA TRANSPARENCY REPORT\n` +
            `Type: Server-Validated (Phase 79)\n` +
            `Generated: ${new Date().toLocaleString()}\n` +
            `Segment: ${segment.toUpperCase()}\n` +
            `--------------------------------------------------\n\n` +
            logs.map(log => `[${log.timestamp}] ${log.action}\n  - ID: ${log.id}\n  - HASH: ${log.node_hash}\n  - Role: ${log.role}`).join('\n\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dcm_institutional_report_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};
