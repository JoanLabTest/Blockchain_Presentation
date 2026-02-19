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
    },

    // --- SMART NOTIFICATIONS (Phase 28) ---
    checkAndShowNotifications: () => {
        // Only on Dashboard
        if (!window.location.pathname.includes('dashboard.html')) return;

        const history = JSON.parse(localStorage.getItem('dcm_quiz_history') || '[]');

        // 1. Welcome Back Context
        if (history.length > 0) {
            const lastQuiz = history[history.length - 1];

            let msg = "";
            let icon = "👋";

            if (lastQuiz.score < lastQuiz.total * 0.8) {
                msg = `Ravi de vous revoir. Votre dernier score était de ${Math.round((lastQuiz.score / lastQuiz.total) * 100)}%. Prêt à réessayer ?`;
                icon = "💪";
            } else {
                msg = `Bon retour ! Vous avez validé le dernier module avec ${Math.round((lastQuiz.score / lastQuiz.total) * 100)}%. Cap sur le prochain niveau ?`;
                icon = "🏆";
            }

            // Show Toast
            SessionManager.showToast(icon, "Bienvenue", msg);
        } else {
            // First time or no history
            SessionManager.showToast("👋", "Bienvenue", "Votre cockpit est prêt. Commencez par le Quiz ou explorez les données.");
        }
    },

    showToast: (icon, title, message) => {
        // Create Toast Element
        const toast = document.createElement('div');
        toast.className = 'smart-toast';
        toast.innerHTML = `
            <div style="font-size: 24px;">\${icon}</div>
            <div>
                <div style="font-weight: bold; margin-bottom: 2px;">\${title}</div>
                <div style="font-size: 12px; opacity: 0.8;">\${message}</div>
            </div>
            <button onclick="this.parentElement.remove()" style="background:none; border:none; color:white; cursor:pointer;">&times;</button>
        `;

        // Styling
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: rgba(30, 41, 59, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-left: 4px solid #3b82f6;
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 15px;
            min-width: 300px;
            z-index: 9999;
            animation: slideInRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;

        // Animation Keyframes
        const style = document.createElement('style');
        style.innerHTML = `@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
        document.head.appendChild(style);

        document.body.appendChild(toast);

        // Auto remove after 8s
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            toast.style.transition = 'all 0.5s';
            setTimeout(() => toast.remove(), 500);
        }, 8000);
    }
};

// Auto-start tracking if loaded
if (typeof window !== 'undefined') {
    // Only start if not already managed by another script to avoid double counting? 
    // Actually, setInterval is per page instance.
    SessionManager.startTracking();
    // Delay slightly
    setTimeout(() => SessionManager.checkAndShowNotifications(), 1500);
}
