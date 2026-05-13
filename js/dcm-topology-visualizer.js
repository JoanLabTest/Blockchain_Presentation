/**
 * DCM Core Institutional Topology Visualizer (v1.0.0)
 * ---------------------------------------------------
 * Standard: Rigid schematic vector mapping.
 * Benchmarks: Bloomberg Terminal, DTCC clearing topologies, BIS Unified Ledger.
 * NO FORCE-DIRECTED PHYSICS. Pure rigid grid routing.
 */

class DCMTopologyVisualizer {
    constructor(containerId, dataset = null) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`[DCM Topology] Container #${containerId} not found.`);
            return;
        }

        // Detect context language
        this.lang = (document.documentElement.lang === 'fr' || window.location.pathname.includes('/fr/')) ? 'fr' : 'en';

        // Set static node/layout settings
        this.nodeWidth = 240;
        this.nodeHeight = 65;
        this.layerSpacing = 320; // Horizontal distance between columns
        this.nodeSpacing = 35;   // Vertical distance between nodes in a column
        
        this.data = dataset || this.getDefaultDataset();
        this.init();
    }

    getDefaultDataset() {
        return {
            layers: [
                {
                    id: 'l1',
                    name: { en: 'RESERVES & STATUTORY CUSTODY', fr: 'RÉSERVES & CONSERVATION STATUTAIRE' },
                    nodes: [
                        { id: 'fed-ecb', name: 'Fed / ECB Cash Accounts', cat: 'cb', desc: { en: 'Statutory liquidity backstop', fr: 'Garantie statutaire de liquidité' } },
                        { id: 'bny', name: 'BNY Mellon Custody', cat: 'cust', desc: { en: 'Rule 15c3-3 custody vehicle', fr: 'Véhicule de conservation Règle 15c3-3' } },
                        { id: 'jpm-res', name: 'J.P. Morgan Liquidity Desk', cat: 'cust', desc: { en: 'Operational cash management', fr: 'Gestion de trésorerie opérationnelle' } }
                    ]
                },
                {
                    id: 'l2',
                    name: { en: 'AUTHORIZED ISSUERS & SPVs', fr: 'ÉMETTEURS AGRÉÉS & SPV' },
                    nodes: [
                        { id: 'circle', name: 'Circle (USDC / EURC)', cat: 'issuer', desc: { en: 'Regulated EMI Entity', fr: 'Établissement de Monnaie Électronique' } },
                        { id: 'buidl', name: 'BlackRock BUIDL Fund', cat: 'issuer', desc: { en: 'Institutional MMF Wrap', fr: 'Fonds monétaire institutionnel' } },
                        { id: 'sg-forge', name: 'SG Forge (EURCV)', cat: 'issuer', desc: { en: 'MiCA-Compliant Agent', fr: 'Agent d\'émission conforme MiCA' } }
                    ]
                },
                {
                    id: 'l3',
                    name: { en: 'CLEARING & SETTLEMENT RAILS', fr: 'RAILS DE COMPENSATION & RÈGLEMENT' },
                    nodes: [
                        { id: 'eth', name: 'Ethereum Mainnet (ERC-20)', cat: 'rail', desc: { en: 'Public decentralized settlement', fr: 'Règlement public décentralisé' } },
                        { id: 'onyx', name: 'J.P. Morgan Onyx Network', cat: 'rail', desc: { en: 'Private permissioned Repo engine', fr: 'Moteur de Repo privé autorisé' } },
                        { id: 'canton', name: 'Canton Ledger Network', cat: 'rail', desc: { en: 'Inter-bank privacy fabric', fr: 'Réseau de confidentialité interbancaire' } }
                    ]
                }
            ],
            connections: [
                { from: 'fed-ecb', to: 'bny' },
                { from: 'fed-ecb', to: 'jpm-res' },
                { from: 'bny', to: 'circle' },
                { from: 'bny', to: 'buidl' },
                { from: 'jpm-res', to: 'circle' },
                { from: 'jpm-res', to: 'sg-forge' },
                { from: 'jpm-res', to: 'onyx' },
                { from: 'circle', to: 'eth' },
                { from: 'buidl', to: 'eth' },
                { from: 'sg-forge', to: 'canton' },
                { from: 'sg-forge', to: 'eth' }
            ]
        };
    }

    init() {
        // Append scoped CSS styles for UI
        this.injectStyles();
        
        // Compute dynamic viewport geometry
        const width = this.data.layers.length * this.layerSpacing + 100;
        const maxNodesInLayer = Math.max(...this.data.layers.map(l => l.nodes.length));
        const height = maxNodesInLayer * (this.nodeHeight + this.nodeSpacing) + 160;

        // Build main skeleton markup
        this.container.innerHTML = `
            <div class="topo-frame">
                <div class="topo-toolbar">
                    <div class="topo-toolbar-title">
                        <i class="fas fa-network-wired" style="color: #3b82f6;"></i>
                        <span>${this.lang === 'fr' ? 'EXPLORATEUR DE TOPOLOGIE SYSTÉMIQUE' : 'SYSTEMIC TOPOLOGY EXPLORER'}</span>
                    </div>
                    <div class="topo-toolbar-legend">
                        <span class="leg-item"><span class="dot cb"></span>CB</span>
                        <span class="leg-item"><span class="dot cust"></span>Custody</span>
                        <span class="leg-item"><span class="dot issuer"></span>Issuer</span>
                        <span class="leg-item"><span class="dot rail"></span>Rail</span>
                    </div>
                </div>
                <div class="topo-viewport-wrap">
                    <svg id="topo-svg" class="topo-svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                        <!-- SVG filters for glowing effects -->
                        <defs>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        <g id="topo-connections-layer"></g>
                        <g id="topo-nodes-layer"></g>
                    </svg>
                </div>
                <div id="topo-inspector" class="topo-inspector">
                    <div class="ins-placeholder">
                        <i class="fas fa-mouse-pointer"></i> 
                        ${this.lang === 'fr' ? 'Sélectionnez un nœud d\'infrastructure pour inspecter ses dépendances amont/aval.' : 'Click an infrastructure node to inspect transactional dependencies.'}
                    </div>
                </div>
            </div>
        `;

        this.svg = this.container.querySelector('#topo-svg');
        this.connLayer = this.container.querySelector('#topo-connections-layer');
        this.nodeLayer = this.container.querySelector('#topo-nodes-layer');
        this.inspector = this.container.querySelector('#topo-inspector');

        this.render();
    }

    render() {
        const positions = {}; // Map to cache resolved coordinate structures for connection drawing

        // 1. Render Columns (Layers) & Nodes
        this.data.layers.forEach((layer, lIndex) => {
            const colX = 60 + lIndex * this.layerSpacing;

            // Render Column Header Label
            const headerText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            headerText.setAttribute("x", colX + this.nodeWidth/2);
            headerText.setAttribute("y", 45);
            headerText.setAttribute("class", "layer-header-text");
            headerText.setAttribute("text-anchor", "middle");
            headerText.textContent = layer.name[this.lang];
            this.nodeLayer.appendChild(headerText);

            // Draw dashed separation line
            if (lIndex > 0) {
                const sepLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
                sepLine.setAttribute("x1", colX - (this.layerSpacing - this.nodeWidth)/2);
                sepLine.setAttribute("y1", 30);
                sepLine.setAttribute("x2", colX - (this.layerSpacing - this.nodeWidth)/2);
                sepLine.setAttribute("y2", this.svg.viewBox.baseVal.height - 40);
                sepLine.setAttribute("class", "layer-divider");
                this.connLayer.appendChild(sepLine);
            }

            // Total height consumed by nodes in this layer to vertical center them
            const layerNodesHeight = layer.nodes.length * this.nodeHeight + (layer.nodes.length - 1) * this.nodeSpacing;
            const startY = (this.svg.viewBox.baseVal.height - layerNodesHeight) / 2 + 30;

            layer.nodes.forEach((node, nIndex) => {
                const nodeY = startY + nIndex * (this.nodeHeight + this.nodeSpacing);

                // Save connection anchor points (Left/Right midpoints)
                positions[node.id] = {
                    x: colX,
                    y: nodeY,
                    w: this.nodeWidth,
                    h: this.nodeHeight,
                    anchorL: { x: colX, y: nodeY + this.nodeHeight / 2 },
                    anchorR: { x: colX + this.nodeWidth, y: nodeY + this.nodeHeight / 2 }
                };

                // Create Group Element
                const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                g.setAttribute("class", `topo-node-group cat-${node.cat}`);
                g.setAttribute("data-id", node.id);

                // Node box rect
                const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("x", colX);
                rect.setAttribute("y", nodeY);
                rect.setAttribute("width", this.nodeWidth);
                rect.setAttribute("height", this.nodeHeight);
                rect.setAttribute("rx", "4");
                rect.setAttribute("class", "topo-node-rect");
                g.appendChild(rect);

                // Class accent strip (left edge)
                const strip = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                strip.setAttribute("x", colX);
                strip.setAttribute("y", nodeY);
                strip.setAttribute("width", "4");
                strip.setAttribute("height", this.nodeHeight);
                strip.setAttribute("rx", "0");
                strip.setAttribute("class", "topo-node-strip");
                g.appendChild(strip);

                // Node Category Badge pill text (top right)
                const catLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
                catLabel.setAttribute("x", colX + this.nodeWidth - 12);
                catLabel.setAttribute("y", nodeY + 20);
                catLabel.setAttribute("class", "node-cat-badge");
                catLabel.setAttribute("text-anchor", "end");
                catLabel.textContent = node.cat.toUpperCase();
                g.appendChild(catLabel);

                // Node Name text
                const nameText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                nameText.setAttribute("x", colX + 16);
                nameText.setAttribute("y", nodeY + 32);
                nameText.setAttribute("class", "node-name-text");
                nameText.textContent = node.name;
                g.appendChild(nameText);

                // Subtext description
                const subText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                subText.setAttribute("x", colX + 16);
                subText.setAttribute("y", nodeY + 48);
                subText.setAttribute("class", "node-desc-text");
                subText.textContent = node.desc[this.lang];
                g.appendChild(subText);

                // Interactivity bindings
                g.addEventListener('mouseenter', () => this.highlightPathways(node.id));
                g.addEventListener('mouseleave', () => this.resetHighlights());
                g.addEventListener('click', () => this.inspectNode(node));

                this.nodeLayer.appendChild(g);
            });
        });

        // 2. Render Connections (Orthogonal DTCC-Style Routing paths)
        this.data.connections.forEach(conn => {
            const fromPos = positions[conn.from];
            const toPos = positions[conn.to];

            if (fromPos && toPos) {
                const start = fromPos.anchorR;
                const end = toPos.anchorL;

                // Draw path
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                
                // Compute rigid S-bend curve (using two horizontal legs and one vertical backbone)
                const midX = start.x + (end.x - start.x) / 2;
                
                // Format: Move to start -> Line to midX horizontally -> Line to end.y vertically -> Line to end.x horizontally
                const d = `M ${start.x} ${start.y} H ${midX} V ${end.y} H ${end.x}`;

                path.setAttribute("d", d);
                path.setAttribute("class", "topo-link");
                path.setAttribute("data-from", conn.from);
                path.setAttribute("data-to", conn.to);

                // Draw direction arrow markers or inline animated dot circles
                this.connLayer.appendChild(path);
            }
        });
    }

    highlightPathways(nodeId) {
        // 1. Dim everything
        this.svg.classList.add('has-active-focus');
        
        const affectedNodes = new Set([nodeId]);
        const affectedLinks = [];

        // Traverse outgoing connections (Downstream)
        this.data.connections.forEach(conn => {
            if (conn.from === nodeId) {
                affectedNodes.add(conn.to);
                affectedLinks.push(conn);
            }
            if (conn.to === nodeId) {
                affectedNodes.add(conn.from);
                affectedLinks.push(conn);
            }
        });

        // Apply highlighting classes
        this.nodeLayer.querySelectorAll('.topo-node-group').forEach(g => {
            const id = g.getAttribute('data-id');
            if (affectedNodes.has(id)) {
                g.classList.add('node-highlighted');
                if (id === nodeId) g.classList.add('node-primary');
            } else {
                g.classList.add('node-dimmed');
            }
        });

        this.connLayer.querySelectorAll('.topo-link').forEach(path => {
            const from = path.getAttribute('data-from');
            const to = path.getAttribute('data-to');

            if (from === nodeId || to === nodeId) {
                path.classList.add('link-highlighted');
            } else {
                path.classList.add('link-dimmed');
            }
        });
    }

    resetHighlights() {
        this.svg.classList.remove('has-active-focus');
        this.nodeLayer.querySelectorAll('.topo-node-group').forEach(g => {
            g.classList.remove('node-highlighted', 'node-primary', 'node-dimmed');
        });
        this.connLayer.querySelectorAll('.topo-link').forEach(p => {
            p.classList.remove('link-highlighted', 'link-dimmed');
        });
    }

    inspectNode(node) {
        // Gather systemic metadata
        const parents = this.data.connections.filter(c => c.to === node.id).map(c => {
            return this.findNodeName(c.from);
        });
        const children = this.data.connections.filter(c => c.from === node.id).map(c => {
            return this.findNodeName(c.to);
        });

        this.inspector.innerHTML = `
            <div class="ins-active">
                <div class="ins-header cat-${node.cat}">
                    <span class="ins-type-tag">${node.cat.toUpperCase()} ENTRY</span>
                    <h3>${node.name}</h3>
                </div>
                <div class="ins-body">
                    <div class="ins-section">
                        <strong>${this.lang === 'fr' ? 'CLASSIFICATION SYSTÉMIQUE' : 'SYSTEMIC CLASSIFICATION'}</strong>
                        <p>${node.desc[this.lang]}</p>
                    </div>
                    <div class="ins-columns">
                        <div class="ins-col">
                            <strong><i class="fas fa-arrow-turn-up" style="transform:rotate(90deg)"></i> ${this.lang === 'fr' ? 'DÉPENDANCES AMONT' : 'UPSTREAM DEPENDENCIES'}</strong>
                            <ul>
                                ${parents.length ? parents.map(n => `<li>${n}</li>`).join('') : `<li style="opacity:0.4; font-style:italic;">${this.lang === 'fr' ? 'Aucune (Origine Racine)' : 'None (Root Origin)'}</li>`}
                            </ul>
                        </div>
                        <div class="ins-col">
                            <strong><i class="fas fa-arrow-turn-down" style="transform:rotate(-90deg)"></i> ${this.lang === 'fr' ? 'RAILS DE SORTIE AVAL' : 'DOWNSTREAM OUTLETS'}</strong>
                            <ul>
                                ${children.length ? children.map(n => `<li>${n}</li>`).join('') : `<li style="opacity:0.4; font-style:italic;">${this.lang === 'fr' ? 'Aucun (Point Terminal)' : 'None (Terminal Endpoint)'}</li>`}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    findNodeName(id) {
        for (let l of this.data.layers) {
            const found = l.nodes.find(n => n.id === id);
            if (found) return found.name;
        }
        return id;
    }

    injectStyles() {
        if (document.getElementById('dcm-topo-injected-styles')) return;
        
        const css = `
            .topo-frame {
                background: #050811;
                border: 1px solid rgba(59, 130, 246, 0.15);
                border-radius: 8px;
                font-family: 'JetBrains Mono', 'Inter', monospace;
                overflow: hidden;
                color: #e2e8f0;
                box-shadow: 0 15px 40px rgba(0,0,0,0.5);
            }
            .topo-toolbar {
                background: rgba(15, 23, 42, 0.6);
                border-bottom: 1px solid rgba(255,255,255,0.05);
                padding: 12px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 11px;
                letter-spacing: 1px;
            }
            .topo-toolbar-title { display: flex; align-items: center; gap: 10px; font-weight: 700; }
            .topo-toolbar-legend { display: flex; gap: 16px; opacity: 0.8; }
            .leg-item { display: flex; align-items: center; gap: 6px; }
            .dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
            .dot.cb { background: #ef4444; }
            .dot.cust { background: #f59e0b; }
            .dot.issuer { background: #3b82f6; }
            .dot.rail { background: #10b981; }

            .topo-viewport-wrap {
                overflow-x: auto;
                background: radial-gradient(circle at center, #0b1120 0%, #050811 100%);
                padding: 20px 0;
            }
            .topo-svg {
                display: block;
                user-select: none;
            }

            /* Grid Typography */
            .layer-header-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                fill: #64748b;
                letter-spacing: 2px;
            }
            .layer-divider {
                stroke: rgba(255, 255, 255, 0.04);
                stroke-dasharray: 4 4;
                stroke-width: 1;
            }

            /* Node Blocks */
            .topo-node-group {
                cursor: pointer;
                transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            .topo-node-rect {
                fill: #0e1526;
                stroke: rgba(255,255,255,0.08);
                stroke-width: 1px;
                transition: inherit;
            }
            .topo-node-strip { transition: inherit; }
            .topo-node-group.cat-cb .topo-node-strip { fill: #ef4444; }
            .topo-node-group.cat-cust .topo-node-strip { fill: #f59e0b; }
            .topo-node-group.cat-issuer .topo-node-strip { fill: #3b82f6; }
            .topo-node-group.cat-rail .topo-node-strip { fill: #10b981; }

            .node-cat-badge {
                font-size: 8px;
                font-weight: 800;
                letter-spacing: 1px;
                fill: #475569;
                opacity: 0.8;
            }
            .node-name-text {
                font-size: 12px;
                font-weight: 700;
                fill: #fff;
            }
            .node-desc-text {
                font-size: 9px;
                fill: #94a3b8;
            }

            /* Linking Edges */
            .topo-link {
                fill: none;
                stroke: rgba(59, 130, 246, 0.15);
                stroke-width: 1.5px;
                transition: stroke 0.2s, stroke-width 0.2s, opacity 0.2s;
            }

            /* HOVER & FOCUS STATES */
            .topo-node-group:hover .topo-node-rect {
                fill: #141f38;
                stroke: rgba(59, 130, 246, 0.4);
            }
            .topo-node-group.node-highlighted .topo-node-rect {
                stroke-width: 1.5px;
                fill: #16223d;
            }
            
            /* Colors in focus modes */
            .topo-node-group.node-primary .topo-node-rect {
                stroke: #3b82f6;
                fill: #1e293b !important;
                filter: url(#glow);
            }
            .topo-node-group.node-highlighted.cat-cb .topo-node-rect { stroke: #f87171; }
            .topo-node-group.node-highlighted.cat-cust .topo-node-rect { stroke: #fbbf24; }
            .topo-node-group.node-highlighted.cat-issuer .topo-node-rect { stroke: #60a5fa; }
            .topo-node-group.node-highlighted.cat-rail .topo-node-rect { stroke: #34d399; }

            .link-highlighted {
                stroke: rgba(99, 179, 237, 0.65);
                stroke-width: 2.5px;
                opacity: 1 !important;
            }

            .has-active-focus .node-dimmed {
                opacity: 0.25;
            }
            .has-active-focus .link-dimmed {
                opacity: 0.08;
            }

            /* Inspector Panel */
            .topo-inspector {
                background: #03050b;
                border-top: 1px solid rgba(255,255,255,0.05);
                min-height: 120px;
                padding: 20px 24px;
                display: flex;
                align-items: center;
            }
            .ins-placeholder {
                width: 100%;
                text-align: center;
                color: #475569;
                font-size: 11px;
                letter-spacing: 1px;
            }
            .ins-placeholder i { margin-right: 8px; font-size: 14px; }
            
            .ins-active { width: 100%; display: flex; flex-direction: column; gap: 16px; animation: fadeIn 0.3s; }
            @keyframes fadeIn { from {opacity:0;} to {opacity:1;} }
            
            .ins-header { display: flex; flex-direction: column; gap: 4px; border-left: 3px solid transparent; padding-left: 16px; }
            .ins-header.cat-cb { border-color: #ef4444; }
            .ins-header.cat-cust { border-color: #f59e0b; }
            .ins-header.cat-issuer { border-color: #3b82f6; }
            .ins-header.cat-rail { border-color: #10b981; }
            
            .ins-type-tag { font-size: 9px; font-weight: 800; color: #475569; letter-spacing: 1.5px; }
            .ins-header h3 { margin: 0; font-size: 16px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
            
            .ins-body { display: flex; gap: 40px; font-size: 11px; }
            .ins-section { flex: 1.5; }
            .ins-section strong, .ins-col strong { display: block; font-size: 9px; color: #64748b; letter-spacing: 1px; margin-bottom: 6px; }
            .ins-section p { margin: 0; color: #cbd5e1; line-height: 1.5; }
            
            .ins-columns { display: flex; flex: 2; gap: 32px; }
            .ins-col { flex: 1; }
            .ins-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
            .ins-col li { color: #e2e8f0; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 2px; }
            
            @media (max-width: 768px) {
                .ins-body { flex-direction: column; gap: 24px; }
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.id = "dcm-topo-injected-styles";
        styleSheet.textContent = css;
        document.head.appendChild(styleSheet);
    }
}

// Auto-mount if element is present on DOM load
document.addEventListener('DOMContentLoaded', () => {
    const mountTarget = document.getElementById('dcm-topology-container');
    if (mountTarget) {
        new DCMTopologyVisualizer('dcm-topology-container');
    }
});
