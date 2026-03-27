/**
 * API MANAGEMENT MODULE (Phase 111)
 * Handles client-side API key generation, hashing, and Supabase interaction.
 */

const APIManagement = {

    /**
     * Generate a new API key with prefix and random entropy.
     * Format: prefix_randomstring
     */
    generateRawKey: (prefix = 'dcm_live_') => {
        const entropy = Array.from(crypto.getRandomValues(new Uint8Array(24)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        return `${prefix}${entropy}`;
    },

    /**
     * Hash the key using SHA-256 for secure storage.
     */
    hashKey: async (rawKey) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(rawKey);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    /**
     * Create a new API key in Supabase.
     */
    createKey: async (name, prefix = 'dcm_live_') => {
        const rawKey = APIManagement.generateRawKey(prefix);
        const keyHash = await APIManagement.hashKey(rawKey);
        
        const sb = window.supabase;
        const profile = window.SessionManager.getCurrentUser();
        
        if (!sb || !profile) throw new Error('Auth session missing');

        const { data, error } = await sb
            .from('api_keys')
            .insert([{
                user_id: profile.id,
                org_id: profile.org_id,
                name: name,
                prefix: prefix,
                hashed_key: keyHash,
                status: 'active'
            }])
            .select()
            .single();

        if (error) throw error;

        // RETURN THE RAW KEY ONLY ONCE (User must save it)
        return { ...data, raw_key: rawKey };
    },

    /**
     * Fetch all keys for the current user.
     */
    getKeys: async () => {
        const sb = window.supabase;
        if (!sb) return [];

        const { data, error } = await sb
            .from('api_keys')
            .select('*')
            .eq('revoked', false)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching API keys:', error);
            return [];
        }
        return data;
    },

    /**
     * Revoke an API key.
     */
    revokeKey: async (id) => {
        const sb = window.supabase;
        if (!sb) return false;

        const { error } = await sb
            .from('api_keys')
            .update({ status: 'revoked' })
            .eq('id', id);

        if (error) {
            console.error('Error revoking API key:', error);
            return false;
        }
        return true;
    },

    /**
     * UI Integration: Show secure modal with the raw key.
     */
    showKeyModal: (rawKey) => {
        const modalHtml = `
            <div id="api-key-modal-overlay" style="position:fixed; inset:0; background:rgba(2,6,23,0.92); backdrop-filter:blur(10px); z-index:9999; display:flex; align-items:center; justify-content:center;">
                <div style="background:#0f172a; border:2px solid #fbbf24; border-radius:16px; padding:35px; max-width:550px; width:100%; position:relative; box-shadow:0 0 50px rgba(251,191,36,0.2);">
                    <h3 style="color:#fbbf24; margin-bottom:15px; font-size:20px;"><i class="fas fa-shield-check"></i> Credential Generated Successfully</h3>
                    <p style="font-size:13px; color:#94a3b8; margin-bottom:25px; line-height:1.6;">Please save this API key now. For security reasons, <strong>we cannot show it to you again</strong> after you close this window.</p>
                    
                    <div style="background:#020617; border:1px solid #1e293b; border-radius:8px; padding:15px; position:relative; display:flex; gap:10px; align-items:center;">
                        <code style="color:#10b981; font-family:'JetBrains Mono',monospace; font-size:12px; flex:1; word-break:break-all;">${rawKey}</code>
                        <button onclick="navigator.clipboard.writeText('${rawKey}'); this.innerHTML='<i class=\'fas fa-check\'></i>'" style="background:#fbbf24; color:#020617; border:none; border-radius:6px; padding:8px 12px; cursor:pointer;" title="Copy to clipboard">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>

                    <button onclick="document.getElementById('api-key-modal-overlay').remove(); window.DashboardEngine.loadApiTab();" 
                        style="margin-top:30px; width:100%; background:var(--accent-blue); color:white; border:none; padding:12px; border-radius:8px; cursor:pointer; font-weight:700;">
                        I have saved this key safely
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    init: () => {
        const btn = document.getElementById('btn-generate-key');
        if (btn) {
            btn.onclick = async () => {
                const name = prompt("Enter a label for this key:", "Institutional Key");
                if (!name) return;
                
                try {
                    const result = await APIManagement.createKey(name);
                    APIManagement.showKeyModal(result.raw_key);
                } catch (e) {
                    console.error('API Key generation failed:', e);
                    alert("Error: Only Institutional tier users can generate keys.");
                }
            };
        }
    }
};

window.APIManagement = APIManagement;
document.addEventListener('DOMContentLoaded', () => APIManagement.init());
