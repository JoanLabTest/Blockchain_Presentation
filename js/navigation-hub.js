/**
 * DCM CORE INSTITUTE - GLOBAL NAVIGATION ENGINE
 * Handles wallet modal, mobile menu, and interactive navigation elements.
 */

function openWalletModal() {
    // Check if modal exists, if not create a basic one or redirect
    console.log("Global: opening wallet modal...");
    const modalId = 'walletModal';
    let modal = document.getElementById(modalId);
    
    if (!modal) {
        // Create basic modal if not present
        modal = document.createElement('div');
        modal.id = modalId;
        modal.innerHTML = `
            <div style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:400px; background:#0f172a; border:1px solid #3b82f6; border-radius:16px; padding:30px; z-index:20000; box-shadow:0 0 50px rgba(0,0,0,1);">
                <h3 style="color:white; margin-bottom:20px; font-family:Outfit;">Connect Wallet</h3>
                <div style="display:grid; gap:12px;">
                    <button onclick="alert('Metamask connect simulated')" style="padding:12px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white; border-radius:8px; cursor:pointer; text-align:left;">Metamask</button>
                    <button onclick="alert('WalletConnect simulated')" style="padding:12px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white; border-radius:8px; cursor:pointer; text-align:left;">WalletConnect</button>
                </div>
                <button onclick="document.getElementById('walletModal').remove()" style="margin-top:20px; width:100%; padding:10px; background:#3b82f6; border:none; color:white; border-radius:8px; cursor:pointer; font-weight:700;">Close</button>
            </div>
            <div id="modalOverlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:19999;" onclick="document.getElementById('walletModal').remove(); this.remove()"></div>
        `;
        document.body.appendChild(modal);
    }
}

// Language Switcher & Navigation Orchestration
document.addEventListener('DOMContentLoaded', () => {
    // 1. Language Switcher (Path Preservation)
    const langLinks = document.querySelectorAll('.lang-link');
    langLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetLang = link.textContent.trim().toLowerCase().includes('en') ? 'en' : 'fr'; 
            const currentPath = window.location.pathname;
            const isInFR = currentPath.includes('/fr/') || currentPath.endsWith('/fr');
            const isInEN = currentPath.includes('/en/') || currentPath.endsWith('/en');
            
            let newPath = '';
            if (isInFR) {
                if (targetLang === 'en') newPath = currentPath.replace('/fr', '/en');
            } else if (isInEN) {
                if (targetLang === 'fr') newPath = currentPath.replace('/en', '/fr');
            } else {
                // If not in a language folder, try to find the base path or just append
                const pathParts = currentPath.split('/');
                const filename = pathParts.pop() || 'index.html';
                const base = pathParts.join('/') + '/';
                newPath = `${base}${targetLang}/${filename}`;
            }

            if (newPath && newPath !== currentPath) window.location.href = newPath;
        });
    });

    // 2. Mobile Menu (Hamburger)
    const hamburger = document.querySelector('.hamburger') || document.querySelector('.mobile-menu-toggle');
    const navPillars = document.querySelector('.nav-pillars');
    if (hamburger && navPillars) {
        hamburger.addEventListener('click', () => {
            navPillars.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // 3. Search Initialization (Enhanced Autocomplete)
    const searchInput = document.getElementById('globalSearchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput && searchResults) {
        const institutionalKeywords = {
            'ethereum': { id: 'ETH_DOM', title: 'Ethereum Dominance (Institutional Insight)' },
            'eth': { id: 'ETH_DOM', title: 'Ethereum Dominance (Institutional Insight)' },
            'blackrock': { id: 'TFIN-BUIDL-001', title: 'BlackRock BUIDL Catalyst (RWA)' },
            'buidl': { id: 'TFIN-BUIDL-001', title: 'BlackRock BUIDL Catalyst (RWA)' },
            'mica': { id: 'MICA_REG', title: 'MiCA Compliance Regulation (EU Policy)' },
            'reg': { id: 'MICA_REG', title: 'MiCA Compliance Regulation (EU Policy)' },
            'yield': { id: 'YIELD_STRUC', title: 'Yield Structures (On-chain vs TradFi)' },
            't-bill': { id: 'YIELD_STRUC', title: 'Yield Structures (On-chain vs TradFi)' },
            'conc': { id: 'MARKET_CONC', title: 'Market Concentration Analysis' }
        };

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            searchResults.innerHTML = '';
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }

            const matches = Object.keys(institutionalKeywords).filter(k => k.includes(query));
            
            if (matches.length > 0) {
                searchResults.style.display = 'block';
                const list = document.createElement('div');
                list.className = 'search-list';
                
                matches.forEach(k => {
                    const item = institutionalKeywords[k];
                    const row = document.createElement('div');
                    row.className = 'search-row';
                    row.style.padding = '12px 15px';
                    row.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                    row.style.cursor = 'pointer';
                    row.style.transition = 'background 0.2s';
                    row.innerHTML = `
                        <div style="font-size: 13px; font-weight: 700; color: #fff;">${item.title}</div>
                        <div style="font-size: 10px; color: var(--accent-blue); text-transform: uppercase;">Institutional Intelligence</div>
                    `;
                    row.addEventListener('click', () => {
                        console.log(`[SEARCH] Drilling down to: ${item.id}`);
                        if (window.marketActivity) {
                            window.marketActivity.drillDown(item.id);
                            searchResults.style.display = 'none';
                            searchInput.value = '';
                        }
                    });
                    row.addEventListener('mouseover', () => row.style.background = 'rgba(59, 130, 246, 0.1)');
                    row.addEventListener('mouseout', () => row.style.background = 'transparent');
                    list.appendChild(row);
                });
                searchResults.appendChild(list);
            } else {
                searchResults.style.display = 'none';
            }
        });

        // Close search results on click outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
});

// Social Insight Sharing Utility
function shareInsight(title, data, url) {
    const text = `Institutional Insight from DCM Core Institute: ${data}\n\nExplore real-time tokenization metrics:`;
    const shareUrl = encodeURIComponent(url);
    const shareText = encodeURIComponent(text);
    
    // Choose platform (simplified for this implementation - defaults to LinkedIn/X dialog)
    const choice = confirm(`Share this insight?\n\n"${data}"\n\n[OK] Share on LinkedIn/X | [Cancel] Copy Link`);
    
    if (choice) {
        // Direct to LinkedIn for professional distribution
        const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
        window.open(linkedin, '_blank');
    } else {
        navigator.clipboard.writeText(`${text} ${url}`);
        alert("Institutional insight and link copied to clipboard.");
    }
}
