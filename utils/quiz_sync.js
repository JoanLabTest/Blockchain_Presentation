/**
 * QUIZ SYNC MANAGER
 * Handles synchronization between LocalStorage (UI) and Supabase (Cloud)
 */

window.QuizSync = (() => {
    let client = null;

    function init() {
        if (typeof supabase === 'undefined' || typeof DCM_CONFIG === 'undefined') {
            console.error("QuizSync: Supabase dependencies missing");
            return;
        }

        // Singleton Client check
        if (!client) {
            client = supabase.createClient(DCM_CONFIG.supabaseUrl, DCM_CONFIG.supabaseAnonKey);
        }
        console.log("QuizSync: Ready ☁️");

        // Auto-sync on load if user is logged in
        syncFromCloud();
    }

    /**
     * Save a new result to Supabase
     */
    async function saveResult(level, score, totalQuestions, passed, rankName) {
        if (!client) init();

        const { data: { session } } = await client.auth.getSession();

        if (!session) {
            console.warn("QuizSync: User not logged in. Result saved LOCALLY only.");
            return;
        }

        const userId = session.user.id;

        // Normalized Rank (lowercase for DB consistency)
        let dbRank = rankName ? rankName.toLowerCase() : (passed ? 'passed' : 'failed');

        // Map UI Rank Names to Clean Keys
        if (dbRank.includes("bronze")) dbRank = "bronze";
        if (dbRank.includes("argent")) dbRank = "silver";
        if (dbRank.includes("or")) dbRank = "gold";
        if (dbRank.includes("iridescent")) dbRank = "iridescent";
        if (dbRank.includes("crimson")) dbRank = "crimson";
        if (dbRank.includes("diamond")) dbRank = "diamond";
        if (dbRank.includes("platinum")) dbRank = "platinum";

        const payload = {
            user_id: userId,
            level: level,
            score: score,
            total_questions: totalQuestions,
            passed: passed,
            rank: dbRank,
            created_at: new Date().toISOString()
        };

        console.log("QuizSync: Saving to Supabase...", payload);

        const { data, error } = await client
            .from('quiz_results')
            .insert([payload]);

        if (error) {
            console.error("QuizSync Error:", error);
        } else {
            console.log("QuizSync: Saved Successfully ✅");
        }
    }

    /**
     * Load history from Cloud and update LocalStorage (Sync)
     */
    async function syncFromCloud() {
        if (!client) return;

        const { data: { session } } = await client.auth.getSession();
        if (!session) return;

        console.log("QuizSync: Fetching cloud history...");

        const { data, error } = await client
            .from('quiz_results')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: true }); // Process oldest to newest

        if (error) {
            console.error("QuizSync Fetch Error:", error);
            return;
        }

        if (data && data.length > 0) {
            // Replay logic to sync LocalStorage
            let changes = 0;

            data.forEach(row => {
                // If passed, unlock corresponding metal
                if (row.passed) {
                    if (row.level === 1 && !localStorage.getItem('quiz_metal_1')) {
                        localStorage.setItem('quiz_metal_1', 'bronze'); changes++;
                    }
                    if (row.level === 2 && !localStorage.getItem('quiz_metal_2')) {
                        localStorage.setItem('quiz_metal_2', 'silver'); changes++;
                    }
                    if (row.level === 3 && !localStorage.getItem('quiz_metal_3')) {
                        localStorage.setItem('quiz_metal_3', 'gold'); changes++;
                    }

                    // Head Of Unlock logic (if Gold was passed with high score)
                    if (row.level === 3 && (row.score / row.total_questions) >= 0.9) {
                        localStorage.setItem('quiz_lvl4_unlocked', 'true'); changes++;
                    }
                }

                if (row.level === 4 && row.rank && row.rank !== 'failed') {
                    // Capitalize for UI consistency
                    const uiRank = row.rank.charAt(0).toUpperCase() + row.rank.slice(1);
                    localStorage.setItem('quiz_rank_4', uiRank); changes++;
                }
            });

            if (changes > 0) {
                console.log(`QuizSync: Synced ${changes} items from Cloud. Refreshing UI...`);
                // Ideally trigger a re-render, but reload is safer for now if significant changes
                // location.reload(); // Can be annoying, let's just log for now
            }
        }
    }

    return {
        init,
        saveResult
    };
})();

// Auto-init logic
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Config
    if (typeof DCM_CONFIG !== 'undefined') {
        setTimeout(QuizSync.init, 500);
    }
});
