/**
 * DCM Simulation Engine
 * Handles persistence of financial scenarios.
 */

const STORAGE_KEY = 'dcm_simulations';

export class SimulationEngine {
    constructor() {
        this.simulations = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    /**
     * Save a new simulation scenario
     * @param {string} type - 'YIELD', 'RISK', 'GOVERNANCE'
     * @param {string} name - User friendly name (e.g. "Bull Case 2026")
     * @param {object} params - Inputs (eth_amount, duration, etc.)
     * @param {object} results - Outputs (apy, total_yield)
     */
    save(type, name, params, results) {
        const scenario = {
            id: Date.now().toString(36),
            timestamp: new Date().toISOString(),
            type,
            name,
            params,
            results
        };

        this.simulations.unshift(scenario); // Add to top
        this.persist();

        console.log("💾 Simulation Saved:", scenario);
        return scenario;
    }

    getHistory() {
        return this.simulations;
    }

    clear() {
        this.simulations = [];
        this.persist();
    }

    persist() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.simulations));

        // Update Research Score (Bonus for using tools)
        // We increment score by 5 points per simulation saved
        let currentScore = parseInt(localStorage.getItem('dcm_research_score') || 0);
        if (currentScore < 100) {
            localStorage.setItem('dcm_research_score', currentScore + 5);
        }
    }
}

export const simEngine = new SimulationEngine();
