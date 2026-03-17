/**
 * DCM Core Institute - Market Activity Engine
 * Powers the "Live Tokenization Market" feed and Bloomberg-style drill-down.
 */

class MarketActivityEngine {
    constructor() {
        const fallbackData = [
            { id: 'TFIN-BR-01', name: 'BlackRock BUIDL', type: 'Tokenized Fund', infrastructure: 'Ethereum', aum: '$375M', issuer: 'BlackRock', jurisdiction: 'US', compliance: 'DORA / MiCA', isin: 'US123456789', settlement: 'T+0', status: 'LIVE', dora: 'Compliant', liquidity: 'Tier 1 - Institutional' },
            { id: 'TFIN-GS-04', name: 'GS DAP Digital Bond', type: 'Digital Bond', infrastructure: 'Canton', aum: '$100M', issuer: 'Goldman Sachs', jurisdiction: 'Luxembourg', compliance: 'EU Pilot Regime', isin: 'LU987654321', settlement: 'T+0', status: 'LIVE', dora: 'Partial', liquidity: 'Tier 1 - Institutional' },
            { id: 'TFIN-SG-09', name: 'SG-Forge EURCV', type: 'Stablecoin', infrastructure: 'Ethereum', aum: '$12M', issuer: 'Société Générale', jurisdiction: 'France', compliance: 'MiCA Compliant', isin: 'FR001234567', settlement: 'Real-time', status: 'LIVE', dora: 'Compliant', liquidity: 'Tier 2 - Specialized' },
            { id: 'TFIN-DB-02', name: 'DWS Xtrackers DLT', type: 'ETF Token', infrastructure: 'SWIAT', aum: '$50M', issuer: 'DWS Group', jurisdiction: 'Germany', compliance: 'Kvg G', isin: 'DE000ABC123', settlement: 'T+0', status: 'PILOT', dora: 'In Progress', liquidity: 'Tier 2 - Specialized' }
        ];

        this.database = (window.GTSR_DATABASE && window.GTSR_DATABASE.length > 0) ? window.GTSR_DATABASE : fallbackData;
        this.currentEventIndex = 0;
        this.cyclingInterval = null;
        this.feedContainer = null;
        this.panel = null;
        
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.feedContainer = document.getElementById('market-activity-feed');
            this.createSidePanel();
            if (this.feedContainer) {
                this.renderFeed();
                this.startCycling();
            }
        });
    }

    createSidePanel() {
        if (document.getElementById('terminal-side-panel')) return;
        
        this.panel = document.createElement('div');
        this.panel.id = 'terminal-side-panel';
        this.panel.className = 'terminal-panel';
        this.panel.innerHTML = `
            <div class="panel-header">
                <span class="panel-mono">TERMINAL_DRILL_DOWN</span>
                <button class="panel-close" onclick="window.marketActivity.closePanel()">&times;</button>
            </div>
            <div id="panel-content" class="panel-scroll-area">
                <!-- Content injected here -->
            </div>
        `;
        document.body.appendChild(this.panel);
    }

    renderFeed() {
        const events = this.database.slice(0, 5); // Use first 5 assets as "Live" events
        this.feedContainer.innerHTML = '';
        
        events.forEach((asset, index) => {
            const eventEl = document.createElement('div');
            eventEl.className = `activity-event ${index === 0 ? 'active' : ''}`;
            eventEl.innerHTML = `
                <div class="event-meta">
                    <span class="event-label">NEW_ISSUANCE</span>
                    <span class="event-time">Just Now</span>
                </div>
                <div class="event-content" onclick="window.marketActivity.drillDown('${asset.id}')">
                    <span class="event-asset">${asset.name}</span>
                    <span class="event-divider">/</span>
                    <span class="event-infra">${asset.infrastructure}</span>
                    <span class="event-divider">/</span>
                    <span class="event-value">${asset.aum} AUM</span>
                    <i class="fas fa-arrow-right-long event-arrow"></i>
                </div>
            `;
            this.feedContainer.appendChild(eventEl);
        });
    }

    startCycling() {
        const events = document.querySelectorAll('.activity-event');
        if (events.length <= 1) return;

        this.cyclingInterval = setInterval(() => {
            events[this.currentEventIndex].classList.remove('active');
            this.currentEventIndex = (this.currentEventIndex + 1) % events.length;
            events[this.currentEventIndex].classList.add('active');
        }, 5000); // Cycle every 5 seconds
    }

    drillDown(assetId) {
        const asset = this.database.find(a => a.id === assetId);
        if (!asset) return;

        const content = document.getElementById('panel-content');
        content.innerHTML = `
            <h2 class="panel-title">${asset.name}</h2>
            <p class="panel-subtitle">${asset.type}</p>
            
            <div class="panel-stats-grid">
                <div class="stat-box">
                    <span class="stat-label">IDENTIFIER (TFIN)</span>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="stat-value highlight">${asset.id}</span>
                        <button class="copy-btn-mini" onclick="window.marketActivity.copyID('${asset.id}', this)" title="Copy TFIN-ID">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
                <div class="stat-box">
                    <span class="stat-label">ASSET_VALUE (AUM)</span>
                    <span class="stat-value highlight">${asset.aum}</span>
                </div>
            </div>

            <div class="panel-data-table">
                <div class="table-row"><span>Issuer</span><span class="val">${asset.issuer}</span></div>
                <div class="table-row"><span>Infrastructure</span><span class="val">${asset.infrastructure}</span></div>
                <div class="table-row"><span>Jurisdiction</span><span class="val">${asset.jurisdiction}</span></div>
                <div class="table-row"><span>Compliance</span><span class="val">${asset.compliance}</span></div>
                <div class="table-row"><span>DORA Readiness</span><span class="val highlight-blue">${asset.dora || 'Unknown'}</span></div>
                <div class="table-row"><span>Liquidity Tier</span><span class="val highlight-green">${asset.liquidity || 'N/A'}</span></div>
                <div class="table-row"><span>Settlement</span><span class="val">${asset.settlement}</span></div>
            </div>

            <div class="panel-status-pill ${asset.status.toLowerCase().includes('live') ? 'status-live' : 'status-pilot'}">
                <i class="fas fa-circle"></i> Status: ${asset.status}
            </div>

            <div class="panel-actions-pro">
                <button class="panel-btn-primary" onclick="window.marketActivity.exportSnapshot('${asset.id}')">
                    <i class="fas fa-file-pdf"></i> Export Snapshot
                </button>
                <a href="en/observatory/registre-titres-tokenises.html" class="panel-btn-secondary">
                    <i class="fas fa-database"></i> Registry Port
                </a>
            </div>
        `;

        this.panel.classList.add('open');
    }

    closePanel() {
        this.panel.classList.remove('open');
    }

    copyID(text, btn) {
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.color = '#10b981';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.color = '';
            }, 2000);
        });
    }

    exportSnapshot(assetId) {
        const asset = this.database.find(a => a.id === assetId);
        if (!asset) return;

        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const content = `
DCM CORE - INSTITUTIONAL INTELLIGENCE SNAPSHOT
--------------------------------------------------
ASSET NAME:     ${asset.name.toUpperCase()}
ASSET TYPE:     ${asset.type}
TFIN-ID:        ${asset.id}
ISIN:           ${asset.isin}
--------------------------------------------------
ISSUER:         ${asset.issuer}
JURISDICTION:   ${asset.jurisdiction}
INFRASTRUCTURE: ${asset.infrastructure}
AUM / VALUE:    ${asset.aum}
SETTLEMENT:     ${asset.settlement}
--------------------------------------------------
INSTITUTIONAL METRICS:
DORA READINESS: ${asset.dora || 'N/A'}
LIQUIDITY TIER: ${asset.liquidity || 'N/A'}
--------------------------------------------------
SOURCE:         GTSR Unified Registry
GENERATED AT:   ${timestamp} (UTC)
--------------------------------------------------
(c) 2026 DCM Core Institute. All rights reserved.
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DCM_SNAPSHOT_${assetId}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    exportJSON(assetId) {
        const asset = this.database.find(a => a.id === assetId);
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(asset, null, 4));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `DCM_ASSET_${assetId}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}

// Global instance for drill-down access
window.marketActivity = new MarketActivityEngine();
