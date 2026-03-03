/**
 * Blockchain Network Engine
 * Handles Comparative Radar Charts, Performance Simulators, and Interactive Quizzes.
 */

const NetworkEngine = {

    /**
     * Initializes a Comparative Radar Chart using Chart.js
     * @param {string} canvasId 
     * @param {string} networkName 
     * @param {Array<number>} dataValues [Security, Decentralization, Throughput, Monetary rigidity, Ecosystem depth]
     * @param {string} colorHex 
     */
    initComparativeRadar: function (canvasId, networkName, dataValues, colorHex) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Security', 'Decentralization', 'Throughput', 'Hardness (Monetary)', 'Ecosystem Depth'],
                datasets: [{
                    label: networkName,
                    data: dataValues,
                    backgroundColor: `${colorHex}33`, // 20% opacity
                    borderColor: colorHex,
                    pointBackgroundColor: colorHex,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: colorHex,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: {
                            color: '#ccc',
                            font: { size: 12, family: 'JetBrains Mono' }
                        },
                        ticks: {
                            display: false,
                            min: 0,
                            max: 10,
                            stepSize: 2
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#111',
                        titleColor: '#fff',
                        bodyColor: colorHex,
                        borderColor: '#333',
                        borderWidth: 1,
                        padding: 10
                    }
                }
            }
        });
    },

    /**
     * Renders a Risk Heatmap matrix inside a designated container
     * @param {string} containerId 
     * @param {Object} riskData { Regulatory: 'High', Technical: 'Low', Monetary: 'Medium', Governance: 'Low' }
     */
    initRiskHeatmap: function (containerId, riskData) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">';

        const colors = {
            'Low': 'rgba(16, 185, 129, 0.15)',
            'Medium': 'rgba(245, 158, 11, 0.15)',
            'High': 'rgba(239, 68, 68, 0.15)'
        };
        const textColors = {
            'Low': '#10b981',
            'Medium': '#f59e0b',
            'High': '#ef4444'
        };

        for (const [key, value] of Object.entries(riskData)) {
            html += `
                <div style="background: ${colors[value]}; border: 1px solid ${colors[value].replace('0.15', '0.4')}; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="color: #ccc; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">${key}</div>
                    <div style="color: ${textColors[value]}; font-weight: bold; font-size: 18px;">${value} Risk</div>
                </div>
            `;
        }

        html += '</div>';
        container.innerHTML = html;
    },

    /**
     * Simulator setup generic handler
     */
    setupSimulator: function (inputId, outputId, calculateLogic) {
        const inputEl = document.getElementById(inputId);
        const outputEl = document.getElementById(outputId);

        if (!inputEl || !outputEl) return;

        const update = () => {
            const val = parseFloat(inputEl.value) || 0;
            outputEl.innerHTML = calculateLogic(val);
        };

        inputEl.addEventListener('input', update);
        update(); // Init
    },

    /**
     * Initializes the mini-quiz at the bottom of the deep-dive
     */
    initQuiz: function (containerId, question, answers, correctIndex) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = `
            <div style="background: #080808; border: 1px solid #222; padding: 30px; border-radius: 8px;">
                <h3 style="color: white; margin-bottom: 20px;"><i class="fa-solid fa-graduation-cap" style="color: #10b981;"></i> Mastery Check</h3>
                <p style="color: #ccc; font-size: 16px; margin-bottom: 25px;">${question}</p>
                <div style="display: flex; flex-direction: column; gap: 10px;" id="${containerId}-answers">
        `;

        answers.forEach((ans, idx) => {
            html += `<button onclick="NetworkEngine.checkQuiz('${containerId}', ${idx}, ${correctIndex})" class="quiz-btn" style="padding: 15px; background: #111; color: #888; border: 1px solid #333; cursor: pointer; text-align: left; border-radius: 4px; font-size: 14px; transition: 0.3s; width: 100%; text-transform: none;">${ans}</button>`;
        });

        html += `
                </div>
                <div id="${containerId}-result" style="margin-top: 20px; font-weight: bold; font-size: 14px; display: none;"></div>
            </div>
        `;

        container.innerHTML = html;
    },

    checkQuiz: function (containerId, selectedIdx, correctIdx) {
        const buttons = document.querySelectorAll(`#${containerId}-answers button`);
        const resultDiv = document.getElementById(`${containerId}-result`);

        buttons.forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === correctIdx) {
                btn.style.background = 'rgba(16, 185, 129, 0.2)';
                btn.style.borderColor = '#10b981';
                btn.style.color = '#10b981';
            } else if (idx === selectedIdx && idx !== correctIdx) {
                btn.style.background = 'rgba(239, 68, 68, 0.2)';
                btn.style.borderColor = '#ef4444';
                btn.style.color = '#ef4444';
            }
        });

        resultDiv.style.display = 'block';
        if (selectedIdx === correctIdx) {
            resultDiv.style.color = '#10b981';
            resultDiv.innerHTML = '<i class="fa-solid fa-circle-check"></i> Correct! Certification point awarded.';
        } else {
            resultDiv.style.color = '#ef4444';
            resultDiv.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Incorrect. Review the architecture section above.';
        }
    },
    /**
     * Fetch live market stats from the market-data Edge Function (Phase 52)
     * and populate a Live Stats panel inside containerId.
     * @param {string} containerId - DOM id of the target container
     * @param {string} symbol - 'BTC' | 'ETH' | 'SOL' | 'BNB'
     */
    fetchLiveStats: async function (containerId, symbol) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const MARKET_DATA_URL = 'https://wnwerjuqtrduqkgwdjrg.supabase.co/functions/v1/market-data';
        const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indud2VyanVxdHJkdXFrZ3dkanJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3Mzg3OTEsImV4cCI6MjA4NjMxNDc5MX0.0WqMQs84PFAHuoMQT8xiAZYpWN5b2XGeumtaNzRHcoo';

        const formatPrice = (val) => {
            if (!val) return '--';
            if (val >= 10000) return val.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
            if (val >= 100) return val.toLocaleString('fr-FR', { maximumFractionDigits: 1 });
            return val.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };

        const formatLarge = (val) => {
            if (!val) return '--';
            if (val >= 1e12) return `${(val / 1e12).toFixed(2)}T`;
            if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
            if (val >= 1e6) return `${(val / 1e6).toFixed(0)}M`;
            return val.toLocaleString('fr-FR');
        };

        // Loading skeleton
        container.innerHTML = `
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin:20px 0;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
                    <span style="width:8px;height:8px;border-radius:50%;background:#10b981;animation:blink 1.5s infinite;display:inline-block;"></span>
                    <span style="color:#10b981;font-weight:700;font-size:13px;letter-spacing:1px;">LIVE MARKET DATA</span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;" id="${containerId}-grid">
                    <div style="color:#555;font-size:12px;">Chargement...</div>
                </div>
            </div>
        `;

        try {
            const res = await fetch(MARKET_DATA_URL, {
                headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const coin = data.coins?.[symbol];

            if (!coin) throw new Error('Coin not found');

            const change = coin.change24h?.toFixed(2) ?? null;
            const positive = change !== null && parseFloat(change) >= 0;
            const changeColor = positive ? '#10b981' : '#ef4444';
            const arrow = positive ? '&#9650;' : '&#9660;';

            const statBox = (label, value, highlight = false) =>
                `<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:14px;">
                    <div style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">${label}</div>
                    <div style="color:${highlight || '#e2e8f0'};font-weight:700;font-size:16px;font-family:'JetBrains Mono',monospace;">${value}</div>
                </div>`;

            document.getElementById(`${containerId}-grid`).innerHTML =
                statBox('Prix EUR', `&euro;${formatPrice(coin.priceEur)}`, '#f0c040') +
                statBox('24h Change', change !== null ? `${arrow} ${Math.abs(change)}%` : '--', changeColor) +
                statBox('Market Cap', `&euro;${formatLarge(coin.marketCapEur)}`) +
                statBox('Volume 24h', `&euro;${formatLarge(coin.volume24hEur)}`);

        } catch (err) {
            document.getElementById(`${containerId}-grid`).innerHTML =
                `<span style="color:#555;font-size:12px;">Donnees live indisponibles</span>`;
        }
    },
};

window.NetworkEngine = NetworkEngine;
