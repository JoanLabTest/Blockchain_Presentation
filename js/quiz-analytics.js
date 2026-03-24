/**
 * QUIZ ANALYTICS ENGINE — v1.0 (Phase 7: Analytics & Polish)
 * Tracks user performance, timing, and engagement for local and institutional reporting.
 * Persists data to localStorage for persistence across sessions.
 */

window.QuizAnalytics = {
    STORAGE_KEY: 'dcm_quiz_analytics',

    /**
     * Records a completed question attempt.
     * @param {string} levelKey - e.g., 'student', 'pro', 'super'
     * @param {number} questionIndex - Index of the question
     * @param {boolean} isCorrect - Whether the answer was correct
     * @param {number} timeSpentSeconds - Time taken to answer
     * @param {string} theme - Category of the question (if available)
     */
    trackAttempt: (levelKey, questionIndex, isCorrect, timeSpentSeconds, theme = 'General') => {
        const data = QuizAnalytics._loadData();

        const entry = {
            timestamp: new Date().toISOString(),
            level: levelKey,
            question: questionIndex,
            correct: isCorrect,
            time: timeSpentSeconds,
            theme: theme
        };

        data.attempts.push(entry);
        QuizAnalytics._saveData(data);
        console.log(`📊 Analytics: Tracked attempt for level [${levelKey}] question [${questionIndex}]`);
    },

    /**
     * Records a full quiz session completion.
     */
    trackSessionComplete: (levelKey, score, total, durationSeconds) => {
        const data = QuizAnalytics._loadData();

        const session = {
            timestamp: new Date().toISOString(),
            level: levelKey,
            score: score,
            total: total,
            duration: durationSeconds,
            pct: Math.round((score / total) * 100)
        };

        data.sessions.push(session);
        QuizAnalytics._saveData(data);
        console.log(`🏆 Analytics: Quiz session complete [${levelKey}] - ${score}/${total}`);

        // Sync to Supabase
        if (window.supabase) {
            window.supabase.auth.getSession().then(({ data: { session: sbSession } }) => {
                if (sbSession && sbSession.user) {
                    window.supabase.from('quiz_results').insert([{
                        user_id: sbSession.user.id,
                        quiz_type: String(levelKey),
                        score_percent: session.pct,
                        time_taken_seconds: durationSeconds,
                        passed: session.pct >= 80
                    }]).then(({error}) => {
                        if (error) console.error('Quiz sync error:', error);
                        else console.log('✅ Quiz session synced to Supabase');
                    });
                }
            });
        }
    },

    /**
     * Retrieves aggregated data for the Dashboard charts.
     */
    getAggregatedStats: () => {
        const data = QuizAnalytics._loadData();
        if (data.attempts.length === 0) return null;

        const stats = {
            totalAttempts: data.attempts.length,
            overallAccuracy: 0,
            avgTimePerQuestion: 0,
            themePerformance: {},
            sessionHistory: data.sessions
        };

        let totalCorrect = 0;
        let totalTime = 0;

        data.attempts.forEach(a => {
            if (a.correct) totalCorrect++;
            totalTime += a.time;

            if (!stats.themePerformance[a.theme]) {
                stats.themePerformance[a.theme] = { correct: 0, total: 0 };
            }
            stats.themePerformance[a.theme].total++;
            if (a.correct) stats.themePerformance[a.theme].correct++;
        });

        stats.overallAccuracy = Math.round((totalCorrect / data.attempts.length) * 100);
        stats.avgTimePerQuestion = Math.round(totalTime / data.attempts.length);

        return stats;
    },

    /**
     * Returns a consolidated stats object for the Dashboard.
     * Aliased/unified format expected by DashboardEngine.renderQuizAnalytics.
     */
    getGlobalStats: () => {
        const data = QuizAnalytics._loadData();
        const total = data.sessions.length;
        const passed = data.sessions.filter(s => s.pct >= 80).length;
        const avgScore = total > 0
            ? Math.round(data.sessions.reduce((acc, s) => acc + s.pct, 0) / total)
            : 0;

        let totalTime = 0;
        let attempts = data.attempts.length;
        const themes = {};

        data.attempts.forEach(a => {
            totalTime += a.time;
            if (!themes[a.theme]) themes[a.theme] = { correct: 0, total: 0 };
            themes[a.theme].total++;
            if (a.correct) themes[a.theme].correct++;
        });

        return {
            totalSessions: total,
            passedSessions: passed,
            avgScore,
            avgTimePerQuestion: attempts > 0 ? Math.round(totalTime / attempts) : 0,
            themes
        };
    },

    /**
     * Internal: Load from Storage
     */
    _loadData: () => {
        const raw = localStorage.getItem(QuizAnalytics.STORAGE_KEY);
        if (!raw) return { attempts: [], sessions: [] };
        try {
            return JSON.parse(raw);
        } catch (e) {
            console.error('Analytics: Failed to parse storage data', e);
            return { attempts: [], sessions: [] };
        }
    },

    /**
     * Internal: Save to Storage
     */
    _saveData: (data) => {
        // Keep only last 500 attempts to avoid quota issues
        if (data.attempts.length > 500) data.attempts = data.attempts.slice(-500);
        if (data.sessions.length > 50) data.sessions = data.sessions.slice(-50);

        localStorage.setItem(QuizAnalytics.STORAGE_KEY, JSON.stringify(data));
    }
};

console.log('📊 Quiz Analytics Engine Loaded.');
