/**
 * FEATURE FLAGS ENGINE - v1.0
 * Centralized logic for segmented access control.
 * Implements logical gating to prevent unauthorized feature access.
 */

export const FeatureMatrix = {
    student: {
        audit: false,
        benchmark: false,
        certification: true,
        REPORT_EXPORT: false,
        MANAGER_VIEW: false,
        aiInsights: 'limited',
        roiCalculator: true, // Limited pedagogical version
        growthTracker: true
    },
    pro: {
        audit: true,
        benchmark: true,
        certification: false,
        REPORT_EXPORT: true,
        MANAGER_VIEW: true,
        whiteLabel: true,
        aiInsights: 'standard',
        roiCalculator: true,
        growthTracker: true
    },
    enterprise: {
        audit: true,
        benchmark: true,
        multiUser: true,
        sla: true,
        governance: true,
        apiAccess: true,
        aiInsights: 'unlimited',
        REPORT_EXPORT: true,
        MANAGER_VIEW: true,
        whiteLabel: true,
        roiCalculator: true,
        growthTracker: true
    }
};

/**
 * Checks if a feature is enabled for a specific segment.
 * @param {string} segment - user segment (student, pro, enterprise)
 * @param {string} feature - feature key
 */
export const checkFeature = (segment, feature) => {
    // 🚧 SUPER DEV / MASTER OVERRIDE 🚧
    if (localStorage.getItem('dcm_user_role') === 'ADMIN') {
        return true;
    }

    if (!FeatureMatrix[segment]) return false;

    // Growth Engine Tracking (Phase 74)
    if (window.GrowthEngine) {
        const trigger = window.GrowthEngine.recordAction('featureChecks');
        if (trigger && window.showUpgradeModal) window.showUpgradeModal(trigger);
    }

    const value = FeatureMatrix[segment][feature];
    return value === true || value === 'standard' || value === 'unlimited' || value === 'limited';
};

/**
 * Gates a feature by checking the segment and taking action.
 * @param {string} segment 
 * @param {string} feature 
 * @param {Function} onDisabled - callback if disabled (e.g., show upgrade modal)
 */
export const gateFeature = (segment, feature, onDisabled) => {
    if (!checkFeature(segment, feature)) {
        if (typeof onDisabled === 'function') {
            onDisabled();
        } else {
            console.warn(`🚫 Feature [${feature}] is locked for segment [${segment}].`);
        }
        return false;
    }
    return true;
};
