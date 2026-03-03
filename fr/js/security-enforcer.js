/**
 * DCM SECURITY MANAGER — Phase 48
 * Global Security Headers (Client-Side Emulation for GitHub Pages)
 * and HTTPS Enforcement.
 */

(function () {
    // 1. Force HTTPS (Critical for SaaS) - Skip for local testing
    if (location.protocol !== 'https:' && location.protocol !== 'file:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        console.warn("🔐 Insecure connection detected. Redirecting to HTTPS...");
        location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }

    // 2. Inject Security Meta Tags (CSP 3.0 & Anti-Framing)
    const metaCSP = document.createElement('meta');
    metaCSP.httpEquiv = "Content-Security-Policy";
    metaCSP.content = "default-src 'self' https://*.supabase.co; " +
        "frame-ancestors 'none'; " + // Prevent framing on modern browsers
        "script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.clarity.ms; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://unpkg.com; " +
        "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
        "img-src 'self' data: https://ui-avatars.com https://*.supabase.co https://www.google-analytics.com https://c.clarity.ms; " +
        "connect-src 'self' https://*.supabase.co https://*.supabase.net https://www.google-analytics.com https://w.clarity.ms;";
    document.head.appendChild(metaCSP);

    // Referrer Policy: Institutional standard
    const metaReferrer = document.createElement('meta');
    metaReferrer.name = "referrer";
    metaReferrer.content = "same-origin";
    document.head.appendChild(metaReferrer);

    // X-Frame-Options emulation for client-side
    const metaXFrame = document.createElement('meta');
    metaXFrame.httpEquiv = "X-Frame-Options";
    metaXFrame.content = "DENY";
    document.head.appendChild(metaXFrame);

    // Aggressive Frame-Buster (Phase 83) - Bypassed for automated testing (Playwright)
    if (window.top !== window.self && !navigator.webdriver) {
        window.top.location.replace(window.self.location.href);
    }

    // 3. Input Sanitization (Whitelisting approach)
    window.DCM_Security = {
        sanitizeInput: (str) => {
            if (typeof str !== 'string') return str;
            // Basic HTML Entity Encoding (Institutional Baseline)
            return str.replace(/[&<>"']/g, m => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
            }[m]));
        }
    };

    console.log("🛡️ Institutional Security Enforcer Active.");
})();
