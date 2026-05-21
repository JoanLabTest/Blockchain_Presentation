/**
 * DCM Core Institute — API Sandbox Engine (Phase 120)
 * Live interactive API playground for the Institutional API portal
 */

// ── Config ────────────────────────────────────────────────────────────────────
const SUPABASE_FUNCTIONS_URL = 'https://wnwerjuqtrduqkgwdjrg.supabase.co/functions/v1/gtsr-api';
const STATIC_BASE = '/api/v1';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indud2VyanVxdHJkdXFrZ3dkanJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3Mzg3OTEsImV4cCI6MjA4NjMxNDc5MX0.0WqMQs84PFAHuoMQT8xiAZYpWN5b2XGeumtaNzRHcoo';
const isFr = document.documentElement.lang === 'fr';

// ── State ─────────────────────────────────────────────────────────────────────
let activeEndpointId = null;
let requestTimer = null;

// ── Endpoint definitions ──────────────────────────────────────────────────────
const ENDPOINTS = [
  {
    id: 'registry-assets',
    method: 'GET',
    path: '/v1/registry/assets',
    label: isFr ? 'Registre GTSR — Tous les Actifs' : 'GTSR Registry — All Assets',
    description: isFr 
      ? 'Renvoie tous les actifs institutionnels vérifiés du Registre Global (GTSR). Filtrez par juridiction, statut ou classe d\'actifs.'
      : 'Returns all verified institutional assets from the Global Tokenized Securities Registry. Filter by jurisdiction, status, or asset class.',
    color: '#3b82f6',
    icon: 'fa-list-check',
    params: [
      { name: 'jurisdiction', type: 'string', example: 'France', description: isFr ? 'Filtrer par juridiction (ex: France, EU, United States)' : 'Filter by jurisdiction (e.g. France, EU, United States)' },
      { name: 'status', type: 'enum', example: 'VALIDATED', description: 'VALIDATED | PENDING', options: ['', 'VALIDATED', 'PENDING'] },
      { name: 'asset_class', type: 'string', example: 'Bond', description: isFr ? 'Filtrer par classe d\'actif (ex: Bond, Fund, Stablecoin)' : 'Filter by asset class (e.g. Bond, Fund, Stablecoin)' },
    ],
    staticFallback: `${STATIC_BASE}/registry.json`,
    edgePath: '/v1/registry/assets',
    badge: 'LIVE',
  },
  {
    id: 'registry-asset',
    method: 'GET',
    path: '/v1/registry/asset',
    label: isFr ? 'Actif GTSR — Recherche Unique' : 'GTSR Asset — Single Lookup',
    description: isFr
      ? 'Récupère un actif spécifique par son TFIN ID ou GTSR ID. Renvoie le profil complet avec l\'alignement réglementaire MiCA.'
      : 'Fetch a specific asset by its TFIN ID or GTSR ID. Returns full institutional profile including risk vectors and MiCA compliance status.',
    color: '#10b981',
    icon: 'fa-fingerprint',
    params: [
      { name: 'tfin', type: 'string', example: 'TFIN-FUND-ETH-2024-0042', description: isFr ? 'Tokenized Financial Instrument Number (TFIN ID)' : 'Tokenized Financial Instrument Number (TFIN ID)' },
    ],
    staticFallback: null,
    edgePath: '/v1/registry/asset',
    badge: 'LIVE',
  },
  {
    id: 'market-stablecoins',
    method: 'GET',
    path: '/v1/market/stablecoins',
    label: isFr ? 'Structure du Marché des Stablecoins' : 'Stablecoin Market Structure',
    description: isFr
      ? 'Données d\'audit en temps réel sur les stablecoins. Analyse la dominance, la conformité MiCA et l\'adoption institutionnelle.'
      : 'Real-time stablecoin market audit data. Tracks USDT, USDC, EURC and PYUSD dominance, MiCA compliance rating, and institutional adoption metrics.',
    color: '#a855f7',
    icon: 'fa-bridge',
    params: [],
    staticFallback: `${STATIC_BASE}/stablecoins.json`,
    edgePath: '/v1/market/stablecoins',
    badge: 'LIVE',
  },
  {
    id: 'compliance-mica',
    method: 'GET',
    path: '/v1/compliance/mica-status',
    label: isFr ? 'Intelligence Réglementaire MiCA' : 'MiCA Compliance Intelligence',
    description: isFr
      ? 'Indicateurs de conformité MiCA par catégorie avec scores de préparation par juridiction nationale au sein de l\'UE.'
      : 'MiCA compliance indicators per framework category (EMT, ART, CASP, DLT Sandbox) with jurisdictional readiness scores for all EU member states.',
    color: '#f59e0b',
    icon: 'fa-shield-halved',
    params: [],
    staticFallback: `${STATIC_BASE}/mica-status.json`,
    edgePath: '/v1/compliance/mica-status',
    badge: 'LIVE',
  },
  {
    id: 'system-status',
    method: 'GET',
    path: '/v1/system/status',
    label: isFr ? 'Statut du Système API' : 'API System Status',
    description: isFr
      ? 'Métriques de santé opérationnelle en direct. Renvoie la disponibilité, la latence et les statistiques d\'inscription de la base DCM.'
      : 'Live platform health metrics. Returns uptime, latency percentiles, and real-time platform statistics from the DCM Core database.',
    color: '#06b6d4',
    icon: 'fa-heart-pulse',
    params: [],
    staticFallback: null,
    edgePath: '/v1/system/status',
    badge: 'REAL-TIME',
  },
];

// ── Fetch with fallback ───────────────────────────────────────────────────────
async function fetchEndpoint(endpoint, queryParams = {}) {
  // Build edge function URL
  const edgeUrl = new URL(SUPABASE_FUNCTIONS_URL.replace('/gtsr-api', '') + '/gtsr-api' + endpoint.edgePath);
  Object.entries(queryParams).forEach(([k, v]) => { if (v) edgeUrl.searchParams.set(k, v); });

  try {
    const res = await fetch(edgeUrl.toString(), {
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return { data, source: 'edge', status: res.status, url: edgeUrl.toString() };
  } catch (edgeErr) {
    // Fallback to static JSON
    if (endpoint.staticFallback) {
      try {
        const fallbackUrl = new URL(endpoint.staticFallback, window.location.origin);
        const res = await fetch(fallbackUrl.toString());
        const data = await res.json();
        return { data, source: 'static', status: res.status, url: fallbackUrl.toString() };
      } catch (staticErr) {
        throw new Error(`Both edge and static fetch failed: ${edgeErr.message}`);
      }
    }
    throw edgeErr;
  }
}

// ── UI Helpers ────────────────────────────────────────────────────────────────
function syntaxHighlight(json) {
  if (typeof json !== 'string') json = JSON.stringify(json, null, 2);
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
    let cls = 'json-number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) cls = 'json-key';
      else cls = 'json-string';
    } else if (/true|false/.test(match)) cls = 'json-bool';
    else if (/null/.test(match)) cls = 'json-null';
    return `<span class="${cls}">${match}</span>`;
  });
}

function showLoading(responseEl) {
  responseEl.innerHTML = `
    <div class="sandbox-loading">
      <div class="sandbox-spinner"></div>
      <span>${isFr ? 'Interrogation de l\'infrastructure DCM Core…' : 'Querying DCM Core infrastructure…'}</span>
    </div>`;
}

function showResponse(responseEl, data, meta) {
  const { source, status, url, duration } = meta;
  const sourceLabel = source === 'edge' 
    ? (isFr ? '⚡ Fonction Edge' : '⚡ Edge Function') 
    : (isFr ? '📁 Point d\'accès statique' : '📁 Static Endpoint');
  const statusColor = status >= 200 && status < 300 ? '#10b981' : '#ef4444';

  responseEl.innerHTML = `
    <div class="response-meta">
      <span style="color:${statusColor}; font-weight:800;">HTTP ${status}</span>
      <span class="response-source">${sourceLabel}</span>
      <span class="response-time">${duration}ms</span>
      <span class="response-url" title="${url}">${url.replace(window.location.origin, '')}</span>
    </div>
    <pre class="json-output">${syntaxHighlight(JSON.stringify(data, null, 2))}</pre>`;
}

function showError(responseEl, err) {
  responseEl.innerHTML = `
    <div class="response-meta">
      <span style="color:#ef4444; font-weight:800;">ERROR</span>
    </div>
    <pre class="json-output json-error">${err.message}</pre>`;
}

// ── Render sandbox card ───────────────────────────────────────────────────────
function renderEndpointCard(endpoint) {
  const hasParams = endpoint.params.length > 0;
  const paramsHtml = hasParams ? `
    <div class="sandbox-params" id="params-${endpoint.id}">
      ${endpoint.params.map(p => `
        <div class="param-row">
          <label class="param-label">
            <span class="param-name">${p.name}</span>
            <span class="param-type">${p.type}</span>
          </label>
          ${p.options ? `
            <select class="param-input" data-param="${p.name}" id="param-${endpoint.id}-${p.name}">
              ${p.options.map(o => `<option value="${o}">${o || (isFr ? '— Tous —' : '— Any —')}</option>`).join('')}
            </select>` : `
            <input class="param-input" type="text" placeholder="${p.example}" 
                   data-param="${p.name}" id="param-${endpoint.id}-${p.name}"
                   value="${p.example}">`}
          <span class="param-desc">${p.description}</span>
        </div>`).join('')}
    </div>` : '';

  return `
    <div class="endpoint-card" id="card-${endpoint.id}" data-endpoint="${endpoint.id}"
         style="--ep-color: ${endpoint.color}">
      <div class="endpoint-header" onclick="toggleCard('${endpoint.id}')">
        <div class="ep-left">
          <span class="ep-method">GET</span>
          <span class="ep-path">${endpoint.path}</span>
          <span class="ep-badge ep-badge-${endpoint.badge.toLowerCase().replace('-','')}">${endpoint.badge}</span>
        </div>
        <div class="ep-right">
          <i class="fas ${endpoint.icon}" style="color:${endpoint.color}"></i>
          <span class="ep-label">${endpoint.label}</span>
          <i class="fas fa-chevron-down ep-chevron" id="chevron-${endpoint.id}"></i>
        </div>
      </div>

      <div class="endpoint-body" id="body-${endpoint.id}" style="display:none;">
        <p class="ep-description">${endpoint.description}</p>
        ${paramsHtml}
        <div class="sandbox-actions">
          <button class="try-btn" onclick="runEndpoint('${endpoint.id}')" id="btn-${endpoint.id}">
            <i class="fas fa-play"></i> ${isFr ? 'Exécuter la requête' : 'Run Request'}
          </button>
          <button class="copy-curl-btn" onclick="copyCurl('${endpoint.id}')">
            <i class="fas fa-terminal"></i> ${isFr ? 'Copier le cURL' : 'Copy cURL'}
          </button>
        </div>
        <div class="sandbox-response" id="response-${endpoint.id}">
          <div class="response-placeholder">
            <i class="fas fa-play-circle"></i>
            <span>${isFr ? 'Cliquez sur "Exécuter la requête" pour lancer l\'appel' : 'Click "Run Request" to execute this endpoint live'}</span>
          </div>
        </div>
      </div>
    </div>`;
}

// ── Toggle card ───────────────────────────────────────────────────────────────
window.toggleCard = function(id) {
  const body = document.getElementById(`body-${id}`);
  const chevron = document.getElementById(`chevron-${id}`);
  const card = document.getElementById(`card-${id}`);
  const isOpen = body.style.display !== 'none';

  // Close all
  ENDPOINTS.forEach(ep => {
    document.getElementById(`body-${ep.id}`).style.display = 'none';
    document.getElementById(`chevron-${ep.id}`).style.transform = '';
    document.getElementById(`card-${ep.id}`).classList.remove('active');
  });

  if (!isOpen) {
    body.style.display = 'block';
    chevron.style.transform = 'rotate(180deg)';
    card.classList.add('active');
    activeEndpointId = id;
  } else {
    activeEndpointId = null;
  }
};

// ── Run endpoint ──────────────────────────────────────────────────────────────
window.runEndpoint = async function(id) {
  const endpoint = ENDPOINTS.find(e => e.id === id);
  if (!endpoint) return;

  const responseEl = document.getElementById(`response-${id}`);
  const btn = document.getElementById(`btn-${id}`);

  // Gather params
  const queryParams = {};
  endpoint.params.forEach(p => {
    const el = document.getElementById(`param-${id}-${p.name}`);
    if (el && el.value) queryParams[p.name] = el.value;
  });

  // UI state
  btn.disabled = true;
  btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${isFr ? 'Exécution…' : 'Running…'}`;
  showLoading(responseEl);

  const t0 = Date.now();
  try {
    const result = await fetchEndpoint(endpoint, queryParams);
    const duration = Date.now() - t0;
    showResponse(responseEl, result.data, { ...result, duration });

    // Update live counter
    incrementCallCounter();
  } catch (err) {
    showError(responseEl, err);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i class="fas fa-play"></i> ${isFr ? 'Exécuter la requête' : 'Run Request'}`;
  }
};

// ── Copy cURL ─────────────────────────────────────────────────────────────────
window.copyCurl = function(id) {
  const endpoint = ENDPOINTS.find(e => e.id === id);
  if (!endpoint) return;

  const queryParams = {};
  endpoint.params.forEach(p => {
    const el = document.getElementById(`param-${id}-${p.name}`);
    if (el && el.value) queryParams[p.name] = el.value;
  });

  const edgeUrl = new URL(`https://wnwerjuqtrduqkgwdjrg.supabase.co/functions/v1/gtsr-api${endpoint.edgePath}`);
  Object.entries(queryParams).forEach(([k, v]) => { if (v) edgeUrl.searchParams.set(k, v); });

  const curl = `curl -X GET "${edgeUrl}" \\
  -H "apikey: ${ANON_KEY}" \\
  -H "Authorization: Bearer ${ANON_KEY}" \\
  -H "Content-Type: application/json"`;

  navigator.clipboard.writeText(curl).then(() => {
    const btn = document.querySelector(`#card-${id} .copy-curl-btn`);
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = `<i class="fas fa-check"></i> ${isFr ? 'Copié !' : 'Copied!'}`;
      btn.style.color = '#10b981';
      setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; }, 2000);
    }
  });
};

// ── Live call counter ─────────────────────────────────────────────────────────
function incrementCallCounter() {
  const el = document.getElementById('live-call-counter');
  if (!el) return;
  const n = parseInt(el.textContent || '0') + 1;
  el.textContent = n;
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = 'counterPop 0.4s ease';
}

// ── Inject sandbox CSS ────────────────────────────────────────────────────────
function injectSandboxCSS() {
  if (document.getElementById('sandbox-css')) return;
  const style = document.createElement('style');
  style.id = 'sandbox-css';
  style.textContent = `
    .endpoint-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      margin-bottom: 16px;
      overflow: hidden;
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    .endpoint-card.active {
      border-color: var(--ep-color);
      box-shadow: 0 0 30px rgba(0,0,0,0.3), 0 0 0 1px var(--ep-color);
    }
    .endpoint-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      cursor: pointer;
      user-select: none;
      transition: background 0.2s;
      flex-wrap: wrap;
      gap: 12px;
    }
    .endpoint-header:hover { background: rgba(255,255,255,0.02); }
    .ep-left { display: flex; align-items: center; gap: 14px; }
    .ep-right { display: flex; align-items: center; gap: 12px; }
    .ep-method {
      background: rgba(59,130,246,0.15);
      color: #60a5fa;
      padding: 4px 10px;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
    }
    .ep-path {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #e2e8f0;
      font-weight: 700;
    }
    .ep-badge {
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .ep-badge-live { background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3); }
    .ep-badge-realtime { background: rgba(6,182,212,0.15); color: #06b6d4; border: 1px solid rgba(6,182,212,0.3); }
    .ep-label { font-size: 13px; color: #94a3b8; }
    .ep-chevron { color: #475569; transition: transform 0.3s; font-size: 12px; }
    .endpoint-body { padding: 0 24px 24px; border-top: 1px solid rgba(255,255,255,0.05); }
    .ep-description { color: #94a3b8; font-size: 14px; line-height: 1.7; margin: 20px 0; }
    .sandbox-params { margin-bottom: 20px; display: flex; flex-direction: column; gap: 14px; }
    .param-row { display: grid; grid-template-columns: 200px 1fr 1fr; gap: 12px; align-items: center; }
    .param-label { display: flex; flex-direction: column; gap: 3px; }
    .param-name { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #e2e8f0; font-weight: 700; }
    .param-type { font-size: 10px; color: #475569; text-transform: uppercase; letter-spacing: 1px; }
    .param-input {
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.1);
      color: #f8fafc;
      padding: 10px 14px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      transition: border-color 0.2s;
    }
    .param-input:focus { outline: none; border-color: var(--ep-color, #3b82f6); }
    .param-desc { font-size: 12px; color: #64748b; line-height: 1.5; }
    .sandbox-actions { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .try-btn {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--ep-color, #3b82f6);
      color: white; border: none; padding: 12px 24px;
      border-radius: 8px; font-weight: 700; font-size: 13px;
      cursor: pointer; transition: all 0.2s;
    }
    .try-btn:hover { filter: brightness(1.15); transform: translateY(-1px); }
    .try-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .copy-curl-btn {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,0.05);
      color: #94a3b8; border: 1px solid rgba(255,255,255,0.1);
      padding: 12px 20px; border-radius: 8px;
      font-weight: 600; font-size: 13px;
      cursor: pointer; transition: all 0.2s;
    }
    .copy-curl-btn:hover { background: rgba(255,255,255,0.08); color: #e2e8f0; }
    .sandbox-response {
      background: rgba(0,0,0,0.4);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      min-height: 120px;
      overflow: hidden;
    }
    .response-placeholder {
      display: flex; align-items: center; justify-content: center;
      gap: 12px; height: 120px;
      color: #334155; font-size: 14px;
    }
    .response-placeholder i { font-size: 20px; }
    .response-meta {
      display: flex; align-items: center; gap: 16px;
      padding: 12px 20px;
      background: rgba(255,255,255,0.03);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      font-size: 12px; font-family: 'JetBrains Mono', monospace;
      flex-wrap: wrap;
    }
    .response-source { background: rgba(16,185,129,0.1); color: #10b981; padding: 2px 8px; border-radius: 4px; font-weight: 700; }
    .response-time { color: #94a3b8; }
    .response-url { color: #475569; font-size: 11px; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .json-output {
      padding: 20px; margin: 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px; line-height: 1.7;
      overflow-x: auto;
      white-space: pre;
      max-height: 500px;
      overflow-y: auto;
    }
    .json-key { color: #60a5fa; }
    .json-string { color: #34d399; }
    .json-number { color: #f59e0b; }
    .json-bool { color: #a78bfa; }
    .json-null { color: #94a3b8; }
    .json-error { color: #f87171; }
    .sandbox-loading {
      display: flex; align-items: center; justify-content: center;
      gap: 16px; height: 120px; color: #60a5fa; font-size: 14px;
    }
    .sandbox-spinner {
      width: 20px; height: 20px;
      border: 2px solid rgba(59,130,246,0.2);
      border-top-color: #60a5fa;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes counterPop {
      0% { transform: scale(1); }
      50% { transform: scale(1.4); color: #10b981; }
      100% { transform: scale(1); }
    }
    @media (max-width: 768px) {
      .param-row { grid-template-columns: 1fr; }
      .ep-label { display: none; }
    }
  `;
  document.head.appendChild(style);
}

// ── Initialize sandbox ────────────────────────────────────────────────────────
function initSandbox() {
  injectSandboxCSS();

  const container = document.getElementById('api-sandbox-container');
  if (!container) return;

  container.innerHTML = ENDPOINTS.map(renderEndpointCard).join('');

  // Auto-open first card
  toggleCard('registry-assets');

  // Load system status asynchronously for the stats bar
  loadSystemStats();
}

async function loadSystemStats() {
  const statsEl = document.getElementById('sandbox-stats-bar');
  if (!statsEl) return;
  try {
    const res = await fetchEndpoint(ENDPOINTS.find(e => e.id === 'system-status'), {});
    const d = res.data?.data;
    if (d) {
      document.getElementById('stat-assets').textContent = d.gtsr_assets_tracked;
      document.getElementById('stat-aum').textContent = d.gtsr_total_aum_display;
      document.getElementById('stat-uptime').textContent = `${d.uptime_percent}%`;
      document.getElementById('stat-latency').textContent = `${d.latency_p50_ms}ms`;
    }
  } catch (_) { /* keep placeholders */ }
}

// ── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initSandbox);
window.DCMApiSandbox = { ENDPOINTS, fetchEndpoint, runEndpoint };
