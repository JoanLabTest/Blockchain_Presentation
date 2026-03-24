import { supabase } from './supabase-client.js';

export class SimulationEngine {
    constructor() {
        this.simulations = [];
        this.orgId = localStorage.getItem('dcm_org_id');
    }

    async save(type, name, params, results) {
        const { data: { session } } = await supabase.auth.getSession();
        const profile = window.SessionManager ? window.SessionManager.getCurrentUser() : null;

        if (!session) {
            console.warn("🔐 No real session, saving locally.");
            return this._saveLocal(type, name, params, results);
        }

        const scenario = {
            user_id: session.user.id,
            org_id: profile?.org_id || this.orgId,
            scenario_name: name,
            simulation_type: type,
            input_data: params,
            results: results,
            score_delta: 5 // Bonus research score
        };

        const { data, error } = await supabase
            .from('simulations')
            .insert([scenario])
            .select();

        if (error) {
            console.error("❌ Simulation Save Error:", error.message);
            return this._saveLocal(type, name, params, results);
        }

        console.log("💾 Simulation Persisted on Server:", data[0].id);

        // Sync Research Score (Phase 85)
        await this.persist();

        // Log Audit (Phase 79)
        if (window.AuditLogger) {
            await window.AuditLogger.log('SIMULATION_PERSISTED', 'Analyste', { type, name, id: data[0].id });
        }

        return data[0];
    }

    _saveLocal(type, name, params, results) {
        const scenario = {
            id: `LOCAL-${Date.now().toString(36)}`,
            timestamp: new Date().toISOString(),
            type,
            name,
            params,
            results
        };
        // Keep a short local cache for performance
        let history = JSON.parse(localStorage.getItem('dcm_simulations')) || [];
        history.unshift(scenario);
        localStorage.setItem('dcm_simulations', JSON.stringify(history.slice(0, 10)));
        return scenario;
    }

    async getHistory() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return JSON.parse(localStorage.getItem('dcm_simulations')) || [];

        const { data, error } = await supabase
            .from('simulations')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.warn("⚠️ Fetch Error, using local history.");
            return JSON.parse(localStorage.getItem('dcm_simulations')) || [];
        }

        return data.map(s => ({
            id: s.id,
            timestamp: s.created_at,
            type: s.simulation_type || (s.scenario_name.includes('Yield') ? 'YIELD' : 'RISK'),
            name: s.scenario_name,
            params: s.input_data,
            results: s.results
        }));
    }

    clear() {
        this.simulations = [];
        localStorage.removeItem('dcm_simulations');
    }

    async persist() {
        const profile = window.SessionManager ? window.SessionManager.getCurrentUser() : null;
        if (!profile || profile.id.startsWith('guest')) {
            let currentScore = parseInt(localStorage.getItem('dcm_research_score') || 0);
            if (currentScore < 100) {
                localStorage.setItem('dcm_research_score', currentScore + 2);
            }
            return;
        }

        // Sync maturity score to Supabase via research_scores table
        try {
            const today = new Date().toISOString().split('T')[0];
            const currentScore = parseInt(localStorage.getItem('dcm_research_score') || 50);
            
            const { error } = await supabase
                .from('research_scores')
                .upsert({
                    user_id: profile.id,
                    snapshot_date: today,
                    total_score: Math.min(100, currentScore + 2),
                    sub_score_engagement: 10 // Increment engagement
                }, { onConflict: 'user_id,snapshot_date' });

            if (error) throw error;
            console.log("📈 Research maturity score synced to Supabase.");
        } catch (err) {
            console.warn("⚠️ Score sync failed:", err.message);
        }
    }
}

export const simEngine = new SimulationEngine();
