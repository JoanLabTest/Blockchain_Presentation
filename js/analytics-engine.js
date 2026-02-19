/**
 * ANALYTICS ENGINE — v1.0 (Phase 32)
 * Centralized Google Analytics 4 (GA4) event tracking module.
 */

export const AnalyticsEngine = {

    // Helper to call gtag securely whether loaded or not
    _sendEvent: (eventName, params = {}) => {
        if (typeof window !== 'undefined' && window.DCM_CONFIG && typeof DCM_CONFIG.sendEvent === 'function') {
            DCM_CONFIG.sendEvent(eventName, params);
        } else if (typeof gtag === 'function') {
            gtag('event', eventName, params);
            console.log(`📊 [GA4] Event: ${eventName}`, params);
        } else {
            console.warn(`📊 [GA4 Skipped] Event: ${eventName}`, params);
        }
    },

    // ==========================================
    //  SPECIFIC EVENT TRACKERS
    // ==========================================

    /**
     * Fired when the user starts a quiz level.
     */
    trackQuizStart: (levelId, moduleName) => {
        AnalyticsEngine._sendEvent('quiz_started', {
            level: levelId,
            module: moduleName
        });
    },

    /**
     * Fired when the user finishes a quiz level and sees results.
     */
    trackQuizComplete: (levelId, moduleName, scorePercent, passed) => {
        AnalyticsEngine._sendEvent('quiz_completed', {
            level: levelId,
            module: moduleName,
            score: scorePercent,
            passed: passed,
            rank: passed ? 'validated' : 'failed'
        });
    },

    /**
     * Fired when the user interacts with a feature that checks for access bounds.
     */
    trackFeatureAccess: (featureName, isGranted) => {
        AnalyticsEngine._sendEvent('feature_accessed', {
            feature_name: featureName,
            granted: isGranted
        });
    },

    /**
     * Fired when the user ends a tracking period (page leave / disconnect).
     */
    trackPageTime: (pageUrl, secondsSpent) => {
        AnalyticsEngine._sendEvent('page_time_tracked', {
            page: pageUrl,
            seconds: secondsSpent
        });
    }

};
