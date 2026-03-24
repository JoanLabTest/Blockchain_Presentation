/**
 * DCM Core Institute - Narrative Engine
 * Transforms GTSR quantitative data into a continuous sequence of Bloomberg-style market insights.
 */

class NarrativeEngine {
    constructor() {
        this.containerId = 'market-narrative-strip';
        this.container = document.getElementById(this.containerId);
        
        // Wait for container to be ready if called in head
        if (!this.container) {
            window.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) return;

        // Fetch data array
        const combinedDB = (window.GTSR_DATABASE || window.DCM_CORE_DATABASE || []);
        
        // Fallback or seed data to ensure the ticker is never empty
        const fallbackData = [
            { id: 'TFIN-BUIDL-001', name: 'BlackRock BUIDL', aum: '$500M+', infrastructure: 'Ethereum' },
            { id: 'ETH_DOM', name: 'Ethereum Dominance', aum: '72.4%', infrastructure: 'Mainnet' },
            { id: 'TFIN-GS-04', name: 'GS DAP Digital Bond', aum: '$100M', infrastructure: 'Canton' },
            { id: 'TFIN-SG-09', name: 'SG-Forge EURCV', aum: '$12M', infrastructure: 'Ethereum' }
        ];

        this.database = (combinedDB.length > 0) ? combinedDB : fallbackData;

        this.renderStrip();
    }

    generatePhrases() {
        const phrases = [
            "GLOBAL TOKENIZATION MARKET CAP SURPASSES $176B",
            "MICA COMPLIANCE BECOMES MANDATORY FOR EEA ISSUERS"
        ];

        this.database.forEach(asset => {
            if (asset.aum && asset.aum !== 'N/A') {
                phrases.push(`${asset.name.toUpperCase()} REACHES ${asset.aum} AUM ON ${asset.infrastructure.toUpperCase()}`);
            }
            if (asset.dora === 'Compliant') {
                phrases.push(`${asset.name.toUpperCase()} ACHIEVES FULL DORA COMPLIANCE`);
            }
        });

        // Add some macro variations
        phrases.push("INSTITUTIONAL SETTLEMENT CONVERGING ON T+0");
        phrases.push("TFIN STANDARD ADOPTION ACCELERATES ACROSS TIER-1 BANKS");
        
        // Shuffle the array
        for (let i = phrases.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [phrases[i], phrases[j]] = [phrases[j], phrases[i]];
        }
        
        return phrases;
    }

    renderStrip() {
        const phrases = this.generatePhrases();
        
        // Construct the CSS animation content
        // We duplicate the phrases to create a seamless infinite scroll loop
        const innerHTML = phrases.map(p => `
            <div class="narrative-item">
                <span class="narrative-bullet">■</span>
                <span class="narrative-text">${p}</span>
            </div>
        `).join('') + phrases.map(p => `
            <div class="narrative-item" aria-hidden="true">
                <span class="narrative-bullet">■</span>
                <span class="narrative-text">${p}</span>
            </div>
        `).join('');

        this.container.innerHTML = `
            <div class="narrative-track">
                ${innerHTML}
            </div>
        `;

        this.applyStyles();
    }

    applyStyles() {
        if (document.getElementById('narrative-engine-styles')) return;

        const style = document.createElement('style');
        style.id = 'narrative-engine-styles';
        style.innerHTML = `
            .narrative-strip {
                background: #020617;
                border-bottom: 1px solid rgba(59, 130, 246, 0.3);
                border-top: 1px solid rgba(59, 130, 246, 0.3);
                height: 40px;
                width: 100%;
                overflow: hidden;
                position: relative;
                display: flex;
                align-items: center;
                white-space: nowrap;
                z-index: 9998;
            }

            .narrative-strip::before,
            .narrative-strip::after {
                content: '';
                position: absolute;
                top: 0;
                width: 150px;
                height: 100%;
                z-index: 2;
                pointer-events: none;
            }

            .narrative-strip::before {
                left: 0;
                background: linear-gradient(to right, #020617, transparent);
            }

            .narrative-strip::after {
                right: 0;
                background: linear-gradient(to left, #020617, transparent);
            }

            .narrative-track {
                display: inline-flex;
                animation: narrative-scroll 60s linear infinite;
            }
            
            .narrative-track:hover {
                animation-play-state: paused;
            }

            .narrative-item {
                display: inline-flex;
                align-items: center;
                padding: 0 40px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 1px;
                color: #e2e8f0;
            }

            .narrative-bullet {
                color: #10b981; /* Neon green signaling */
                margin-right: 15px;
                font-size: 8px;
                animation: blink-soft 2s infinite;
            }

            .narrative-text {
                text-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
            }

            @keyframes narrative-scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }

            @keyframes blink-soft {
                0%, 100% { opacity: 1; text-shadow: 0 0 8px #10b981; }
                50% { opacity: 0.4; text-shadow: none; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Instantiate globally
window.narrativeEngine = new NarrativeEngine();
