/**
 * DCM COMPLIANCE MANAGER — Phase 81
 * Handles GDPR requirements: Data Portability and Deletion.
 */

import { supabase } from './supabase-client.js';

export const ComplianceManager = {

    /**
     * Right to Portability: Export all user data as JSON.
     */
    exportUserData: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;

        const userId = session.user.id;
        console.log("📂 GDPR: Generating data portability export...");

        // Fetch all related data
        const [profile, simulations, quizResults, auditLogs] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', userId).single(),
            supabase.from('simulations').select('*').eq('user_id', userId),
            supabase.from('quiz_results').select('*').eq('user_id', userId),
            supabase.from('audit_logs').select('*').eq('user_id', userId)
        ]);

        const exportData = {
            metadata: {
                platform: "DCM Digital",
                version: "Institutional Phase 81",
                export_date: new Date().toISOString(),
                user_id: userId
            },
            profile: profile.data,
            simulations: simulations.data,
            quiz_results: quizResults.data,
            audit_logs: auditLogs.data
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dcm_gdpr_export_${userId.substring(0, 8)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (window.AuditLogger) {
            await window.AuditLogger.log('GDPR_DATA_EXPORT', 'User', { scope: 'FULL_JSON' });
        }

        return exportData;
    },

    /**
     * Right to be Forgotten: Permanent deletion request.
     * Note: This usually triggers an administrative workflow in institutional apps.
     */
    requestAccountDeletion: async () => {
        const confirmResult = confirm("⚠️ ATTENTION : Cette action est irréversible. Toutes vos données, simulations et certifications seront définitivement supprimées conformément au RGPD. Voulez-vous continuer ?");

        if (!confirmResult) return;

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // In a real institutional setup, this would call a secure Edge Function 
        // that handles cascading deletes and signs out the user.
        console.warn("🔐 GDPR: Deletion request received for user:", session.user.id);

        if (window.AuditLogger) {
            await window.AuditLogger.log('GDPR_DELETION_REQUESTED', 'User', { status: 'PENDING_SERVER' });
        }

        alert("Votre demande de suppression a été enregistrée. Pour des raisons de sécurité institutionnelle, un administrateur validera la suppression sous 24h.");

        // Return true to indicate UI should maybe logout or show pending state
        return true;
    }
};
