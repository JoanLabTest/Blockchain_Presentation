const FeatureMatrix = {
    student: {
        AUDIT_VIEW: false,
        ORG_MANAGEMENT: false,
        certification: true,
        aiInsights: 'limited',
        roiCalculator: true,
        growthTracker: true
    },
    pro: {
        AUDIT_VIEW: true,
        ORG_MANAGEMENT: true,
        certification: false,
        aiInsights: 'standard',
        roiCalculator: true,
        growthTracker: true
    },
    enterprise: {
        AUDIT_VIEW: true,
        ORG_MANAGEMENT: true,
        multiUser: true,
        sla: true,
        governance: true,
        apiAccess: true,
        aiInsights: 'unlimited',
        whiteLabel: true,
        roiCalculator: true,
        growthTracker: true
    },
    free: {
        AUDIT_VIEW: false,
        ORG_MANAGEMENT: false,
        certification: true,
        aiInsights: 'limited',
        roiCalculator: true,
        growthTracker: true
    },
    guest: {
        AUDIT_VIEW: false,
        ORG_MANAGEMENT: false,
        certification: false,
        aiInsights: 'limited',
        roiCalculator: false,
        growthTracker: false
    }
};

const checkFeature = (segment, feature) => {
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

const gateFeature = (segment, feature, onDisabled) => {
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

// Global Exposer
if (typeof window !== 'undefined') {
    window.DCM_CORE_FLAGS = { FeatureMatrix, checkFeature, gateFeature };
}
