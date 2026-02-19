/**
 * DASHBOARD INTELLIGENCE ENGINE (v2.0)
 * Handles data simulation, chart rendering, and "Brain" logic for the user dashboard.
 * Designed to be replaced by Supabase API calls in production.
 */

export const DashboardEngine = {
    // --- MOCK DATA GENERATOR ---
    generateMockData: () => {
        // 1. Simulation History
        const simulations = [
            { id: 1, date: '2026-02-18', name: 'High Yield ETH Strategy', type: 'Staking', result: '5.2% APY', status: 'optimal' },
            { id: 2, date: '2026-02-15', name: 'Risky Leverage Play', type: 'Lending', result: 'High Risk', status: 'warning' },
            { id: 3, date: '2026-02-10', name: 'Stablecoin Safety Net', type: 'Liquidity', result: '3.1% APY', status: 'optimal' },
            { id: 4, date: '2026-02-05', name: 'RWA Exposure Test', type: 'RWA', result: '4.8% APY', status: 'optimal' },
            { id: 5, date: '2026-01-28', name: 'DeFi Crash Sim', type: 'Stress Test', result: '-15% Drawdown', status: 'critical' }
        ];

        // 2. Evolution Data (Score History)
        const evolutionLabels = ['Jan W1', 'Jan W2', 'Jan W3', 'Jan W4', 'Feb W1', 'Feb W2', 'Feb W3'];
        const researchScores = [45, 48, 55, 62, 65, 70, 78];
        const quizScores = [60, 65, 62, 70, 75, 80, 85];

        // 3. Radar Scores (Breakdown)
        const radarData = {
            labels: ['Technology', 'Legal', 'Risk Mgmt', 'Engagement'],
            dataset: [65, 85, 90, 75] // Strong legal/risk, weaker tech
        };

        // 4. Compliance Profile
        const complianceProfile = {
            jurisdiction: 'EU (MiCA)',
            impactScore: 42, // 0-100 friction
            alerts: ['Verify CASP License', 'T+1 Settlement Check']
        };

        // 5. User Activity Timeline (NEW)
        const timeline = [
            { date: 'Today', time: '10:42 AM', action: 'Simulation Run', detail: 'High Yield ETH Strategy' },
            { date: 'Yesterday', time: '15:30 PM', action: 'Quiz Completed', detail: 'Level 2: Smart Contracts' },
            { date: '17 Feb', time: '09:15 AM', action: 'Login', detail: 'New Device (MacBook Pro)' },
            { date: '15 Feb', time: '14:20 PM', action: 'Export', detail: 'Weekly_Risk_Report.pdf' }
        ];

        // 6. Audit System Status (NEW)
        const systemStatus = {
            lastSync: 'Just now',
            dataVersion: 'v2.4.1',
            securityLevel: 'High (AES-256)',
            nextBackup: 'in 2 hours'
        };

        return { simulations, evolutionLabels, researchScores, quizScores, radarData, complianceProfile, timeline, systemStatus };
    },

    // --- CHART RENDERING ---
    initCharts: (data) => {
        // RADAR CHART (Score Breakdown)
        const ctxRadar = document.getElementById('radarChart').getContext('2d');
        new Chart(ctxRadar, {
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
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: { color: '#94a3b8', font: { size: 11 } },
                        ticks: { backdropColor: 'transparent', color: 'transparent' } // Hide numbers
                    }
                },
                plugins: { legend: { display: false } }
            }
        });

        // LINE CHART (Evolution)
        const ctxLine = document.getElementById('evolutionChart').getContext('2d');
        new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: data.evolutionLabels,
                datasets: [
                    {
                        label: 'Research Score',
                        data: data.researchScores,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
                    y: {
                        grid: { color: '#1e293b' },
                        ticks: { color: '#94a3b8' },
                        beginAtZero: true,
                        max: 100
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8' }
                    }
                }
            }
        });
    },

    // --- TABLE RENDERING ---
    renderSimulationTable: (sims) => {
        const tbody = document.getElementById('sim-table-body');
        if (!tbody) return;

        tbody.innerHTML = sims.map(sim => `
            <tr>
                <td style="color:#94a3b8">${sim.date}</td>
                <td style="font-weight:600; color:white;">
                    ${sim.name}
                </td>
                <td><span class="badge ${sim.type === 'Stress Test' ? 'badge-warn' : 'badge-info'}">${sim.type}</span></td>
                <td style="color:${sim.status === 'critical' ? '#ef4444' : sim.status === 'warning' ? '#f59e0b' : '#10b981'}">
                    ${sim.result}
                </td>
                <td>
                    <button class="btn-small" title="Replay" onclick="window.location.href='yield-mechanics.html?replay=${sim.id}'">
                        <i class="fas fa-play"></i>
                    </button>
                    <!-- <button class="btn-small"><i class="fas fa-file-export"></i></button> -->
                </td>
            </tr>
        `).join('');
    },

    // --- COMPLIANCE WIDGET ---
    renderComplianceWidget: (profile) => {
        const scoreEl = document.getElementById('compliance-score-val');
        const barEl = document.getElementById('compliance-bar-fill');
        const alertListEl = document.getElementById('compliance-alerts');

        if (scoreEl) scoreEl.innerText = profile.impactScore + '/100';
        if (barEl) barEl.style.width = profile.impactScore + '%';

        if (alertListEl) {
            alertListEl.innerHTML = profile.alerts.map(alert => `
                <div style="font-size:12px; color:#f59e0b; margin-top:5px;">
                    <i class="fas fa-exclamation-triangle"></i> ${alert}
                </div>
            `).join('');
        }
    },

    // --- TIMELINE RENDERING (NEW) ---
    renderTimeline: (timelineEvents) => {
        const container = document.getElementById('activity-timeline');
        if (!container) return;

        container.innerHTML = timelineEvents.map(event => `
            <div class="timeline-item" style="padding:10px 0; border-left:2px solid var(--border); padding-left:15px; position:relative;">
                <div style="position:absolute; left:-6px; top:15px; width:10px; height:10px; background:var(--accent-blue); border-radius:50%;"></div>
                <div style="font-size:11px; color:var(--text-muted);">${event.date} • ${event.time}</div>
                <div style="font-weight:600; color:white; margin-top:2px;">${event.action}</div>
                <div style="font-size:12px; color:var(--text-secondary);">${event.detail}</div>
            </div>
        `).join('');
    },

    // --- KPI STRIP RENDERING (REMOVED IN HYBRID LAYOUT) ---
    // KPIs are now back in the main Dashboard Cards (Phase 25 Style)
    // --- SAAS MANAGER MODE (Phase 29) ---
    switchToTeamView: () => {
        // Mock Team Data (Aggregated)
        const teamResearch = [60, 65, 70, 75, 82, 88]; // Higher average
        const teamCompliance = 92;

        // Update Research Chart
        const chart = Chart.getChart("radarChart");
        if (chart) {
            chart.data.datasets[0].data = [85, 90, 75, 88, 92]; // Tech, Legal, Finance, Ops, Strat
            chart.data.datasets[0].label = "Team Average";
            chart.data.datasets[0].borderColor = "#3b82f6";
            chart.data.datasets[0].backgroundColor = "rgba(59, 130, 246, 0.2)";
            chart.update();
        }

        // Update Evolution Chart
        const evoChart = Chart.getChart("evolutionChart");
        if (evoChart) {
            evoChart.data.datasets[0].data = teamResearch;
            evoChart.data.datasets[0].label = "Team Velocity";
            evoChart.data.datasets[0].borderColor = "#10b981";
            evoChart.update();
        }

        // Update Text Metrics
        const valEl = document.querySelector('.score-val');
        if (valEl) valEl.innerText = "A+";

        const circleEl = document.querySelector('.score-circle');
        if (circleEl) circleEl.innerText = "92%";

        const covValEl = document.querySelector('.coverage-val');
        if (covValEl) covValEl.innerText = "95%";

        const covBarEl = document.getElementById('coverage-bar');
        if (covBarEl) covBarEl.style.width = "95%";

        const compScoreEl = document.getElementById('compliance-score-val');
        if (compScoreEl) compScoreEl.innerText = teamCompliance + "/100";

        const compBarEl = document.getElementById('compliance-bar-fill');
        if (compBarEl) compBarEl.style.width = teamCompliance + "%";

        // Update Alerts
        const alertBox = document.getElementById('compliance-alerts');
        if (alertBox) {
            alertBox.innerHTML = `
                <div class="status-badge" style="background:rgba(16, 185, 129, 0.1); color:var(--accent-green)">✅ TEAM COMPLIANT</div>
                <div class="status-badge" style="background:rgba(59, 130, 246, 0.1); color:var(--accent-blue)">ℹ️ 5 MEMBERS ACTIVE</div>
            `;
        }
    },

    switchToPersonalView: () => {
        // Re-generate Personal Data to revert
        const data = DashboardEngine.generateMockData();

        // Update Research Chart
        const chart = Chart.getChart("radarChart");
        if (chart) {
            chart.data.datasets[0].data = data.radarData.dataset;
            chart.data.datasets[0].label = "Skill Matrix";
            chart.data.datasets[0].borderColor = "#3b82f6";
            chart.data.datasets[0].backgroundColor = "rgba(59, 130, 246, 0.2)";
            chart.update();
        }

        // Update Evolution Chart
        const evoChart = Chart.getChart("evolutionChart");
        if (evoChart) {
            evoChart.data.datasets[0].data = data.researchScores;
            evoChart.data.datasets[0].label = "Research Score";
            evoChart.data.datasets[0].borderColor = "#3b82f6";
            evoChart.update();
        }

        // Update Text Metrics
        const score = data.researchScores[data.researchScores.length - 1]; // number

        const valEl = document.querySelector('.score-val');
        if (valEl) valEl.innerText = "A-"; // Hardcoded revert to match initial state visually if possible, or mapping logic. 
        // Actually initial state uses data.researchScores[last]. Let's just use "A-" as that's what we saw in the HTML hardcoded or initialized.

        const circleEl = document.querySelector('.score-circle');
        if (circleEl) circleEl.innerText = "85%";

        const covValEl = document.querySelector('.coverage-val');
        if (covValEl) covValEl.innerText = "65%";

        const covBarEl = document.getElementById('coverage-bar');
        if (covBarEl) covBarEl.style.width = "65%";

        DashboardEngine.renderComplianceWidget(data.complianceProfile);
    }
};
