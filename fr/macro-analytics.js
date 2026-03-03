// macro-analytics.js
// Macro-Economic Sensitivity Engine for Research OS
// Connects Crypto Yields to TradFi Benchmarks (US 10Y Treasury)

const MacroEngine = {
    state: {
        us10y: 4.20, // Default Risk-Free Rate (%)
        fedAdjustment: 0.00, // Basis points adjustment via Slider
        stakingYield: 3.15 // Default, will update from Live Data
    },

    init() {
        console.log("🌍 Initializing Macro Intelligence Layer...");

        // Listen for Live Data updates
        // We poll the DOM because market-data.js updates the UI directly
        // In a strictly reactive framework we'd use state management, but here DOM is source of truth
        setInterval(() => this.syncYield(), 2000);

        // Bind Controls
        const slider = document.getElementById('fedSlider');
        if (slider) {
            slider.addEventListener('input', (e) => {
                this.state.fedAdjustment = parseFloat(e.target.value);
                this.updateUI();
            });
        }

        this.updateUI();
    },

    syncYield() {
        const yieldEl = document.querySelector('[data-config="rate"]'); // From config.js logic or market-data
        if (yieldEl) {
            // Extract float from string like "3.15%" or "3,15 %"
            const text = yieldEl.innerText.replace(',', '.').replace('%', '');
            const val = parseFloat(text);
            if (!isNaN(val) && val !== this.state.stakingYield) {
                this.state.stakingYield = val;
                this.updateUI();
            }
        }
    },

    calculateMetrics() {
        const effectiveRiskFree = this.state.us10y + this.state.fedAdjustment;
        const spread = this.state.stakingYield - effectiveRiskFree;

        // Valuation Impact Proxy (DCF Model Simplification)
        // If Risk Free goes DOWN, Asset Value goes UP
        // Delta Price % ~= - Duration * Delta Yield
        // Assuming Duration of ~20 for high growth crypto assets
        const valuationImpact = -(this.state.fedAdjustment / 100) * 20;

        return {
            effectiveRiskFree,
            spread,
            valuationImpact
        };
    },

    updateUI() {
        const metrics = this.calculateMetrics();

        // Update Text
        const rfEl = document.getElementById('macro-us10y');
        if (rfEl) rfEl.innerText = metrics.effectiveRiskFree.toFixed(2) + "%";

        const spreadEl = document.getElementById('macro-spread');
        if (spreadEl) {
            spreadEl.innerText = (metrics.spread > 0 ? "+" : "") + metrics.spread.toFixed(2) + "%";
            spreadEl.style.color = metrics.spread > 0 ? "#10b981" : "#ef4444";

            // Update Label
            const signalEl = document.getElementById('macro-signal');
            if (signalEl) {
                if (metrics.spread > 2.0) {
                    signalEl.innerText = "ATTRACTIVE ENTRY";
                    signalEl.style.color = "#10b981";
                } else if (metrics.spread > 0) {
                    signalEl.innerText = "NEUTRAL CARRY";
                    signalEl.style.color = "#f59e0b";
                } else {
                    signalEl.innerText = "NEGATIVE CARRY (RISK)";
                    signalEl.style.color = "#ef4444";
                }
            }
        }

        // Update Slider Label
        const adjEl = document.getElementById('fed-adjustment-label');
        if (adjEl) {
            const val = this.state.fedAdjustment;
            adjEl.innerText = (val > 0 ? "+" : "") + val.toFixed(2) + "%";
            adjEl.style.color = val === 0 ? "#94a3b8" : (val < 0 ? "#10b981" : "#ef4444"); // Rate Time: Bad for assets
        }

        // Update Gauge (Simple CSS Width)
        const gaugeBar = document.getElementById('macro-gauge-bar');
        if (gaugeBar) {
            // Normalize spread from -2% to +6% range into 0-100% width
            // -2% = 0%, 2% = 50%, 6% = 100%
            let pct = ((metrics.spread + 2) / 8) * 100;
            pct = Math.max(0, Math.min(100, pct));
            gaugeBar.style.width = pct + "%";
            gaugeBar.style.backgroundColor = metrics.spread > 0 ? "#3b82f6" : "#ef4444";
        }
    }
};

// Auto-init
document.addEventListener('DOMContentLoaded', () => MacroEngine.init());
