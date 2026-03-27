/**
 * DCM CORE — API DOCS ENGINE
 * Phase 113: Institutional Developer Experience
 * Handles interaction for the "Try It Out" console and multi-language code switchers.
 */

const ApiDocsEngine = {
    // MOCK DATA FOR THE CONSOLE
    MOCK_RESPONSES: {
        '/v1/registry/assets': {
            status: 200,
            data: [
                { id: "bond-eur-t1", tfin: "TFIN-EUR-001", issuer: "DCM Treasury", grade: "Investment" },
                { id: "rwa-immo-fr", tfin: "TFIN-RE-082", issuer: "PropChain SAS", grade: "Prime" }
            ],
            meta: { total: 142, page: 1 }
        },
        '/v1/stablecoins/liquidity': {
            status: 200,
            metrics: {
                bifurcation_index: 0.72,
                dominant_issuer: "Circle (USDC)",
                mica_compliant_volume: "84.2%",
                venue_count: 24
            }
        },
        '/v1/risk/dora-mapping': {
            status: 200,
            framework: "DORA",
            coverage: "94%",
            critical_flags: 2
        },
        '/v1/insights/snapshots': {
            status: 200,
            audit_id: "DC-STR-2026-004",
            summary: "Market structure shift detected in Tier-1 Euro settlement layers.",
            timestamp: new Date().toISOString()
        }
    },

    init() {
        console.log("🚀 DCM API Docs Engine Initialized");
        this.setupCodeSwitchers();
        this.setupTryItOut();
        this.setupAutoHeaderLinks();
    },

    // 1. CODE SNIPET SWITCHER
    setupCodeSwitchers() {
        document.querySelectorAll('.code-tabs').forEach(tabGroup => {
            const btns = tabGroup.querySelectorAll('.tab-btn');
            btns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const lang = btn.dataset.lang;
                    // Switch all snippets globally for consistent DX
                    this.switchGlobalLanguage(lang);
                });
            });
        });
    },

    switchGlobalLanguage(lang) {
        // Update all buttons
        document.querySelectorAll(`.tab-btn`).forEach(b => {
            b.classList.toggle('active', b.dataset.lang === lang);
        });
        // Update all snippet blocks
        document.querySelectorAll('.snippet-block').forEach(s => {
            s.style.display = s.dataset.lang === lang ? 'block' : 'none';
        });
    },

    // 2. INTERACTIVE CONSOLE (Mock)
    setupTryItOut() {
        document.querySelectorAll('.btn-try-it').forEach(btn => {
            btn.addEventListener('click', async () => {
                const endpoint = btn.dataset.endpoint;
                const responseBox = document.getElementById(`res-${endpoint.replace(/\//g, '-')}`);
                
                if (!responseBox) return;

                // Loading state
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Executing...';
                responseBox.innerHTML = '<span class="comment">// Connecting to api.dcmcore.com...</span>';
                responseBox.parentElement.style.display = 'block';

                // Simulate network latency (Phase 113)
                await new Promise(r => setTimeout(r, 600));

                const mockResponse = this.MOCK_RESPONSES[endpoint] || { error: "Endpoint not found" };
                
                responseBox.innerHTML = this.formatJSON(mockResponse);
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-play"></i> Try It Out';
            });
        });
    },

    // 3. UTILITY: JSON Formatter
    formatJSON(obj) {
        const json = JSON.stringify(obj, null, 2);
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
            let cls = 'num';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'str';
                }
            } else if (/true|false/.test(match)) {
                cls = 'bool';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    },

    // 4. AUTO-GENERATED ANCHORS
    setupAutoHeaderLinks() {
        document.querySelectorAll('.api-section-title, .endpoint-path').forEach(el => {
            const id = el.innerText.toLowerCase().replace(/[^a-z0-9]/g, '-');
            el.id = id;
            el.style.cursor = 'pointer';
            el.title = "Click to copy deep link";
            el.onclick = () => {
                const url = window.location.origin + window.location.pathname + '#' + id;
                navigator.clipboard.writeText(url).then(() => {
                    if (window.SessionManager) window.SessionManager.showToast('🔗', 'Link Copied', 'Deep link saved to clipboard.');
                });
            };
        });
    }
};

document.addEventListener('DOMContentLoaded', () => ApiDocsEngine.init());
