/**
 * DCM Core Intelligence — Terminal-Grade Universal Search Engine
 * Connective tissue connecting Entities, Research, Risks, and Live Monitors.
 */

(function() {
    // Guard Clause to prevent multiple loads
    if (window.dcmSearchEngineLoaded) return;
    window.dcmSearchEngineLoaded = true;

    // 1. DATA GRAPHS & ASYNC API INFRASTRUCTURE
    let SEARCH_GRAPH = [];

    // Resilient relative URL resolver for decoupling
    function getApiPrefix() {
        const path = window.location.pathname;
        if (path.includes('/entities/') || path.includes('/observatory/') || path.includes('/case-studies/') || path.includes('/research/') || path.includes('/intelligence/')) {
            return '../../api/v1/';
        } else if (path.includes('/en/') || path.includes('/fr/')) {
            return '../api/v1/';
        }
        return 'api/v1/';
    }

    // Async API pipeline Loader
    async function hydrateKnowledgeGraph() {
        const apiPrefix = getApiPrefix();
        const endpoints = ['entities.json', 'narratives.json', 'research.json', 'risks.json', 'system.json'];
        const urls = endpoints.map(f => apiPrefix + f);

        try {
            const fetches = urls.map(url => 
                fetch(url)
                    .then(res => {
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                        return res.json();
                    })
                    .catch(err => {
                        console.warn(`[DCM API] Error fetching endpoint ${url}:`, err);
                        return null; 
                    })
            );

            const results = await Promise.all(fetches);
            
            // Hydrate from available responses
            let hydratedCount = 0;
            results.forEach((dataset, index) => {
                if (dataset && dataset.data) {
                    SEARCH_GRAPH.push(...dataset.data);
                    hydratedCount++;
                }
            });

            if (hydratedCount > 0) {
                console.log(`[DCM API] Hypermedia Pipeline Connected. Successfully hydrated ${SEARCH_GRAPH.length} nodes from ${hydratedCount} endpoints.`);
                return;
            }
            throw new Error("No endpoints resolved successfully.");

        } catch (error) {
            console.warn("[DCM API] Fail-safe triggered. Running on embedded static dataset fallback.", error);
            SEARCH_GRAPH = FALLBACK_GRAPH;
        }
    }

    // Embedded Fail-Safe Data Object (Ensures local filesystem browsing remains zero-friction)
    const FALLBACK_GRAPH = [
        {
            id: 'entity-blackrock',
            category: 'entity',
            title: { en: 'BlackRock', fr: 'BlackRock' },
            desc: { en: 'Asset Management · Grade A · SEC registered issuer', fr: 'Gestion d\'Actifs · Note A · Émetteur SEC' },
            keywords: ['blackrock', 'buidl', 'securitize', 'asset', 'mmf'],
            urlPath: 'entities/blackrock.html',
            relatedIds: ['wp-buidl', 'risk-buidl']
        },
        {
            id: 'entity-jpm',
            category: 'entity',
            title: { en: 'JPMorgan Onyx', fr: 'JPMorgan Onyx' },
            desc: { en: 'Commercial Banking · Grade AA · Wholesale settlement ledger', fr: 'Banque Commerciale · Note AA · Registre de gros' },
            keywords: ['jpmorgan', 'jpm', 'onyx', 'coin', 'repo'],
            urlPath: 'entities/jpm-onyx.html',
            relatedIds: ['risk-jpm']
        },
        {
            id: 'entity-circle',
            category: 'entity',
            title: { en: 'Circle / USDC', fr: 'Circle / USDC' },
            desc: { en: 'Digital Infra · Grade AA · Atomic payment & CCTP rails', fr: 'Infra Digitale · Note AA · Paiement atomique & rails CCTP' },
            keywords: ['circle', 'usdc', 'stablecoin', 'cctp'],
            urlPath: 'entities/circle.html',
            relatedIds: ['risk-usdc']
        },
        {
            id: 'entity-forge',
            category: 'entity',
            title: { en: 'SG Forge', fr: 'SG Forge' },
            desc: { en: 'Investment Banking · Grade A · Eur CoinVertible issuer', fr: 'Banque d\'Investissement · Note A · Émetteur Eur CoinVertible' },
            keywords: ['societe generale', 'sg', 'forge', 'eurcv', 'mica'],
            urlPath: 'observatory/risk-radar.html',
            relatedIds: []
        },
        {
            id: 'wp-global',
            category: 'research',
            title: { en: 'Global Tokenization Report 2026', fr: 'Rapport de Tokenisation Mondial 2026' },
            desc: { en: 'DCM-WP-2026-01 · Quantitative institutional market audit', fr: 'DCM-WP-2026-01 · Audit de marché institutionnel' },
            keywords: ['report', 'audit', 'market', 'wp-2026-01'],
            urlPath: 'research/terminal.html',
            relatedIds: []
        },
        {
            id: 'wp-stablecoin-eu',
            category: 'research',
            title: { en: 'European Stablecoin Structure', fr: 'Structure Stablecoins Europe' },
            desc: { en: 'DCM-WP-2026-04 · MiCA liquidity migration paper', fr: 'DCM-WP-2026-04 · Papier sur la migration de liquidité MiCA' },
            keywords: ['stablecoin', 'mica', 'europe', 'wp-2026-04'],
            urlPath: {
                en: 'research/european-stablecoin-market-structure-2026.html',
                fr: 'research/structure-marche-stablecoins-europeens-2026.html'
            },
            relatedIds: ['risk-mica']
        },
        {
            id: 'risk-buidl',
            category: 'risk',
            title: { en: 'BlackRock BUIDL Risk Profile', fr: 'Profil de Risque BUIDL' },
            desc: { en: 'Grade A · Vector scores: TECH:A CUST:AA LEGAL:A LIQ:BB', fr: 'Note A · Scores vectoriels : TECH:A CUST:AA' },
            keywords: ['risk', 'buidl', 'blackrock'],
            urlPath: 'observatory/risk-radar.html',
            relatedIds: []
        },
        {
            id: 'narratives-thematic',
            category: 'narrative',
            title: { en: 'Market Narratives Matrix', fr: 'Thèses de Marché Institutionnelles' },
            desc: { en: 'Thematic overlays linking macro drivers to token assets', fr: 'Couches thématiques reliant les vecteurs macro aux actifs' },
            keywords: ['narratives', 'thesis', 'thèses', 'macro'],
            urlPath: 'intelligence/narratives.html',
            relatedIds: ['hub-central']
        },
        {
            id: 'hub-central',
            category: 'hub',
            title: { en: 'Command Center Hub', fr: 'Centre de Commande Intelligence' },
            desc: { en: 'Central dashboard orchestrating real-time market vectors', fr: 'Tableau de bord central pilotant les vecteurs en temps réel' },
            keywords: ['hub', 'command', 'dashboard'],
            urlPath: 'intelligence/hub.html',
            relatedIds: []
        }
    ];

    // 2. DETECT LANGAUGE & COMPUTE URL BASE
    const currentLang = (document.documentElement.lang === 'fr' || window.location.pathname.includes('/fr/')) ? 'fr' : 'en';
    
    // Find depth relative to the 'en' or 'fr' directory
    function getBaseUrl() {
        const path = window.location.pathname;
        if (path.includes('/entities/') || path.includes('/observatory/') || path.includes('/case-studies/') || path.includes('/research/') || path.includes('/intelligence/')) {
            return '../'; // Go up one level to get to /en/ or /fr/ root
        }
        return './';
    }
    const baseUrl = getBaseUrl();

    // Interface Localized Labels
    const labels = {
        en: {
            placeholder: 'Search entities, research papers, or risk scores...',
            recent: 'Suggested Queries',
            related: 'Related Intelligence Graph',
            all: 'Search Results',
            stats: 'Indexed: 12 Entities · 24 Research Papers · 6 Risk Models · 4 System Overlays',
            footer: '<span><kbd>↑↓</kbd> Select</span><span><kbd>↵</kbd> Open</span><span><kbd>Esc</kbd> Dismiss</span>',
            badge_entity: 'Entity',
            badge_research: 'Research',
            badge_risk: 'Risk Profile',
            badge_monitor: 'Live System',
            badge_timeline: 'Timeline',
            badge_hub: 'Hub Portal',
            badge_narrative: 'Narrative'
        },
        fr: {
            placeholder: 'Rechercher entités, documents, ou scores de risque...',
            recent: 'Requêtes Suggérées',
            related: 'Graphe d\'Intelligence Lié',
            all: 'Résultats de Recherche',
            stats: 'Indexé : 12 Entités · 24 Rapports · 6 Modèles · 4 Couches Système',
            footer: '<span><kbd>↑↓</kbd> Naviguer</span><span><kbd>↵</kbd> Ouvrir</span><span><kbd>Esc</kbd> Fermer</span>',
            badge_entity: 'Entité',
            badge_research: 'Recherche',
            badge_risk: 'Profil Risque',
            badge_monitor: 'Système Live',
            badge_timeline: 'Chronologie',
            badge_hub: 'Centre Hub',
            badge_narrative: 'Narratif'
        }
    }[currentLang];

    let activeIndex = -1;
    let visibleHits = [];

    // 3. INITIALIZATION: Inject CSS and DOM Node
    function initSearchEngine() {
        // A. Inject CSS automatically
        const head = document.head;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        // Compute relative path to css root folder from current depth
        const depthPrefix = baseUrl === '../' ? '../../' : '../'; // Assuming root or 1-deep structure
        link.href = depthPrefix + 'css/dcm-search-engine.css';
        head.appendChild(link);

        // B. Construct & Inject HTML Modal Container
        const overlay = document.createElement('div');
        overlay.id = 'dcm-search-engine-overlay';
        overlay.className = 'dcm-search-overlay';
        
        overlay.innerHTML = `
            <div class="dcm-search-container">
                <!-- Header -->
                <div class="dcm-search-header">
                    <i class="fas fa-search dcm-search-icon"></i>
                    <input type="text" id="dcm-search-input-node" class="dcm-search-input" placeholder="${labels.placeholder}" autocomplete="off" spellcheck="false">
                    <span class="dcm-search-kbd-escape">esc</span>
                </div>
                
                <!-- Main results stream / empty state -->
                <div id="dcm-search-results-stream" class="dcm-search-results">
                    <!-- Populated dynamically by renderResults() -->
                </div>

                <!-- Footer HUD -->
                <div class="dcm-search-footer">
                    <div class="dcm-footer-instructions">${labels.footer}</div>
                    <div class="dcm-footer-stats">${labels.stats}</div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // C. Event Listeners SETUP
        const input = document.getElementById('dcm-search-input-node');
        
        // Toggle Global Commands (⌘K / Ctrl+K and ESC)
        window.addEventListener('keydown', function(e) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                openOverlay();
            }
            if (e.key === 'Escape') {
                closeOverlay();
            }
        });

        // Overlay Click-off dismissal
        overlay.addEventListener('mousedown', function(e) {
            if (e.target === overlay) closeOverlay();
        });

        // Text Input Event
        input.addEventListener('input', function() {
            runSearch(this.value);
        });

        // Keyboard Navigation Events
        input.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                moveSelection(1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                moveSelection(-1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                triggerActiveSelection();
            }
        });

        // Populate Empty State initially
        renderEmptyState();
    }

    // 4. UI CONTROLS
    function openOverlay() {
        const overlay = document.getElementById('dcm-search-engine-overlay');
        overlay.style.display = 'flex';
        // Delay focus slightly to trigger layout paints smoothly
        setTimeout(() => {
            overlay.classList.add('active');
            const input = document.getElementById('dcm-search-input-node');
            input.focus();
            input.select();
        }, 20);
    }

    function closeOverlay() {
        const overlay = document.getElementById('dcm-search-engine-overlay');
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 200);
    }

    // 5. SEARCH ENGINE CORE LOGIC (Filtering, Relational Grouping, Ranking)
    function runSearch(query) {
        query = query.trim().toLowerCase();
        const stream = document.getElementById('dcm-search-results-stream');
        
        if (!query) {
            renderEmptyState();
            return;
        }

        // Step A: Filter direct hits
        let matchedItems = SEARCH_GRAPH.filter(item => {
            const titleMatch = item.title[currentLang].toLowerCase().includes(query);
            const descMatch = item.desc[currentLang].toLowerCase().includes(query);
            const keywordMatch = item.keywords.some(k => k.includes(query));
            return titleMatch || descMatch || keywordMatch;
        });

        if (matchedItems.length === 0) {
            stream.innerHTML = `<div style="padding:32px; text-align:center; color:rgba(255,255,255,0.3); font-size:13px;">No matched intelligence records.</div>`;
            visibleHits = [];
            activeIndex = -1;
            return;
        }

        // Step B: Sort / Rank direct hits (Entities first, then Research, then Risk)
        const order = { 'hub': 0, 'narrative': 1, 'entity': 2, 'research': 3, 'risk': 4, 'monitor': 5, 'timeline': 6 };
        matchedItems.sort((a, b) => order[a.category] - order[b.category]);

        // Step C: Detect if we need an "Intelligence Graph" group (if primary match is an Entity, inject related IDs immediately)
        const primaryEntity = matchedItems.find(item => item.category === 'entity');
        let html = '';
        visibleHits = []; // Reset mapped DOM items for arrow navigation

        if (primaryEntity && query.length > 2) {
            // Render the connected Graph Group
            html += `<div class="dcm-search-group-header"><i class="fas fa-project-diagram"></i> ${labels.related}: ${primaryEntity.title[currentLang]}</div>`;
            
            // Always render primary entity first
            html += generateHitHtml(primaryEntity);
            visibleHits.push(primaryEntity);

            // Locate related objects from IDs
            primaryEntity.relatedIds.forEach(rid => {
                const relItem = SEARCH_GRAPH.find(x => x.id === rid);
                if (relItem) {
                    html += generateHitHtml(relItem);
                    visibleHits.push(relItem);
                }
            });

            // Now render other remaining direct hits (not already in the related list)
            const otherHits = matchedItems.filter(item => item.id !== primaryEntity.id && !primaryEntity.relatedIds.includes(item.id));
            if (otherHits.length > 0) {
                html += `<div class="dcm-search-group-header" style="color:rgba(255,255,255,0.25); margin-top:16px;">${labels.all}</div>`;
                otherHits.forEach(item => {
                    html += generateHitHtml(item);
                    visibleHits.push(item);
                });
            }
        } else {
            // Regular categorical list rendering
            html += `<div class="dcm-search-group-header">${labels.all}</div>`;
            matchedItems.forEach(item => {
                html += generateHitHtml(item);
                visibleHits.push(item);
            });
        }

        stream.innerHTML = html;
        
        // Set first index active by default
        activeIndex = 0;
        updateActiveVisualClass();
    }

    // Generate Single Hit Markup
    function generateHitHtml(item) {
        const finalPath = (typeof item.urlPath === 'object' && item.urlPath[currentLang]) ? item.urlPath[currentLang] : item.urlPath;
        const fullUrl = baseUrl + finalPath;
        const badgeClass = `badge-${item.category}`;
        const badgeText = labels[`badge_${item.category}`];

        return `
            <a href="${fullUrl}" class="dcm-search-hit" data-id="${item.id}">
                <span class="dcm-hit-badge ${badgeClass}">${badgeText}</span>
                <div class="dcm-hit-meta">
                    <div class="dcm-hit-title">${item.title[currentLang]}</div>
                    <div class="dcm-hit-desc">${item.desc[currentLang]}</div>
                </div>
                <i class="fas fa-arrow-right dcm-hit-action-icon"></i>
            </a>
        `;
    }

    // 6. EMPTY & RECENT STATE RENDERER
    function renderEmptyState() {
        const stream = document.getElementById('dcm-search-results-stream');
        const suggested = ['BUIDL', 'USDC', 'Canton Network', 'Report 2026', 'JPM Onyx', 'MiCA'];
        
        let html = `
            <div class="dcm-search-empty-state">
                <div class="dcm-search-section-title">${labels.recent}</div>
                <div class="dcm-search-suggestions">
        `;
        
        suggested.forEach(s => {
            html += `<span class="dcm-search-suggestion-pill" onclick="window.dcmQuickSearch('${s.replace("'", "\\'")}')">${s}</span>`;
        });

        html += `
                </div>
                <div class="dcm-search-section-title" style="margin-top:24px;">SYSTEM ARCHITECTURE</div>
                <div style="font-size:11px; line-height:1.6; color:rgba(255,255,255,0.3);">
                    The Command Bar performs real-time heuristic search traversal across localized repositories. Use <kbd>↑</kbd> <kbd>↓</kbd> and <kbd>↵</kbd> to navigate instantly without mouse interaction.
                </div>
            </div>
        `;

        stream.innerHTML = html;
        visibleHits = [];
        activeIndex = -1;
    }

    // Triggered from Suggested Pills
    window.dcmQuickSearch = function(text) {
        const input = document.getElementById('dcm-search-input-node');
        input.value = text;
        input.focus();
        runSearch(text);
    };

    // 7. KEYBOARD NAVIGATION HELPER ACTIONS
    function moveSelection(direction) {
        if (visibleHits.length === 0) return;
        
        activeIndex += direction;
        if (activeIndex < 0) activeIndex = visibleHits.length - 1;
        if (activeIndex >= visibleHits.length) activeIndex = 0;

        updateActiveVisualClass();
    }

    function updateActiveVisualClass() {
        const hitNodes = document.querySelectorAll('.dcm-search-hit');
        hitNodes.forEach((node, i) => {
            if (i === activeIndex) {
                node.classList.add('active');
                // Ensure visible element scrolls into frame smoothly
                node.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                node.classList.remove('active');
            }
        });
    }

    function triggerActiveSelection() {
        if (activeIndex === -1 || visibleHits.length === 0) return;
        const item = visibleHits[activeIndex];
        const targetUrl = baseUrl + item.urlPath;
        window.location.href = targetUrl;
    }

    // Bootstrapping: Start Hydrating immediately (Network Thread), and wire DOM events
    hydrateKnowledgeGraph();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearchEngine);
    } else {
        initSearchEngine();
    }

    // Global window reference to toggle overlay from traditional HTML button clicks
    window.dcmToggleGlobalSearch = function() {
        openOverlay();
    };

})();
