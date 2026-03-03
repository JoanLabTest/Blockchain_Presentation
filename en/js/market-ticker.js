/**
 * MARKET TICKER — Phase 52
 * Fetches live crypto prices from the market-data Edge Function
 * and renders them in a sticky ticker bar (dashboard) or live stats panels (networks).
 */

const MARKET_DATA_URL = 'https://wnwerjuqtrduqkgwdjrg.supabase.co/functions/v1/market-data';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indud2VyanVxdHJkdXFrZ3dkanJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3Mzg3OTEsImV4cCI6MjA4NjMxNDc5MX0.0WqMQs84PFAHuoMQT8xiAZYpWN5b2XGeumtaNzRHcoo';

// Cache
let _lastData = null;
let _refreshTimer = null;

/**
 * Fetch market data from the Edge Function proxy.
 * @returns {Promise<Object|null>}
 */
async function fetchMarketData() {
    try {
        const res = await fetch(MARKET_DATA_URL, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        _lastData = data;
        return data;
    } catch (err) {
        console.warn('⚠️ Market data fetch failed:', err.message);
        return null;
    }
}

/**
 * Format a price in EUR with appropriate precision.
 */
function formatPrice(val) {
    if (val === null || val === undefined) return '--';
    if (val >= 10000) return val.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
    if (val >= 100) return val.toLocaleString('fr-FR', { maximumFractionDigits: 1 });
    return val.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Format large numbers (market cap, volume) in human-readable form.
 */
function formatLarge(val) {
    if (!val) return '--';
    if (val >= 1e12) return `€${(val / 1e12).toFixed(2)}T`;
    if (val >= 1e9) return `€${(val / 1e9).toFixed(1)}B`;
    if (val >= 1e6) return `€${(val / 1e6).toFixed(0)}M`;
    return `€${val.toLocaleString('fr-FR')}`;
}

/**
 * Render the ticker bar inside #market-ticker container.
 */
function renderTicker(data) {
    const container = document.getElementById('market-ticker');
    if (!container) return;

    if (!data || !data.coins) {
        container.innerHTML = '<span style="color:#666;font-size:12px;">Live data unavailable</span>';
        return;
    }

    const order = ['BTC', 'ETH', 'SOL', 'BNB'];
    const icons = { BTC: '₿', ETH: 'Ξ', SOL: '◎', BNB: 'B' };

    const html = order.map(sym => {
        const coin = data.coins[sym];
        const price = formatPrice(coin.priceEur);
        const change = coin.change24h !== null ? coin.change24h.toFixed(2) : null;
        const isPositive = change !== null && parseFloat(change) >= 0;
        const changeColor = isPositive ? '#10b981' : '#ef4444';
        const arrow = isPositive ? '▲' : '▼';
        const changeText = change !== null ? `${arrow} ${Math.abs(change)}%` : '--';

        return `
            <div class="ticker-item" id="ticker-${sym}">
                <span class="ticker-icon">${icons[sym]}</span>
                <span class="ticker-symbol">${sym}</span>
                <span class="ticker-price">€${price}</span>
                <span class="ticker-change" style="color:${changeColor}">${changeText}</span>
            </div>
        `;
    }).join('<span class="ticker-sep">|</span>');

    const ts = data.updatedAt ? new Date(data.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--';
    container.innerHTML = `
        <div class="ticker-coins">${html}</div>
        <div class="ticker-meta">
            <span class="ticker-live-dot"></span>
            <span style="color:#555;font-size:10px;">MAJ ${ts}</span>
        </div>
    `;
}

/**
 * Render a live stats panel inside a container element.
 * @param {string} containerId - DOM id of the container
 * @param {string} symbol - 'BTC' | 'ETH' | 'SOL' | 'BNB'
 */
function renderLiveStats(containerId, symbol) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Show skeleton
    container.innerHTML = `
        <div class="live-stats-panel">
            <div class="live-stats-header">
                <span class="live-dot-pulse"></span>
                <span>Live Market Data</span>
            </div>
            <div class="live-stats-grid" id="${containerId}-values">
                <div class="stat-item"><div class="stat-label">Prix</div><div class="stat-value skeleton">--</div></div>
                <div class="stat-item"><div class="stat-label">24h Change</div><div class="stat-value skeleton">--</div></div>
                <div class="stat-item"><div class="stat-label">Market Cap</div><div class="stat-value skeleton">--</div></div>
                <div class="stat-item"><div class="stat-label">Volume 24h</div><div class="stat-value skeleton">--</div></div>
            </div>
        </div>
    `;

    fetchMarketData().then(data => {
        if (!data || !data.coins || !data.coins[symbol]) {
            document.getElementById(`${containerId}-values`).innerHTML =
                '<span style="color:#666;font-size:12px;">Données live indisponibles</span>';
            return;
        }
        const coin = data.coins[symbol];
        const change = coin.change24h !== null ? coin.change24h.toFixed(2) : null;
        const isPositive = change !== null && parseFloat(change) >= 0;
        const changeColor = isPositive ? '#10b981' : '#ef4444';
        const arrow = isPositive ? '▲' : '▼';

        document.getElementById(`${containerId}-values`).innerHTML = `
            <div class="stat-item">
                <div class="stat-label">Prix EUR</div>
                <div class="stat-value" style="color:#f0c040;font-size:20px;">€${formatPrice(coin.priceEur)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">24h Change</div>
                <div class="stat-value" style="color:${changeColor}">
                    ${change !== null ? `${arrow} ${Math.abs(change)}%` : '--'}
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Market Cap</div>
                <div class="stat-value">${formatLarge(coin.marketCapEur)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Volume 24h</div>
                <div class="stat-value">${formatLarge(coin.volume24hEur)}</div>
            </div>
        `;
    });
}

/**
 * Init ticker on dashboard — auto-refreshes every 60s.
 */
async function initTicker() {
    const data = await fetchMarketData();
    renderTicker(data);

    // Auto-refresh
    if (_refreshTimer) clearInterval(_refreshTimer);
    _refreshTimer = setInterval(async () => {
        const fresh = await fetchMarketData();
        renderTicker(fresh);
    }, 60_000);
}

export const MarketTicker = { initTicker, renderLiveStats, fetchMarketData };
window.MarketTicker = MarketTicker;
