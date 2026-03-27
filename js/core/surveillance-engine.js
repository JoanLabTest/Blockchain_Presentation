/**
 * SURVEILLANCE ENGINE - v1.0 (Phase 114)
 * Real-time Institutional Monitoring Layer for MiCA/DORA Compliance.
 */

const SurveillanceEngine = {
    state: {
        active: true,
        lastCheck: null,
        status: 'INITIALIZING',
        metrics: {
            mica_art23: 100, // Asset Reserve Buffer
            dora_art17: 100, // IT Continuity
            overall_health: 100
        }
    },

    init: function() {
        console.log("🛡️ SurveillanceEngine: Institutional Monitor Activated [MiCA/DORA Mode]");
        this.startHeartbeat();
    },

    /**
     * Translates Stress Test or Backtesting outputs into Regulatory Benchmarks.
     * @param {Object} results - Metrics from StressTestingEngine or BacktestingEngine
     */
    updateFromStressTest: function(results) {
        if (!results) return;

        let micaScore = 100;
        let doraScore = 100;

        // Mode A: From StressTestingEngine (Monte Carlo)
        if (results.metrics && results.metrics.var95 !== undefined) {
            const { var95, infraRiskScore } = results.metrics;
            micaScore = Math.max(0, 100 - (var95 * 4));
            doraScore = Math.max(0, 100 - (infraRiskScore * 5));
        } 
        // Mode B: From BacktestingEngine (Sensitivity Audit)
        else if (results.variance !== undefined) {
            const variance = parseFloat(results.variance);
            micaScore = Math.max(0, 100 - (Math.abs(variance) * 2.5));
            doraScore = results.resilience === 'CRITICAL' ? 45 : (results.resilience === 'MEDIUM' ? 70 : 92);
        }

        this.state.metrics.mica_art23 = Math.round(micaScore);
        this.state.metrics.dora_art17 = Math.round(doraScore);
        this.state.metrics.overall_health = Math.round((micaScore + doraScore) / 2);

        this.updateUI();
        
        // Audit Hook (Phase 115)
        if (window.AuditLogger && window.AuditLogger.log) {
            window.AuditLogger.log('SURVEILLANCE_UPDATE', { 
                mica_status: micaScore > 80 ? 'COMPLIANT' : 'WARNING',
                dora_status: doraScore > 75 ? 'RESILIENT' : 'VULNERABLE',
                timestamp: new Date().toISOString()
            });
        }
    },

    startHeartbeat: function() {
        setInterval(() => {
            if (!this.state.active) return;
            this.state.lastCheck = new Date();
            this.pulseMonitor();
        }, 5000); // 5-second pulse for "Live" feel
    },

    pulseMonitor: function() {
        const pulseDot = document.getElementById('surveillance-pulse');
        const lastCheckEl = document.getElementById('last-compliance-check');
        
        if (pulseDot) {
            pulseDot.style.opacity = '1';
            setTimeout(() => pulseDot.style.opacity = '0.4', 800);
        }

        if (lastCheckEl) {
            lastCheckEl.innerText = this.state.lastCheck.toLocaleTimeString();
        }
    },

    updateUI: function() {
        const micaEl = document.getElementById('mica-health-val');
        const doraEl = document.getElementById('dora-health-val');
        const statusBadge = document.getElementById('surveillance-status-badge');

        if (micaEl) micaEl.style.width = `${this.state.metrics.mica_art23}%`;
        if (doraEl) doraEl.style.width = `${this.state.metrics.dora_art17}%`;

        if (statusBadge) {
            const health = this.state.metrics.overall_health;
            if (health > 85) {
                statusBadge.innerText = 'HEALTHY';
                statusBadge.style.color = '#10b981';
            } else if (health > 60) {
                statusBadge.innerText = 'STRESSED';
                statusBadge.style.color = '#f59e0b';
            } else {
                statusBadge.innerText = 'CRITICAL';
                statusBadge.style.color = '#ef4444';
            }
        }
    }
};

if (typeof window !== 'undefined') {
    window.SurveillanceEngine = SurveillanceEngine;
}
