/**
 * DCM Snapshot Engine (v1.0.0)
 * ---------------------------
 * Standard: Ultra-compressed, high-contrast institutional card framework.
 * Constraint Enforced: Exactly 1 chart, 1 master quantitative metric, and 3 implications max.
 * Benchmarks: ECB Financial Stability Note visuals, DTCC Systemic Dashboard cards.
 */

class DCMSnapshotEngine {
    constructor() {
        this.lang = (document.documentElement.lang === 'fr' || window.location.pathname.includes('/fr/')) ? 'fr' : 'en';
        
        // Global Snapshot Registry (Extensible)
        this.registry = {
            'SNAP-2026-04': {
                id: 'SNAP-2026-04',
                category: 'LIQUIDITY',
                title: { en: 'Repo Velocity Compression', fr: 'Compression de la Vélocité Repo' },
                date: '2026-05-08',
                mainValue: '-12.4%',
                mainLabel: { en: 'Interbank Repo Volume Delta (QoQ)', fr: 'Delta Vol. Repo Interbancaire (T/T)' },
                chartData: [98, 89, 84, 72, 61, 54, 45], // Decreasing yield line spark
                trend: 'down',
                implications: {
                    en: [
                        "Mandatory reserve caches directly sequester short-term paper.",
                        "Intra-day private ledgers isolate bank commercial liquidity.",
                        "Cross-chain latency triggers periodic settlement finality lag."
                    ],
                    fr: [
                        "Les réserves obligatoires séquestrent directement le collatéral court-terme.",
                        "Les registres privés intra-journaliers isolent la liquidité interbancaire.",
                        "La latence multi-chaines provoque des retards de règlement périodiques."
                    ]
                }
            },
            'SNAP-2026-05': {
                id: 'SNAP-2026-05',
                category: 'REGULATORY',
                title: { en: 'MiCA Compliance Pivot Rate', fr: 'Taux de Pivot de Conformité MiCA' },
                date: '2026-05-10',
                mainValue: '+68%',
                mainLabel: { en: 'Compliant Custody Asset Inflow', fr: 'Entrée d\'Actifs en Garde Conforme' },
                chartData: [12, 22, 35, 44, 55, 68], // Increasing growth
                trend: 'up',
                implications: {
                    en: [
                        "Non-EU unregulated pools face rapid liquidation directives.",
                        "Regulated custodian spreads narrow due to cash influx.",
                        "Issuer survival tethered directly to tier-1 balance sheets."
                    ],
                    fr: [
                        "Les pools non-UE non régulés font face à des directives de liquidation.",
                        "Les spreads des conservateurs agréés se resserrent sous l'afflux.",
                        "La survie de l'émetteur dépend directement des bilans de rang 1."
                    ]
                }
            }
        };

        this.injectStyles();
        this.mountAll();
    }

    injectStyles() {
        if (document.getElementById('dcm-snapshot-injected-styles')) return;

        const css = `
            .dcm-snap-card {
                background: #050811;
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 6px;
                overflow: hidden;
                font-family: 'JetBrains Mono', 'Inter', monospace;
                color: #e2e8f0;
                max-width: 340px;
                width: 100%;
                box-sizing: border-box;
                margin-bottom: 24px;
                transition: border-color 0.2s;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            .dcm-snap-card:hover {
                border-color: rgba(59, 130, 246, 0.3);
            }
            
            /* Header Row */
            .snap-header {
                background: rgba(255,255,255,0.02);
                border-bottom: 1px solid rgba(255,255,255,0.05);
                padding: 8px 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 9px;
                letter-spacing: 1px;
            }
            .snap-badge {
                font-weight: 800;
                text-transform: uppercase;
                padding: 2px 6px;
                border-radius: 3px;
            }
            .snap-badge.liquidity { background: rgba(16, 185, 129, 0.15); color: #10b981; }
            .snap-badge.regulatory { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
            .snap-badge.structural { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
            .snap-id { color: #64748b; }

            /* Center Core Display */
            .snap-core {
                padding: 16px;
                display: flex;
                gap: 16px;
                align-items: center;
                border-bottom: 1px solid rgba(255,255,255,0.03);
            }
            .snap-numeric { flex: 1.2; }
            .snap-val {
                font-family: 'Outfit', sans-serif;
                font-size: 32px;
                font-weight: 800;
                line-height: 1;
                letter-spacing: -1px;
            }
            .snap-val.val-down { color: #ef4444; }
            .snap-val.val-up { color: #10b981; }
            .snap-lbl {
                font-size: 8.5px;
                color: #94a3b8;
                line-height: 1.3;
                margin-top: 6px;
                text-transform: uppercase;
                font-weight: 600;
            }
            
            .snap-viz {
                flex: 1;
                height: 50px;
                position: relative;
            }
            .snap-spark {
                width: 100%;
                height: 100%;
                display: block;
            }

            /* Bottom Implications Matrix */
            .snap-implications {
                padding: 12px 16px;
                background: rgba(255,255,255,0.01);
            }
            .snap-imp-lbl {
                font-size: 8px;
                color: #475569;
                font-weight: 800;
                letter-spacing: 1px;
                margin-bottom: 8px;
                text-transform: uppercase;
            }
            .snap-list {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .snap-item {
                font-size: 10px;
                line-height: 1.4;
                color: #cbd5e1;
                display: flex;
                gap: 8px;
            }
            .snap-bullet {
                color: #64748b;
                font-weight: bold;
            }
            
            /* Footer Attributions */
            .snap-footer {
                background: #03050a;
                border-top: 1px solid rgba(255,255,255,0.04);
                padding: 6px 12px;
                font-size: 8px;
                color: #475569;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .snap-footer a {
                color: var(--term-blue, #3b82f6);
                text-decoration: none;
            }
        `;

        const style = document.createElement("style");
        style.id = "dcm-snapshot-injected-styles";
        style.textContent = css;
        document.head.appendChild(style);
    }

    generateSparkline(data, trend) {
        const strokeColor = trend === 'down' ? '#ef4444' : '#10b981';
        const width = 120;
        const height = 40;
        
        const min = Math.min(...data);
        const max = Math.max(...data);
        const spread = max - min || 1;
        
        // Map data values into relative viewbox coordinates
        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val - min) / spread) * height;
            return `${x},${y}`;
        });

        const pathData = `M ${points.join(' L ')}`;
        
        return `
            <svg viewBox="0 0 ${width} ${height}" class="snap-spark" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="grad-${trend}" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.2"></stop>
                        <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0"></stop>
                    </linearGradient>
                </defs>
                <path d="${pathData} L ${width},${height} L 0,${height} Z" fill="url(#grad-${trend})"></path>
                <path d="${pathData}" fill="none" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <circle cx="${points[points.length - 1].split(',')[0]}" cy="${points[points.length - 1].split(',')[1]}" r="2.5" fill="${strokeColor}"></circle>
            </svg>
        `;
    }

    renderCard(data) {
        const sparkline = this.generateSparkline(data.chartData, data.trend);
        const itemsHtml = data.implications[this.lang].map((text, idx) => `
            <li class="snap-item">
                <span class="snap-bullet">0${idx + 1}</span>
                <span>${text}</span>
            </li>
        `).join('');

        const categoryBadge = `<span class="snap-badge ${data.category.toLowerCase()}">${data.category}</span>`;
        const trendClass = data.trend === 'down' ? 'val-down' : 'val-up';

        const citationLabel = this.lang === 'fr' ? 'COPIER CITATION' : 'COPY CITE';
        const titleText = this.lang === 'fr' ? 'IMPLICATIONS SYSTÉMIQUES' : 'SYSTEMIC IMPLICATIONS';

        return `
            <div class="dcm-snap-card">
                <div class="snap-header">
                    ${categoryBadge}
                    <span class="snap-id">${data.id} · ${data.date}</span>
                </div>
                <div class="snap-core">
                    <div class="snap-numeric">
                        <div class="snap-val ${trendClass}">${data.mainValue}</div>
                        <div class="snap-lbl">${data.mainLabel[this.lang]}</div>
                    </div>
                    <div class="snap-viz">
                        ${sparkline}
                    </div>
                </div>
                <div class="snap-implications">
                    <div class="snap-imp-lbl">${titleText}</div>
                    <ul class="snap-list">
                        ${itemsHtml}
                    </ul>
                </div>
                <div class="snap-footer">
                    <span>DCM CORE INSTITUTE</span>
                    <a href="#" onclick="navigator.clipboard.writeText('DCM Core Snapshot ${data.id}: ${data.mainValue} in ${data.title[this.lang]}'); alert('Snapshot cite copied to clipboard!'); return false;">${citationLabel} →</a>
                </div>
            </div>
        `;
    }

    mountAll() {
        const mounts = document.querySelectorAll('.dcm-snapshot-mount');
        mounts.forEach(element => {
            const id = element.getAttribute('data-snap-id');
            if (this.registry[id]) {
                element.innerHTML = this.renderCard(this.registry[id]);
            } else {
                console.warn(`[DCMSnapshot] ID '${id}' not registered.`);
            }
        });
    }
}

// Auto-run engine on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.dcmSnapshot = new DCMSnapshotEngine();
});
