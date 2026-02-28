// AUDIT LOGGER UI - Non-Module Version (Phase 79)
const AuditLogger = {

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
        const { data: { session } } = await window.supabase.auth.getSession();
        const userId = session?.user?.id || 'ANONYMOUS';
        const orgId = localStorage.getItem('dcm_org_id') || 'DEFAULT_ORG';

        // Fetch Last Hash for Chaining (Phase 83)
        const { data: lastLogs } = await window.supabase
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

        const { data, error } = await window.supabase
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

        const { data, error } = await window.supabase
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
    // ... (omitting range for brevity, will use full replacement or multiple chunks)

    renderAuditTrail: async (containerId, segment) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const logs = await AuditLogger.getLogs(segment);
        const integrity = await AuditLogger.verifyIntegrity(); // Check chain integrity

        if (!logs || logs.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-style:italic;">Aucune activité enregistrée.</div>';
            return;
        }

        const integrityHTML = integrity.valid
            ? `<div style="padding:10px; background:rgba(16,185,129,0.1); color:#10b981; border-radius:8px; font-size:11px; margin-bottom:15px; display:flex; align-items:center;">
                 <i class="fas fa-link" style="margin-right:8px;"></i> INTEGRITÉ VÉRIFIÉE (TÉMOIN CRYPTOGRAPHIQUE ACTIF)
               </div>`
            : `<div style="padding:10px; background:rgba(239,68,68,0.1); color:#ef4444; border-radius:8px; font-size:11px; margin-bottom:15px; display:flex; align-items:center;">
                 <i class="fas fa-exclamation-triangle" style="margin-right:8px;"></i> RUPTURE D'INTÉGRITÉ DÉTECTÉE (LOGS ALTÉRÉS)
               </div>`;

        container.innerHTML = integrityHTML + logs.map(log => `
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
            logs.map(log => `[${log.timestamp}] ${log.action}\n  - ID: ${log.id}\n  - PREV HASH: ${log.prev_hash}\n  - NODE HASH: ${log.node_hash}\n  - Role: ${log.role}`).join('\n\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dcm_institutional_report_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Verifies the integrity of the audit log chain.
     */
    verifyIntegrity: async () => {
        console.log("🛡️ Starting Audit Log Integrity Verification...");
        const { data: logs, error } = await window.supabase
            .from('audit_logs')
            .select('*')
            .order('timestamp', { ascending: true }); // Check chronologically

        if (error) return { valid: false, error: error.message };
        if (!logs || logs.length === 0) return { valid: true, count: 0 };

        let isValid = true;
        let breakIndex = -1;

        for (let i = 0; i < logs.length; i++) {
            const current = logs[i];
            const prevHash = i === 0 ? 'GENESIS' : logs[i - 1].node_hash;

            // Re-calculate hash to compare
            const payload = {
                timestamp: current.timestamp,
                action: current.action,
                user_id: current.user_id,
                org_id: current.org_id,
                metadata: current.metadata,
                severity: current.severity,
                prev_hash: current.prev_hash
            };

            const recalculated = await AuditLogger._generateHash(payload, current.prev_hash);

            if (recalculated !== current.node_hash || current.prev_hash !== prevHash) {
                console.error(`🚨 INTEGRITY BREACH DETECTED at entry ${current.id}`);
                isValid = false;
                breakIndex = i;
                break;
            }
        }

        return {
            valid: isValid,
            count: logs.length,
            breakId: breakIndex !== -1 ? logs[breakIndex].id : null
        };
    },

    /**
     * Simulates Notarization (Phase 84)
     * Anchors the current state to a "trusted external hub" by creating a signature of the head.
     */
    notarizeChain: async () => {
        console.log("⚓ Initiating Digital Notarization...");
        const { data: lastLogs } = await window.supabase
            .from('audit_logs')
            .select('node_hash')
            .order('timestamp', { ascending: false })
            .limit(1);

        if (!lastLogs || lastLogs.length === 0) return;

        const headHash = lastLogs[0].node_hash;

        // Log the notarization event
        await AuditLogger.log('EXTERNAL_NOTARIZATION', 'SYSTEM', {
            notary_hub: "DCM_TRUST_ANCHOR_V1",
            anchored_hash: headHash,
            signature_mock: `SIG-${Math.random().toString(36).substring(2, 12).toUpperCase()}`
        });

        alert(`📦 État notarisé avec succès !\nHash ancré : ${headHash.substring(0, 16)}...`);
    }
};

// Global Exposure
if (typeof window !== 'undefined') {
    window.AuditLogger = AuditLogger;
}
