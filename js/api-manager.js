/**
 * DCM Core API Manager (Phase 113)
 * Handles client-side API Key generation and management UI.
 */

const ApiManager = {
    // Session-based state
    keys: [],

    init: function() {
        console.log("🔑 API Manager Initialized");
        this.setupEventListeners();
    },

    setupEventListeners: function() {
        const genBtn = document.getElementById('btn-generate-key');
        if (genBtn) {
            genBtn.addEventListener('click', () => this.generateNewKey());
        }
    },

    /**
     * Generates a new cryptographically secure API Key (dcm_sk_live_...)
     * In a production environment, only the 'dcm_pk' is shown again.
     */
    generateNewKey: async function() {
        // Institutional Check
        const userTier = localStorage.getItem('dcm_user_tier') || 'basic';
        if (userTier !== 'institutional') {
            alert("⚠️ API Key generation is restricted to Institutional Tier clients (€499/mo).");
            return;
        }

        // Standard dcm_sk_ pattern simulation (Phase 113)
        const array = new Uint8Array(24);
        window.crypto.getRandomValues(array);
        const randomString = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        const newKey = `dcm_sk_live_${randomString}`;

        this.showKeyModal(newKey);
        
        // Audit Event (Phase 116 Hook)
        if (window.AuditLogger) {
            window.AuditLogger.log('API_KEY_GENERATED', { 
                key_prefix: 'dcm_sk_live_...', 
                scope: ['read:registry', 'read:stablecoins'] 
            });
        }
    },

    showKeyModal: function(key) {
        // Create a secure modal display
        const modalHtml = `
            <div id="key-modal-overlay" style="position:fixed; inset:0; background:rgba(2,6,23,0.9); backdrop-filter:blur(8px); z-index:9999; display:flex; align-items:center; justify-content:center;">
                <div style="background:#0f172a; border:1px solid rgba(251,191,36,0.2); border-radius:12px; padding:32px; max-width:500px; width:90%; position:relative;">
                    <h3 style="color:#fbbf24; margin-bottom:16px;"><i class="fas fa-shield-check"></i> New API Key Generated</h3>
                    <p style="font-size:13px; color:#94a3b8; margin-bottom:24px;">This key will only be shown <strong>ONCE</strong>. Store it securely in your secrets manager.</p>
                    
                    <div style="background:#020617; border:1px solid #1e293b; border-radius:6px; padding:12px; position:relative; overflow:hidden;">
                        <code id="new-key-value" style="color:#10b981; font-family:'JetBrains Mono',monospace; font-size:12px; word-break:break-all;">${key}</code>
                        <button onclick="navigator.clipboard.writeText('${key}'); this.innerText='COPIED!'" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); background:#fbbf24; color:#020617; border:none; border-radius:4px; padding:4px 8px; font-size:10px; font-weight:700; cursor:pointer;">COPY</button>
                    </div>

                    <button onclick="document.getElementById('key-modal-overlay').remove()" style="margin-top:32px; width:100%; background:#1e293b; color:white; border:1px solid #334155; padding:10px; border-radius:6px; cursor:pointer; font-weight:600;">I Have Stored This Key</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
};

// Start logic
document.addEventListener('DOMContentLoaded', () => ApiManager.init());
