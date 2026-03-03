// market-data.js
// Orchestrates Real-Time Data Feeds for the Research OS

const MarketData = {
    sources: {
        coingecko: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur&include_last_updated_at=true"
    },
    
    state: {
        ethPrice: 0,
        lastUpdate: null,
        isLive: false,
        blockHeight: 19420402
    },

    async init() {
        console.log("📡 Initializing Research OS Live Data Feed...");
        
        // Initial Fetch
        await this.fetchData();
        
        // Start Loops
        setInterval(() => this.fetchData(), 60000); // Poll Price every 60s
        setInterval(() => this.simulateBlock(), 12000); // New Block every 12s
    },

    async fetchData() {
        try {
            const response = await fetch(this.sources.coingecko);
            if (!response.ok) throw new Error("API Fetch Failed");
            
            const data = await response.json();
            
            if (data.ethereum && data.ethereum.eur) {
                this.state.ethPrice = data.ethereum.eur;
                this.state.lastUpdate = new Date(data.ethereum.last_updated_at * 1000);
                this.state.isLive = true;
                this.updateUI();
            }
        } catch (e) {
            console.warn("⚠️ Market Data Oracle Error (CORS/RateLimit). Using Fallback.", e);
            this.state.isLive = false;
            // Fallback: Use config or maintain last known
            if (this.state.ethPrice === 0) this.state.ethPrice = 2450.00; // Hardcoded fallback
            this.updateUI();
        }
    },

    simulateBlock() {
        this.state.blockHeight++;
        const el = document.getElementById('block-height');
        if(el) {
            el.innerText = this.state.blockHeight;
            el.style.color = "#10b981";
            setTimeout(() => el.style.color = "#64748b", 500);
        }
    },

    updateUI() {
        // Update Price
        const priceEls = document.querySelectorAll('[data-live="price-eth"]');
        priceEls.forEach(el => {
            el.innerText = this.state.ethPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
            if (this.state.isLive) el.classList.add('live-flash');
            setTimeout(() => el.classList.remove('live-flash'), 1000);
        });

        // Update Timestamp
        const timeEls = document.querySelectorAll('[data-live="timestamp"]');
        const now = new Date();
        timeEls.forEach(el => {
            el.innerText = now.toLocaleTimeString();
        });

        // Update Status
        const statusEls = document.querySelectorAll('.data-status-indicator');
        statusEls.forEach(el => {
            if (this.state.isLive) {
                el.innerHTML = '<span class="pulsing-dot"></span> Live Oracle';
            } else {
                el.innerHTML = '<span class="pulsing-dot orange"></span> Cached Data';
            }
        });
    }
};

// Auto-start on load
document.addEventListener('DOMContentLoaded', () => MarketData.init());
