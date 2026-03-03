/**
 * DCM DIGITAL — Cookie Consent Manager (RGPD Compliant)
 * Blocks GA4 and Hotjar until explicit user consent.
 * Lightweight, no external dependency.
 */

(function () {
    'use strict';

    const CONSENT_KEY = 'dcm_cookie_consent';
    const GA_ID = 'G-486THQXM9D';
    // Replace with your real Hotjar Site ID when available
    const HOTJAR_ID = null; // Set to numeric ID when ready, e.g. 1234567

    // =========================================
    //  CONSENT STATE
    // =========================================
    function getConsent() {
        try {
            return JSON.parse(localStorage.getItem(CONSENT_KEY));
        } catch (e) {
            return null;
        }
    }

    function setConsent(analytics) {
        const consent = {
            analytics: analytics,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
        return consent;
    }

    // =========================================
    //  INJECT GA4 (only after consent)
    // =========================================
    function injectGA4() {
        if (document.getElementById('dcm-ga4-script')) return; // already loaded
        const s = document.createElement('script');
        s.id = 'dcm-ga4-script';
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);

        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_ID, { anonymize_ip: true });
        console.log('🟢 [RGPD] GA4 loaded after consent.');
    }

    // =========================================
    //  INJECT HOTJAR (only after consent)
    // =========================================
    function injectHotjar() {
        if (!HOTJAR_ID || document.getElementById('dcm-hotjar-script')) return;
        (function (h, o, t, j, a, r) {
            h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments); };
            h._hjSettings = { hjid: HOTJAR_ID, hjsv: 6 };
            a = o.getElementsByTagName('head')[0];
            r = o.createElement('script'); r.async = 1; r.id = 'dcm-hotjar-script';
            r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
            a.appendChild(r);
        })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
        console.log('🟢 [RGPD] Hotjar loaded after consent.');
    }

    // =========================================
    //  LOAD ANALYTICS IF CONSENT EXISTS
    // =========================================
    function loadAnalyticsIfConsented() {
        const consent = getConsent();
        if (consent && consent.analytics === true) {
            injectGA4();
            injectHotjar();
        }
    }

    // =========================================
    //  BANNER UI
    // =========================================
    function showBanner() {
        if (document.getElementById('dcm-cookie-banner')) return;

        const banner = document.createElement('div');
        banner.id = 'dcm-cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Gestion des cookies');
        banner.innerHTML = `
            <div class="dcm-cb-inner">
                <div class="dcm-cb-text">
                    <i class="fas fa-shield-alt" style="color:#3b82f6; margin-right:8px;"></i>
                    <span>
                        Ce site utilise des cookies analytiques (GA4) pour mesurer l'audience et améliorer l'expérience.
                        <a href="cookies.html" style="color:#3b82f6; text-decoration:underline;">En savoir plus</a>
                    </span>
                </div>
                <div class="dcm-cb-actions">
                    <button id="dcm-cb-refuse" class="dcm-cb-btn dcm-cb-btn-secondary">Refuser</button>
                    <button id="dcm-cb-accept" class="dcm-cb-btn dcm-cb-btn-primary">Accepter</button>
                </div>
            </div>
        `;

        // Styles
        const style = document.createElement('style');
        style.textContent = `
            #dcm-cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 99999;
                background: rgba(2, 6, 23, 0.97);
                border-top: 1px solid rgba(59, 130, 246, 0.3);
                backdrop-filter: blur(20px);
                padding: 16px 24px;
                font-family: 'Inter', sans-serif;
                animation: dcm-cb-slide-up 0.4s ease-out;
            }
            @keyframes dcm-cb-slide-up {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .dcm-cb-inner {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
                flex-wrap: wrap;
            }
            .dcm-cb-text {
                font-size: 13px;
                color: #94a3b8;
                line-height: 1.5;
                flex: 1;
                min-width: 300px;
            }
            .dcm-cb-actions {
                display: flex;
                gap: 10px;
                flex-shrink: 0;
            }
            .dcm-cb-btn {
                padding: 10px 22px;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                border: none;
                transition: all 0.2s;
                font-family: 'Inter', sans-serif;
            }
            .dcm-cb-btn-primary {
                background: linear-gradient(135deg, #3b82f6, #a855f7);
                color: white;
            }
            .dcm-cb-btn-primary:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
            }
            .dcm-cb-btn-secondary {
                background: transparent;
                color: #94a3b8;
                border: 1px solid #334155;
            }
            .dcm-cb-btn-secondary:hover {
                border-color: #64748b;
                color: #e2e8f0;
            }
            @media (max-width: 600px) {
                .dcm-cb-inner { flex-direction: column; text-align: center; }
                .dcm-cb-actions { width: 100%; justify-content: center; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(banner);

        // Event listeners
        document.getElementById('dcm-cb-accept').addEventListener('click', function () {
            setConsent(true);
            injectGA4();
            injectHotjar();
            closeBanner();
        });

        document.getElementById('dcm-cb-refuse').addEventListener('click', function () {
            setConsent(false);
            closeBanner();
        });
    }

    function closeBanner() {
        const banner = document.getElementById('dcm-cookie-banner');
        if (banner) {
            banner.style.animation = 'dcm-cb-slide-down 0.3s ease-in forwards';
            const slideDown = document.createElement('style');
            slideDown.textContent = `
                @keyframes dcm-cb-slide-down {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(slideDown);
            setTimeout(() => banner.remove(), 300);
        }
    }

    // =========================================
    //  PUBLIC API (for "Gérer les cookies" link)
    // =========================================
    window.DCM_CookieConsent = {
        reset: function () {
            localStorage.removeItem(CONSENT_KEY);
            // Remove GA4/Hotjar scripts if loaded
            const ga = document.getElementById('dcm-ga4-script');
            const hj = document.getElementById('dcm-hotjar-script');
            if (ga) ga.remove();
            if (hj) hj.remove();
            showBanner();
        },
        getStatus: function () {
            return getConsent();
        }
    };

    // =========================================
    //  INIT
    // =========================================
    document.addEventListener('DOMContentLoaded', function () {
        const consent = getConsent();
        if (consent === null) {
            // No choice made yet → show banner
            showBanner();
        } else {
            // Choice already made → load if accepted
            loadAnalyticsIfConsented();
        }
    });

})();
