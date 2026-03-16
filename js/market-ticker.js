/**
 * DCM Core Institute - Market Telemetry Ticker
 * Real-time institutional metrics layer
 */

const TICKER_CONFIG = {
    en: {
        index: "GTCMI Index",
        aum: "Total AUM",
        sync: "Last Sync",
        status: "Live"
    },
    fr: {
        index: "Indice GTCMI",
        aum: "AUM Global",
        sync: "Dernière Sync",
        status: "En Direct"
    }
};

class MarketTicker {
    constructor() {
        this.lang = document.documentElement.lang || 'en';
        this.config = TICKER_CONFIG[this.lang] || TICKER_CONFIG.en;
        this.container = document.getElementById('market-telemetry-ticker');
        this.interval = null;
        
        if (this.container) {
            this.init();
        }
    }

    init() {
        this.render();
        this.update();
        // Update every 10 seconds
        this.interval = setInterval(() => this.update(), 10000);
    }

    render() {
        this.container.innerHTML = `
            <div class="ticker-content">
                <div class="ticker-item" id="ticker-index">
                    <span class="ticker-label">${this.config.index}:</span>
                    <span class="ticker-value">--</span>
                </div>
                <div class="ticker-item" id="ticker-aum">
                    <span class="ticker-label">${this.config.aum}:</span>
                    <span class="ticker-value">--</span>
                </div>
                <div class="ticker-item" id="ticker-sync">
                    <span class="ticker-label">${this.config.sync}:</span>
                    <span class="ticker-value">--</span>
                </div>
                <div class="ticker-status">
                    <span class="status-pulse"></span>
                    <span class="status-text">${this.config.status}</span>
                </div>
            </div>
        `;
    }

    update() {
        if (!window.DCM || !window.DCM.stats) {
            console.warn("DCM API not available for ticker updates.");
            return;
        }

        const stats = window.DCM.stats();
        const now = new Date();
        const timeStr = now.toLocaleTimeString(this.lang === 'fr' ? 'fr-FR' : 'en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });

        const indexEl = this.container.querySelector('#ticker-index .ticker-value');
        const aumEl = this.container.querySelector('#ticker-aum .ticker-value');
        const syncEl = this.container.querySelector('#ticker-sync .ticker-value');

        if (indexEl) indexEl.textContent = stats.gtcm_index_status;
        if (aumEl) aumEl.textContent = stats.total_aum_verified;
        if (syncEl) syncEl.textContent = timeStr;

        // Trigger pulse animation on the container
        this.container.classList.remove('ticker-pulse');
        void this.container.offsetWidth; // Trigger reflow
        this.container.classList.add('ticker-pulse');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Ensure GTSR engine is loaded first or DCM API is present
    if (window.DCM) {
        new MarketTicker();
    } else {
        // Fallback if script order is tricky
        setTimeout(() => new MarketTicker(), 500);
    }
});
