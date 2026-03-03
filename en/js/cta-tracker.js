/**
 * DCM DIGITAL — CTA Conversion Tracker (RGPD Conditionnel)
 * Tracks strategic CTA clicks, scroll depth, and time-on-page.
 * ALL events fire ONLY if GA4 consent was given via cookie-consent.js.
 */

(function () {
    'use strict';

    const CONSENT_KEY = 'dcm_cookie_consent';

    // =========================================
    //  CONSENT CHECK
    // =========================================
    function hasAnalyticsConsent() {
        try {
            const c = JSON.parse(localStorage.getItem(CONSENT_KEY));
            return c && c.analytics === true;
        } catch (e) {
            return false;
        }
    }

    function sendGA4Event(eventName, params) {
        if (!hasAnalyticsConsent()) return;
        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, params);
            console.log('📊 [CTA Tracker]', eventName, params);
        }
    }

    // =========================================
    //  1. CTA CLICK TRACKING
    // =========================================
    //  Auto-detect strategic CTAs by href or text content
    const CTA_SELECTORS = {
        // Links to key conversion pages
        'cta_schedule_demo': 'a[href*="SCHEDULE_DEMO"], a[href*="schedule-demo"], a[href*="mailto:contact@dcm-digital"]',
        'cta_pilot_intake': 'a[href*="pilot-intake"]',
        'cta_pricing': 'a[href*="pricing"]',
        'cta_why_now': 'a[href*="why-now"]',
        'cta_series_a': 'a[href*="series-a-narrative"]',
        'cta_case_study': 'a[href*="case-study"]',
        'cta_governance_os': 'a[href*="governance-os-landing"]',
        'cta_investor_relations': 'a[href*="investor-relations"], a[href*="investor-login"]',
        'cta_risk_register': 'a[href*="risk-register"]',
        'cta_competitive': 'a[href*="competitive-landscape"]'
    };

    function initCTATracking() {
        Object.entries(CTA_SELECTORS).forEach(([eventName, selector]) => {
            document.querySelectorAll(selector).forEach(el => {
                if (el.dataset.ctaTracked) return; // avoid double-binding
                el.dataset.ctaTracked = 'true';
                el.addEventListener('click', function () {
                    sendGA4Event(eventName, {
                        page: window.location.pathname,
                        link_text: el.textContent.trim().substring(0, 60),
                        link_url: el.href || ''
                    });
                });
            });
        });
    }

    // =========================================
    //  2. SCROLL DEPTH TRACKING (25%, 50%, 75%, 100%)
    // =========================================
    const scrollMilestones = { 25: false, 50: false, 75: false, 100: false };

    function initScrollTracking() {
        const pagePath = window.location.pathname;

        window.addEventListener('scroll', function () {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (docHeight <= 0) return;

            const scrollPercent = Math.round((scrollTop / docHeight) * 100);

            Object.keys(scrollMilestones).forEach(threshold => {
                const t = parseInt(threshold);
                if (scrollPercent >= t && !scrollMilestones[t]) {
                    scrollMilestones[t] = true;
                    sendGA4Event('scroll_depth', {
                        page: pagePath,
                        depth: t + '%'
                    });
                }
            });
        }, { passive: true });
    }

    // =========================================
    //  3. TIME ON PAGE (fire at 30s, 1min, 3min, 5min)
    // =========================================
    const timeMilestones = [30, 60, 180, 300]; // seconds
    const firedTimeMilestones = {};

    function initTimeTracking() {
        const pagePath = window.location.pathname;
        const startTime = Date.now();

        setInterval(function () {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);

            timeMilestones.forEach(threshold => {
                if (elapsed >= threshold && !firedTimeMilestones[threshold]) {
                    firedTimeMilestones[threshold] = true;
                    const label = threshold >= 60
                        ? Math.floor(threshold / 60) + 'min'
                        : threshold + 's';
                    sendGA4Event('time_on_page', {
                        page: pagePath,
                        duration: label
                    });
                }
            });
        }, 5000); // check every 5 seconds
    }

    // =========================================
    //  4. PERSONA GATE TRACKING
    // =========================================
    function initPersonaTracking() {
        const pagePath = window.location.pathname;

        document.querySelectorAll('.radical-gate-card, .gate-cta-btn').forEach(el => {
            if (el.dataset.personaTracked) return;
            el.dataset.personaTracked = 'true';

            el.addEventListener('click', function () {
                const persona = el.getAttribute('onclick')?.match(/setPersona\('(\w+)'\)/)?.[1]
                    || el.closest('[onclick]')?.getAttribute('onclick')?.match(/setPersona\('(\w+)'\)/)?.[1]
                    || 'unknown';
                sendGA4Event('persona_selected', {
                    page: pagePath,
                    persona: persona
                });
            });
        });
    }

    // =========================================
    //  INIT
    // =========================================
    document.addEventListener('DOMContentLoaded', function () {
        // Wait a short moment for consent to be processed
        setTimeout(function () {
            initCTATracking();
            initScrollTracking();
            initTimeTracking();
            initPersonaTracking();
        }, 500);
    });

})();
