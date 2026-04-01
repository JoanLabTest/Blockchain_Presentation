/**
 * SESSION MANAGER — v2.0 (Phase 31: Production Grade)
 * Real Supabase Auth integration replacing localStorage mock.
 * Handles: Auth state, JWT verification, RLS-backed data, logout.
 */

// supabase is loaded globally via supabase-client.js script tag
const _supabase = () => window.supabase;

const SessionManager = {

    // --- KEYS (kept for offline/fallback cache) ---
    KEYS: {
        AUTH_TOKEN: 'dcm_auth_token',
        USER_PROFILE: 'dcm_user_profile',
        SESSION_START: 'dcm_session_start',
        LAST_ACTIVITY: 'dcm_last_activity'
    },

    // Config: 30 minutes in milliseconds
    SESSION_TIMEOUT_MS: 30 * 60 * 1000,

    // =============================================
    //  INITIALIZATION — Check Supabase session
    // =============================================
    init: async () => {
        const sb = _supabase();
        if (!sb) {
            console.warn('SessionManager: supabase not loaded');
            return null;
        }

        // --- PHASE 31.5: GUEST MODE BYPASS ---
        const localToken = localStorage.getItem(SessionManager.KEYS.AUTH_TOKEN);
        const localProfile = localStorage.getItem(SessionManager.KEYS.USER_PROFILE);
        if (localToken && localToken.startsWith('guest-token-') && localProfile) {
            console.info('🎟️ Guest Mode detected. Skipping server auth check.');
            return JSON.parse(localProfile);
        }

        // 🛡️ STRICT CHECK: getUser() hits the server to verify the JWT and account status
        const { data: { user }, error } = await sb.auth.getUser();

        if (error || !user) {
            console.warn('🔒 No active/valid Supabase session found on server.');
            // Clear local cache if server says no
            const keysToRemove = [SessionManager.KEYS.AUTH_TOKEN, SessionManager.KEYS.USER_PROFILE, SessionManager.KEYS.SESSION_START];
            keysToRemove.forEach(k => localStorage.removeItem(k));

            // 🧹 SECURITY: Ensure master UI patches are removed if no valid master session
            if (typeof window.__deactivateMasterMode === 'function') {
                window.__deactivateMasterMode();
            }

            // 🛡️ SYNC STATE: Force Supabase client to acknowledge the session is dead
            await sb.auth.signOut();

            return null;
        }

        // Fetch fresh session for accessToken and cache update
        const { data: { session } } = await sb.auth.getSession();
        const profile = await SessionManager._buildProfile(user, session?.access_token);

        // --- PHASE 48: SESSION TIMEOUT INIT ---
        SessionManager._initActivityTracker();

        return profile;
    },

    /**
     * Protects a route by enforcing a valid server-side session.
     * Redirects to login if check fails.
     */
    protectRoute: async () => {
        // Hide body until verified to prevent flash
        document.documentElement.style.visibility = 'hidden';

        try {
            const profile = await SessionManager.init();
            if (!profile) {
                console.warn('🔒 Route protection: Invalid session. Redirecting...');
                window.location.replace('login.html');
                return null;
            }
            return profile;
        } catch (err) {
            console.error('🔒 Route protection: Critical error during init:', err);
            window.location.replace('login.html');
            return null;
        } finally {
            // Guarantee visibility is restored even if script errors occur
            document.documentElement.style.visibility = '';
        }
    },


    // =============================================
    //  BUILD USER PROFILE from Supabase user object
    // =============================================
    _buildProfile: async (user, accessToken) => {
        // Try to fetch extended profile from public.profiles table
        const sb = _supabase();
        const { data: profileData, error } = sb ? await sb
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single() : { data: null, error: null };

        if (error) {
            console.error("Supabase Profile Fetch Error:", error.message);
        }

        const profile = {
            id: user.id,
            name: user.user_metadata?.full_name || profileData?.full_name || profileData?.username || user.user_metadata?.username || user.email.split('@')[0],
            email: user.email,
            role: profileData?.role || 'Analyste',
            org_id: profileData?.org_id || null,
            jurisdiction: profileData?.jurisdiction || 'EU (France)',
            subscription_tier: profileData?.subscription_tier || 'free',
            lastLogin: new Date().toISOString()
        };

        // 🎭 MASTER ACCESS — only for confirmed Supabase email
        const MASTER_EMAIL = 'joanlyczak@gmail.com';
        const userEmail = user.email ? user.email.toLowerCase() : '';
        
        if (userEmail === MASTER_EMAIL.toLowerCase()) {
            console.info('SessionManager: 🎭 MASTER ACCESS for ' + userEmail);
            profile.name = 'Joan'; // Force display name for master
            profile.role = 'ADMIN';
            profile.subscription_tier = 'enterprise';
            profile.org_id = 'dcm-master-org';

            // Activate master patches via dev-unlock hook (conditional, post-auth)
            if (typeof window.__activateMasterMode === 'function') {
                window.__activateMasterMode(userEmail);
            }
        } else {
            // 🧹 SECURITY: Wipe any stale dev/master flags from localStorage on every normal login.
            const STALE_KEYS = ['is_super_dev', 'dcm_user_role', 'dcm_active_role', 'dcm_segment', 'dcm_org_id', 'userRole', 'userTier'];
            STALE_KEYS.forEach(k => localStorage.removeItem(k));
            sessionStorage.removeItem('dcm_master_active');

            // 🧹 SECURITY: Explicitly deactivate any active master UI patches
            if (typeof window.__deactivateMasterMode === 'function') {
                window.__deactivateMasterMode();
            }

            if (window.DCM_CONFIG) window.DCM_CONFIG.DEV_MODE = false;
        }

        // Cache locally for offline fallback
        localStorage.setItem(SessionManager.KEYS.AUTH_TOKEN, accessToken);
        localStorage.setItem(SessionManager.KEYS.USER_PROFILE, JSON.stringify(profile));
        localStorage.setItem(SessionManager.KEYS.SESSION_START, Date.now());
        if (profile.org_id) localStorage.setItem('dcm_org_id', profile.org_id);

        if (profile) {
            localStorage.setItem('dcm_segment', profile.subscription_tier || 'free');
            localStorage.setItem('dcm_active_role', profile.subscription_tier || 'free');

            // 📣 Notify components that the verified profile is ready
            window.dispatchEvent(new CustomEvent('dcm-profile-ready', { detail: profile }));
        }
        return profile;
    },

    // =============================================
    //  LOGIN — Delegates to Supabase Auth
    // =============================================
    login: async (email, password) => {
        const sb = _supabase(); if (!sb) throw new Error('Supabase not available');
        const { data, error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const profile = await SessionManager._buildProfile(data.user, data.session.access_token);
        return profile;
    },

    // =============================================
    //  SIGNUP — Delegates to Supabase Auth
    // =============================================
    signup: async (email, password, firstName, lastName) => {
        const sb = _supabase(); if (!sb) throw new Error('Supabase not available');
        const { data, error } = await sb.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    full_name: `${firstName} ${lastName}`
                }
            }
        });
        if (error) throw error;

        // If auto-confirm is enabled, we get a session immediately
        if (data.session) {
            const profile = await SessionManager._buildProfile(data.user, data.session.access_token);
            return { profile, requireVerification: false };
        }

        return { profile: null, requireVerification: true };
    },

    // =============================================
    //  LOGOUT — Clears Supabase session + local cache
    // =============================================
    logout: async () => {
        console.log('🔒 Terminating session (Supabase + Storage)...');

        // 1. Sign out from Supabase
        try {
            const sb = _supabase();
            if (sb) await sb.auth.signOut();
        } catch (e) {
            console.warn('Supabase signout failed, continuing with cache clear:', e);
        }

        // 2. Clear all localStorage auth & role keys
        const keysToRemove = [
            SessionManager.KEYS.AUTH_TOKEN,
            SessionManager.KEYS.USER_PROFILE,
            SessionManager.KEYS.SESSION_START,
            SessionManager.KEYS.LAST_ACTIVITY,
            'dcm_org_id',
            'dcm_active_role',
            'dcm_segment',
            'dcm_user_role',
            'is_super_dev',
            'userRole',
            'userTier'
        ];
        keysToRemove.forEach(k => localStorage.removeItem(k));

        // 3. Clear sessionStorage (master flag + anything else)
        sessionStorage.clear();

        // 4. 🧹 SECURITY: Explicitly deactivate any active master UI patches
        if (typeof window.__deactivateMasterMode === 'function') {
            window.__deactivateMasterMode();
        }

        // 5. Redirect to login
        window.location.href = 'login.html';
    },

    // =============================================
    //  SEGMENTATION & ROLES (PHASE 61)
    // =============================================
    setSessionRole: (role) => {
        console.log(`🎯 Setting session role: ${role}`);
        localStorage.setItem('dcm_active_role', role);
        // Trigger a custom event for other modules
        window.dispatchEvent(new CustomEvent('dcmRoleChanged', { detail: { role } }));
    },

    getActiveRole: () => {
        return localStorage.getItem('dcm_active_role') || 'Guest';
    },

    // =============================================
    //  UTILS & SESSION TIMEOUT (PHASE 48)
    // =============================================
    getCurrentUser: () => {
        const profile = localStorage.getItem(SessionManager.KEYS.USER_PROFILE);
        return profile ? JSON.parse(profile) : null;
    },

    getSessionDuration: () => {
        const start = localStorage.getItem(SessionManager.KEYS.SESSION_START);
        if (!start) return 0;
        return Math.floor((Date.now() - parseInt(start)) / 60000);
    },

    _initActivityTracker: () => {
        // Track mouse/keyboard as 'activity'
        const updateActivity = () => localStorage.setItem(SessionManager.KEYS.LAST_ACTIVITY, Date.now().toString());
        window.addEventListener('mousemove', updateActivity, { once: true, capture: true }); // throttle via occasional reset
        window.addEventListener('keydown', updateActivity, { once: true, capture: true });

        // Reset listeners every 5 mins to avoid spam
        setInterval(() => {
            window.addEventListener('mousemove', updateActivity, { once: true, capture: true });
            window.addEventListener('keydown', updateActivity, { once: true, capture: true });
        }, 300000);

        // Security loop check every 1 minute
        setInterval(() => {
            const lastActivity = parseInt(localStorage.getItem(SessionManager.KEYS.LAST_ACTIVITY) || Date.now().toString());
            if (Date.now() - lastActivity > SessionManager.SESSION_TIMEOUT_MS) {
                console.warn('🔒 Session Timeout reached (30 min inactivity). Logging out.');
                alert("Session expired due to inactivity. Please log in again.");
                SessionManager.logout();
            }
        }, 60000);
    },

    /**
     * Update user profile in Supabase and local cache
     */
    updateProfile: async (updates) => {
        const sb = _supabase();
        const profile = SessionManager.getCurrentUser();
        if (!sb || !profile || profile.id.startsWith('guest')) {
            // Local update for guests
            const newProfile = { ...profile, ...updates };
            localStorage.setItem(SessionManager.KEYS.USER_PROFILE, JSON.stringify(newProfile));
            return newProfile;
        }

        const { data, error } = await sb
            .from('profiles')
            .update(updates)
            .eq('id', profile.id)
            .select()
            .single();

        if (error) {
            console.error("❌ Profile Update Error:", error.message);
            throw error;
        }

        // Update local cache
        const updatedProfile = { ...profile, ...updates };
        localStorage.setItem(SessionManager.KEYS.USER_PROFILE, JSON.stringify(updatedProfile));
        window.dispatchEvent(new CustomEvent('dcm-profile-updated', { detail: updatedProfile }));
        return updatedProfile;
    },

    // =============================================
    //  DATA SYNC — Write activity to Supabase
    // =============================================
    syncPageActivity: async () => {
        const sb = _supabase();
        if (!sb) return;
        const { data: { session } } = await sb.auth.getSession();
        if (!session) return; // No real session, skip sync

        const path = window.location.pathname.split('/').pop() || 'index.html';
        const localHistory = JSON.parse(localStorage.getItem('dcm_page_history') || '{}');
        const seconds = localHistory[path] || 0;
        if (seconds < 10) return; // Don't bother syncing < 10s

        // --- PHASE 32: ANALYTICS ENGINE INTEGRATION ---
        if (typeof AnalyticsEngine !== 'undefined') {
            AnalyticsEngine.trackPageTime(path, seconds);
        }

        if (!sb) return;
        await sb.from('activity_logs').upsert({
            user_id: session.user.id,
            page_url: path,
            time_spent_seconds: seconds,
            session_date: new Date().toISOString().split('T')[0]
        }, { onConflict: 'user_id,page_url,session_date' });
    },

    // =============================================
    //  TIME TRACKER (unchanged)
    // =============================================
    startTracking: () => {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        setInterval(() => {
            let history = JSON.parse(localStorage.getItem('dcm_page_history') || '{}');
            if (!history[path]) history[path] = 0;
            history[path] += 5;
            localStorage.setItem('dcm_page_history', JSON.stringify(history));
            let total = parseInt(localStorage.getItem('dcm_total_time') || '0');
            localStorage.setItem('dcm_total_time', total + 5);
        }, 5000);

        // Sync to Supabase every 2 minutes
        setInterval(() => SessionManager.syncPageActivity(), 120000);
    },

    // =============================================
    //  TOAST (unchanged API)
    // =============================================
    showToast: (icon, title, message) => {
        const toast = document.createElement('div');
        toast.innerHTML = `
            <div style="font-size:24px">${icon}</div>
            <div>
                <div style="font-weight:bold;margin-bottom:2px">${title}</div>
                <div style="font-size:12px;opacity:0.8">${message}</div>
            </div>
            <button onclick="this.parentElement.remove()" style="background:none;border:none;color:white;cursor:pointer;margin-left:auto">×</button>
        `;
        toast.style.cssText = `
            position:fixed;top:100px;right:30px;
            background:rgba(30,41,59,0.95);backdrop-filter:blur(10px);
            border:1px solid rgba(255,255,255,0.1);border-left:4px solid #3b82f6;
            color:white;padding:15px 20px;border-radius:12px;
            box-shadow:0 10px 30px rgba(0,0,0,0.5);
            display:flex;align-items:center;gap:15px;min-width:300px;z-index:9999;
            animation:slideInRight 0.5s cubic-bezier(0.175,0.885,0.32,1.275);
        `;
        const style = document.createElement('style');
        style.innerHTML = `@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`;
        document.head.appendChild(style);
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.transition = 'all 0.5s';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 500);
        }, 8000);
    },

    // =============================================
    //  SMART NOTIFICATIONS (Phase 28 — English)
    // =============================================
    checkAndShowNotifications: () => {
        if (!window.location.pathname.includes('dashboard.html')) return;
        const history = JSON.parse(localStorage.getItem('dcm_quiz_history') || '[]');
        if (history.length > 0) {
            const last = history[history.length - 1];
            const pct = Math.round((last.score / last.total) * 100);
            const icon = pct < 80 ? '💪' : '🏆';
            const msg = pct < 80
                ? `Your last score was ${pct}%. Ready to try again?`
                : `You validated the last module with ${pct}%. Heading for the next level?`;
            SessionManager.showToast(icon, 'Welcome', msg);
        } else {
            SessionManager.showToast('👋', 'Welcome', 'Your cockpit is ready. Start with the Quiz or explore the data.');
        }
    },

    checkAccess: (permission) => {
        const profile = SessionManager.getCurrentUser() || {};
        const role = (profile.role || '').toUpperCase();
        const tier = (profile.subscription_tier || 'free').toLowerCase();
        const email = profile.email || '';
        const status = (profile.subscription_status || 'inactive').toLowerCase();
        const override = profile.admin_override === true;

        // 🎭 MASTER ACCESS — confirmed via Supabase email
        const MASTER_EMAIL = 'joanlyczak@gmail.com';
        if (email.toLowerCase() === MASTER_EMAIL.toLowerCase()) return true;

        // 🛡️ ADMIN ROLE OR OVERRIDE
        if (role === 'ADMIN' || override) {
            console.log(`[RBAC] ✅ checkAccess("${permission}") → GRANTED (Admin/Override)`);
            return true;
        }

        /**
         * Institutional Permission Matrix
         */
        const TIER_PERMISSIONS = {
            'free': [
                'BASIC_DASHBOARD',
                'PUBLIC_RESEARCH'
            ],
            'pro': [
                'BASIC_DASHBOARD',
                'PUBLIC_RESEARCH',
                'REPORT_EXPORT',
                'BENCHMARK_DETAIL',
                'PREMIUM_RESEARCH'
            ],
            'enterprise': [
                'BASIC_DASHBOARD',
                'PUBLIC_RESEARCH',
                'REPORT_EXPORT',
                'BENCHMARK_DETAIL',
                'PREMIUM_RESEARCH',
                'AUDIT_VIEW',
                'USER_MANAGEMENT',
                'RISK_MODEL_EDIT',
                'API_ACCESS'
            ]
        };

        // 🛡️ STRIPE STATUS CHECK (Must be active for paid tiers)
        const isPaidTier = tier === 'pro' || tier === 'enterprise';
        if (isPaidTier && status !== 'active') {
            console.warn(`[RBAC] ❌ checkAccess("${permission}") → DENIED (Paid tier but status is ${status})`);
            SessionManager.showPaywall(permission, role);
            return false;
        }

        const allowedFeatures = TIER_PERMISSIONS[tier] || TIER_PERMISSIONS['free'];
        const isGranted = allowedFeatures.includes(permission.toUpperCase());

        if (!isGranted) {
            console.warn(`[RBAC] ❌ checkAccess("${permission}") → DENIED (Tier ${tier} mission)`);
            SessionManager.showPaywall(permission, role);
            return false;
        }

        console.log(`[RBAC] ✅ checkAccess("${permission}") → GRANTED (Tier ${tier})`);
        return true;
    },

    showPaywall: (permission, currentRole) => {
        const messages = {
            'REPORT_EXPORT': 'Institutional PDF Export (Analyst+ required).',
            'AUDIT_VIEW': 'Access to Audit Logs (Admin required).',
            'USER_MANAGEMENT': 'Access Management (Admin required).',
            'RISK_MODEL_EDIT': 'Risk Model Modification (Admin required).'
        };
        const displayName = messages[permission] || 'this expert feature';

        const modalId = 'premium-upgrade-modal';
        if (document.getElementById(modalId)) return;

        const modal = document.createElement('div');
        modal.id = modalId;
        modal.style.cssText = `
            position:fixed;top:0;left:0;width:100%;height:100%;
            background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);
            display:flex;justify-content:center;align-items:center;z-index:999999;
        `;
        modal.innerHTML = `
            <div style="background:#0a0a0a;padding:40px;border-radius:24px;text-align:center;border:1px solid #333;max-width:450px;box-shadow:0 25px 50px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.2);position:relative;animation:modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1);">
                <button onclick="this.closest('#${modalId}').remove()" style="position:absolute;top:15px;right:20px;background:none;border:none;color:#666;font-size:24px;cursor:pointer;transition:0.2s;">×</button>
                
                <div style="width:70px;height:70px;border-radius:50%;background:rgba(139, 92, 246, 0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
                    <i class="fas fa-crown" style="font-size:30px;color:var(--accent-purple);"></i>
                </div>
                
                <h2 style="color:white;margin-bottom:12px;font-size:24px;font-weight:800;">Limited Access</h2>
                <p style="color:#a1a1aa;margin-bottom:30px;font-size:15px;line-height:1.5;">You are currently using the <strong style="color:white">Analyst Free</strong> edition. Unlock <strong>${displayName}</strong> and real-time data with the Pro plan.</p>
                
                <div style="display:flex;flex-direction:column;gap:15px">
                    <button onclick="window.location.href='pricing.html'" style="padding:14px;background:var(--accent-purple);color:white;border:none;border-radius:12px;cursor:pointer;font-weight:700;font-size:16px;box-shadow:0 10px 20px rgba(139, 92, 246, 0.3);transition:transform 0.2s;">
                        View Pro Subscriptions 🚀
                    </button>
                    <button onclick="this.closest('#${modalId}').remove()" style="padding:14px;background:transparent;border:1px solid #333;color:#888;border-radius:12px;cursor:pointer;font-weight:600;transition:0.2s;">
                        Continue in free mode
                    </button>
                </div>
            </div>
            <style>
                @keyframes modalPop { 0% { opacity:0; transform:scale(0.95) translateY(10px); } 100% { opacity:1; transform:scale(1) translateY(0); } }
            </style>
        `;
        document.body.appendChild(modal);
    }
};

// =============================================
//  SUPABASE AUTH STATE LISTENER
//  Auto-sync session changes (token refresh, expiry)
// =============================================
const _sb = _supabase();
if (_sb) {
    _sb.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
            localStorage.removeItem(SessionManager.KEYS.AUTH_TOKEN);
            localStorage.removeItem(SessionManager.KEYS.USER_PROFILE);
            localStorage.removeItem(SessionManager.KEYS.SESSION_START);
        } else if (event === 'TOKEN_REFRESHED' && session) {
            localStorage.setItem(SessionManager.KEYS.AUTH_TOKEN, session.access_token);
            const profile = await SessionManager._buildProfile(session.user, session.access_token);
            console.log('🔄 Token refreshed, profile updated:', profile.name);
        }
    });
}

// Expose globally and auto-start
if (typeof window !== 'undefined') {
    window.SessionManager = SessionManager;
    SessionManager.startTracking();
    setTimeout(() => SessionManager.checkAndShowNotifications(), 1500);
}

// =============================================
//  STORAGE MIGRATION v2 — Auto-cleanup legacy dev keys
//  Runs once per browser to remove stale unconditional
//  dev-unlock.js writes that corrupted auth state.
// =============================================
(function _cleanLegacyDevStorage() {
    const MIGRATION_KEY = 'dcm_storage_v2';
    if (localStorage.getItem(MIGRATION_KEY)) return; // Already cleaned

    const STALE_DEV_KEYS = [
        'is_super_dev',
        'dcm_user_role',
        'dcm_active_role',
        'dcm_segment',
        'dcm_org_id',
        'userRole',
        'userTier'
    ];

    // Only wipe the full token/profile if the token looks like a dev fake
    // (i.e. starts with 'dev_master_token_' or 'dev-mode-token')
    const existingToken = localStorage.getItem('dcm_auth_token') || '';
    const isStaleToken = existingToken.startsWith('dev_master_token_')
        || existingToken === 'dev-mode-token'
        || existingToken.startsWith('guest-token-123');

    if (isStaleToken) {
        localStorage.removeItem('dcm_auth_token');
        localStorage.removeItem('dcm_user_profile');
        localStorage.removeItem('dcm_session_start');
        console.info('[SessionManager] 🧹 Stale dev auth token cleared (migration v2).');
    }

    STALE_DEV_KEYS.forEach(k => localStorage.removeItem(k));

    // Mark as done
    localStorage.setItem(MIGRATION_KEY, '1');
    console.info('[SessionManager] ✅ Storage migration v2 complete.');
})();

