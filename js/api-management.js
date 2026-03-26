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
                key_hash: keyHash
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
            .update({ revoked: true })
            .eq('id', id);

        if (error) {
            console.error('Error revoking API key:', error);
            return false;
        }
        return true;
    }
};

window.APIManagement = APIManagement;
