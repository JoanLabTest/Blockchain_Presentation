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

        // 3. Check Session

        // DEV MODE BYPASS (Only if explicitly activated via SATOSHI password)
        if (typeof DCM_CONFIG !== 'undefined' && DCM_CONFIG.DEV_MODE && localStorage.getItem('is_super_dev') === 'true') {
            console.warn("AuthManager: 🚧 SUPER DEV MODE ACTIVE - Simulating Super Dev User");
            currentUser = {
                id: 'super-dev-id',
                email: 'superdev@dcm-hub.com',
                role: 'admin',
                user_metadata: {
                    first_name: "Super",
                    last_name: "Dev",
                    full_access: true,
                    levels_unlocked: true,
                    certificates_ready: true
                }
            };
            // Mock getSessionToken for agents
            AuthManager.getSessionToken = async () => "mock-dev-token";
        } else {
            const { data: { session } } = await supabaseClient.auth.getSession();
            currentUser = session?.user || null;

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

                const name = currentUser.user_metadata?.first_name || currentUser.email.split('@')[0];

                if (userDisplay) {
                    userDisplay.innerText = name;
                }

                // Handle Dashboard Welcome Title if present
                const welcomeTitle = document.getElementById('welcome-title');
                if (welcomeTitle) {
                    welcomeTitle.innerText = `Bienvenue, ${name} !`;
                }
            } else {
                authBtnPlaceholder.innerHTML = '<i class="fas fa-user"></i> Connexion';
                authBtnPlaceholder.href = "login.html";
                authBtnPlaceholder.onclick = null;

                if (userDisplay) {
                    userDisplay.innerText = "Invité";
                }
            }
        }
    }

    async function signOut(e) {
        if (e) e.preventDefault();
        const { error } = await supabaseClient.auth.signOut();
        if (!error) {
            window.location.href = "index.html"; // Go home after logout
        } else {
            console.error("Logout Error:", error);
            alert("Erreur lors de la déconnexion");
        }
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
