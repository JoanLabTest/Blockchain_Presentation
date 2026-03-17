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
            const targetLang = link.textContent.trim().toLowerCase(); 
            const currentPath = window.location.pathname;
            const pathParts = currentPath.split('/');
            const filename = pathParts[pathParts.length - 1] || 'index.html';
            let newPath = '';
            
            const isInFR = currentPath.includes('/fr/');
            const isInEN = currentPath.includes('/en/');
            
            if (isInFR) {
                if (targetLang === 'en') newPath = currentPath.replace('/fr/', '/en/');
                else return;
            } else if (isInEN) {
                if (targetLang === 'fr') newPath = currentPath.replace('/en/', '/fr/');
                else return;
            } else {
                newPath = `/${targetLang}/${filename}`;
            }

            if (newPath) window.location.href = newPath;
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

    // 3. Search Initialization (If exists)
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            console.log('Search triggered:', e.target.value);
            // Logic for search results would go here or in gtsr-query-engine.js
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
