/**
 * DCM QUIZ ENGINE — v2.0
 * ============================================
 * Phase 2: Quiz Engine
 * Handles: question loading, shuffling, session management,
 * scoring, unlock logic, localStorage persistence.
 * Compatible with both file:// and http:// protocols (non-module).
 * ============================================
 */

const QuizEngine = {

    // ─── CONFIG ─────────────────────────────────────────────────────────────
    BANK_PATH: './js/quiz-bank/',
    QUESTIONS_PER_SESSION: 20,
    PASS_SCORE: 80, // % required to unlock next level

    LEVELS: [
        { id: 1, key: 'L1', file: 'level-1.json', name: 'Foundations of DLT Risk', color: '#10b981', icon: 'fa-seedling', requires: null },
        { id: 2, key: 'L2', file: 'level-2.json', name: 'Governance & Capital Impact', color: '#eab308', icon: 'fa-building-columns', requires: 1 },
        { id: 3, key: 'L3', file: 'level-3.json', name: 'Regulatory Mapping', color: '#f97316', icon: 'fa-scale-balanced', requires: 2 },
        { id: 4, key: 'L4', file: 'level-4.json', name: 'Infrastructure & Deployment', color: '#ef4444', icon: 'fa-server', requires: 3 },
        { id: 5, key: 'L5', file: 'level-5.json', name: 'Strategic Positioning', color: '#6366f1', icon: 'fa-chess-king', requires: 4 },
        { id: 'super', key: 'SL', file: 'super-level.json', name: 'DCM Black Level', color: '#7c3aed', icon: 'fa-bolt', requires: 5, isSuper: true }
    ],

    // ─── LOCALSTORAGE KEYS ───────────────────────────────────────────────────
    KEYS: {
        UNLOCKS: 'dcm_quiz_unlocks',
        SCORES: 'dcm_quiz_scores',
        HISTORY: 'dcm_quiz_history',
        SUPER: 'dcm_super_unlocked',
        CERTS: 'dcm_quiz_certs'
    },

    // ─── STATE ───────────────────────────────────────────────────────────────
    _state: {
        currentLevel: null,
        bank: [],
        session: [],
        currentIndex: 0,
        answers: [],
        sessionId: null,
        startTime: null
    },

    // ─── DEV MODE ────────────────────────────────────────────────────────────
    isDevMode() {
        return localStorage.getItem('is_super_dev') === 'true'
            || localStorage.getItem('dcm_user_role') === 'ADMIN';
    },

    // ─── UNLOCK MANAGEMENT ──────────────────────────────────────────────────
    getUnlocks() {
        if (this.isDevMode()) return [1, 2, 3, 4, 5, 'super'];
        return JSON.parse(localStorage.getItem(this.KEYS.UNLOCKS) || '[1]');
    },

    isLevelUnlocked(levelId) {
        if (this.isDevMode()) return true;
        const unlocks = this.getUnlocks();
        return unlocks.includes(levelId);
    },

    unlockLevel(levelId) {
        const unlocks = this.getUnlocks();
        if (!unlocks.includes(levelId)) {
            unlocks.push(levelId);
            localStorage.setItem(this.KEYS.UNLOCKS, JSON.stringify(unlocks));
        }
    },

    // ─── SCORE MANAGEMENT ───────────────────────────────────────────────────
    getBestScore(levelKey) {
        const scores = JSON.parse(localStorage.getItem(this.KEYS.SCORES) || '{}');
        return scores[levelKey] || null;
    },

    _saveScore(levelKey, score, passed) {
        const scores = JSON.parse(localStorage.getItem(this.KEYS.SCORES) || '{}');
        if (!scores[levelKey] || score > scores[levelKey]) {
            scores[levelKey] = score;
        }
        localStorage.setItem(this.KEYS.SCORES, JSON.stringify(scores));
    },

    // ─── QUESTION BANK LOADING ───────────────────────────────────────────────
    async loadBank(levelId) {
        const level = this.LEVELS.find(l => l.id === levelId);
        if (!level) throw new Error(`Level ${levelId} not found`);

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `${this.BANK_PATH}${level.file}?v=${Date.now()}`, true);
            xhr.onload = () => {
                if (xhr.status === 200 || xhr.status === 0) {
                    try { resolve(JSON.parse(xhr.responseText)); }
                    catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
                } else {
                    reject(new Error(`Failed to load ${level.file}: ${xhr.status}`));
                }
            };
            xhr.onerror = () => reject(new Error(`Network error loading ${level.file}`));
            xhr.send();
        });
    },

    // ─── SHUFFLE UTILITY ─────────────────────────────────────────────────────
    _shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },

    // ─── SHUFFLE CHOICES (keeping correct answer tracking) ──────────────────
    _shuffleChoices(question) {
        const indices = question.choices.map((_, i) => i);
        const shuffledIndices = this._shuffle(indices);
        return {
            ...question,
            choices: shuffledIndices.map(i => question.choices[i]),
            correct: shuffledIndices.indexOf(question.correct), // remap correct index
            _originalCorrect: question.correct
        };
    },

    // ─── START SESSION ───────────────────────────────────────────────────────
    async startSession(levelId) {
        if (!this.isLevelUnlocked(levelId)) {
            throw new Error(`Level ${levelId} is locked. Complete the previous level first.`);
        }

        const bankData = await this.loadBank(levelId);
        const levelMeta = this.LEVELS.find(l => l.id === levelId);

        // Pick questions: super takes all 15, others pick 20 from 30
        const questionsToUse = levelMeta.isSuper
            ? bankData.questions
            : this._shuffle(bankData.questions).slice(0, this.QUESTIONS_PER_SESSION);

        // Shuffle choices for each question
        const session = questionsToUse.map(q => this._shuffleChoices(q));

        this._state = {
            currentLevel: levelId,
            levelMeta,
            bankMeta: bankData,
            bank: bankData.questions,
            session,
            currentIndex: 0,
            answers: [],
            sessionId: `SID-${Date.now()}-L${levelId}`,
            startTime: Date.now()
        };

        return {
            sessionId: this._state.sessionId,
            levelName: bankData.name,
            totalQuestions: session.length,
            level: levelMeta
        };
    },

    // ─── GET CURRENT QUESTION ────────────────────────────────────────────────
    getCurrentQuestion() {
        const { session, currentIndex } = this._state;
        if (currentIndex >= session.length) return null;
        return {
            ...session[currentIndex],
            index: currentIndex,
            total: session.length,
            progress: Math.round((currentIndex / session.length) * 100)
        };
    },

    // ─── SUBMIT ANSWER ───────────────────────────────────────────────────────
    submitAnswer(choiceIndex) {
        const { session, currentIndex, answers } = this._state;
        const question = session[currentIndex];
        if (!question) return null;

        const isCorrect = choiceIndex === question.correct;
        const answer = {
            questionId: question.id,
            question: question.question,
            chosen: choiceIndex,
            correct: question.correct,
            isCorrect,
            explanation: question.explanation,
            theme: question.theme
        };

        answers.push(answer);
        this._state.currentIndex++;

        return {
            isCorrect,
            correctIndex: question.correct,
            explanation: question.explanation,
            hasMore: this._state.currentIndex < session.length
        };
    },

    // ─── END SESSION & CALCULATE RESULTS ────────────────────────────────────
    endSession() {
        const { answers, _state, sessionId } = this;
        const { currentLevel, levelMeta, session, startTime } = this._state;

        const totalQuestions = session.length;
        const correct = this._state.answers.filter(a => a.isCorrect).length;
        const scorePercent = Math.round((correct / totalQuestions) * 100);
        const passed = scorePercent >= this.PASS_SCORE;
        const duration = Math.round((Date.now() - startTime) / 1000);

        // Theme breakdown
        const themeMap = {};
        this._state.answers.forEach(a => {
            if (!themeMap[a.theme]) themeMap[a.theme] = { correct: 0, total: 0 };
            themeMap[a.theme].total++;
            if (a.isCorrect) themeMap[a.theme].correct++;
        });

        // Save score
        this._saveScore(levelMeta.key, scorePercent, passed);

        // Handle unlock
        let unlocked = null;
        if (passed) {
            const nextLevel = this.LEVELS.find(l => l.requires === currentLevel);
            if (nextLevel) {
                this.unlockLevel(nextLevel.id);
                unlocked = nextLevel;
            }
            // Handle super level unlock
            if (currentLevel === 5) {
                this.unlockLevel('super');
                localStorage.setItem(this.KEYS.SUPER, 'true');
            }
            // Handle certification
            this._issueCertificate(levelMeta, scorePercent);
        }

        // Save to history
        const session_record = {
            sessionId: this._state.sessionId,
            level: currentLevel,
            levelKey: levelMeta.key,
            score: scorePercent,
            correct,
            total: totalQuestions,
            passed,
            duration,
            date: new Date().toISOString(),
            themes: themeMap,
            failedQuestions: this._state.answers.filter(a => !a.isCorrect).map(a => a.questionId)
        };
        const history = JSON.parse(localStorage.getItem(this.KEYS.HISTORY) || '[]');
        history.unshift(session_record);
        localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history.slice(0, 50)));

        return {
            score: scorePercent,
            correct,
            total: totalQuestions,
            passed,
            passScore: this.PASS_SCORE,
            duration,
            unlocked,
            themes: themeMap,
            answers: this._state.answers,
            levelMeta
        };
    },

    // ─── CERTIFICATION ───────────────────────────────────────────────────────
    _issueCertificate(levelMeta, score) {
        const certLevel = {
            1: null,          // No cert for L1
            2: null,          // No cert for L2
            3: 'Governance Practitioner',
            4: null,
            5: 'Institutional Expert',
            'super': 'Black Level'
        }[levelMeta.id];

        if (!certLevel) return;

        const certs = JSON.parse(localStorage.getItem(this.KEYS.CERTS) || '[]');
        const existing = certs.find(c => c.level === levelMeta.id);
        if (!existing) {
            certs.push({
                level: levelMeta.id,
                certName: certLevel,
                score,
                date: new Date().toISOString(),
                certId: `DCM-${levelMeta.key}-${Date.now().toString(36).toUpperCase()}`
            });
            localStorage.setItem(this.KEYS.CERTS, JSON.stringify(certs));
        }
    },

    // ─── GET LEVEL MAP DATA ──────────────────────────────────────────────────
    getLevelMap() {
        return this.LEVELS.map(level => {
            const bestScore = this.getBestScore(level.key);
            const unlocked = this.isLevelUnlocked(level.id);
            const completed = bestScore !== null && bestScore >= this.PASS_SCORE;
            return {
                ...level,
                unlocked,
                completed,
                bestScore,
                locked: !unlocked
            };
        });
    },

    // ─── ANALYTICS ───────────────────────────────────────────────────────────
    getAnalytics() {
        const history = JSON.parse(localStorage.getItem(this.KEYS.HISTORY) || '[]');
        const scores = JSON.parse(localStorage.getItem(this.KEYS.SCORES) || '{}');

        const byLevel = {};
        history.forEach(s => {
            if (!byLevel[s.levelKey]) byLevel[s.levelKey] = { attempts: 0, passed: 0, scores: [] };
            byLevel[s.levelKey].attempts++;
            if (s.passed) byLevel[s.levelKey].passed++;
            byLevel[s.levelKey].scores.push(s.score);
        });

        return { history, scores, byLevel };
    }
};

// Make globally available for non-module scripts
window.QuizEngine = QuizEngine;
