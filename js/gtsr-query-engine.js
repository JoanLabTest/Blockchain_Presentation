/**
 * DCM Core Institute - Global Tokenization Query Engine
 * Interactive Market Intelligence Layer
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

function initQueryEngine() {
    const searchInput = document.getElementById('marketQueryInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
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
}

function updateTerminalWithAsset(asset) {
    // Update Asset Intelligence Panel
    const tfinId = document.querySelector('.terminal-grid .term-main [style*="color: var(--accent-green)"]');
    const assetTitle = document.querySelector('.terminal-grid .term-main h3');
    
    // Metadata Layer mappings
    const isinVal = document.querySelector('.term-item .term-label64748b')?.parentElement.querySelector('.term-value'); // This selector is tricky if structure variations occur

    // More robust selectors for current Terminal UI
    const metadataValues = document.querySelectorAll('.term-main .term-item .term-value');
    
    if (tfinId) tfinId.textContent = asset.id;
    if (assetTitle) assetTitle.textContent = asset.name + " Intelligence";

    // Assuming Metadata Layer: ISIN (0), TFIC (1), Jurisdiction (2)
    // Assuming Technical Layer: Infra (3), Token (4), Settlement (5)
    if (metadataValues.length >= 6) {
        metadataValues[0].textContent = asset.isin;
        metadataValues[1].textContent = asset.tfic;
        metadataValues[2].textContent = asset.jurisdiction;
        metadataValues[3].textContent = asset.infrastructure;
        metadataValues[4].textContent = asset.type; // Token type
        metadataValues[5].textContent = asset.settlement;
    }

    // Update Status Pill in Info Panel
    const statusPill = document.querySelector('.term-info [style*="background: rgba(245, 158, 11, 0.1)"]');
    if (statusPill) {
        statusPill.innerHTML = `<i class="fas fa-check-circle"></i> Status: ${asset.status}`;
        statusPill.style.background = asset.status === 'Live Production' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)';
        statusPill.style.color = asset.status === 'Live Production' ? '#10b981' : '#f59e0b';
    }
}

function resetTerminal() {
    // Optional: Reset to default asset (SGF-EURCV)
    updateTerminalWithAsset(GTSR_DATABASE[0]);
}

document.addEventListener('DOMContentLoaded', initQueryEngine);
