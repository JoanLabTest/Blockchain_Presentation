// SHARED DEV MODE UTILS
// Handles Dev Access Button, Password Modal, and Unlock Logic across all pages.

const DevMode = {
    init: function () {
        // 1. Inject Styles if not present
        if (!document.getElementById('dev-mode-css')) {
            const link = document.createElement('link');
            link.id = 'dev-mode-css';
            link.rel = 'stylesheet';
            link.href = 'styles/dev_mode.css';
            document.head.appendChild(link);
        }

        // 2. Inject HTML UI
        this.injectUI();

        // 3. Bind Events
        this.bindEvents();
    },

    injectUI: function () {
        const uiHTML = `
            <button id="devModeBtn" class="dev-mode-btn">
                <i class="fas fa-terminal"></i> Dev Access
            </button>

            <div id="devModal" class="dev-modal-overlay">
                <div class="dev-modal-content">
                    <h3 style="color:#3b82f6; margin-bottom:10px;">MODE DÉVELOPPEUR</h3>
                    <p style="font-size:12px; color:#94a3b8;">Accès restreint (Admin/QA)</p>
                    
                    <input type="password" id="devPasswordInput" class="dev-modal-input" placeholder="Mot de passe">
                    
                    <button id="devUnlockBtn" class="dev-modal-btn">DÉVERROUILLÉ</button>
                    
                    <button id="devResetBtn" class="dev-reset-btn">
                        <i class="fas fa-trash"></i> Réinitialiser Progression
                    </button>

                    <button id="devCloseBtn" style="width:100%; margin-top:10px; background:transparent; border:none; color:#64748b; cursor:pointer;">Annuler</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', uiHTML);
    },

    bindEvents: function () {
        const btn = document.getElementById('devModeBtn');
        const modal = document.getElementById('devModal');
        const close = document.getElementById('devCloseBtn');
        const unlock = document.getElementById('devUnlockBtn');
        const reset = document.getElementById('devResetBtn');
        const input = document.getElementById('devPasswordInput');

        if (btn) btn.onclick = () => {
            modal.style.display = 'flex';
            input.focus();
        };

        if (close) close.onclick = () => modal.style.display = 'none';

        if (unlock) unlock.onclick = () => this.checkPassword();

        if (reset) reset.onclick = () => this.resetProgress();

        if (input) {
            input.onkeypress = (e) => {
                if (e.key === 'Enter') this.checkPassword();
            };
        }
    },

    checkPassword: function () {
        const input = document.getElementById('devPasswordInput');
        const val = input.value;

        if (val.toUpperCase() === "SATOSHI") {
            // MASTER UNLOCK
            localStorage.setItem('quiz_metal_1', 'bronze');
            localStorage.setItem('quiz_metal_2', 'silver');
            localStorage.setItem('quiz_metal_3', 'gold');
            localStorage.setItem('quiz_lvl4_unlocked', 'true');
            // Ensure Rank 4 is set to something valid so Diploma works immediately
            if (!localStorage.getItem('quiz_rank_4')) {
                localStorage.setItem('quiz_rank_4', 'Platinum');
            }

            // Unlock Guide Badges
            localStorage.setItem('badge_explorer', 'true');
            localStorage.setItem('badge_listener', 'true');
            localStorage.setItem('badge_strategist', 'true');

            // Specific page handling
            if (window.revealHeadOf) window.revealHeadOf(); // quiz.html specific

            alert("🔓 DEV MODE ACTIVÉ : Tout est débloqué (Passeport, Quiz, Badges).");
            document.getElementById('devModal').style.display = 'none';
            location.reload();
        } else {
            alert("Accès refusé.");
            input.value = "";
        }
    },

    resetProgress: function () {
        if (confirm("⚠️ Êtes-vous sûr de vouloir tout réinitialiser ? Cette action est irréversible.")) {
            localStorage.clear();
            alert("Progression réinitialisée.");
            location.reload();
        }
    },

    toggleModal: function () {
        const modal = document.getElementById('devModal');
        if (modal) {
            if (modal.style.display === 'flex') modal.style.display = 'none';
            else {
                modal.style.display = 'flex';
                const input = document.getElementById('devPasswordInput');
                if (input) input.focus();
            }
        }
    }
};

// Global Access
window.toggleDevMode = () => DevMode.toggleModal();

// Auto-init logic (Wait for DOM)
document.addEventListener('DOMContentLoaded', () => {
    DevMode.init();
});
