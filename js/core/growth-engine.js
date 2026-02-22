/**
 * GROWTH ENGINE - v1.0
 * Tracks user behavior and manages the 'Upgrade Ladder' logic.
 */

export const GrowthEngine = {

    // Thresholds for segment progression
    THRESHOLDS: {
        STUDENT_TO_PRO: {
            simulations: 5,
            levelReached: 3,
            featureChecks: 10
        },
        PRO_TO_ENTERPRISE: {
            reportsGenerated: 3,
            simulations: 15,
            multiUserAttempts: 1
        }
    },

    /**
     * Initializes the growth engine by loading stats from localStorage.
     */
    init: () => {
        const stats = JSON.parse(localStorage.getItem('dcm_growth_stats')) || {
            simulations: 0,
            reportsGenerated: 0,
            featureChecks: 0,
            lastAction: null
        };
        return stats;
    },

    /**
     * Records a significant user action.
     * @param {string} actionType 
     */
    recordAction: (actionType) => {
        const stats = GrowthEngine.init();
        if (stats[actionType] !== undefined) {
            stats[actionType]++;
        }
        stats.lastAction = { type: actionType, timestamp: Date.now() };
        localStorage.setItem('dcm_growth_stats', JSON.stringify(stats));

        // Check for ladder trigger
        return GrowthEngine.checkLadderTrigger(stats);
    },

    /**
     * Checks if the user's behavior warrants an upgrade prompt.
     * @param {Object} stats 
     */
    checkLadderTrigger: (stats) => {
        const segment = localStorage.getItem('dcm_segment') || 'student';

        if (segment === 'student') {
            const t = GrowthEngine.THRESHOLDS.STUDENT_TO_PRO;
            if (stats.simulations >= t.simulations || stats.featureChecks >= t.featureChecks) {
                return {
                    trigger: 'UPSELL_PRO',
                    title: '🚀 Prêt pour le niveau Pro ?',
                    message: `Vous avez déjà réalisé ${stats.simulations} simulations. Débloquez les exports PDF et les benchmarks complets.`
                };
            }
        }

        if (segment === 'pro') {
            const t = GrowthEngine.THRESHOLDS.PRO_TO_ENTERPRISE;
            if (stats.reportsGenerated >= t.reportsGenerated) {
                return {
                    trigger: 'UPSELL_ENTERPRISE',
                    title: '🏛️ Direction l\'Institutionnel ?',
                    message: "Vos besoins en reporting augmentent. Découvrez nos outils de gouvernance et d'audit pour les équipes."
                };
            }
        }

        return null;
    }
};
