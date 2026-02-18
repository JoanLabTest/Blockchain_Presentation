/* --- RESEARCH ENGINE LOGIC (Legacy-Free) --- */

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
        console.log("Research Engine: Online 🟢");
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
                <div id="search-results">
                    <!-- Results injected here -->
                    <div class="empty-state">Commencez à taper pour explorer le Knowledge Hub...</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        this.triggerEl = trigger;
        this.modalEl = modal;
        this.inputEl = document.getElementById('search-input');
        this.resultsEl = document.getElementById('search-results');
    }

    async loadIndex() {
        try {
            const response = await fetch('search-index.json');
            this.index = await response.json();
        } catch (e) {
            console.error("Research Engine: Failed to load index", e);
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

    handleSearch(query) {
        if (!query) {
            this.resultsEl.innerHTML = '<div class="empty-state">Commencez à taper pour explorer le Knowledge Hub...</div>';
            return;
        }

        const q = query.toLowerCase();

        // Simple Scoring Logic
        const results = this.index.map(item => {
            let score = 0;
            if (item.title.toLowerCase().includes(q)) score += 10;
            if (JSON.stringify(item.tags).toLowerCase().includes(q)) score += 5;
            if (item.content.toLowerCase().includes(q)) score += 2;

            return { ...item, score };
        })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score || b.weight - a.weight) // Tie-break with static weight
            .slice(0, 5); // Limit to top 5

        this.renderResults(results);
        this.selectedIndex = 0; // Reset selection
    }

    renderResults(results) {
        if (results.length === 0) {
            this.resultsEl.innerHTML = '<div class="empty-state">Aucun résultat trouvé.</div>';
            return;
        }

        this.currentResults = results; // Store for navigation

        this.resultsEl.innerHTML = results.map((item, index) => `
            <div class="result-item ${index === 0 ? 'selected' : ''}" data-index="${index}" onclick="window.engine.goTo('${item.page}', '${item.anchor}')">
                <div class="result-icon">
                    ${this.getIcon(item.category)}
                </div>
                <div class="result-info">
                    <div class="result-title">
                        ${item.title}
                        <span class="badge-cat cat-${item.category}">${item.category}</span>
                    </div>
                    <div class="result-desc">${item.content}</div>
                </div>
                <div style="font-size:12px; color:#444;">
                    <i class="fa-solid fa-arrow-turn-down-left"></i>
                </div>
            </div>
        `).join('');
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
