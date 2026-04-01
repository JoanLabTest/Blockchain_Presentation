/**
 * DASHBOARD ENGINE — v4.3.2 (Phase 128: Final Resilience & Personalization)
 * Real Supabase data queries with offline-first fallback to mock data.
 * Fully localized for French. Specialized for Master Identity (Joan).
 */

// Dependencies loaded via script tags — accessed as window globals
const _sb = () => window.supabase;

const DashboardEngine = {
    // Phase 122: Global Exposure (Absolute Priority)
    __version: "4.3.2-stable",
};
window.DashboardEngine = DashboardEngine;

// ============================================================
//  SUPABASE DATA LAYER
// ============================================================

const SupabaseData = {
    getQuizResults: async function(userId) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sb = _sb();
        if (!sb) return null;
        const { data, error } = await sb.from('quiz_results').select('*').eq('user_id', userId).gte('completed_at', thirtyDaysAgo.toISOString()).order('completed_at', { ascending: true });
        if (error) { console.warn('⚠️ Erreur fetch quiz:', error); return null; }
        return data;
    },
    getScoreHistory: async function(userId) {
        const sb = _sb();
        if (!sb) return null;
        const { data, error } = await sb.from('research_scores').select('total_score, sub_score_legal, sub_score_tech, sub_score_risk, sub_score_engagement, snapshot_date').eq('user_id', userId).order('snapshot_date', { ascending: true }).limit(8);
        if (error) { console.warn('⚠️ Erreur fetch scores:', error); return null; }
        return data;
    },
    getSimulations: async function(userId) {
        const sb = _sb();
        if (!sb) return null;
        const { data, error } = await sb.from('simulations').select('id, scenario_name, input_data, results, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(10);
        if (error) { console.warn('⚠️ Erreur fetch simulations:', error); return null; }
        return data;
    },
    getActivityLogs: async function(userId) {
        const sb = _sb();
        if (!sb) return null;
        const { data, error } = await sb.from('activity_logs').select('page_url, time_spent_seconds, session_date').eq('user_id', userId).order('session_date', { ascending: false }).limit(5);
        if (error) { console.warn('⚠️ Erreur fetch logs:', error); return null; }
        return data;
    }
};

const MockData = {
    generate: () => ({
        simulations: [
            { id: 1, date: '2026-02-18', name: 'Stratégie ETH Haut Rendement', type: 'Staking', result: '5.2% APY', status: 'optimal' },
            { id: 2, date: '2026-02-15', name: 'Levier Risqué', type: 'Prêt', result: 'Risque Élevé', status: 'warning' },
            { id: 3, date: '2026-02-10', name: 'Filet de Sécurité Stablecoin', type: 'Liquidité', result: '3.1% APY', status: 'optimal' }
        ],
        evolutionLabels: ['Jan S1', 'Jan S2', 'Jan S3', 'Jan S4', 'Fév S1', 'Fév S2'],
        researchScores: [45, 48, 55, 62, 65, 70],
        quizScores: [60, 65, 62, 70, 75, 80],
        radarData: { labels: ['Technologie', 'Légal', 'Risque', 'Engagement'], dataset: [65, 85, 90, 75] },
        complianceProfile: { jurisdiction: 'UE (MiCA)', impactScore: 42, alerts: ['Vérifier Licence CASP', 'Check Règlement T+1'] },
        timeline: [
            { date: 'Aujourd\'hui', time: '10:42', action: 'Simulation Lancée', detail: 'Stratégie ETH Haut Rendement' },
            { date: 'Hier', time: '15:30', action: 'Quiz Terminé', detail: 'Niveau 2: Smart Contracts' }
        ]
    })
};

const Adapters = {
    adaptQuizResults: function(results) {
        if (!results || results.length === 0) return { quizScores: [85], lastGrade: 'A-' };
        const scores = results.map(r => r.score_percent);
        const last = scores[scores.length - 1];
        return { quizScores: scores, lastGrade: last >= 90 ? 'A+' : last >= 80 ? 'A-' : last >= 70 ? 'B+' : 'B' };
    },
    adaptScoreHistory: function(history) {
        if (!history || history.length === 0) return { labels: [], researchScores: [], radarData: null };
        const labels = history.map(h => { const d = new Date(h.snapshot_date); return `${d.toLocaleString('fr', { month: 'short' })} ${d.getDate()}`; });
        const researchScores = history.map(h => Math.round(h.total_score));
        const last = history[history.length - 1];
        const radarData = last ? { labels: ['Technologie', 'Légal', 'Risque', 'Engagement'], dataset: [last.sub_score_tech || 70, last.sub_score_legal || 85, last.sub_score_risk || 90, last.sub_score_engagement || 75] } : null;
        return { labels, researchScores, radarData };
    }
};

Object.assign(DashboardEngine, {
    loadData: async function() {
        try {
            const { data: { session } } = window.supabase ? await window.supabase.auth.getSession() : { data: {} };
            if (!session) return { source: 'mock', ...MockData.generate(), riskProfile: 45 };
            const userId = session.user.id;
            const [quizResults, scoreHistory, simulations, activityLogs] = await Promise.all([SupabaseData.getQuizResults(userId), SupabaseData.getScoreHistory(userId), SupabaseData.getSimulations(userId), SupabaseData.getActivityLogs(userId)]);
            const quizAdapted = Adapters.adaptQuizResults(quizResults);
            const scoreAdapted = Adapters.adaptScoreHistory(scoreHistory);
            const mock = MockData.generate();
            return { source: 'supabase', simulations: scoreAdapted.labels.length > 0 ? simulations : mock.simulations, evolutionLabels: scoreAdapted.labels.length > 0 ? scoreAdapted.labels : mock.evolutionLabels, researchScores: scoreAdapted.researchScores.length > 0 ? scoreAdapted.researchScores : mock.researchScores, quizScores: quizAdapted.quizScores, radarData: scoreAdapted.radarData || mock.radarData, timeline: mock.timeline, lastGrade: quizAdapted.lastGrade };
        } catch (e) {
            console.error("Dashboard data load failure:", e);
            return { source: 'error', ...MockData.generate() };
        }
    },
    initCharts: function(data) {
        const ctxRadar = document.getElementById('radarChart');
        if (ctxRadar) {
            new Chart(ctxRadar.getContext('2d'), {
                type: 'radar',
                data: { labels: data.radarData.labels, datasets: [{ label: 'Skill Matrix', data: data.radarData.dataset, backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: '#3b82f6' }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { r: { ticks: { display: false }, grid: { color: 'rgba(255,255,255,0.1)' } } } }
            });
        }
        const ctxLine = document.getElementById('evolutionChart');
        if (ctxLine) {
            new Chart(ctxLine.getContext('2d'), {
                type: 'line',
                data: { labels: data.evolutionLabels, datasets: [{ label: 'Research Score', data: data.researchScores, borderColor: '#3b82f6', tension: 0.4 }] },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }
            });
        }
    },
    applyRoleVisibility: function(segment) {
        // RESILIENT IDENTITY FETCH (Phase 128)
        const userProfile = window.SessionManager?.getCurrentUser() || 
                           window.SessionManager?.__verifiedProfile || 
                           JSON.parse(localStorage.getItem('dcm_user_profile') || '{}');
        
        const isJoan = (userProfile.email === 'joanlyczak@gmail.com' || localStorage.getItem('dcm_master_active') === 'true');
        
        // Personalization Logic
        let userName = isJoan ? 'Joan' : (userProfile.name || userProfile.full_name || 'Utilisateur').trim();
        if (userName.includes(' ')) userName = userName.split(' ')[0]; // First name extraction

        const greeting = document.getElementById('user-greeting');
        const sideUserName = document.getElementById('side-user-name');
        const sideUserRole = document.getElementById('side-user-role');

        if (sideUserName) sideUserName.innerText = userName;
        if (sideUserRole) sideUserRole.innerText = isJoan ? 'PRO ACCÈS TOTAL' : (userProfile.subscription_tier?.toUpperCase() || 'FREE');
        
        if (greeting) {
            // Force master greeting
            if (isJoan) {
                greeting.innerText = `Bienvenue, Joan 👋`;
            } else {
                const nameLabel = userName === 'Utilisateur' ? '' : userName;
                const segmentGreetings = { 
                    student: `Bienvenue, ${nameLabel} 👋`, 
                    pro: `Performance ROI : ${nameLabel}`, 
                    enterprise: `${nameLabel} | Cockpit Institutionnel` 
                };
                greeting.innerText = segmentGreetings[segment] || `Bienvenue, ${nameLabel} 👋`;
            }
        }
    },
    renderSimulationTable: function(sims) {
        const tbody = document.getElementById('sim-table-body');
        if (tbody) tbody.innerHTML = sims.map(sim => `<tr><td>${new Date(sim.created_at || Date.now()).toLocaleDateString('fr-FR')}</td><td>${sim.scenario_name || sim.name}</td><td>${sim.simulation_type || sim.type}</td><td style="color:#10b981">${sim.results?.summary || sim.result}</td></tr>`).join('');
    },
    renderTimeline: function(events) {
        const container = document.getElementById('activity-timeline');
        if (container) container.innerHTML = events.map(ev => `<div style="margin-bottom:10px; border-left:2px solid #3b82f6; padding-left:10px;"><div style="font-size:11px; color:#64748b">${ev.date}</div><div style="font-weight:600; color:white">${ev.action}</div></div>`).join('');
    },
    switchToTeamView: function() { console.log("Team View Active"); },
    switchToPersonalView: function() { console.log("Personal View Active"); },
    renderBadges: function() { console.log("Badges Rendered"); }
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        console.log("🚀 DashboardEngine: Mode de personnalisation dynamique actif.");
        const data = await DashboardEngine.loadData();
        DashboardEngine.initCharts(data);
        DashboardEngine.applyRoleVisibility(localStorage.getItem('dcm_segment') || 'student');
        DashboardEngine.renderSimulationTable(data.simulations);
        DashboardEngine.renderTimeline(data.timeline);
    } catch (e) {
        console.error("❌ Dashboard Boot Failure:", e);
    }
});
