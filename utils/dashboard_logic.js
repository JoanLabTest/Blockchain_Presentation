// DASHBOARD LOGIC
// Fetches analytics from n8n and renders charts

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check Config
    if (!window.DCM_CONFIG || !DCM_CONFIG.analyticsUrl) {
        console.warn("Analytics URL not configured. Using Mock Data.");
    }

    // 2. Init UI
    const loading = document.getElementById('loading');

    try {
        // 3. Fetch Data (or fall back to mock)
        const data = await fetchAnalyticsData();

        // 4. Update UI
        updateKPIs(data);
        renderCharts(data);

        // 5. Hide Loader
        loading.style.display = 'none';

    } catch (error) {
        console.error("Dashboard Error:", error);
        loading.innerHTML = `<span style="color: #ef4444;"><i class="fas fa-exclamation-triangle"></i> Erreur: ${error.message}</span>`;
    }
});

async function fetchAnalyticsData() {
    // Attempt fetch if URL exists
    if (window.DCM_CONFIG && DCM_CONFIG.analyticsUrl) {
        try {
            const res = await fetch(DCM_CONFIG.analyticsUrl, {
                method: "GET", // Simple GET for analytics
                headers: { "Content-Type": "application/json" }
            });
            if (res.ok) {
                const result = await res.json();
                // Handle n8n returning an array of items (common)
                if (Array.isArray(result) && result.length > 0) {
                    return result[0];
                }
                return result;
            }
        } catch (e) {
            console.warn("API Fetch failed, using fallback data", e);
        }
    }

    // Fallback Mock Data (Demo Mode)
    return {
        total_quizzes: 124,
        pass_rate: 68,
        diplomas_issued: 42,
        avg_score: 8.5,
        levels: {
            fundamental: { pass: 80, fail: 20 },
            intermediate: { pass: 60, fail: 40 },
            expert: { pass: 45, fail: 55 }
        },
        ranks: [10, 25, 7] // Bronze, Silver, Gold
    };
}

function updateKPIs(data) {
    animateValue("kpi-total-quiz", 0, data.total_quizzes, 2000);
    animateValue("kpi-pass-rate", 0, data.pass_rate, 2000, "%");
    animateValue("kpi-diplomas", 0, data.diplomas_issued, 2000);
    document.getElementById("kpi-avg-score").innerText = data.avg_score + "/10";
}

// Global chart instances to allow destruction
let charts = {};

function renderCharts(data) {
    if (!data || !data.levels || !data.ranks) {
        console.error("Incomplete data for charts:", data);
        return;
    }

    // Delay slightly to ensure layout and canvas sizes are ready
    setTimeout(() => {
        // 1. BAR CHART (Levels)
        const canvasLevel = document.getElementById('levelChart');
        if (!canvasLevel) return;

        // Destroy existing chart if it exists
        if (charts.level) charts.level.destroy();

        charts.level = new Chart(canvasLevel, {
            type: 'bar',
            data: {
                labels: ['Fondamental', 'Intermédiaire', 'Expert'],
                datasets: [
                    {
                        label: 'Réussite (%)',
                        data: [
                            Number(data.levels.fundamental?.pass || 0),
                            Number(data.levels.intermediate?.pass || 0),
                            Number(data.levels.expert?.pass || 0)
                        ],
                        backgroundColor: '#10b981',
                        borderRadius: 6
                    },
                    {
                        label: 'Échec (%)',
                        data: [
                            Number(data.levels.fundamental?.fail || 0),
                            Number(data.levels.intermediate?.fail || 0),
                            Number(data.levels.expert?.fail || 0)
                        ],
                        backgroundColor: '#ef4444',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#94a3b8' } }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8' }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: '#334155' },
                        ticks: { color: '#94a3b8' }
                    }
                }
            }
        });

        // 2. DOUGHNUT CHART (Ranks)
        const canvasRank = document.getElementById('rankChart');
        if (!canvasRank) return;

        // Destroy existing chart if it exists
        if (charts.rank) charts.rank.destroy();

        charts.rank = new Chart(canvasRank, {
            type: 'doughnut',
            data: {
                labels: ['Bronze', 'Silver', 'Gold'],
                datasets: [{
                    data: (data.ranks || [0, 0, 0]).map(v => Number(v)),
                    backgroundColor: ['#cd7f32', '#c0c0c0', '#fbbf24'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#94a3b8' } }
                },
                cutout: '70%'
            }
        });
    }, 200);
}

// Utility: Count Up Animation
function animateValue(id, start, end, duration, suffix = "") {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start) + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
