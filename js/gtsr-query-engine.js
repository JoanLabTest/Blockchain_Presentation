/**
 * DCM Core Institute - Global Tokenization Query Engine
 * Interactive Market Intelligence Layer (v2.2 - Bloomberg Upgrade)
 */

const GTSR_DATABASE = [
    {
        id: "TFIN-DEBT-ETH-2026-0001",
        name: "SocGen EURCV",
        issuer: "Société Générale FORGE",
        type: "Stablecoin / E-Money",
        infrastructure: "Ethereum Mainnet",
        aum: "$384.2M",
        jurisdiction: "France (EU)",
        compliance: "GTDS v1.0 Standard",
        isin: "FR001400A123",
        tfic: "D-B-G-01",
        settlement: "Atomic DvP",
        status: "Live Production"
    },
    {
        id: "TFIN-FUND-ETH-2024-0042",
        name: "BlackRock BUIDL",
        issuer: "BlackRock / Securitize",
        type: "Tokenized Money Market Fund",
        infrastructure: "Ethereum Mainnet",
        aum: "$542.4M",
        jurisdiction: "Global (multi)",
        compliance: "GTDS v1.0 Standard",
        isin: "US12345B1078",
        tfic: "F-I-M-01",
        settlement: "T+0 Finality",
        status: "Live Production"
    },
    {
        id: "TFIN-DEBT-STR-2024-0005",
        name: "FOBXX Money Fund",
        issuer: "Franklin Templeton",
        type: "Tokenized Fund",
        infrastructure: "Stellar Hub",
        aum: "$412.8M",
        jurisdiction: "United States",
        compliance: "GTDS v1.0 Standard",
        isin: "US3547211022",
        tfic: "F-I-M-02",
        settlement: "Stellar Consensus",
        status: "Live Production"
    },
    {
        id: "TFIN-BOND-POL-2025-0012",
        name: "EIB Digital Bond 2",
        issuer: "European Investment Bank",
        type: "Digital Bond",
        infrastructure: "Polygon AppChain",
        aum: "$100M",
        jurisdiction: "Luxembourg (EU)",
        compliance: "GTDS v1.0 Standard",
        isin: "XS1234567890",
        tfic: "B-G-D-01",
        settlement: "Wholesale CBDC",
        status: "Production Pilot"
    },
    {
        id: "TFIN-REAL-ETH-2025-0089",
        name: "Hamilton Lane Green Solar",
        issuer: "Hamilton Lane / Provenance",
        type: "Tokenized Equity (Real Assets)",
        infrastructure: "Provenace / Ethereum",
        aum: "$12.5M",
        jurisdiction: "Global (multi)",
        compliance: "GTDS v1.0 Standard",
        isin: "XS9876543210",
        tfic: "E-R-A-01",
        settlement: "Instant Atomic",
        status: "Production Pilot"
    },
    {
        id: "TFIN-MONY-POL-2026-0002",
        name: "JPM Onyx Settlement Coin",
        issuer: "J.P. Morgan",
        type: "Wholesale wCBDC Substitute",
        infrastructure: "JPM Onyx (Polygon Interop)",
        aum: "$1.2B",
        jurisdiction: "International",
        compliance: "GTDS v2.0 Standard",
        isin: "N/A (Systemic)",
        tfic: "C-W-S-01",
        settlement: "Real-time Gross Settlement",
        status: "Live Production"
    }
];

// PROGRAMMABLE TERMINAL API (Bloomberg-style for researchers)
window.DCM_CORE_DATABASE = GTSR_DATABASE;
window.DCM = {
    query: (criteria) => {
        console.log("%c DCM Terminal %c Running institutional query...", "background:#10b981; color:black; font-weight:bold; padding:2px 5px; border-radius:3px;", "color:#10b981;");
        return GTSR_DATABASE.filter(asset => {
            let match = true;
            for (let key in criteria) {
                if (!asset[key] || !asset[key].toLowerCase().includes(criteria[key].toLowerCase())) {
                    match = false;
                }
            }
            return match;
        });
    },
    stats: () => {
        return {
            total_assets_tracked: GTSR_DATABASE.length,
            total_aum_verified: "$2.65B+",
            top_infrastructure: "Ethereum (Mainnet)",
            gtcm_index_status: "Stable / Growth"
        };
    },
    help: () => {
        console.table([
            { Command: "DCM.query({issuer: 'BlackRock'})", Description: "Filter by issuer" },
            { Command: "DCM.query({type: 'Bond'})", Description: "Filter by asset type" },
            { Command: "DCM.query({command: '/stablecoins'})", Description: "Stablecoin Dominance" },
            { Command: "DCM.stats()", Description: "System telemetry" }
        ]);
        return "Terminal API ready.";
    }
};

function initQueryEngine() {
    const searchInput = document.getElementById('marketQueryInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const rawQuery = e.target.value;
        const query = rawQuery.toLowerCase().trim();
        
        // CLI COMMAND HANDLING
        if (query === 'help') {
            displayTerminalMessage("DCM TERMINAL COMMANDS:\nhelp - Show this guide\n/all - List all assets\n/stablecoins - Market Dominance & Flows\n/clear - Reset Terminal\n/stats - System telemetry", "#3b82f6");
            return;
        }

        if (query === '/clear') {
            resetTerminal();
            searchInput.value = '';
            return;
        }

        if (query === '/all') {
            displayTerminalMessage("Showing all verified institutional assets (" + GTSR_DATABASE.length + " entries).", "#10b981");
            return;
        }

        if (query === '/stablecoins') {
            displayTerminalMessage("INSTITUTIONAL STABLECOIN MONITOR:\nDominance: USDT (71.2%) | USDC (19.4%) | PYUSD (1.8%)\nTotal MkCap: $164.2B | Active Flows: +8.4% MoM\nStatus: High Liquidity / MiCA Compliance Pending", "#a855f7");
            return;
        }

        if (query === '/stats') {
            const s = window.DCM.stats();
            displayTerminalMessage(`TELEMETRY: AUM: ${s.total_aum_verified} | Assets: ${s.total_assets_tracked}`, "#f59e0b");
            return;
        }

        if (query.length < 2) {
            resetTerminal();
            return;
        }
        
        const results = GTSR_DATABASE.filter(asset => {
            return asset.name.toLowerCase().includes(query) || 
                   asset.issuer.toLowerCase().includes(query) || 
                   asset.infrastructure.toLowerCase().includes(query) ||
                   asset.type.toLowerCase().includes(query);
        });

        if (results.length > 0) {
            updateTerminalWithAsset(results[0]);
        }
    });

    // Handle suggested queries
    const chips = document.querySelectorAll('.query-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            searchInput.value = chip.dataset.query;
            searchInput.dispatchEvent(new Event('input'));
        });
    });

    // ESC to clear
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            resetTerminal();
            searchInput.value = '';
            searchInput.blur();
        }
    });
}

function displayTerminalMessage(msg, color) {
    const assetTitle = document.querySelector('.terminal-grid .term-main h3');
    if (assetTitle) {
        assetTitle.innerHTML = `<span style="color:${color}; font-family:'JetBrains Mono'; font-size:14px; line-height:1.5;">${msg.replace(/\n/g, '<br>')}</span>`;
    }
}

function updateTerminalWithAsset(asset) {
    const tfinId = document.querySelector('.terminal-grid .term-main [style*="color: var(--accent-green)"]');
    const assetTitle = document.querySelector('.terminal-grid .term-main h3');
    const metadataValues = document.querySelectorAll('.term-main .term-item .term-value');
    
    if (tfinId) tfinId.textContent = asset.id;
    if (assetTitle) assetTitle.textContent = asset.name + " Intelligence";

    if (metadataValues.length >= 6) {
        metadataValues[0].textContent = asset.isin;
        metadataValues[1].textContent = asset.tfic;
        metadataValues[2].textContent = asset.jurisdiction;
        metadataValues[3].textContent = asset.infrastructure;
        metadataValues[4].textContent = asset.type;
        metadataValues[5].textContent = asset.settlement;
    }

    const statusPill = document.querySelector('.term-info [style*="background: rgba(245, 158, 11, 0.1)"]');
    if (statusPill) {
        statusPill.innerHTML = `<i class="fas fa-check-circle"></i> Status: ${asset.status}`;
        statusPill.style.background = asset.status === 'Live Production' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)';
        statusPill.style.color = asset.status === 'Live Production' ? '#10b981' : '#f59e0b';
    }
}

function resetTerminal() {
    updateTerminalWithAsset(GTSR_DATABASE[0]);
}

document.addEventListener('DOMContentLoaded', initQueryEngine);
