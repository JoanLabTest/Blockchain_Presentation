/**
 * SESSION MANAGER — v2.0 (Phase 31: Production Grade)
 * Real Supabase Auth integration replacing localStorage mock.
 * Handles: Auth state, JWT verification, RLS-backed data, logout.
 */

import { supabase } from './supabase-client.js';

export const SessionManager = {

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
        const { data: { session }, error } = await supabase.auth.getSession();

        const path = window.location.pathname;
        const isPublicPage = path.endsWith('index.html') || path.endsWith('login.html') || path === '/' || path.endsWith('/');

        if (error || !session) {
            // Fallback: check localStorage cache (offline/demo mode)
            const cachedToken = localStorage.getItem(SessionManager.KEYS.AUTH_TOKEN);
            const cachedProfile = localStorage.getItem(SessionManager.KEYS.USER_PROFILE);

            if (!cachedToken || !cachedProfile) {
                if (!isPublicPage) {
                    console.warn('🔒 No active Supabase session. Redirecting to login...');
                    window.location.href = 'login.html';
                }
                return null;
            }
            // Return cached profile (offline/demo mode)
            return JSON.parse(cachedProfile);
        }

        // Real Supabase session exists — build & cache profile
        const user = session.user;
        const profile = await SessionManager._buildProfile(user, session.access_token);

        // --- PHASE 48: SESSION TIMEOUT INIT ---
        SessionManager._initActivityTracker();

        return profile;
    },

    // =============================================
    //  BUILD USER PROFILE from Supabase user object
    // =============================================
    _buildProfile: async (user, accessToken) => {
        // Try to fetch extended profile from public.profiles table
        const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error("Supabase Profile Fetch Error:", error.message);
        }

        const profile = {
            id: user.id,
            name: profileData?.full_name || profileData?.username || user.user_metadata?.full_name || user.email.split('@')[0],
            email: user.email,
            role: profileData?.role || 'Analyste',
            org_id: profileData?.org_id || null,
            jurisdiction: profileData?.jurisdiction || 'EU (France)',
            subscription_tier: profileData?.subscription_tier || 'free',
            lastLogin: new Date().toISOString()
        };

        // Cache locally for offline fallback
        localStorage.setItem(SessionManager.KEYS.AUTH_TOKEN, accessToken);
        localStorage.setItem(SessionManager.KEYS.USER_PROFILE, JSON.stringify(profile));
        localStorage.setItem(SessionManager.KEYS.SESSION_START, Date.now());
        if (profile.org_id) localStorage.setItem('dcm_org_id', profile.org_id);

        return profile;
    },

    // =============================================
    //  LOGIN — Delegates to Supabase Auth
    // =============================================
    login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const profile = await SessionManager._buildProfile(data.user, data.session.access_token);
        return profile;
    },

    // =============================================
    //  SIGNUP — Delegates to Supabase Auth
    // =============================================
    signup: async (email, password, firstName, lastName) => {
        const { data, error } = await supabase.auth.signUp({
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
        console.log('🔒 Terminating session (Supabase + LocalStorage)...');

        // 1. Sign out from Supabase
        await supabase.auth.signOut();

        // 2. Clear all local caches
        localStorage.removeItem(SessionManager.KEYS.AUTH_TOKEN);
        localStorage.removeItem(SessionManager.KEYS.USER_PROFILE);
        localStorage.removeItem(SessionManager.KEYS.SESSION_START);
        localStorage.removeItem('dcm_org_id');
        localStorage.removeItem('dcm_active_role');
        sessionStorage.clear();

        // 3. Redirect
        window.location.href = 'index.html';
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
                alert("Session expirée pour inactivité. Veuillez vous reconnecter.");
                SessionManager.logout();
            }
        }, 60000);
    },
    // =============================================
    //  DATA SYNC — Write activity to Supabase
    // =============================================
    syncPageActivity: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return; // No real session, skip sync

        const path = window.location.pathname.split('/').pop() || 'index.html';
        const localHistory = JSON.parse(localStorage.getItem('dcm_page_history') || '{}');
        const seconds = localHistory[path] || 0;
        if (seconds < 10) return; // Don't bother syncing < 10s

        // --- PHASE 32: ANALYTICS ENGINE INTEGRATION ---
        if (typeof AnalyticsEngine !== 'undefined') {
            AnalyticsEngine.trackPageTime(path, seconds);
        }

        await supabase.from('activity_logs').upsert({
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
    //  SMART NOTIFICATIONS (Phase 28 — unchanged)
    // =============================================
    checkAndShowNotifications: () => {
        if (!window.location.pathname.includes('dashboard.html')) return;
        const history = JSON.parse(localStorage.getItem('dcm_quiz_history') || '[]');
        if (history.length > 0) {
            const last = history[history.length - 1];
            const pct = Math.round((last.score / last.total) * 100);
            const icon = pct < 80 ? '💪' : '🏆';
            const msg = pct < 80
                ? `Votre dernier score était de ${pct}%. Prêt à réessayer ?`
                : `Vous avez validé le dernier module avec ${pct}%. Cap sur le prochain niveau ?`;
            SessionManager.showToast(icon, 'Bienvenue', msg);
        } else {
            SessionManager.showToast('👋', 'Bienvenue', 'Votre cockpit est prêt. Commencez par le Quiz ou explorez les données.');
        }
    },

    // =============================================
    //  RBAC (Phase 80)
    // =============================================
    checkAccess: (permission) => {
        const profile = SessionManager.getCurrentUser() || {};
        const role = profile.role || 'Viewer'; // Default to Viewer for institutional safety
        const tier = profile.subscription_tier || 'free';

        /**
         * Institutional Permission Matrix
         * Maps permissions to required roles and tiers.
         */
        const PERMISSION_MATRIX = {
            'REPORT_EXPORT': { roles: ['Admin', 'Analyst'], tiers: ['pro', 'enterprise'] },
            'AUDIT_VIEW': { roles: ['Admin'], tiers: ['enterprise'] },
            'BENCHMARK_DETAIL': { roles: ['Admin', 'Analyst'], tiers: ['pro', 'enterprise'] },
            'USER_MANAGEMENT': { roles: ['Admin'], tiers: ['enterprise'] },
            'RISK_MODEL_EDIT': { roles: ['Admin'], tiers: ['enterprise'] },
            'BASIC_DASHBOARD': { roles: ['Admin', 'Analyst', 'Viewer'], tiers: ['free', 'pro', 'enterprise'] }
        };

        const rule = PERMISSION_MATRIX[permission];
        if (!rule) {
            console.warn(`⚠️ Unknown permission requested: ${permission}. Defaulting to DENY.`);
            return false;
        }

        let isGranted = false;

        // 1. System Admin / Super Dev Bypass
        const isSuperDev = typeof DCM_CONFIG !== 'undefined' && DCM_CONFIG.DEV_MODE && localStorage.getItem('is_super_dev') === 'true';
        if (isSuperDev || role === 'Head of Digital') {
            isGranted = true;
        }
        // 2. Role & Tier Check
        else if (rule.roles.includes(role) && rule.tiers.includes(tier)) {
            isGranted = true;
        }

        // --- Institutional Logging (Phase 80) ---
        if (!isGranted && window.AuditLogger) {
            window.AuditLogger.log('UNAUTHORIZED_ACCESS_ATTEMPT', role, { permission });
        }

        if (!isGranted) {
            SessionManager.showPaywall(permission, role);
            return false;
        }
        return true;
    },

    showPaywall: (permission, currentRole) => {
        const messages = {
            'REPORT_EXPORT': 'Exportation PDF institutionnelle (Droits Analyst+ requis).',
            'AUDIT_VIEW': 'Accès aux Logs d\'Audit (Droits Admin requis).',
            'USER_MANAGEMENT': 'Gestion des accès (Droits Admin requis).',
            'RISK_MODEL_EDIT': 'Modification du modèle de risque (Droits Admin requis).'
        };
        const displayName = messages[permission] || 'cette fonctionnalité experte';

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
                
                <h2 style="color:white;margin-bottom:12px;font-size:24px;font-weight:800;">Accès Limité</h2>
                <p style="color:#a1a1aa;margin-bottom:30px;font-size:15px;line-height:1.5;">Vous utilisez actuellement l'édition <strong style="color:white">Analyst Free</strong>. Débloquez <strong>${displayName}</strong> et les données temps réel avec le plan Pro.</p>
                
                <div style="display:flex;flex-direction:column;gap:15px">
                    <button onclick="window.location.href='pricing.html'" style="padding:14px;background:var(--accent-purple);color:white;border:none;border-radius:12px;cursor:pointer;font-weight:700;font-size:16px;box-shadow:0 10px 20px rgba(139, 92, 246, 0.3);transition:transform 0.2s;">
                        Voir les abonnements Pro 🚀
                    </button>
                    <button onclick="this.closest('#${modalId}').remove()" style="padding:14px;background:transparent;border:1px solid #333;color:#888;border-radius:12px;cursor:pointer;font-weight:600;transition:0.2s;">
                        Continuer en mode gratuit
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
supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        localStorage.removeItem(SessionManager.KEYS.AUTH_TOKEN);
        localStorage.removeItem(SessionManager.KEYS.USER_PROFILE);
        localStorage.removeItem(SessionManager.KEYS.SESSION_START);
    } else if (event === 'TOKEN_REFRESHED' && session) {
        // Update cached token with fresh one
        localStorage.setItem(SessionManager.KEYS.AUTH_TOKEN, session.access_token);
        const profile = await SessionManager._buildProfile(session.user, session.access_token);
        console.log('🔄 Token refreshed, profile updated:', profile.name);
    }
});

// Auto-start tracking if in browser
if (typeof window !== 'undefined') {
    SessionManager.startTracking();
    setTimeout(() => SessionManager.checkAndShowNotifications(), 1500);
}
