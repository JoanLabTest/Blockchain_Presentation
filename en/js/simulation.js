import { supabase } from './supabase-client.js';

export class SimulationEngine {
    constructor() {
        this.simulations = [];
        this.orgId = localStorage.getItem('dcm_org_id');
    }

    async save(type, name, params, results) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            console.warn("🔐 No real session, saving locally.");
            // Fallback for demo
            return this._saveLocal(type, name, params, results);
        }

        const scenario = {
            user_id: session.user.id,
            org_id: this.orgId,
            scenario_name: name,
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
        this.simulations.unshift(scenario);
        localStorage.setItem('dcm_simulations', JSON.stringify(this.simulations.slice(0, 20)));
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
            type: s.scenario_name.includes('Yield') ? 'YIELD' : 'RISK', // Simplified mapping
            name: s.scenario_name,
            params: s.input_data,
            results: s.results
        }));
    }

    clear() {
        this.simulations = [];
        this.persist();
    }

    persist() {
        // Research mapping (simplified for front-end evolution display)
        let currentScore = parseInt(localStorage.getItem('dcm_research_score') || 0);
        if (currentScore < 100) {
            localStorage.setItem('dcm_research_score', currentScore + 5);
        }
    }
}

export const simEngine = new SimulationEngine();
