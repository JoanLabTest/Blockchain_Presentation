/**
 * SCORING ENGINE - v1.0
 * Centralized, stateless logic for Trust Scores and Risk Indices.
 */

export const ScoringEngine = {

    /**
     * Calculates the Trust Score based on sub-metrics.
     * @param {Object} metrics - sub-scores (tech, legal, risk, engagement)
     */
    calculateTrustScore: (metrics) => {
        const weights = { tech: 0.3, legal: 0.3, risk: 0.2, engagement: 0.2 };
        let total = 0;
        for (const [key, weight] of Object.entries(weights)) {
            total += (metrics[key] || 0) * weight;
        }
        return Math.min(100, Math.max(0, Math.round(total)));
    },

    /**
     * Calculates the Risk Index.
     * @param {Array} simulations - list of recent simulation results
     * @param {number} avgKnowledgeScore - average score from radar
     */
    calculateRiskIndex: (simulations, avgKnowledgeScore) => {
        let risk = 50; // Base risk

        // Simulations impact
        if (simulations && simulations.length > 0) {
            const highRiskCount = simulations.filter(s => s.status === 'critical').length;
            risk += (highRiskCount * 10);
            risk -= (simulations.length * 2);

            // Infrastructure Factor (Phase 127)
            const infraRisks = simulations.reduce((sum, s) => sum + (s.infraRiskScore || 0), 0);
            risk += (infraRisks / simulations.length);
        }

        // Knowledge impact (higher knowledge = lower risk)
        risk -= (avgKnowledgeScore * 0.2);

        return Math.max(5, Math.min(95, Math.round(risk)));
    },

    /**
     * Converts numerical score to letter grade.
     */
    getLetterGrade: (score) => {
        if (score >= 95) return 'A+';
        if (score >= 88) return 'A';
        if (score >= 80) return 'A-';
        if (score >= 70) return 'B+';
        if (score >= 60) return 'B';
        return 'C';
    }
};
