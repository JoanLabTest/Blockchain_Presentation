/* --- RESEARCH ENGINE LOGIC (Bloomberg-Lite) --- */

const SYNONYMS = {
    "risk": ["danger", "hazard", "warning", "stress", "panic", "drawdown"],
    "staking": ["pos", "validator", "yield", "reward", "proof of stake"],
    "contract": ["code", "solidity", "smart contract", "program", "dapp"],
    "compliance": ["legal", "regulation", "law", "kyc", "aml", "sanction"],
    "security": ["audit", "hack", "exploit", "guard", "protection", "safe"],
    "liquidity": ["depth", "volume", "market making", "slippage"],
    "architecture": ["structure", "design", "pattern", "flow", "diagram"]
};

class ResearchEngine {
    constructor() {
        this.index = [];
        this.isOpen = false;
        this.selectedIndex = 0;
        this.init();
    }

    async init() {
        // 1. Inject UI
        this.injectStyles();
        this.injectHTML();

        // 2. Load Data
        await this.loadIndex();

        // 3. Bind Events
        this.bindEvents();
        console.log("Research Engine: Intelligent Mode Online 🧠");
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
                
                <!-- FACETED FILTERS -->
                <div class="search-filters">
                    <button class="filter-btn active" data-filter="ALL">ALL</button>
                    <button class="filter-btn" data-filter="RISK">RISK</button>
                    <button class="filter-btn" data-filter="TECH">TECH</button>
                    <button class="filter-btn" data-filter="LEGAL">LEGAL</button>
                    <button class="filter-btn" data-filter="MACRO">MACRO</button>
                </div>

                <div id="search-results">
                    <!-- Results injected here -->
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
                this.handleSearch(this.inputEl.value); // Re-run search
            });
        });
    }

    async loadIndex() {
        try {
            const response = await fetch('search-index.json');
            this.index = await response.json();
        } catch (e) {
            console.warn("Research Engine: Failed to load index via fetch. Using embedded fallback.");
            // Compact fallback for demo continuity if JSON fails
            this.index = [
                { id: "fallback-1", title: "Liquidity Crunch Scenario", category: "RISK", type: "Scenario", fullText: "Mass exit scenario...", weight: 10, page: "pos-economics.html", anchor: "#section-6", tags: ["#StressTest"] }
            ];
        }
    }

    bindEvents() {
        // Open/Close
        this.triggerEl.addEventListener('click', () => this.open());

        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.isOpen ? this.close() : this.open();
            }
            if (e.key === 'Escape' && this.isOpen) this.close();

            // Navigation
            if (this.isOpen) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.moveSelection(1);
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.moveSelection(-1);
                }
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.executeSelection();
                }
            }
        });

        // Search Input
        this.inputEl.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Close on Click Outside
        this.modalEl.addEventListener('click', (e) => {
            if (e.target === this.modalEl) this.close();
        });
    }

    open() {
        this.isOpen = true;
        this.modalEl.classList.add('active');
        this.inputEl.focus();
    }

    close() {
        this.isOpen = false;
        this.modalEl.classList.remove('active');
        this.inputEl.value = '';
        this.resultsEl.innerHTML = '<div class="empty-state">Commencez à taper pour explorer le Knowledge Hub...</div>';
    }

    // --- INTELLIGENT SCORING ENGINE ---
    handleSearch(query) {
        if (!query) {
            this.resultsEl.innerHTML = '<div class="empty-state">Commencez à taper pour explorer le Knowledge Hub...</div>';
            return;
        }

        const q = query.toLowerCase();

        // 1. Get Synonyms
        let expandedQuery = [q];
        Object.keys(SYNONYMS).forEach(key => {
            if (q.includes(key)) {
                expandedQuery = [...expandedQuery, ...SYNONYMS[key]];
            }
            // Reverse check: if query is "danger", map to "risk"
            if (SYNONYMS[key].includes(q)) {
                expandedQuery.push(key);
            }
        });

        const results = this.index.map(item => {
            let score = 0;

            // A. Title Match (High Weight)
            if (item.title.toLowerCase().includes(q)) score += 25;

            // B. Synonym/Tags Match (Medium Weight)
            const itemString = (JSON.stringify(item.tags) + " " + item.category).toLowerCase();
            expandedQuery.forEach(term => {
                if (itemString.includes(term)) score += 10;
            });

            // C. Full Text Match (Low Weight but captures depth)
            if (item.fullText && item.fullText.toLowerCase().includes(q)) score += 5;

            // D. Exact ID Match (Very High)
            if (item.id === q) score += 50;

            // E. Filter Check
            if (this.activeFilter !== 'ALL' && item.category !== this.activeFilter) {
                score = 0; // Filter out
            }

            return { ...item, score };
        })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score || b.weight - a.weight)
            .slice(0, 7); // Show top 7

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
