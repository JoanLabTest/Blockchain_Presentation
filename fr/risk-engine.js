// risk-engine.js
// Advanced Risk Modeling (Monte Carlo) for Research OS

const RiskEngine = {
    config: {
        simulations: 1000,
        days: 365,
        volatility: 0.45, // 45% Annual Volatility (Crypto standard)
        drift: 0.15 // 15% Expected Annual Return (Staking + Price Appreciation)
    },

    // Geometric Brownian Motion (GBM)
    // S_t = S_0 * exp((mu - 0.5 * sigma^2) * t + sigma * W_t)
    runSimulation(currentPrice) {
        console.time("MonteCarlo");
        const dt = 1 / 365;
        const scenarios = [];

        for (let i = 0; i < this.config.simulations; i++) {
            let price = currentPrice;
            const path = [price];

            for (let t = 0; t < this.config.days; t++) {
                const shock = this.boxMullerTransform();
                const drift = (this.config.drift - 0.5 * Math.pow(this.config.volatility, 2)) * dt;
                const diffusion = this.config.volatility * Math.sqrt(dt) * shock;

                price = price * Math.exp(drift + diffusion);
                path.push(price);
            }
            scenarios.push(path);
        }
        console.timeEnd("MonteCarlo");
        return scenarios;
    },

    // Generate Standard Normal Random Variable
    boxMullerTransform() {
        const u = 1 - Math.random();
        const v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    },

    // Calculate VaR (Value at Risk) at 95% Confidence
    calculateMetrics(scenarios, currentPrice) {
        const finalPrices = scenarios.map(path => path[path.length - 1]).sort((a, b) => a - b);

        const p05 = finalPrices[Math.floor(this.config.simulations * 0.05)]; // 5th Percentile (Worst Case)
        const p50 = finalPrices[Math.floor(this.config.simulations * 0.50)]; // Median
        const p95 = finalPrices[Math.floor(this.config.simulations * 0.95)]; // 95th Percentile (Best Case)

        const var95 = ((currentPrice - p05) / currentPrice) * 100;

        return {
            p05,
            p50,
            p95,
            var95: var95 > 0 ? var95 : 0 // Percentage loss
        };
    },

    // Render Chart.js
    renderChart(scenarios, canvasId) {
        const ctx = document.getElementById(canvasId).getContext('2d');

        // Downsample for performance (Show only 50 paths)
        const pathsToShow = scenarios.slice(0, 50);
        const labels = Array.from({ length: this.config.days }, (_, i) => `Day ${i}`);

        // Construct Datasets
        const datasets = pathsToShow.map(path => ({
            data: path,
            borderColor: 'rgba(59, 130, 246, 0.1)', // Subtle Blue
            borderWidth: 1,
            pointRadius: 0,
            fill: false
        }));

        // Add Average Path
        const avgPath = [];
        for (let d = 0; d < this.config.days; d++) {
            let sum = 0;
            for (let s = 0; s < this.config.simulations; s++) sum += scenarios[s][d];
            avgPath.push(sum / this.config.simulations);
        }
        datasets.push({
            label: 'Mean Projection',
            data: avgPath,
            borderColor: '#10b981', // Green
            borderWidth: 2,
            pointRadius: 0
        });

        if (window.RiskChart) window.RiskChart.destroy();

        window.RiskChart = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, title: { display: true, text: '1,000 Monte Carlo Simulations (1 Year)' } },
                scales: {
                    x: { display: false },
                    y: { grid: { color: '#334155' } }
                }
            }
        });
    }
};
