/**
 * DCM Core API Documentation Engine (Phase 112)
 * Handles interactivity, code snippets, and 'Try It Out' simulations.
 */

const ApiDocsEngine = {
    MOCKS: {
        '/v1/registry/assets': {
            status: 200,
            data: [
                {
                    tfin: "TFIN-ETH-BND-2026-001",
                    name: "Ethereum Sovereign Bond Token",
                    issuer: "DCM Treasury",
                    asset_class: "Fixed Income",
                    isin_reference: "US4590581017",
                    ledger: "Ethereum Mainnet",
                    status: "ACTIVE",
                    mica_assessment: "Compliant (Art. 60)"
                },
                {
                    tfin: "TFIN-SOL-RED-2026-042",
                    name: "Solar Energy RWA Index",
                    issuer: "GreenLedger Infra",
                    asset_class: "Real World Asset",
                    ledger: "Solana",
                    status: "PENDING_AUDIT",
                    mica_assessment: "Under Review"
                }
            ]
        },
        '/v1/stablecoins/liquidity': {
            status: 200,
            data: {
                pair: "USDC/USDT",
                bifurcation_index: 0.12,
                liquidity_score: 98.4,
                mica_readiness: {
                    USDC: "High (Electronic Money Token)",
                    USDT: "Medium (Asset-Referenced Token)"
                },
                volatility_24h: "0.02%",
                arbitrage_opportunity: "None"
            }
        },
        '/v1/risk/dora-mapping': {
            status: 200,
            data: {
                framework: "DORA (Digital Operational Resilience Act)",
                coverage: "84%",
                critical_ict_third_party: ["DCM Cloud", "LedgerVault"],
                resilience_score: 9.2,
                last_stress_test: "2026-03-26T14:22:00Z",
                compliance_status: "ADM_APPROVED"
            }
        }
    },

    init: function() {
        console.log("🚀 DCM API Docs Engine Initialized");
        this.setupTabSwitching();
        this.setupTryItOut();
        this.setupSidebarSpy();
    },

    setupTabSwitching: function() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const container = e.target.closest('.endpoint-body');
                const lang = e.target.getAttribute('data-lang');

                // Update buttons
                container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Update snippets
                container.querySelectorAll('.snippet-block').forEach(block => {
                    block.style.display = block.getAttribute('data-lang') === lang ? 'block' : 'none';
                });
            });
        });
    },

    setupTryItOut: function() {
        document.querySelectorAll('.btn-try-it').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const endpoint = e.target.getAttribute('data-endpoint');
                const resConsole = e.target.nextElementSibling; // console-res

                // Loading state
                e.target.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Executing...';
                e.target.disabled = true;

                // Simulate Network Latency
                await new Promise(r => setTimeout(r, 800));

                const mock = this.MOCKS[endpoint] || { status: 404, error: "Endpoint not found in sandbox" };

                // Render JSON with highlighting
                resConsole.innerHTML = this.syntaxHighlight(mock);
                resConsole.style.display = 'block';

                // Reset button
                e.target.innerHTML = '<i class="fas fa-play"></i> Try It Out';
                e.target.disabled = false;
            });
        });
    },

    syntaxHighlight: function(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
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

    setupSidebarSpy: function() {
        // Basic intersection observer for active link highlighting
        const options = { threshold: 0.5 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    if (id) {
                        document.querySelectorAll('.sidebar-link').forEach(link => {
                            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                        });
                    }
                }
            });
        }, options);

        document.querySelectorAll('[id]').forEach(section => observer.observe(section));
    }
};

// Start logic
document.addEventListener('DOMContentLoaded', () => ApiDocsEngine.init());
