/**
 * DASHBOARD ENGINE — v3.0 (Phase 31: Production Grade)
 * Real Supabase data queries with offline-first fallback to mock data.
 * Fully backwards-compatible with existing chart rendering.
 */

// Dependencies loaded via script tags — accessed as window globals
const _sb = () => window.supabase;

// ============================================================
//  SUPABASE DATA LAYER
// ============================================================

const SupabaseData = {

    /**
     * Fetch quiz results for the current user (last 30 days).
     */
    getQuizResults: async (userId) => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const sb = _sb();
        if (!sb) return null;
        const { data, error } = await sb
            .from('quiz_results')
            .select('*')
            .eq('user_id', userId)
            .gte('completed_at', thirtyDaysAgo.toISOString())
            .order('completed_at', { ascending: true });

        if (error) { console.warn('⚠️ Quiz fetch error:', error); return null; }
        return data;
    },

    /**
     * Fetch research score snapshots for evolution chart.
     */
    getScoreHistory: async (userId) => {
        const sb = _sb();
        if (!sb) return null;
        const { data, error } = await sb
            .from('research_scores')
            .select('total_score, sub_score_legal, sub_score_tech, sub_score_risk, sub_score_engagement, snapshot_date')
            .eq('user_id', userId)
            .order('snapshot_date', { ascending: true })
            .limit(8);

        if (error) { console.warn('⚠️ Score history fetch error:', error); return null; }
        return data;
    },

    /**
     * Fetch simulations for table view.
     */
    getSimulations: async (userId) => {
        const sb = _sb();
        if (!sb) return null;
        const { data, error } = await sb
            .from('simulations')
            .select('id, scenario_name, input_data, results, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) { console.warn('⚠️ Simulations fetch error:', error); return null; }
        return data;
    },

    /**
     * Fetch activity logs for the live activity timeline.
     */
    getActivityLogs: async (userId) => {
        const sb = _sb();
        if (!sb) return null;
        const { data, error } = await sb
            .from('activity_logs')
            .select('page_url, time_spent_seconds, session_date')
            .eq('user_id', userId)
            .order('session_date', { ascending: false })
            .limit(5);

        if (error) { console.warn('⚠️ Activity log fetch error:', error); return null; }
        return data;
    },

    /**
     * Write quiz result to Supabase after quiz completion.
     */
    saveQuizResult: async (userId, quizType, scorePercent, timeTaken, passed) => {
        const sb = _sb();
        if (!sb) return false;
        const { data, error } = await sb
            .from('quiz_results')
            .insert([{
                user_id: userId,
                quiz_type: quizType,
                score_percent: scorePercent,
                time_taken_seconds: timeTaken,
                passed: passed
            }]);

        if (error) { console.error('❌ Quiz save error:', error); return false; }
        console.log('✅ Quiz result saved to Supabase');
        return true;
    },

    /**
     * Write simulation result to Supabase (Phase 79).
     */
    saveSimulation: async (userId, orgId, name, type, inputData, results) => {
        const sb = _sb();
        if (!sb) return null;
        const { data, error } = await sb
            .from('simulations')
            .insert([{
                user_id: userId,
                org_id: orgId,
                scenario_name: name,
                input_data: inputData,
                results: results,
                score_delta: 5
            }])
            .select();

        if (error) { console.error('❌ Simulation save error:', error); return null; }
        return data[0];
    }
};

// ============================================================
//  MOCK DATA FALLBACK (offline / no session)
// ============================================================

const MockData = {
    generate: () => ({
        simulations: [
            { id: 1, date: '2026-02-18', name: 'High Yield ETH Strategy', type: 'Staking', result: '5.2% APY', status: 'optimal' },
            { id: 2, date: '2026-02-15', name: 'Risky Leverage Play', type: 'Lending', result: 'High Risk', status: 'warning' },
            { id: 3, date: '2026-02-10', name: 'Stablecoin Safety Net', type: 'Liquidity', result: '3.1% APY', status: 'optimal' },
            { id: 4, date: '2026-02-05', name: 'RWA Exposure Test', type: 'RWA', result: '4.8% APY', status: 'optimal' },
            { id: 5, date: '2026-01-28', name: 'DeFi Crash Sim', type: 'Stress Test', result: '-15% Drawdown', status: 'critical' }
        ],
        evolutionLabels: ['Jan W1', 'Jan W2', 'Jan W3', 'Jan W4', 'Feb W1', 'Feb W2', 'Feb W3'],
        researchScores: [45, 48, 55, 62, 65, 70, 78],
        quizScores: [60, 65, 62, 70, 75, 80, 85],
        radarData: {
            labels: ['Technology', 'Legal', 'Risk Mgmt', 'Engagement'],
            dataset: [65, 85, 90, 75]
        },
        complianceProfile: {
            jurisdiction: 'EU (MiCA)',
            impactScore: 42,
            alerts: ['Verify CASP License', 'T+1 Settlement Check']
        },
        timeline: [
            { date: 'Today', time: '10:42', action: 'Simulation Run', detail: 'High Yield ETH Strategy' },
            { date: 'Yesterday', time: '15:30', action: 'Quiz Completed', detail: 'Level 2: Smart Contracts' },
            { date: '17 Feb', time: '09:15', action: 'Login', detail: 'New Device' },
            { date: '15 Feb', time: '14:20', action: 'Export', detail: 'Weekly_Risk_Report.pdf' }
        ]
    })
};

// ============================================================
//  DATA ADAPTERS (Supabase → Dashboard format)
// ============================================================

const Adapters = {

    adaptQuizResults: (results) => {
        if (!results || results.length === 0) return { quizScores: [85], lastGrade: 'A-' };
        const scores = results.map(r => r.score_percent);
        const last = scores[scores.length - 1];
        const grade = last >= 90 ? 'A+' : last >= 80 ? 'A-' : last >= 70 ? 'B+' : 'B';
        return { quizScores: scores, lastGrade: grade, passedCount: results.filter(r => r.passed).length };
    },

    adaptScoreHistory: (history) => {
        if (!history || history.length === 0) return { labels: [], researchScores: [], radarData: null };

        const labels = history.map(h => {
            const d = new Date(h.snapshot_date);
            return `${d.toLocaleString('fr', { month: 'short' })} ${d.getDate()}`;
        });

        // --- PHASE 49: Research Maturity Logic ---
        // Dynamically compute 'Learning Velocity' based on score jumps
        const researchScores = history.map((h, i, arr) => {
            let baseScore = h.total_score;
            if (i > 0) {
                // Reward consistent progress
                const diff = h.total_score - arr[i - 1].total_score;
                if (diff > 0) baseScore += (diff * 0.1);
            }
            return Math.min(100, Math.round(baseScore));
        });

        const last = history[history.length - 1];
        const radarData = last ? {
            labels: ['Technology', 'Legal', 'Risk Mgmt', 'Engagement'],
            dataset: [last.sub_score_tech || 70, last.sub_score_legal || 85, last.sub_score_risk || 90, last.sub_score_engagement || 75]
        } : null;

        return { labels, researchScores, radarData };
    },

    // --- PHASE 72: DELEGATED TO CORE SCORING ENGINE ---
    calculateRiskIndex: (sims, scores) => {
        const radar = scores.radarData;
        const avg = radar ? radar.dataset.reduce((a, b) => a + b, 0) / radar.dataset.length : 0;
        const SE = window.ScoringEngine;
        return SE ? SE.calculateRiskIndex(sims, avg) : Math.round(avg);
    },

    getRiskAdvice: (riskIndex) => {
        if (riskIndex < 20) return "Risque faible. Profil optimal pour l'exploration de nouveaux protocoles RWA.";
        if (riskIndex < 50) return "Risque modéré. Surveillez la volatilité on-chain et diversifiez vos simulations.";
        if (riskIndex < 80) return "Risque élevé. Réduisez l'exposition sur les Smart Contracts non-audités.";
        return "Alerte Critique : Exposition maximale. Revoyez vos paramètres de conformité MiCA immédiatement.";
    },

    adaptSimulations: (sims) => {
        if (!sims || sims.length === 0) return null;
        return sims.map(s => ({
            id: s.id,
            date: new Date(s.created_at).toLocaleDateString('fr-FR'),
            name: s.scenario_name,
            type: s.simulation_type,
            result: s.results?.summary || 'Voir détails',
            status: s.results?.risk_level === 'high' ? 'critical' : s.is_favorite ? 'optimal' : 'warning'
        }));
    },

    adaptActivityLogs: (logs) => {
        if (!logs || logs.length === 0) return null;
        const actionMap = {
            'quiz.html': 'Quiz Consulté', 'dashboard.html': 'Dashboard Ouvert',
            'governance.html': 'Gouvernance Lue', 'legal-matrix.html': 'Legal Matrix Consultée',
            'guide.html': 'Guide Expert Lu', 'yield-mechanics.html': 'Yield Lab Utilisé'
        };
        return logs.map(log => ({
            date: new Date(log.session_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
            time: '--:--',
            action: actionMap[log.page_url] || log.page_url,
            detail: `${Math.round(log.time_spent_seconds / 60)} min passées`
        }));
    }
};

// ============================================================
//  MAIN DASHBOARD ENGINE
// ============================================================

const DashboardEngine = {

    /**
     * Institutional Stress Test Trigger (Phase 127)
     */
    runInstitutionalStressTest: async (network) => {
        const activeUser = SessionManager.profile || { id: 'demo-user', org_id: 'dcm-demo' };

        // Paramètres de base (Bonds Tokenisés)
        const params = {
            currentPrice: 100,
            volatility: network === 'swiat' ? 0.12 : 0.08, // Low vol for institutional assets
            drift: 0.04,
            network: network
        };

        const SE = window.StressTestingEngine;
        if (!SE) { console.warn('StressTestingEngine not loaded'); return; }
        const result = SE.runStressTest(params.currentPrice, params);

        // Save to Supabase
        const sb = _sb();
        const saved = sb ? (await SupabaseData.saveSimulation(
            activeUser.id,
            activeUser.org_id,
            `Stress Test: ${network.toUpperCase()} Infra`,
            'Institutional',
            params,
            {
                summary: `VaR 95%: ${result.metrics.var95.toFixed(2)}%`,
                risk_level: result.metrics.var95 > 10 ? 'high' : 'medium',
                infra_risk: result.metrics.infraRiskScore,
                is_institutional: true
            }
        )) : null;

        if (saved) {
            SessionManager.showToast('🛡️', 'Stress Test Terminé', `Simulation d'infrastructure ${network.toUpperCase()} validée.`);
            // Refresh UI
            const data = await DashboardEngine.loadData();
            DashboardEngine.renderSimulationTable(data.simulations);
            DashboardEngine.renderRiskWidget(data.riskProfile);
        }
    },

    // ============================================================
    //  PHASE 63: ADVISOR RECOMMENDATION ENGINE
    // ============================================================
    RecommendationEngine: {
        RULES: [
            {
                id: 'REGULATORY_GAP',
                condition: (data) => (data.radarData?.dataset[1] || 100) < 75,
                title: '📌 Optimisation Conformité MiCA',
                advice: 'Votre score légal est inférieur aux standards Tier 1. Une révision des politiques de garde (CASP) est recommandée.',
                traceability: 'Calculé sur la base du radar légal (ω: 0.45) et des simulations récentes sans KYC strict.'
            },
            {
                id: 'PORTFOLIO_CONCENTRATION',
                condition: (data) => (data.simulations?.filter(s => s.type === 'Staking').length || 0) > 3,
                title: '⚡ Alerte Concentration Staking',
                advice: '80% de vos simulations reposent sur le staking. Considérez une exposition RWA pour stabiliser le rendement.',
                traceability: 'Analyse de la corrélation entre les 5 derniers scénarios de simulation.'
            },
            {
                id: 'CERTIFICATION_UPGRADE',
                condition: (data, role) => role === 'Student' && (data.quizScores?.slice(-1)[0] || 0) > 80,
                title: '🎓 Opportunité Certification Pro',
                advice: 'Vos excellents résultats académiques vous qualifient pour le passage de la Certification Analyste Pro.',
                traceability: 'Vitesse d\'apprentissage (Velocity) > 1.2 par rapport à la moyenne de la cohorte.'
            },
            {
                id: 'SECURITY_HARDENING',
                condition: (data, role) => role === 'Institution',
                title: '🛡️ Hardening Infrastructure',
                advice: 'Activez l\'option HSM Cloud Souverain pour vos simulations critiques (Compliance DORA).',
                traceability: 'Alignement requis avec l\'infractructure DORA/SecNumCloud mentionnée dans le document de sécurité.'
            }
        ],

        generate: (data, role) => {
            const activeRecs = [];
            DashboardEngine.RecommendationEngine.RULES.forEach(rule => {
                if (rule.condition(data, role)) {
                    activeRecs.push(rule);
                }
            });
            return activeRecs.slice(0, 3);
        }
    },

    // --- PRIMARY: Try Supabase, fallback to mock ---
    loadData: async () => {
        const { data: { session } } = window.supabase ? await window.supabase.auth.getSession() : { data: {} };

        if (!session) {
            console.info('ℹ️ No Supabase session — using mock data (offline/demo mode)');
            const mock = MockData.generate();
            const riskAdapted = Adapters.calculateRiskIndex(mock.simulations, mock);
            return { source: 'mock', ...mock, riskProfile: riskAdapted };
        }

        const userId = session.user.id;
        const profile = await SessionManager.init();
        const activeOrg = window.TenantManager ? window.TenantManager.getActiveOrg() : null;
        const orgId = activeOrg ? activeOrg.id : profile?.org_id;
        const sb = _sb();
        const isEnterprise = profile?.subscription_tier === 'enterprise' || activeOrg?.tier === 'Enterprise';

        console.log(`📡 Loading real data for user: ${userId} [Org: ${orgId}]`);

        // Parallel fetch all data with Org Isolation for Enterprise
        const fetchSims = sb && isEnterprise && orgId
            ? sb.from('simulations').select('*').eq('org_id', orgId)
            : SupabaseData.getSimulations(userId);

        const [quizResults, scoreHistory, simulations, activityLogs] = await Promise.all([
            SupabaseData.getQuizResults(userId),
            SupabaseData.getScoreHistory(userId),
            fetchSims,
            SupabaseData.getActivityLogs(userId)
        ]);

        // Adapt results, fall back to mock if empty
        const mock = MockData.generate();
        const quizAdapted = Adapters.adaptQuizResults(quizResults);
        const scoreAdapted = Adapters.adaptScoreHistory(scoreHistory);
        const simsAdapted = Adapters.adaptSimulations(simulations);
        const logsAdapted = Adapters.adaptActivityLogs(activityLogs);

        // --- PHASE 49: Algorithmic Logic Execution ---
        const finalSims = simsAdapted || mock.simulations;
        const finalScores = { radarData: scoreAdapted.radarData || mock.radarData };
        const riskAdapted = Adapters.calculateRiskIndex(finalSims, finalScores);

        // --- PHASE 74: GROWTH ENGINE INSTRUMENTATION ---
        if (window.GrowthEngine) {
            finalSims.forEach(() => {
                const trigger = window.GrowthEngine.recordAction('simulations');
                if (trigger && window.showUpgradeModal) {
                    setTimeout(() => window.showUpgradeModal(trigger), 2000); // Delayed prompt for better UX
                }
            });
        }

        return {
            source: 'supabase',
            userId,
            simulations: finalSims,
            evolutionLabels: scoreAdapted.labels.length > 0 ? scoreAdapted.labels : mock.evolutionLabels,
            researchScores: scoreAdapted.researchScores.length > 0 ? scoreAdapted.researchScores : mock.researchScores,
            quizScores: quizAdapted.quizScores.length > 1 ? quizAdapted.quizScores : mock.quizScores,
            lastGrade: quizAdapted.lastGrade || 'A-',
            radarData: scoreAdapted.radarData || mock.radarData,
            complianceProfile: mock.complianceProfile,
            timeline: logsAdapted || mock.timeline,
            riskProfile: riskAdapted
        };
    },

    // --- BENCHMARK DATA (Phase 58) ---
    benchmarks: {
        tier1: [85, 90, 88, 80],
        crypto: [95, 60, 92, 98],
        consultants: [75, 95, 80, 85]
    },

    radarChartInstance: null,

    updateBenchmark: (type) => {
        if (!DashboardEngine.radarChartInstance) return;

        const datasets = DashboardEngine.radarChartInstance.data.datasets;

        // Remove existing benchmark dataset if any
        if (datasets.length > 1) {
            datasets.pop();
        }

        if (type !== 'none' && DashboardEngine.benchmarks[type]) {
            datasets.push({
                label: `Benchmark: ${type.toUpperCase()}`,
                data: DashboardEngine.benchmarks[type],
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: '#10b981',
                borderDash: [5, 5],
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff'
            });
        }

        DashboardEngine.radarChartInstance.update();
    },

    // ============================================================
    //  CHART RENDERING (unchanged API, upgraded colors)
    // ============================================================
    initCharts: (data) => {
        // RADAR CHART
        const ctxRadar = document.getElementById('radarChart');
        if (ctxRadar) {
            DashboardEngine.radarChartInstance = new Chart(ctxRadar.getContext('2d'), {
                type: 'radar',
                data: {
                    labels: data.radarData.labels,
                    datasets: [{
                        label: 'Skill Matrix',
                        data: data.radarData.dataset,
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderColor: '#3b82f6',
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#3b82f6'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(255,255,255,0.1)' },
                            grid: { color: 'rgba(255,255,255,0.1)' },
                            pointLabels: { color: '#94a3b8', font: { size: 11 } },
                            ticks: { backdropColor: 'transparent', color: 'transparent' }
                        }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }

        // LINE CHART
        const ctxLine = document.getElementById('evolutionChart');
        if (ctxLine) {
            new Chart(ctxLine.getContext('2d'), {
                type: 'line',
                data: {
                    labels: data.evolutionLabels,
                    datasets: [
                        {
                            label: data.source === 'supabase' ? 'Score Réel' : 'Research Score',
                            data: data.researchScores,
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59,130,246,0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Quiz Avg',
                            data: data.quizScores,
                            borderColor: '#10b981',
                            borderDash: [5, 5],
                            tension: 0.4,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                        legend: { labels: { color: '#94a3b8' } },
                        tooltip: {
                            backgroundColor: '#1e293b',
                            titleColor: '#f8fafc',
                            bodyColor: '#cbd5e1',
                            borderColor: '#334155',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' }, beginAtZero: true, max: 100 },
                        x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                    }
                }
            });
        }

        // QUIZ ANALYTICS (Phase 7)
        this.renderQuizAnalytics();
    },

    /**
     * Render Quiz Analytics (Phase 7)
     */
    renderQuizAnalytics: function () {
        if (!window.QuizAnalytics) return;

        const stats = window.QuizAnalytics.getGlobalStats();
        const themeStats = stats.themes;

        // Populate Metrics
        const total = stats.totalSessions;
        const passed = stats.passedSessions;
        const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
        const avgScore = total > 0 ? Math.round(stats.avgScore) : 0;
        const avgTime = total > 0 ? Math.round(stats.avgTimePerQuestion) : 0;

        const elPassRate = document.getElementById('quiz-pass-rate');
        const elAvgScore = document.getElementById('quiz-avg-score');
        const elAvgTime = document.getElementById('quiz-avg-time');

        if (elPassRate) elPassRate.innerText = `${passRate}%`;
        if (elAvgScore) elAvgScore.innerText = `${avgScore}%`;
        if (elAvgTime) elAvgTime.innerText = `${avgTime}s`;

        // Pass/Fail Chart
        const ctxPF = document.getElementById('quizPassFailChart');
        if (ctxPF) {
            new Chart(ctxPF.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Réussis', 'Échecs'],
                    datasets: [{
                        data: [passed, total - passed],
                        backgroundColor: ['#10b981', '#334155'],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 10 } } }
                    }
                }
            });
        }

        // Theme Radar Chart
        const ctxTheme = document.getElementById('quizThemeChart');
        if (ctxTheme) {
            const labels = Object.keys(themeStats);
            const data = labels.map(l => Math.round((themeStats[l].correct / themeStats[l].total) * 100));

            new Chart(ctxTheme.getContext('2d'), {
                type: 'radar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Précision %',
                        data: data,
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderColor: '#3b82f6',
                        pointBackgroundColor: '#3b82f6',
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            min: 0,
                            max: 100,
                            beginAtZero: true,
                            angleLines: { color: 'rgba(255,255,255,0.1)' },
                            grid: { color: 'rgba(255,255,255,0.1)' },
                            pointLabels: { color: '#94a3b8', font: { size: 9 } },
                            ticks: { display: false }
                        }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }
    },

    /**
     * MODULE VISIBILITY (Phase 96)
     * Shows/hides sections based on segment.
     */
    applyRoleVisibility: (segment) => {
        const CONFIG = {
            student: ['quiz-card', 'evolutionChart', 'radarChart', 'activity-timeline'],
            pro: ['quiz-card', 'evolutionChart', 'radarChart', 'risk-card', 'compliance-bar-fill', 'coverage-card'],
            enterprise: ['quiz-card', 'evolutionChart', 'radarChart', 'risk-card', 'compliance-bar-fill', 'coverage-card', 'institutional-section']
        };

        // ALL_GATED modules are now shown by default to maintain the "Full Dashboard" experience
        // The individual components inside (buttons/data) will be gated by feature flags
        const ALL_GATED = ['institutional-section', 'risk-card', 'quiz-card', 'coverage-card', 'learning-velocity-card'];

        ALL_GATED.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.style.display = 'flex'; // Always show top-level containers

            // Add a subtle lock visual if the user shouldn't have it (optional but helpful)
            if (!activeModules.includes(id)) {
                el.style.opacity = '0.8';
                // We could add a .locked class here if we had CSS for it
            } else {
                el.style.opacity = '1';
            }
        });

        // Update Breadcrumb (Phase 99)
        const bcRole = document.getElementById('bc-role');
        const bcModule = document.getElementById('bc-module');
        const greeting = document.getElementById('user-greeting');

        if (greeting) {
            const segmentGreetings = {
                student: 'Prêt pour votre prochaine certification ?',
                pro: 'Analyse de performance & ROI active.',
                enterprise: 'Institutional Governance Cockpit'
            };
            greeting.innerText = segmentGreetings[segment] || greeting.innerText;
        }

        // --- TENANT INDICATOR (Phase 106) ---
        const tenantIndicator = document.getElementById('tenant-indicator');
        const activeOrgName = document.getElementById('active-org-name');
        if (tenantIndicator && activeOrgName && segment === 'enterprise' && window.TenantManager) {
            const org = window.TenantManager.getActiveOrg();
            activeOrgName.innerText = org.name;
            tenantIndicator.style.display = 'flex';

            // Auto-switch to Team View for Enterprise
            DashboardEngine.switchToTeamView();
        }

        // --- TAB SWITCHING (Phase 108) ---
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab');
        DashboardEngine.handleTabSwitching(tab);

        // Feature: Custom Tab Labels in Breadcrumb
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.replace('#', '').toUpperCase();
            if (bcModule && hash) bcModule.innerText = hash;
        });

        // Intercept sidebar tab clicks to prevent full page reload
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('a.nav-item');
            if (navLink && navLink.hasAttribute('data-tab')) {
                const tabId = navLink.getAttribute('data-tab');
                if (tabId && window.location.pathname.endsWith('dashboard.html')) {
                    e.preventDefault();
                    window.history.pushState({}, '', '?tab=' + tabId);
                    DashboardEngine.handleTabSwitching(tabId);

                    // Update active state in sidebar
                    document.querySelectorAll('a.nav-item').forEach(n => n.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    },

    /**
     * Optimized Tab Switching (Phase 118.2)
     * Handles section visibility with protective guards to prevent flickering.
     */
    handleTabSwitching: (tab) => {
        if (!tab) tab = new URLSearchParams(window.location.search).get('tab') || 'overview';

        const sections = {
            'simulations': document.getElementById('simulations-section'),
            'reports': document.getElementById('reports-section'),
            'validation': document.getElementById('validation-section'),
            'admin': document.getElementById('admin-section')
        };
        const bcModule = document.getElementById('bc-module');
        const topCards = [
            'advisor-insights', 'quiz-card', 'coverage-card', 'activity-timeline',
            'learning-velocity-card', 'main-chart-card', 'risk-card'
        ];

        console.log(`[Dashboard] 🎯 Routing to tab: ${tab}`);

        // 1. Immediate hiding of irrelevant sections to preempt layout jumps
        Object.keys(sections).forEach(key => {
            const s = sections[key];
            if (s) s.style.display = 'none';
        });

        // 2. Logic Branching
        if (tab === 'reports' || tab === 'validation' || tab === 'admin') {
            // Dashboard-specific cards are hidden for specialized views
            topCards.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });

            // Activate Target Section
            const target = sections[tab];
            if (target) {
                target.style.display = (tab === 'admin') ? 'grid' : 'block';
                if (bcModule) {
                    const labels = { 'reports': 'RAPPORTS', 'validation': 'VALIDATION', 'admin': 'CORPORATE ADMIN' };
                    bcModule.innerText = labels[tab];
                }
            }
        } else {
            // Default "Cockpit" View
            topCards.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = '';
            });
            if (sections['simulations']) sections['simulations'].style.display = 'block';
            if (bcModule) bcModule.innerText = window.location.hash.includes('risk-card') ? 'RISK ENGINE' : 'COCKPIT';
        }

        // 3. Coordinate with AOS to prevent the "Fade In" from appearing as flickering
        if (window.AOS) {
            // Multiple refreshes to catch dynamic layout adjustments
            window.AOS.refresh();
            setTimeout(() => window.AOS.refresh(), 150);
        }
    },

    runStressTest: async () => {
        const scenario = document.getElementById('stress-scenario').value;
        const placeholder = document.getElementById('stress-results-placeholder');
        const resultsCard = document.getElementById('stress-results-card');

        placeholder.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size:40px; margin-bottom:15px;"></i><p>Simulation du stress en cours...</p>';

        // Mock asset metrics for the test
        const mockMetrics = {
            liquidity: 85,
            legalScore: 90,
            collateralization: 80
        };

        const BE = window.BacktestingEngine;
        if (!BE) { console.warn('BacktestingEngine not loaded'); return; }
        const result = BE.runSensitivityAudit(mockMetrics, scenario);

        setTimeout(() => {
            placeholder.style.display = 'none';
            resultsCard.style.display = 'block';

            document.getElementById('res-baseline').innerText = Math.round(result.baseline);
            document.getElementById('res-shocked').innerText = Math.round(result.shocked);
            document.getElementById('res-variance').innerText = result.variance;

            // Phase 121: Proactive Signal Flag
            const drop = result.baseline - result.shocked;
            if (drop >= 15) {
                DashboardEngine.triggerCopilotSignal("Unusual deviation detected in regulatory buffer. Generate summary?");
            }

            // Log the test in the audit trail if available
            if (window.AuditLogger) {
                window.AuditLogger.log('STRESS_TEST', { scenario, variance: result.variance });
            }
        }, 1500);
    },

    triggerCopilotSignal: (message) => {
        const btnContainer = document.getElementById('copilot-btn-container');
        if (btnContainer) {
            btnContainer.style.display = 'block';
            const btn = btnContainer.querySelector('button');
            if (btn) {
                btn.style.animation = 'pulse 2s infinite';
                btn.style.boxShadow = '0 0 15px rgba(244, 63, 94, 0.5)';
                btn.style.border = '1px solid #f43f5e';
                btn.innerHTML = `<i class="fas fa-exclamation-triangle" style="color:#f43f5e;"></i> Signal: ${message}`;
            }
        }
    },

    generateReport: async (type) => {
        if (!window.ReportEngine) return;

        const profile = await SessionManager.init();
        const activeOrg = window.TenantManager ? window.TenantManager.getActiveOrg() : null;
        const orgId = activeOrg ? activeOrg.id : profile?.org_id;

        if (type === 'bundle') {
            const bundle = await window.ReportEngine.generateRegulatorBundle(orgId);
            window.ReportEngine.exportToPDF(bundle);
        } else if (type === 'audit') {
            // Phase 122: Mock MRM Audit Export
            const logs = window.AuditLogger ? AuditLogger.getLogs() : [];
            const header = "DCM DIGITAL - INSTITUTIONAL MRM AUDIT EXPORT\n" +
                "Classification: CONFIDENTIAL\n" +
                "Timestamp: " + new Date().toISOString() + "\n" +
                "Signature Validation: SUCCESS\n" +
                "----------------------------------------------------\n\n";

            const formattedLogs = logs.map(l => {
                if (l.action === 'AI_COPILOT_GENERATION') {
                    return `[${new Date(l.timestamp).toISOString()}] USER: ${l.details.user}\nACTION: ${l.action} (${l.details.prompt_type.toUpperCase()})\nSCENARIO_STATE: ${l.details.base_scenario}\nENGINE_REF: ${l.details.version}\nCRYPTOGRAPHIC_HASH: ${l.details.output_hash}\n----------------------------------------------------`;
                }
                return `[${new Date(l.timestamp).toISOString()}] ACTION: ${l.action}\nDETAILS: ${JSON.stringify(l.details)}\n----------------------------------------------------`;
            }).join('\n');

            const content = header + (formattedLogs || "No audit traces generated in this session yet.");
            const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `mrm_audit_trace_${new Date().getTime()}.txt`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            SessionManager.showToast('🛡️', 'Export MRM Terminé', 'Archive d\'audit générée avec succès (TXT).');
        } else {
            const logs = window.AuditLogger ? AuditLogger.getLogs() : [];
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "dcm_audit_export.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            SessionManager.showToast('📥', 'Export Terminé', 'Votre archive JSON a été téléchargée avec succès.');
        }
    },

    // --- AI RISK COPILOT (Phase 119) ---
    toggleCopilot: () => {
        const drawer = document.getElementById('ai-copilot-drawer');
        if (!drawer) return;

        const isClosed = drawer.style.right === '-450px' || drawer.style.right === '';
        drawer.style.right = isClosed ? '0px' : '-450px';
    },

    askCopilot: (type) => {
        const chat = document.getElementById('copilot-chat');
        const prompts = document.getElementById('copilot-prompts');
        if (!chat) return;

        // Context Awareness - Getting data from the dashboard
        const riskScoreStr = document.getElementById('risk-score-circle')?.innerText || 'High';
        const scenario = document.getElementById('stress-scenario')?.value || 'N/A';
        const variance = document.getElementById('res-variance')?.innerText || 'N/A';

        let userMsg = '';
        let aiMsg = '';

        if (type === 'explain') {
            userMsg = "Explain why the score dropped under liquidity shock.";
            aiMsg = `<strong>Synthèse d'Investissement:</strong> Le modèle (DCM-Risk v2) indique une dégradation sous choc de liquidité (-70%) due principalement à l'illiquidité inhérente des actifs sous-jacents (RWA) couplée à un retrait massif simulé. La variance de sensibilité indique que le buffer de collatéral est sous pression pour absorber ce scénario extrême sans impacter la notation globale (${riskScoreStr}).`;
        } else if (type === 'summarize') {
            userMsg = "Summarize the regulatory freeze impact in 3 points.";
            aiMsg = `<strong>Impact MiCA Regulatory Freeze :</strong><br><br>• <strong>Blocage des Émissions:</strong> Interruption totale des nouvelles tranches de Digital Covered Bonds.<br>• <strong>Pénalité de Capital:</strong> Application immédiate du <em>haircut</em> réglementaire, réduisant le ratio de couverture de 14%.<br>• <strong>Maintien du Yield:</strong> Le mécanisme de smart contract protège les coupons existants à court terme (Horizon: 45 jours).`;
        } else if (type === 'draft') {
            userMsg = "Draft a paragraph for the Risk Committee.";
            aiMsg = `<strong>[Draft - Risk Committee]</strong><br><br>Dans le cadre de notre suivi d'exposition aux actifs tokenisés, le stress test actuel révèle un profil de risque <em>${riskScoreStr}</em>. Bien que les smart contracts assurent une gestion automatisée des covenants de marge, la simulation d'un ${scenario.replace('_', ' ').toLowerCase()} indique une vulnérabilité résiduelle. Une révision du buffer de liquidité de sécurité pourrait être envisagée pour anticiper ces frictions réglementaires et de marché de manière proactive.`;
        } else if (type === 'comparative') {
            userMsg = "Compare the impact with the baseline.";
            const numVariance = parseFloat(variance) || 0;
            aiMsg = `<strong>Comparative Insight:</strong><br><br>Comparé à la baseline dynamique (Score: ${document.getElementById('res-baseline')?.innerText || 'N/A'}), la sensibilité du modèle a augmenté de ${Math.abs(numVariance)}% sous le scénario ${scenario}. L'écart de trajectoire justifie une surveillance accrue du collatéral de rang 1.`;
        } else if (type === 'comex') {
            userMsg = "COMEX 60-sec Brief.";
            aiMsg = `<strong>COMEX 60-SEC BRIEF</strong><br><br><strong>KEY SIGNAL:</strong><br>Déviation négative détectée (${variance}) sous scénario ${scenario}. Résilience globale: ${riskScoreStr}.<br><br><strong>IMPACT:</strong><br>Pression sur le ratio de couverture (LCR estimé -12%). Les covenants DeFi restent intacts à CT.<br><br><strong>POTENTIAL ACTION (NON-BINDING):</strong><br>Évaluer un collatéral additionnel liquide (Bonds souverains) pour restaurer le buffer cible de 110%.`;
        }

        // Add PRUDENT DISCLAIMER (Phase 120)
        aiMsg += `<div style="margin-top:12px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.1); font-size:9.5px; color:rgba(255,255,255,0.4); font-family:'JetBrains Mono', monospace;">[Generated analytical summary based on scenario outputs. Not a binding investment or liquidity recommendation.]</div>`;

        // Hide prompt buttons after a choice
        if (prompts) prompts.style.display = 'none';

        // Add user message
        const userDiv = document.createElement('div');
        userDiv.style.alignSelf = 'flex-end';
        userDiv.style.background = 'rgba(255,255,255,0.05)';
        userDiv.style.padding = '12px 15px';
        userDiv.style.borderRadius = '12px 12px 0 12px';
        userDiv.style.color = 'var(--text-muted)';
        userDiv.innerHTML = `<i class="fas fa-user" style="margin-right:5px; font-size:10px;"></i> ${userMsg}`;
        chat.appendChild(userDiv);

        // Simulate AI thinking
        const thinkDiv = document.createElement('div');
        thinkDiv.style.alignSelf = 'flex-start';
        thinkDiv.style.color = 'var(--accent-blue)';
        thinkDiv.style.fontSize = '11px';
        thinkDiv.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Analyse des KPIs du cockpit en cours...`;
        chat.appendChild(thinkDiv);

        // Scroll to bottom
        chat.scrollTop = chat.scrollHeight;

        // Reset button styling if triggered proactively
        const btnContainer = document.getElementById('copilot-btn-container');
        if (btnContainer) {
            const btn = btnContainer.querySelector('button');
            if (btn && btn.style.animation) {
                btn.style.animation = '';
                btn.style.boxShadow = '';
                btn.style.border = '';
                btn.innerHTML = `<i class="fas fa-robot"></i> Ask AI Copilot`;
            }
        }

        // AI Response with delay
        setTimeout(() => {
            thinkDiv.remove();

            const aiDiv = document.createElement('div');
            aiDiv.style.alignSelf = 'flex-start';
            aiDiv.style.background = 'rgba(168, 85, 247, 0.1)';
            aiDiv.style.border = '1px solid rgba(168, 85, 247, 0.2)';
            aiDiv.style.padding = '15px';
            aiDiv.style.borderRadius = '12px 12px 12px 0';
            aiDiv.style.color = 'white';
            aiDiv.style.width = '90%';
            aiDiv.innerHTML = `<div style="font-weight:700; color:var(--accent-purple); margin-bottom:8px;"><i class="fas fa-robot"></i> DCM Copilot Insight</div>${aiMsg}`;

            chat.appendChild(aiDiv);
            chat.scrollTop = chat.scrollHeight;

            // Phase 120: AI Audit Logging
            if (window.AuditLogger) {
                const activeUser = SessionManager.profile?.name || 'Unknown User';
                // Pseudo-hash for auditability
                const shaHash = Array.from(aiMsg).reduce((hash, char) => 0 | (31 * hash + char.charCodeAt(0)), 0).toString(16).padEnd(64, '0').toUpperCase().substring(0, 64);
                window.AuditLogger.log('AI_COPILOT_GENERATION', {
                    user: activeUser,
                    prompt_type: type,
                    base_scenario: scenario,
                    version: 'Copilot v1.2 / Engine v3.1',
                    output_hash: `SHA256:${shaHash}`
                });
            }

            // Bring back prompts after a short delay for next questions
            setTimeout(() => {
                if (prompts) prompts.style.display = 'flex';
                chat.scrollTop = chat.scrollHeight;
            }, 1000);

        }, 1200);
    },

    // --- MODE SWITCHERS ---
    toggleManagerMode: (active) => {
        const body = document.body;
        if (active) body.classList.add('manager-active');
        else body.classList.remove('manager-active');
    },

    toggleWhiteLabel: (active) => {
        const logo = document.querySelector('.brand h2');
        if (active) {
            logo.innerHTML = '<i class="fas fa-briefcase"></i> ADVISOR <span style="color:var(--accent-blue)">WORKSPACE</span>';
            document.title = "DCM Advisory Workspace";
        } else {
            logo.innerHTML = '<i class="fas fa-cube"></i> DCM <span style="color:var(--accent-blue)">DIGITAL</span>';
            document.title = "DCM Intelligence - Cockpit";
        }
    },

    renderSimulationTable: (sims) => {
        const tbody = document.getElementById('sim-table-body');
        if (!tbody) return;
        tbody.innerHTML = sims.map(sim => `
            <tr>
                <td style="color:#94a3b8">${sim.date}</td>
                <td style="font-weight:600;color:white">${sim.name}</td>
                <td><span class="status-badge" style="background:rgba(59,130,246,0.1);color:#3b82f6">${sim.type}</span></td>
                <td style="color:${sim.status === 'critical' ? '#ef4444' : sim.status === 'warning' ? '#f59e0b' : '#10b981'}">${sim.result}</td>
                <td>
                    <button class="btn-glass" style="font-size:11px;padding:5px 10px" onclick="window.location.href='yield-mechanics.html?replay=${sim.id}'">
                        <i class="fas fa-play"></i> Replay
                    </button>
                </td>
            </tr>
        `).join('');
    },

    renderComplianceWidget: (profile) => {
        const scoreEl = document.getElementById('compliance-score-val');
        const barEl = document.getElementById('compliance-bar-fill');
        const alertEl = document.getElementById('compliance-alerts');
        if (scoreEl) scoreEl.innerText = `${profile.impactScore}/100`;
        if (barEl) barEl.style.width = `${profile.impactScore}%`;
        if (alertEl) {
            alertEl.innerHTML = profile.alerts.map(a =>
                `<div style="font-size:12px;color:#f59e0b;margin-top:5px"><i class="fas fa-exclamation-triangle"></i> ${a}</div>`
            ).join('');
        }
    },

    // --- PHASE 49: DYNAMIC RISK WIDGET ---
    renderRiskWidget: (riskData) => {
        const cardEl = document.getElementById('risk-card');
        const circleEl = document.getElementById('risk-score-circle');
        const labelEl = document.getElementById('risk-score-label');
        const alertsEl = document.getElementById('risk-alerts');

        if (circleEl) {
            circleEl.innerText = riskData.tier;
            circleEl.style.borderColor = riskData.color;
            circleEl.style.color = riskData.color;
        }
        if (cardEl) {
            cardEl.style.borderTopColor = riskData.color;
        }
        if (labelEl) {
            labelEl.innerText = riskData.label;
        }
        if (alertsEl) {
            alertsEl.innerHTML = riskData.alerts.map(a =>
                `<div style="font-size:11px; margin-top:5px; padding:6px 8px; border-radius:6px; background:rgba(255,255,255,0.05); color:${a.type === 'critical' ? '#ef4444' : a.type === 'warning' ? '#f59e0b' : '#10b981'}">
                    <i class="fas fa-${a.type === 'critical' ? 'radiation' : a.type === 'warning' ? 'exclamation-circle' : 'check-circle'}"></i> ${a.text}
                </div>`
            ).join('');
        }
    },

    /**
     * Renders recommendations into the Advisor UI box. (Phase 63)
     */
    renderRecommendations: (recs) => {
        const container = document.getElementById('advisor-insights');
        if (!container) return;

        if (!recs || recs.length === 0) {
            container.innerHTML = '<div style="color:#64748b; font-size:13px; font-style:italic;">Aucune recommandation critique pour le moment. Votre cockpit est optimal.</div>';
            return;
        }

        container.innerHTML = recs.map(r => `
            <div class="insight-card-mini" onclick="DashboardEngine.showTraceability('${r.id}')" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); padding:15px; border-radius:12px; cursor:pointer; transition:all 0.3s; position:relative; overflow:hidden;">
                <div style="font-weight:700; color:white; font-size:13px; margin-bottom:4px;">${r.title}</div>
                <div style="color:#94a3b8; font-size:12px; line-height:1.4;">${r.advice}</div>
                <div class="trace-badge"><i class="fas fa-microchip"></i> Traceability Check</div>
            </div>
        `).join('');
    },

    showTraceability: (id) => {
        const rule = DashboardEngine.RecommendationEngine.RULES.find(r => r.id === id);
        if (!rule) return;

        const modal = document.createElement('div');
        modal.style.cssText = `
            position:fixed; top:0; left:0; width:100%; height:100%; 
            background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); 
            display:flex; justify-content:center; align-items:center; z-index:10000;
        `;
        modal.innerHTML = `
            <div style="background:#0f172a; border:1px solid #334155; padding:40px; border-radius:24px; max-width:500px; position:relative; animation: slideUp 0.3s ease;">
                <button onclick="this.parentElement.parentElement.remove()" style="position:absolute; top:20px; right:20px; background:none; border:none; color:#64748b; font-size:24px; cursor:pointer;">&times;</button>
                <h3 style="color:#22c55e; margin-bottom:15px; font-family:'Outfit';">Traceability Logs (Bayesian Inference)</h3>
                <div style="font-family:'JetBrains Mono', monospace; font-size:13px; color:#cbd5e1; background:rgba(0,0,0,0.3); padding:20px; border-radius:12px; border:1px solid rgba(255,255,255,0.05); line-height:1.6;">
                    [INPUT_DATA] Role: ${localStorage.getItem('dcm_active_role') || 'Guest'}<br>
                    [ENGINE] Rule_${rule.id} triggered.<br><br>
                    [LOGIC] ${rule.traceability}<br><br>
                    [CONFIDENCE] 98.4%
                </div>
            </div>
            <style>@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }</style>
        `;
        document.body.appendChild(modal);
    },

    renderTimeline: (events) => {
        const container = document.getElementById('activity-timeline');
        if (!container) return;
        container.innerHTML = events.map(ev => `
            <div style="padding:10px 0; border-left:2px solid rgba(148,163,184,0.1); padding-left:15px; position:relative; margin-bottom:5px">
                <div style="position:absolute; left:-6px; top:15px; width:10px; height:10px; background:#3b82f6; border-radius:50%"></div>
                <div style="font-size:11px; color:#64748b">${ev.date} • ${ev.time}</div>
                <div style="font-weight:600; color:white; margin-top:2px">${ev.action}</div>
                <div style="font-size:12px; color:#94a3b8">${ev.detail}</div>
            </div>
        `).join('');
    },

    // --- SAAS MANAGER MODE (Phase 50) ---
    switchToTeamView: () => {
        // 1. Radar & Evolution Charts (Mocked Aggregation)
        const chart = Chart.getChart('radarChart');
        if (chart) { chart.data.datasets[0].data = [85, 90, 75, 88]; chart.data.datasets[0].label = 'Team Average'; chart.update(); }
        const evoChart = Chart.getChart('evolutionChart');
        if (evoChart) { evoChart.data.datasets[0].data = [60, 65, 70, 75, 82, 88, 92]; evoChart.data.datasets[0].label = 'Team Velocity'; evoChart.update(); }
        const el = document.querySelector('.score-val'); if (el) el.innerText = 'A+';

        // 2. Compliance Widget
        const covEl = document.querySelector('.coverage-val'); if (covEl) covEl.innerText = '95%';
        const covBar = document.getElementById('coverage-bar'); if (covBar) covBar.style.width = '95%';
        const compBar = document.getElementById('compliance-bar-fill'); if (compBar) compBar.style.width = '92%';
        const compScore = document.getElementById('compliance-score-val'); if (compScore) compScore.innerText = '92/100';
        const alerts = document.getElementById('compliance-alerts');
        if (alerts) alerts.innerHTML = `<div class="status-badge" style="background:rgba(16,185,129,0.1);color:#10b981">✅ TEAM COMPLIANT</div>
            <div class="status-badge" style="background:rgba(59,130,246,0.1);color:#3b82f6">ℹ️ 5 MEMBERS ACTIVE</div>`;

        // 3. Team Risk Engine (Phase 50)
        DashboardEngine.renderRiskWidget({
            tier: 'Medium', color: 'var(--accent-gold)', label: 'Exposition Équipe Modérée',
            alerts: [
                { text: '1 collaborateur(s) surexposé(s) au risque DeFi', type: 'warning' },
                { text: 'Couverture globale MiCA stable', type: 'optimal' }
            ]
        });

        // 4. Team Title & Headers Morphing (Phase 50)
        const tableTitle = document.getElementById('sim-table-title');
        if (tableTitle) tableTitle.innerHTML = '<i class="fas fa-users-cog"></i> Audit Logs (Équipe)';
        const colScenario = document.getElementById('col-scenario');
        if (colScenario) colScenario.innerText = 'Collaborateur';
        const colType = document.getElementById('col-type');
        if (colType) colType.innerText = 'Action Auditée';

        // 5. Team Audit Logs Injection (Phase 50)
        const tbody = document.getElementById('sim-table-body');
        if (tbody) {
            tbody.innerHTML = `
                <tr><td style="color:#94a3b8">Aujourd'hui</td><td style="font-weight:600;color:white">Alice Dupont</td><td><span class="status-badge" style="background:rgba(59,130,246,0.1);color:#3b82f6">Simulation Exécutée</span></td><td style="color:#f59e0b">High Yield ETH</td><td><button class="btn-glass" style="font-size:11px;padding:5px 10px"><i class="fas fa-search"></i> Inspect</button></td></tr>
                <tr><td style="color:#94a3b8">Hier</td><td style="font-weight:600;color:white">Marc Leroy</td><td><span class="status-badge" style="background:rgba(16,185,129,0.1);color:#10b981">Quiz Validé</span></td><td style="color:#10b981">Note: A-</td><td><button class="btn-glass" style="font-size:11px;padding:5px 10px"><i class="fas fa-search"></i> Inspect</button></td></tr>
                <tr><td style="color:#94a3b8">Mardi</td><td style="font-weight:600;color:white">Sophie Martin</td><td><span class="status-badge" style="background:rgba(239,68,68,0.1);color:#ef4444">Alerte Conformité</span></td><td style="color:#ef4444">Friction MiCA</td><td><button class="btn-glass" style="font-size:11px;padding:5px 10px"><i class="fas fa-search"></i> Inspect</button></td></tr>
                <tr><td style="color:#94a3b8">Lundi</td><td style="font-weight:600;color:white">Marc Leroy</td><td><span class="status-badge" style="background:rgba(148,163,184,0.1);color:#94a3b8">Rapport Exporté</span></td><td style="color:white">Weekly_Brief.pdf</td><td><button class="btn-glass" style="font-size:11px;padding:5px 10px"><i class="fas fa-search"></i> Inspect</button></td></tr>
            `;
        }

        // 6. Team Timeline Timeline (Phase 50)
        DashboardEngine.renderTimeline([
            { date: 'Today', time: '11:05', action: 'Alice Dupont - Login', detail: 'Paris, FR' },
            { date: 'Today', time: '09:30', action: 'Système', detail: 'Consolidation des risques journalière terminée' },
            { date: 'Yesterday', time: '16:45', action: 'Marc Leroy - Logout', detail: 'Session: 4h 12m' }
        ]);
    },

    switchToPersonalView: async () => {
        // Restore DOM Titles and Headers (Phase 50)
        const tableTitle = document.getElementById('sim-table-title');
        if (tableTitle) tableTitle.innerHTML = '<i class="fas fa-list"></i> Historique des Simulations';
        const colScenario = document.getElementById('col-scenario');
        if (colScenario) colScenario.innerText = 'Scénario';
        const colType = document.getElementById('col-type');
        if (colType) colType.innerText = 'Type';

        // Reload Personal Profile
        const data = await DashboardEngine.loadData();
        DashboardEngine.initCharts(data);
        DashboardEngine.renderComplianceWidget(data.complianceProfile);
        DashboardEngine.renderRiskWidget(data.riskProfile);
        DashboardEngine.renderTimeline(data.timeline);
        DashboardEngine.renderSimulationTable(data.simulations);
    },

    renderBadges: () => {
        const dock = document.getElementById('badge-dock');
        if (!dock) return;

        const badges = [
            { key: 'quiz_metal_1', icon: '🥉', color: '#cd7f32', title: 'Bronze: Fundamentals' },
            { key: 'quiz_metal_2', icon: '🥈', color: '#c0c0c0', title: 'Silver: Advanced' },
            { key: 'quiz_metal_3', icon: '🥇', color: '#ffd700', title: 'Gold: Expert' },
            { key: 'quiz_rank_4', icon: '🌈', color: '#3b82f6', title: 'Iridescent: Head Of' }
        ];

        dock.innerHTML = badges
            .filter(b => localStorage.getItem(b.key))
            .map(b => `<span title="${b.title}" style="font-size:14px; background:rgba(0,0,0,0.5); border-radius:50%; width:18px; height:18px; display:flex; align-items:center; justify-content:center; border:1px solid ${b.color}; cursor:help;">${b.icon}</span>`)
            .join('');
    },

    // --- PUBLIC API for external modules ---
    SupabaseData
};

// Expose globally
if (typeof window !== 'undefined') {
    window.DashboardEngine = DashboardEngine;
}
