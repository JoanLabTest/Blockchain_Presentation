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
                return await res.json();
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

function renderCharts(data) {
    // 1. BAR CHART (Levels)
    const ctxLevel = document.getElementById('levelChart').getContext('2d');
    new Chart(ctxLevel, {
        type: 'bar',
        data: {
            labels: ['Fondamental', 'Intermédiaire', 'Expert'],
            datasets: [
                {
                    label: 'Réussite (%)',
                    data: [data.levels.fundamental.pass, data.levels.intermediate.pass, data.levels.expert.pass],
                    backgroundColor: '#10b981',
                    borderRadius: 6
                },
                {
                    label: 'Échec (%)',
                    data: [data.levels.fundamental.fail, data.levels.intermediate.fail, data.levels.expert.fail],
                    backgroundColor: '#ef4444',
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8' } }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
        }
    });

    // 2. DOUGHNUT CHART (Ranks)
    const ctxRank = document.getElementById('rankChart').getContext('2d');
    new Chart(ctxRank, {
        type: 'doughnut',
        data: {
            labels: ['Bronze', 'Silver', 'Gold'],
            datasets: [{
                data: data.ranks,
                backgroundColor: ['#cd7f32', '#c0c0c0', '#fbbf24'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8' } }
            },
            cutout: '70%'
        }
    });
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
