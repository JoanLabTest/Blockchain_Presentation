/**
 * DCM Core API Documentation Engine (Phase 112)
 * Handles interactivity, code snippets, and 'Try It Out' simulations.
 */

const ApiDocsEngine = {
    MOCKS: {
        '/v1/registry/assets': {
            api_version: "1.0.0",
            endpoint: "GET /v1/registry/assets",
            source: "DCM Core Institute — GTSR Registry",
            generated_at: new Date().toISOString(),
            summary: {
                total_assets: 6,
                total_aum_usd: 2651700000,
                total_aum_display: "$2.65B",
                validated_count: 5
            },
            data: [
                {
                    tfin_id: "TFIN-DEBT-ETH-2026-0001",
                    name: "SocGen EURCV (EUR CoinVertible)",
                    issuer: "Société Générale FORGE",
                    asset_class: "Stablecoin / E-Money Token",
                    infrastructure: "Ethereum Mainnet",
                    aum_usd: 384200000,
                    jurisdiction: "France",
                    regulatory_framework: "EU",
                    mica_status: "MiCA-Aligned (EMT)",
                    custody_grade: "AA",
                    validation_status: "VALIDATED"
                },
                {
                    tfin_id: "TFIN-FUND-ETH-2024-0042",
                    name: "BlackRock BUIDL (USD Institutional Digital Liquidity)",
                    issuer: "BlackRock / Securitize",
                    asset_class: "Tokenized Money Market Fund",
                    infrastructure: "Ethereum Mainnet",
                    aum_usd: 542400000,
                    jurisdiction: "United States",
                    regulatory_framework: "SEC",
                    validation_status: "VALIDATED"
                }
            ]
        },
        '/v1/registry/asset?tfin=TFIN-DEBT-ETH-2026-0001': {
            api_version: "1.0.0",
            endpoint: "GET /v1/registry/asset",
            source: "DCM Core Institute — GTSR Registry",
            generated_at: new Date().toISOString(),
            data: {
                tfin_id: "TFIN-DEBT-ETH-2026-0001",
                gtsr_id: "GTSR-CASH-2024-01",
                name: "SocGen EURCV (EUR CoinVertible)",
                issuer: "Société Générale FORGE",
                asset_class: "Stablecoin / E-Money Token",
                infrastructure: "Ethereum Mainnet",
                aum_usd: 384200000,
                jurisdiction: "France",
                regulatory_framework: "EU",
                mica_status: "MiCA-Aligned (EMT)",
                gtds_compliance: "GTDS v1.0",
                isin: "FR001400A123",
                tfic_code: "D-B-G-01",
                settlement: "Atomic DvP",
                custody_grade: "AA",
                validation_status: "VALIDATED",
                last_verified: "2026-05-01"
            }
        },
        '/v1/market/stablecoins': {
            api_version: "1.0.0",
            endpoint: "GET /v1/market/stablecoins",
            source: "DCM Core Institute — Stablecoin Market Structure Audit",
            generated_at: new Date().toISOString(),
            data: {
                market_summary: {
                    total_market_cap_usd: 164200000000,
                    total_market_cap_display: "$164.2B",
                    institutional_rwa_dominance: 0.724,
                    active_venues_tracked: 24,
                    mica_compliant_share: 0.193
                },
                stablecoins: [
                    {
                        symbol: "USDT",
                        market_cap_usd: 116700000000,
                        dominance_share: 0.711,
                        mica_status: "Restricted (EU)",
                        compliance_rating: "Non-Compliant (EU MiCA)"
                    },
                    {
                        symbol: "USDC",
                        market_cap_usd: 31800000000,
                        dominance_share: 0.194,
                        mica_status: "MiCA-Aligned (EMT)",
                        compliance_rating: "AAA (MiCA)"
                    }
                ]
            }
        },
        '/v1/compliance/mica-status': {
            api_version: "1.0.0",
            endpoint: "GET /v1/compliance/mica-status",
            source: "DCM Core Institute — MiCA Compliance Intelligence Unit",
            generated_at: new Date().toISOString(),
            data: {
                regulation: "Regulation (EU) 2023/1114 on Markets in Crypto-Assets",
                compliance_indicators: [
                    {
                        category: "E-Money Token (EMT)",
                        eu_licensed_issuers: 7,
                        institutional_readiness: 0.89
                    },
                    {
                        category: "Asset-Referenced Token (ART)",
                        eu_licensed_issuers: 3,
                        institutional_readiness: 0.68
                    }
                ],
                jurisdictional_readiness: [
                    { jurisdiction: "France", authority: "AMF", readiness_score: 0.94, status: "ADVANCED" },
                    { jurisdiction: "Luxembourg", authority: "CSSF", readiness_score: 0.93, status: "ADVANCED" }
                ]
            }
        },
        '/v1/system/status': {
            api_version: "1.0.0",
            endpoint: "GET /v1/system/status",
            source: "DCM Core Institute — API Infrastructure",
            generated_at: new Date().toISOString(),
            data: {
                status: "OPERATIONAL",
                uptime_percent: 99.97,
                latency_p50_ms: 42,
                endpoints_live: 5,
                gtsr_assets_tracked: 6,
                gtsr_total_aum_display: "$2.65B+",
                jurisdictions_covered: 42,
                rate_limits: {
                    institutional: "5,000 req/min",
                    enterprise: "Unlimited (SLA)"
                }
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

                const mock = this.MOCKS[endpoint] 
                    ? { _note: "Sandbox response — connect your API key for live data", ...this.MOCKS[endpoint] }
                    : { status: 404, error: "Endpoint not found in sandbox" };

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
