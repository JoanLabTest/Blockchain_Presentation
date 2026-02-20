/**
 * DCM SECURITY MANAGER — Phase 48
 * Global Security Headers (Client-Side Emulation for GitHub Pages)
 * and HTTPS Enforcement.
 */

(function () {
    // 1. Force HTTPS (Critical for SaaS)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        console.warn("🔐 Insecure connection detected. Redirecting to HTTPS...");
        location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }

    // 2. Inject Security Meta Tags (CSP & HSTS equivalents)
    // CSP restricts where scripts/styles/images can be loaded from, mitigating XSS.
    const metaCSP = document.createElement('meta');
    metaCSP.httpEquiv = "Content-Security-Policy";
    metaCSP.content = "default-src 'self' https://*.supabase.co; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.clarity.ms; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://unpkg.com; " +
        "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
        "img-src 'self' data: https://ui-avatars.com https://www.google-analytics.com https://c.clarity.ms; " +
        "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://w.clarity.ms;";
    document.head.appendChild(metaCSP);

    // Ensure site is not loaded in an unauthorized iframe (Clickjacking defense)
    if (window.top !== window.self) {
        console.error("🚫 Blocked iframe rendering (Anti-Clickjacking).");
        window.top.location = window.self.location;
    }
})();
