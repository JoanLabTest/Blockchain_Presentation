/**
 * STRESS TESTING ENGINE - v4.0 (Phase 127)
 * Institutional-grade simulator combining Monte Carlo price movements
 * with Network Infrastructure Overlays (SWIAT & Canton).
 */

const StressTestingEngine = {
    config: {
        simulations: 1000,
        days: 365,
        confidenceInterval: 0.95
    },

    /**
     * Runs a multi-factor stress test.
     * @param {number} currentPrice - Foundation price (e.g., tokenized bond par)
     * @param {Object} parameters - Volatility, Drift, and Network Type
     */
    runStressTest(currentPrice, parameters) {
        const { volatility = 0.45, drift = 0.15, network = 'none' } = parameters;
        const dt = 1 / 365;
        const scenarios = [];

        // Network Risk Coefficients
        const overlays = this.getNetworkOverlays(network);

        for (let i = 0; i < this.config.simulations; i++) {
            let price = currentPrice;
            const path = [price];
            let networkHalt = false;

            for (let t = 0; t < this.config.days; t++) {
                if (networkHalt) {
                    path.push(price); // Price freezes due to infrastructure failure
                    continue;
                }

                // 1. Foundation: Geometric Brownian Motion
                const shock = this.boxMullerTransform();
                const d = (drift - 0.5 * Math.pow(volatility, 2)) * dt;
                const diffusion = volatility * Math.sqrt(dt) * shock;

                price = price * Math.exp(d + diffusion);

                // 2. Network Overlay Impact
                if (network !== 'none') {
                    const jump = Math.random();
                    // Probability of Infrastructure Event
                    if (jump < overlays.haltProbability) {
                        networkHalt = true; // Permanent failure in this scenario
                        price = price * (1 - overlays.crashImpact); // Immediate discount
                    } else if (jump < overlays.volatilitySpikeProbability) {
                        price = price * (1 + (shock * 0.1)); // Infrastructure-induced volatility
                    }
                }

                path.push(price);
            }
            scenarios.push(path);
        }

        return {
            scenarios,
            metrics: this.calculateMetrics(scenarios, currentPrice, network)
        };
    },

    getNetworkOverlays(network) {
        const defaultOverlays = { haltProbability: 0, crashImpact: 0, volatilitySpikeProbability: 0 };

        const models = {
            'swiat': {
                haltProbability: 0.005, // 0.5% chance of DvP Settlement Failure / Registry Freeze
                crashImpact: 0.08,    // 8% haircut on liquidity freeze
                volatilitySpikeProbability: 0.02,
                label: 'SWIAT DvP Risks'
            },
            'canton': {
                haltProbability: 0.003, // 0.3% chance of Notary Desynchronization
                crashImpact: 0.04,     // 4% haircut on sync loss
                volatilitySpikeProbability: 0.05, // Higher micro-volatility due to sub-second settlement
                label: 'Canton Notary Risks'
            }
        };

        return models[network] || defaultOverlays;
    },

    boxMullerTransform() {
        const u = 1 - Math.random();
        const v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    },

    calculateMetrics(scenarios, currentPrice, network) {
        const finalPrices = scenarios.map(path => path[path.length - 1]).sort((a, b) => a - b);
        const p05 = finalPrices[Math.floor(this.config.simulations * 0.05)];
        const p50 = finalPrices[Math.floor(this.config.simulations * 0.50)];
        const p95 = finalPrices[Math.floor(this.config.simulations * 0.95)];

        const var95 = ((currentPrice - p05) / currentPrice) * 100;

        // Network specific risk attribution
        const overlays = this.getNetworkOverlays(network);
        const infraRiskWeight = (overlays.haltProbability * 1000) * (overlays.crashImpact * 10);

        return {
            p05, p50, p95,
            var95: Math.max(0, var95),
            infraRiskScore: Math.round(infraRiskWeight),
            isInstitutional: network !== 'none'
        };
    }
};

if (typeof window !== 'undefined') {
    window.StressTestingEngine = StressTestingEngine;
}
