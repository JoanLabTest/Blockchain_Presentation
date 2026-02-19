/**
 * SESSION MANAGER (v1.0)
 * Handles Authentication State, Security Context, and Global Logout.
 * Centralizes all Auth logic to prepare for Supabase integration.
 */

export const SessionManager = {
    // --- CONFIG ---
    KEYS: {
        AUTH_TOKEN: 'dcm_auth_token',
        USER_PROFILE: 'dcm_user_profile',
        SESSION_START: 'dcm_session_start'
    },

    // --- INITIALIZATION ---
    init: () => {
        // 1. Check if user is logged in
        const token = localStorage.getItem(SessionManager.KEYS.AUTH_TOKEN);
        const profile = localStorage.getItem(SessionManager.KEYS.USER_PROFILE);

        // 2. Strict Redirect (Gatekeeper)
        // Note: We bypass this check if we are on public pages
        if (!token || !profile) {
            const path = window.location.pathname;
            const isPublicPage = path.endsWith('index.html') || path.endsWith('login.html') || path.endsWith('/');

            if (!isPublicPage) {
                console.warn("Security Alert: No active session. Redirecting to Login...");
                // Note: We don't call full logout() here to avoid recursive redirects if logout() goes to index.html
                // Just force the user to the login page
                window.location.href = 'login.html';
            }
            return null;
        }

        return JSON.parse(profile);
    },

    // --- LOGIN (Mock Implementation) ---
    login: (email, role = 'Risk Manager') => {
        const mockProfile = {
            id: 'u-123456',
            name: email.split('@')[0], // Extract name from email
            email: email,
            role: role,
            jurisdiction: 'EU (France)',
            kycLevel: 'Verified (Level 3)',
            lastLogin: new Date().toISOString()
        };

        localStorage.setItem(SessionManager.KEYS.AUTH_TOKEN, 'mock-jwt-token-xyz-789');
        localStorage.setItem(SessionManager.KEYS.USER_PROFILE, JSON.stringify(mockProfile));
        localStorage.setItem(SessionManager.KEYS.SESSION_START, Date.now());

        return mockProfile;
    },

    // --- LOGOUT (Destructive) ---
    logout: () => {
        console.log("🔒 Terminating Session...");

        // 1. Clear Local Storage (Auth)
        localStorage.removeItem(SessionManager.KEYS.AUTH_TOKEN);
        localStorage.removeItem(SessionManager.KEYS.USER_PROFILE);
        localStorage.removeItem(SessionManager.KEYS.SESSION_START);

        // 2. Clear Session Storage (Temp Data)
        sessionStorage.clear();

        // 3. Optional: Clear Application State (if any)
        // ...

        // 4. Redirect to Landing
        window.location.href = 'index.html';
    },

    // --- UTILS ---
    getSessionDuration: () => {
        const start = localStorage.getItem(SessionManager.KEYS.SESSION_START);
        if (!start) return 0;
        const diff = Date.now() - parseInt(start);
        return Math.floor(diff / 60000); // Minutes
    },

    getCurrentUser: () => {
        const profile = localStorage.getItem(SessionManager.KEYS.USER_PROFILE);
        return profile ? JSON.parse(profile) : null;
    },

    // --- TIME TRACKER ---
    startTracking: () => {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        console.log(`⏱️ Tracking time for: ${path}`);

        setInterval(() => {
            // Read
            let history = JSON.parse(localStorage.getItem('dcm_page_history') || '{}');

            // Increment (5 seconds)
            if (!history[path]) history[path] = 0;
            history[path] += 5;

            // Save
            localStorage.setItem('dcm_page_history', JSON.stringify(history));

            // Also update Global Total Time
            let total = parseInt(localStorage.getItem('dcm_total_time') || '0');
            localStorage.setItem('dcm_total_time', total + 5);

        }, 5000);
    }
};

// Auto-start tracking if loaded
if (typeof window !== 'undefined') {
    // Only start if not already managed by another script to avoid double counting? 
    // Actually, setInterval is per page instance.
    SessionManager.startTracking();
}
