/**
 * DCM Core Institute - Market Activity Engine
 * Powers the "Live Tokenization Market" feed and Bloomberg-style drill-down.
 */

class MarketActivityEngine {
    constructor() {
        const fallbackData = [
            { id: 'ETH_DOM', name: 'Ethereum Dominance', type: 'Institutional Insight', infrastructure: 'Mainnet', aum: '72.4%', issuer: 'DCM Analysis', jurisdiction: 'Global', compliance: 'N/A', isin: 'N/A', settlement: 'Direct', status: 'LIVE', dora: 'N/A', liquidity: 'Dominant', 
              narrativeTitle: 'Ethereum dominates tokenized finance', 
              narrativeSubtitle: '72.4% of institutional assets are issued on Ethereum, making it the primary settlement layer for tokenized securities.' 
            },
            { id: 'TFIN-BUIDL-001', name: 'BlackRock BUIDL', type: 'Tokenized Fund', infrastructure: 'Ethereum', aum: '$500M+', issuer: 'BlackRock', jurisdiction: 'US', compliance: 'DORA / MiCA', isin: 'US123456789', settlement: 'T+0', status: 'LIVE', dora: 'Compliant', liquidity: 'Tier 1 - Institutional',
              narrativeTitle: 'BlackRock BUIDL Catalyst',
              narrativeSubtitle: 'BUIDL has surpassed $500M, signaling a massive shift in institutional RWA adoption.'
            },
            { id: 'MARKET_CONC', name: 'Market Concentration', type: 'Institutional Insight', infrastructure: 'Multi-chain', aum: '85%', issuer: 'DCM Analysis', jurisdiction: 'Global', compliance: 'N/A', isin: 'N/A', settlement: 'N/A', status: 'LIVE', dora: 'N/A', liquidity: 'High Concentration',
              narrativeTitle: '85% Market Concentration',
              narrativeSubtitle: 'The top 5 issuers control the vast majority of non-stablecoin tokenized volume.'
            },
            { id: 'YIELD_STRUC', name: 'Yield Structures', type: 'Market Insight', infrastructure: 'Ethereum/Stellar', aum: '5.2%', issuer: 'Market Standard', jurisdiction: 'Global', compliance: 'Regulated', isin: 'N/A', settlement: 'T+0', status: 'LIVE', dora: 'N/A', liquidity: 'Tier 1',
              narrativeTitle: 'Yield Competition: On-chain vs TradFi',
              narrativeSubtitle: 'Tokenized T-Bills at 5.2% now compete directly with traditional high-yield instruments.'
            },
            { id: 'MICA_REG', name: 'Regulation (MiCA)', type: 'Policy Insight', infrastructure: 'EEA', aum: 'N/A', issuer: 'EU Council', jurisdiction: 'European Union', compliance: 'Mandatory', isin: 'N/A', settlement: 'N/A', status: 'ACTIVE', dora: 'Compliant', liquidity: 'N/A',
              narrativeTitle: 'MiCA: The New License to Play',
              narrativeSubtitle: 'Compliance is no longer optional for stablecoin issuers in the European Economic Area.'
            },
            { id: 'TFIN-GS-04', name: 'GS DAP Digital Bond', type: 'Digital Bond', infrastructure: 'Canton', aum: '$100M', issuer: 'Goldman Sachs', jurisdiction: 'Luxembourg', compliance: 'EU Pilot Regime', isin: 'LU987654321', settlement: 'T+0', status: 'LIVE', dora: 'Partial', liquidity: 'Tier 1 - Institutional' },
            { id: 'TFIN-SG-09', name: 'SG-Forge EURCV', type: 'Stablecoin', infrastructure: 'Ethereum', aum: '$12M', issuer: 'Société Générale', jurisdiction: 'France', compliance: 'MiCA Compliant', isin: 'FR001234567', settlement: 'Real-time', status: 'LIVE', dora: 'Compliant', liquidity: 'Tier 2 - Specialized' }
        ];

        const combinedDB = (window.GTSR_DATABASE || window.DCM_CORE_DATABASE || []);
        this.database = (combinedDB.length > 0) ? combinedDB : fallbackData;
        this.currentEventIndex = 0;
        this.cyclingInterval = null;
        this.feedContainer = null;
        this.panel = null;
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onReady());
        } else {
            this.onReady();
        }
    }

    onReady() {
        this.feedContainer = document.getElementById('market-activity-feed');
        this.createSidePanel();
        
        if (this.feedContainer) {
            this.renderFeed();
            this.startCycling();
        }

        // DEEP LINKING: Check for asset ID in URL after panel is ready
        const urlParams = new URLSearchParams(window.location.search);
        const sharedAssetId = urlParams.get('asset') || urlParams.get('tfin') || urlParams.get('assetId');
        if (sharedAssetId) {
            setTimeout(() => this.drillDown(sharedAssetId), 500);
        }
    }

    createSidePanel() {
        const existing = document.getElementById('terminal-side-panel');
        if (existing) {
            this.panel = existing;
            return;
        }
        
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
        
        // GTM Tracking
        console.log(`[DCM_ACTIVATION] TFIN_OPEN: ${assetId}`);
        if (window.gtag) {
            window.gtag('event', 'tfin_open', { 'asset_id': assetId, 'asset_name': asset.name });
        }

        const isFR = window.location.pathname.includes('/fr/');
        const strings = {
            explore: isFR ? 'Explorer le Marché' : 'Explore Full Market',
            observatory: isFR ? 'Observatoire du Marché' : 'Market Observatory',
            accessTerminal: isFR ? 'Accéder au Terminal Institutionnel' : 'Access Full Institutional Terminal',
            getInsights: isFR ? 'Recevoir les Analyses Stratégiques' : 'Get weekly institutional insights',
            emailPlaceholder: isFR ? 'votre@email.com' : 'your@email.com',
            subscribe: isFR ? 'S\'abonner' : 'Subscribe',
            dominanceTitle: isFR ? 'Ethereum domine la finance tokenisée' : 'Ethereum dominates tokenized finance',
            dominanceSub: isFR ? '72,4% des actifs institutionnels sont émis sur Ethereum, en faisant la couche de règlement principale.' : '72.4% of institutional assets are issued on Ethereum, making it the primary settlement layer.'
        };

        const displayTitle = assetId === 'ETH_DOM' ? strings.dominanceTitle : (asset.narrativeTitle || asset.name);
        const displaySub = assetId === 'ETH_DOM' ? strings.dominanceSub : (asset.narrativeSubtitle || asset.type);

        content.innerHTML = `
            <div class="gtm-narrative" style="margin-bottom: 30px; border-bottom: 1px solid rgba(59, 130, 246, 0.2); padding-bottom: 20px;">
                <h2 class="panel-title" style="color: #fff; font-size: 24px; line-height: 1.2;">${displayTitle}</h2>
                <p class="panel-subtitle" style="color: var(--accent-obs); font-weight: 700; margin-top: 10px;">${displaySub}</p>
            </div>
            
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
                    <i class="fas fa-file-pdf"></i> ${isFR ? 'Exporter Snapshot' : 'Export Snapshot'}
                </button>
                <button class="panel-btn-secondary" onclick="window.marketActivity.saveToWatchlist('${asset.id}', this)" style="border-color: rgba(168, 85, 247, 0.4); color: #c084fc;">
                    <i class="fas fa-bookmark"></i> ${isFR ? 'Watchlist' : 'Watchlist'}
                </button>
                <button class="panel-btn-secondary" onclick="window.marketActivity.shareInsight('${asset.id}')">
                    <i class="fas fa-share-nodes"></i> ${isFR ? 'Partager' : 'Share'}
                </button>
            </div>
            <div style="margin-top: 25px; display: grid; gap: 10px;">
                <a href="${isFR ? '/fr/observatory/registre-titres-tokenises.html' : '/en/observatory/tokenized-securities-registry.html'}" class="panel-btn-primary" style="background: var(--accent-blue); color: #fff; border: 1px solid var(--accent-blue); justify-content: center; font-weight: 700;">
                    <i class="fas fa-grid-horizontal"></i> ${strings.explore}
                </a>
                <a href="${isFR ? '/fr/observatory/tokenized-markets.html' : '/en/observatory/tokenized-markets.html'}" class="panel-btn-primary" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid #3b82f6; justify-content: center;">
                    <i class="fas fa-terminal"></i> ${strings.accessTerminal}
                </a>
            </div>

            <!-- Soft Capture -->
            <div class="panel-soft-capture" style="margin-top: 40px; padding: 20px; background: rgba(15, 23, 42, 0.5); border: 1px dashed rgba(59, 130, 246, 0.3); border-radius: 12px;">
                <h4 style="font-size: 14px; color: #fff; margin-bottom: 10px;">${strings.getInsights}</h4>
                <div style="display: flex; gap: 8px;">
                    <input type="email" id="capture-email" placeholder="${strings.emailPlaceholder}" style="flex: 1; background: #020617; border: 1px solid #334155; border-radius: 6px; padding: 8px; color: #fff; font-size: 13px;">
                    <button class="panel-btn-primary" onclick="window.marketActivity.handleCapture()" style="padding: 8px 15px; font-size: 12px;">${strings.subscribe}</button>
                </div>
            </div>
        `;

        this.panel.classList.add('open');
    }

    handleCapture() {
        const email = document.getElementById('capture-email')?.value;
        if (!email || !email.includes('@')) {
            alert(window.location.pathname.includes('/fr/') ? "Veuillez entrer une adresse email valide." : "Please enter a valid email address.");
            return;
        }
        
        console.log(`[DCM_CAPTURE] Email: ${email}`);
        const captureBox = document.querySelector('.panel-soft-capture');
        if (captureBox) {
            captureBox.innerHTML = `
                <div style="text-align: center; color: var(--accent-green);">
                    <i class="fas fa-check-circle" style="font-size: 24px; margin-bottom: 10px;"></i>
                    <p style="margin: 0; font-weight: 700;">${window.location.pathname.includes('/fr/') ? "Inscription réussie !" : "Subscription successful!"}</p>
                </div>
            `;
        }
    }

    async saveToWatchlist(assetId, btnElement) {
        if (!window.supabase) {
            alert(window.location.pathname.includes('/fr/') ? "Authentification Institutionnelle requise. Redirection..." : "Institutional Authentication Required. Redirecting...");
            window.location.href = window.location.pathname.includes('/fr/') ? '/fr/login.html' : '/en/login.html';
            return;
        }

        try {
            const { data: { session } } = await window.supabase.auth.getSession();
            if (!session) {
                alert(window.location.pathname.includes('/fr/') ? "Veuillez vous connecter pour sauvegarder aux favoris." : "Please login to save to your Watchlist.");
                window.location.href = window.location.pathname.includes('/fr/') ? '/fr/login.html' : '/en/login.html';
                return;
            }

            const userId = session.user.id;
            
            const { error } = await window.supabase
                .from('user_watchlists')
                .insert([
                    { user_id: userId, tfin_id: assetId }
                ]);

            if (error) {
                if (error.code === '23505') {
                    alert(window.location.pathname.includes('/fr/') ? "Cet actif est déjà dans votre Watchlist." : "This asset is already in your Institutional Watchlist.");
                } else {
                    console.error("Watchlist save error:", error);
                    alert(window.location.pathname.includes('/fr/') ? "Erreur lors de la sauvegarde." : "Failed to save to Watchlist. Please try again.");
                }
                return;
            }

            const originalHTML = btnElement.innerHTML;
            btnElement.innerHTML = '<i class="fas fa-check"></i> ' + (window.location.pathname.includes('/fr/') ? 'Sauvegardé' : 'Saved');
            btnElement.style.color = '#10b981';
            btnElement.style.borderColor = '#10b981';
            btnElement.disabled = true;

            setTimeout(() => {
                btnElement.innerHTML = originalHTML;
                btnElement.style.color = '';
                btnElement.style.borderColor = '';
                btnElement.disabled = false;
            }, 2000);

        } catch (err) {
            console.error("Watchlist error:", err);
        }
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
        const insightRef = `DCM-CORE-INSIGHT-#${Math.floor(Math.random() * 9000) + 1000}`;
        const content = `
${insightRef} | INSTITUTIONAL INTELLIGENCE SNAPSHOT
--------------------------------------------------
SOURCE: DCM Core Institute (GTSR Unified Registry)
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
GENERATED AT:   ${timestamp} (UTC)
VERIFY AT:      https://dcmcore.com/?tfin=${asset.id}
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

    shareInsight(assetId) {
        const asset = this.database.find(a => a.id === assetId);
        if (!asset) return;

        const shareUrl = `${window.location.origin}${window.location.pathname}?tfin=${asset.id}`;
        const isFR = window.location.pathname.includes('/fr/');
        
        const header = `⚡ [DCM CORE ALERT] TFIN VALIDATION`;
        const action = isFR ? `Actif Institutionnel vérifié sur le Global Tokenized Securities Registry (GTSR).` : `Institutional Asset verified on the Global Tokenized Securities Registry (GTSR).`;
        
        const text = `${header}\n${action}\n\n` +
                     `◩ ASSET: ${asset.name} (${asset.type})\n` +
                     `◩ ISSUER: ${asset.issuer}\n` +
                     `◩ INFRASTRUCTURE: ${asset.infrastructure}\n` +
                     `◩ AUM / METRIC: ${asset.aum}\n` +
                     `◩ DORA READINESS: ${asset.dora || 'N/A'}\n\n` +
                     `🔍 ${isFR ? "Code d'identification" : "TFIN Identifier"}: ${asset.id}\n\n` +
                     `🔗 ${isFR ? "Accéder au Scan Intégral du Terminal" : "Access Full Terminal Scan"}:\n${shareUrl}\n\n` +
                     `#Tokenization #RWA #DCMCore #InstitutionalWeb3 #DigitalAssets`;

        if (navigator.share) {
            navigator.share({
                title: `DCM Core Insight: ${asset.name}`,
                text: text,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(text).then(() => {
                alert(isFR ? "Alerte copié dans le presse-papier ! Prêt pour LinkedIn/X." : "Insight Alert copied to clipboard! Ready to post on LinkedIn/X.");
            });
        }
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
