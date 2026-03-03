/**
 * DCM API GATEWAY — Phase 82
 * Simulates a secured public API for institutional integrations.
 */

import { supabase } from './supabase-client.js';

export const APIGateway = {

    /**
     * Validates an API Key against the organization record.
     */
    validateKey: async (apiKey) => {
        const { data, error } = await supabase
            .from('organizations')
            .select('id, name, tier')
            .eq('settings->api_key', apiKey)
            .single();

        if (error || !data) {
            console.error("❌ Invalid API Key provided to DCM Gateway.");
            return null;
        }

        return data;
    },

    /**
     * Public Endpoint: Get Risk Score
     */
    getRiskScore: async (apiKey, userId) => {
        const org = await APIGateway.validateKey(apiKey);
        if (!org) return { error: "Unauthorized" };

        const { data, error } = await supabase
            .from('profiles')
            .select('last_grade, results')
            .eq('id', userId)
            .eq('org_id', org.id)
            .single();

        if (error) return { error: "User not found in organization" };

        // Log API Usage (Institutional Monitor)
        await APIGateway._logUsage(org.id, 'GET_RISK_SCORE');

        return {
            status: "success",
            user_id: userId,
            risk_score: data.last_grade || "Pending",
            timestamp: new Date().toISOString()
        };
    },

    /**
     * Internal: Usage Monitoring
     */
    _logUsage: async (orgId, endpoint) => {
        await supabase.from('audit_logs').insert([{
            org_id: orgId,
            action: `API_CALL_${endpoint}`,
            metadata: { source: 'external_gateway', version: 'v1.0' },
            severity: 'DEBUG'
        }]);
    }
};
