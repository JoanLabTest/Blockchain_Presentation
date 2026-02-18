/* --- RESEARCH ENGINE LOGIC (Search 3.0 - Intelligence Layer) --- */

const SYNONYMS = {
    // RISK
    "risk": ["danger", "hazard", "warning", "stress", "panic", "drawdown", "peril", "risque", "menace", "alea"],
    // YIELD
    "yield": ["rendement", "interet", "gain", "apy", "apr", "return", "profit"],
    "staking": ["pos", "validator", "validation", "proof of stake", "jalonnement"],
    // TECH
    "contract": ["code", "solidity", "smart contract", "program", "dapp", "contrat", "automate"],
    "architecture": ["structure", "design", "pattern", "flow", "diagram", "shema"],
    // LEGAL
    "compliance": ["legal", "regulation", "law", "kyc", "aml", "sanction", "loi", "droit", "conformite", "regle"],
    // SECURITY
    "security": ["audit", "hack", "exploit", "guard", "protection", "safe", "securite", "faille"],
    // LIQUIDITY
    "liquidity": ["depth", "volume", "market making", "slippage", "liquidite", "profondeur"]
};

class ResearchEngine {
    constructor() {
        this.index = [];
        this.isOpen = false;
        this.selectedIndex = 0;
        this.init();
    }

    async init() {
        this.injectStyles();
        this.injectHTML();
        await this.loadIndex();
        this.bindEvents();
        console.log("Research Engine: Intelligence Layer Online 🧠 (v3.0)");
    }

    injectStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'search-modal.css';
        document.head.appendChild(link);
    }

    injectHTML() {
        // TRIGGER
        const trigger = document.createElement('div');
        trigger.id = 'search-trigger-container';
        trigger.innerHTML = `
            <div class="search-label">CMD + K</div>
            <div class="search-cube">
                <i class="fa-solid fa-layer-group"></i>
            </div>
        `;
        document.body.appendChild(trigger);

        // MODAL
        const modal = document.createElement('div');
        modal.id = 'search-modal-overlay';
        modal.innerHTML = `
            <div class="search-palette">
                <div class="search-header">
                    <i class="fa-solid fa-magnifying-glass search-icon-main"></i>
                    <input type="text" id="search-input" placeholder="Rechercher (Risk, Yield, Compliance...)" autocomplete="off">
                    <span class="esc-hint">ESC</span>
                </div>
                
                <div class="search-filters">
                    <button class="filter-btn active" data-filter="ALL">ALL</button>
                    <button class="filter-btn" data-filter="RISK">RISK</button>
                    <button class="filter-btn" data-filter="TECH">TECH</button>
                    <button class="filter-btn" data-filter="LEGAL">LEGAL</button>
                    <button class="filter-btn" data-filter="MACRO">MACRO</button>
                </div>

                <div id="search-results">
                    <div class="empty-state">
                        <i class="fa-regular fa-compass" style="font-size: 24px; margin-bottom: 10px; opacity: 0.5;"></i><br>
                        Commencez à taper pour explorer le Knowledge Hub...
                    </div>
                </div>
                
                <div class="search-footer">
                    <span><i class="fa-solid fa-arrows-up-down"></i> Naviguer</span>
                    <span><i class="fa-solid fa-turn-down-left"></i> Ouvrir</span>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        this.triggerEl = trigger;
        this.modalEl = modal;
        this.inputEl = document.getElementById('search-input');
        this.resultsEl = document.getElementById('search-results');

        // Filter Logic
        this.activeFilter = 'ALL';
        this.modalEl.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.modalEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.activeFilter = e.target.dataset.filter;
                this.handleSearch(this.inputEl.value);
            });
        });
    }

    async loadIndex() {
        try {
            const response = await fetch('search-index.json');
            this.index = await response.json();
        } catch (e) {
            console.warn("Research Engine: Failed to load index. Using fallback.");
            this.index = [{ id: "fallback", title: "Index Load Error", category: "SYS", fullText: "Please check console.", weight: 0 }];
        }
    }

    bindEvents() {
        this.triggerEl.addEventListener('click', () => this.open());
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); this.isOpen ? this.close() : this.open(); }
            if (e.key === 'Escape' && this.isOpen) this.close();
            if (this.isOpen) {
                if (e.key === 'ArrowDown') { e.preventDefault(); this.moveSelection(1); }
                if (e.key === 'ArrowUp') { e.preventDefault(); this.moveSelection(-1); }
                if (e.key === 'Enter') { e.preventDefault(); this.executeSelection(); }
            }
        });
        this.inputEl.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.modalEl.addEventListener('click', (e) => { if (e.target === this.modalEl) this.close(); });
    }

    open() { this.isOpen = true; this.modalEl.classList.add('active'); this.inputEl.focus(); }

    close() {
        this.isOpen = false;
        this.modalEl.classList.remove('active');
        this.inputEl.value = '';
        this.resultsEl.innerHTML = '<div class="empty-state">Commencez à taper pour explorer le Knowledge Hub...</div>';
    }

    // --- INTELLIGENT SCORING ENGINE v3.0 ---
    handleSearch(query) {
        if (!query) {
            this.resultsEl.innerHTML = '<div class="empty-state">Commencez à taper pour explorer le Knowledge Hub...</div>';
            return;
        }

        const q = query.toLowerCase();

        // 1. Synonym Expansion (Bilingual)
        let expandedQuery = [q];
        Object.keys(SYNONYMS).forEach(key => {
            if (q.includes(key) || SYNONYMS[key].some(s => q.includes(s))) {
                expandedQuery.push(key);
                expandedQuery = [...expandedQuery, ...SYNONYMS[key]];
            }
        });
        expandedQuery = [...new Set(expandedQuery)]; // Dedupe

        // 2. Context Detection
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        const results = this.index.map(item => {
            let score = 0;

            // A. Title Match (Primary)
            if (item.title.toLowerCase().includes(q)) score += 30;

            // B. Synonym/Tags Match (Secondary)
            const itemString = (JSON.stringify(item.tags) + " " + item.category).toLowerCase();
            expandedQuery.forEach(term => {
                if (itemString.includes(term)) score += 10;
                if (item.title.toLowerCase().includes(term)) score += 5; // Bonus for synonym in title
            });

            // C. Full Text Match (Depth)
            if (item.fullText && item.fullText.toLowerCase().includes(q)) score += 5;

            // D. Context Boost (If result is on current page)
            if (item.page === currentPage) score += 15;

            // E. ID Match
            if (item.id.toLowerCase().includes(q)) score += 40;

            // F. Intersection Logic (Multi-term)
            const terms = q.split(' ');
            if (terms.length > 1) {
                const allTermsMatch = terms.every(t =>
                    item.title.toLowerCase().includes(t) ||
                    (item.fullText && item.fullText.toLowerCase().includes(t))
                );
                if (allTermsMatch) score += 20;
            }

            // G. Filter
            if (this.activeFilter !== 'ALL' && item.category !== this.activeFilter) {
                score = 0;
            }

            return { ...item, score };
        })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score || b.weight - a.weight)
            .slice(0, 7);

        this.renderResults(results, q);
        this.selectedIndex = 0;
    }

    renderResults(results, query) {
        if (results.length === 0) {
            this.resultsEl.innerHTML = '<div class="empty-state">Aucun résultat trouvé pour cette recherche.</div>';
            return;
        }

        this.currentResults = results;

        this.resultsEl.innerHTML = results.map((item, index) => {
            // Snippet Logic
            let snippet = item.content;
            if (item.fullText) {
                // Try to find the query in fullText to show context
                const idx = item.fullText.toLowerCase().indexOf(query.toLowerCase());
                if (idx !== -1) {
                    const start = Math.max(0, idx - 20);
                    const end = Math.min(item.fullText.length, idx + 80);
                    snippet = "..." + item.fullText.substring(start, end) + "...";
                }
            }

            return `
            <div class="result-item ${index === 0 ? 'selected' : ''}" data-index="${index}" onclick="window.engine.goTo('${item.page}', '${item.anchor}')">
                <div class="result-icon">
                    ${this.getIcon(item.category)}
                </div>
                <div class="result-info">
                    <div class="result-title">
                        ${item.title}
                        <span class="badge-cat cat-${item.category}">${item.category}</span>
                        ${item.type ? `<span class="badge-type">${item.type}</span>` : ''}
                    </div>
                    <div class="result-desc">${snippet}</div>
                </div>
                <div class="result-arrow">
                    <i class="fa-solid fa-arrow-turn-down-left"></i>
                </div>
            </div>
            `;
        }).join('');
    }

    getIcon(category) {
        const icons = {
            'RISK': '<i class="fa-solid fa-triangle-exclamation"></i>',
            'LEGAL': '<i class="fa-solid fa-scale-balanced"></i>',
            'TECH': '<i class="fa-solid fa-code"></i>',
            'MACRO': '<i class="fa-solid fa-globe"></i>',
            'GOV': '<i class="fa-solid fa-gavel"></i>',
            'TOOL': '<i class="fa-solid fa-calculator"></i>'
        };
        return icons[category] || '<i class="fa-solid fa-file"></i>';
    }

    moveSelection(direction) {
        const items = document.querySelectorAll('.result-item');
        if (items.length === 0) return;

        items[this.selectedIndex].classList.remove('selected');

        this.selectedIndex += direction;

        // Loop
        if (this.selectedIndex < 0) this.selectedIndex = items.length - 1;
        if (this.selectedIndex >= items.length) this.selectedIndex = 0;

        items[this.selectedIndex].classList.add('selected');
        items[this.selectedIndex].scrollIntoView({ block: 'nearest' });
    }

    executeSelection() {
        if (this.currentResults && this.currentResults.length > 0) {
            const item = this.currentResults[this.selectedIndex];
            this.goTo(item.page, item.anchor);
        }
    }

    goTo(page, anchor) {
        console.log(`Navigating to ${page}${anchor}`);
        // Check if we are on the same page
        if (window.location.pathname.includes(page)) {
            window.location.hash = anchor;
            this.close();
        } else {
            window.location.href = `${page}${anchor}`;
        }
    }
}

// Initialize on Load
window.addEventListener('DOMContentLoaded', () => {
    window.engine = new ResearchEngine();
});
