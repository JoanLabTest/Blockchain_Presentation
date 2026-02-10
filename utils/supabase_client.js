// SUPABASE CLIENT INITIALIZATION
// Requires: <script src="https://unpkg.com/@supabase/supabase-js@2"></script> in HTML

const SupabaseService = (() => {
    let client = null;

    function init() {
        if (client) return client;

        if (!window.DCM_CONFIG || !DCM_CONFIG.supabaseUrl || !DCM_CONFIG.supabaseKey) {
            console.warn("Supabase credentials missing in DCM_CONFIG.");
            return null;
        }

        if (!window.supabase) {
            console.error("Supabase SDK not loaded. Add script tag.");
            return null;
        }

        // Initialize
        const { createClient } = window.supabase;
        client = createClient(DCM_CONFIG.supabaseUrl, DCM_CONFIG.supabaseKey);
        console.log("Supabase Client Initialized");
        return client;
    }

    // --- HELPER METHODS ---

    async function recordQuizResult(level, score, total, passed, metadata = {}) {
        const sb = init();
        if (!sb) return { error: "Supabase not configured" };

        const { data: { user } } = await sb.auth.getUser();

        const payload = {
            user_id: user ? user.id : null,
            session_id: localStorage.getItem('dcm_session_id') || 'anon',
            level: level,
            score: score,
            total_questions: total,
            passed: passed,
            metadata: metadata
        };

        const { data, error } = await sb.from('quiz_results').insert([payload]);
        if (error) console.error("Supabase Error:", error);
        return { data, error };
    }

    async function unlockBadges(badges) {
        // Implementation for future
    }

    return {
        init,
        recordQuizResult
    };
})();
