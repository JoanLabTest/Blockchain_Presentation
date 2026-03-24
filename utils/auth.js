// AUTHENTICATION MANAGER
// Handles session checks, redirects, and UI updates

const AuthManager = (() => {
    let currentUser = null;
    let supabaseClient = null;

    async function init() {
        console.log("AuthManager: Initializing...");

        // 1. Check Config
        if (typeof DCM_CONFIG === 'undefined' || typeof supabase === 'undefined') {
            console.error("AuthManager Error: Config or Supabase SDK missing");
            return;
        }

        // 2. Init Supabase
        // Ensure supabaseClient is ready (might be already init in another script, but let's be safe)
        if (!supabaseClient) {
            supabaseClient = supabase.createClient(DCM_CONFIG.supabaseUrl, DCM_CONFIG.supabaseKey);
        }

        // 3. Check Session (Supabase first)
        const { data: { session } } = await supabaseClient.auth.getSession();
        let sessionUser = session?.user || null;

        // GUEST MODE FALLBACK
        if (!sessionUser) {
            const guestProfile = localStorage.getItem('dcm_user_profile');
            if (guestProfile) {
                try {
                    const profile = JSON.parse(guestProfile);
                    // Standardize guest as a user object for internal logic
                    sessionUser = {
                        id: 'guest-' + (profile.name || 'user'),
                        email: 'guest@dcm-institute.com',
                        user_metadata: {
                            full_name: profile.name || 'Invité',
                            first_name: profile.name || 'Invité',
                            role: profile.role || 'Visiteur'
                        },
                        is_guest: true
                    };
                    console.log("AuthManager: Guest profile detected in localStorage");
                } catch (e) {
                    console.warn("AuthManager: Failed to parse guest profile", e);
                }
            }
        }

        let isSuperDev = (typeof DCM_CONFIG !== 'undefined' && DCM_CONFIG.DEV_MODE && localStorage.getItem('is_super_dev') === 'true');

        // MASTER ACCOUNT BYPASS
        if (session && session.user && session.user.email === 'joanlyczak@gmail.com') {
            isSuperDev = true;
        }

        // DEV MODE / MASTER BYPASS
        if (isSuperDev) {
            console.warn("AuthManager: 🚧 SUPER DEV MODE / MASTER ACTIVE - Simulating Full Access");
            currentUser = {
                id: session?.user?.id || 'super-dev-id',
                email: session?.user?.email || 'superdev@dcm-hub.com',
                role: 'admin',
                app_metadata: { role: 'admin' },
                user_metadata: {
                    first_name: session?.user?.user_metadata?.first_name || "Super",
                    last_name: session?.user?.user_metadata?.last_name || "Dev",
                    full_access: true,
                    levels_unlocked: true,
                    certificates_ready: true,
                    role: 'admin'
                }
            };

            // Force localStorage state so the UI (TenantManager, SegmentManager) fully unlocks
            localStorage.setItem('dcm_user_role', 'ADMIN');
            localStorage.setItem('dcm_active_role', 'enterprise');

            // Mock getSessionToken for agents
            AuthManager.getSessionToken = async () => session ? session.access_token : "mock-dev-token";
        } else {
            currentUser = sessionUser;

            // Standard getSessionToken
            AuthManager.getSessionToken = async () => {
                const { data: { session } } = await supabaseClient.auth.getSession();
                return session ? session.access_token : null;
            };
        }

        console.log("AuthManager: User is", currentUser ? "Logged In" : "Guest");

        // 4. Handle Page Protection
        handleRouteGuard();

        // 5. Update UI (Navbar, etc.)
        updateUI();

        // 6. Listen for Auth Changes
        supabaseClient.auth.onAuthStateChange((event, session) => {
            console.log("AuthManager: Event", event);

            // Bypass listener in DEV_MODE to prevent overwriting simulated user
            if (typeof DCM_CONFIG !== 'undefined' && DCM_CONFIG.DEV_MODE) {
                console.log("AuthManager: Listener bypassed (DEV_MODE active)");
                return;
            }

            currentUser = session?.user || null;
            handleRouteGuard();
            updateUI();
        });
    }

    function handleRouteGuard() {
        // Define protected pages
        const protectedPages = ['dashboard.html', 'rwa.html', 'legal_pilot.html']; // Minimal protection first

        // Check current page
        const path = window.location.pathname;
        const page = path.split("/").pop().split("?")[0]; // Remove query params

        const isProtected = protectedPages.some(p => page === p);

        if (isProtected && !currentUser) {
            console.warn("AuthManager: Unauthorized access to " + page);
            // Save redirect URL
            sessionStorage.setItem('redirect_after_login', window.location.href);
            window.location.href = "login.html";
        }
    }

    function updateUI() {
        // Find existing Auth Button or a specific container
        const authBtnPlaceholder = document.getElementById('nav-auth-btn');
        const userDisplay = document.getElementById('user-display');

        if (authBtnPlaceholder) {
            if (currentUser) {
                authBtnPlaceholder.innerHTML = '<i class="fas fa-sign-out-alt"></i> Déconnexion';
                authBtnPlaceholder.onclick = signOut;
                authBtnPlaceholder.href = "#"; // Prevent navigation

                const userMeta = currentUser?.user_metadata || {};
                const name = userMeta.first_name || userMeta.full_name || currentUser.email.split('@')[0];

                if (userDisplay) {
                    userDisplay.innerText = name;
                    userDisplay.style.display = 'inline-block';
                }

                // Handle Dashboard Welcome Title if present
                const welcomeTitle = document.getElementById('welcome-title');
                if (welcomeTitle) {
                    welcomeTitle.innerText = `Welcome, ${name}!`;
                    if (document.documentElement.lang === 'fr') {
                        welcomeTitle.innerText = `Bienvenue, ${name} !`;
                    }
                }
            } else {
                authBtnPlaceholder.innerHTML = '<i class="fas fa-user"></i> Connexion';
                authBtnPlaceholder.href = "login.html";
                authBtnPlaceholder.onclick = null;

                if (userDisplay) {
                    userDisplay.innerText = "";
                    userDisplay.style.display = 'none';
                }
            }
        }
    }

    async function signOut(e) {
        if (e) e.preventDefault();
        
        console.log("AuthManager: Signing out...");

        // 1. Supabase Sign Out (if client exists)
        if (supabaseClient) {
            try {
                await supabaseClient.auth.signOut();
            } catch (err) {
                console.warn("Supabase signOut error (likely already signed out or CORS):", err);
            }
        }
        
        // 2. Clear DCM session markers (Always clear local state)
        localStorage.removeItem('dcm_auth_token');
        localStorage.removeItem('dcm_user_profile');
        localStorage.removeItem('is_super_dev');
        
        // Redirect home
        window.location.href = "index.html"; 
    }

    // Public API
    return {
        init: init,
        getUser: () => currentUser,
        signOut: signOut
    };
})();

// Auto-init only after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a tiny bit to ensure supabase script is loaded if deferred
    if (typeof supabase !== 'undefined') {
        AuthManager.init();
    } else {
        // Retry once after 500ms
        setTimeout(() => {
            if (typeof supabase !== 'undefined') AuthManager.init();
        }, 500);
    }
});
