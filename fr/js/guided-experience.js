/**
 * DCM Core Institute – Guided Experience Layer (Brique 4) [FR]
 * Persona-based intelligent onboarding modal.
 * Shown ONCE per visitor (localStorage flag), dismissed freely.
 */
(function () {
    'use strict';

    const STORAGE_KEY = 'dcm_onboarding_done_v1';

    // Don't show if already seen
    if (localStorage.getItem(STORAGE_KEY)) return;

    const personas = [
        {
            id: 'analyst',
            icon: 'fa-chart-mixed',
            color: '#3b82f6',
            colorRgb: '59,130,246',
            label: 'ANALYSTE',
            title: 'Analyste / Chercheur',
            desc: 'Accédez aux données de marché en direct, au registre GTSR, au terminal de requêtes et aux rapports institutionnels.',
            links: [
                { text: 'Observatoire des Marchés', href: 'observatory/tokenized-markets.html', icon: 'fa-chart-line' },
                { text: 'Global Monitor (TVL/RWA)', href: 'observatory/global-tokenization-monitor.html', icon: 'fa-globe' },
                { text: 'Rapport Mondial 2026', href: 'research/rapport-mondial-tokenisation-2026.html', icon: 'fa-crown' },
            ]
        },
        {
            id: 'bank',
            icon: 'fa-building-columns',
            color: '#d4af37',
            colorRgb: '212,175,55',
            label: 'INSTITUTION',
            title: 'Banque / Institution',
            desc: 'Explorez les blueprints techniques, les standards TFIN-ID et les cadres de conformité MiCA / DORA pour votre déploiement.',
            links: [
                { text: 'Galerie des Blueprints', href: 'standards/blueprints/index.html', icon: 'fa-layer-group' },
                { text: 'Standard TFIN-ID', href: 'standards/tfin-id.html', icon: 'fa-id-card' },
                { text: 'Cadre PCM', href: 'research/programmable-capital-markets/index.html', icon: 'fa-microchip' },
            ]
        },
        {
            id: 'investor',
            icon: 'fa-briefcase',
            color: '#10b981',
            colorRgb: '16,185,129',
            label: 'INVESTISSEUR',
            title: 'Investisseur / Gestionnaire',
            desc: 'Découvrez les stratégies institutionnelles RWA, les analyses de produits tokenisés et les outils de rendement optimisé.',
            links: [
                { text: 'Stratégies BlackRock ETHB', href: 'strategies/blackrock-ethb-staked-ethereum-etf.html', icon: 'fa-gem' },
                { text: 'Hasnote USYC (T-Bills)', href: 'strategies/usyc-tresor-tokenise.html', icon: 'fa-vault' },
                { text: 'ETF Covered Call', href: 'strategies/etf-covered-call.html', icon: 'fa-arrows-left-right-to-line' },
            ]
        }
    ];

    function dismiss() {
        localStorage.setItem(STORAGE_KEY, '1');
        const overlay = document.getElementById('dcm-guided-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transform = 'scale(1.02)';
            setTimeout(() => overlay.remove(), 400);
        }
    }

    function renderPersonaCard(p) {
        return `
        <div class="dcm-persona-card" id="dcm-persona-${p.id}" style="--p-color: ${p.color}; --p-rgb: ${p.colorRgb};" onclick="document.getElementById('dcm-guided-overlay').querySelector('#dcm-links-${p.id}').classList.toggle('dcm-active')">
            <div class="dcm-persona-top">
                <div class="dcm-persona-icon"><i class="fas ${p.icon}"></i></div>
                <div>
                    <div class="dcm-persona-badge">${p.label}</div>
                    <h3 class="dcm-persona-title">${p.title}</h3>
                </div>
                <i class="fas fa-chevron-down dcm-persona-chevron"></i>
            </div>
            <p class="dcm-persona-desc">${p.desc}</p>
            <div class="dcm-links" id="dcm-links-${p.id}">
                ${p.links.map(l => `<a href="${l.href}" class="dcm-quick-link" onclick="event.stopPropagation(); localStorage.setItem('${STORAGE_KEY}','1');"><i class="fas ${l.icon}"></i> ${l.text} <i class="fas fa-arrow-right" style="margin-left:auto;opacity:0.5;font-size:11px;"></i></a>`).join('')}
            </div>
        </div>`;
    }

    const css = `
    #dcm-guided-overlay {
        position: fixed; inset: 0; z-index: 99999;
        background: rgba(2,6,23,0.92);
        backdrop-filter: blur(14px);
        display: flex; align-items: center; justify-content: center;
        padding: 20px;
        transition: opacity 0.4s ease, transform 0.4s ease;
        opacity: 1; transform: scale(1);
    }
    .dcm-modal {
        max-width: 900px; width: 100%;
        background: linear-gradient(135deg, rgba(15,23,42,0.98), rgba(2,6,23,0.99));
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 28px;
        padding: 48px 48px 36px;
        box-shadow: 0 40px 80px rgba(0,0,0,0.6);
        position: relative;
        max-height: 92vh; overflow-y: auto;
    }
    .dcm-modal-header { text-align: center; margin-bottom: 36px; }
    .dcm-modal-eyebrow {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px; font-weight: 700; letter-spacing: 2.5px;
        text-transform: uppercase;
        color: #d4af37;
        background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.25);
        display: inline-block; padding: 5px 14px; border-radius: 100px;
        margin-bottom: 18px;
    }
    .dcm-modal-title { font-family: 'Outfit','Inter',sans-serif; font-size: 34px; font-weight: 800; color: #fff; margin: 0 0 10px; }
    .dcm-modal-sub { color: #94a3b8; font-size: 16px; margin: 0; }
    .dcm-personas { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 24px; }
    .dcm-persona-card {
        background: rgba(30,41,59,0.4);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 16px; padding: 24px 20px 20px;
        cursor: pointer; transition: 0.35s;
        position: relative; overflow: hidden;
    }
    .dcm-persona-card::before {
        content:''; position:absolute; top:0; left:0; right:0; height:3px;
        background: var(--p-color); opacity:0.5; transition:0.3s;
    }
    .dcm-persona-card:hover { border-color: var(--p-color); background: rgba(var(--p-rgb),0.07); box-shadow: 0 8px 30px rgba(var(--p-rgb),0.12); }
    .dcm-persona-card:hover::before { opacity:1; }
    .dcm-persona-top { display:flex; align-items:center; gap:14px; margin-bottom:12px; }
    .dcm-persona-icon { width:44px; height:44px; border-radius:12px; display:grid; place-items:center; font-size:20px; color:var(--p-color); background:rgba(var(--p-rgb),0.12); flex-shrink:0; }
    .dcm-persona-badge { font-size:9px; font-weight:800; letter-spacing:1.5px; color:var(--p-color); text-transform:uppercase; margin-bottom:3px; }
    .dcm-persona-title { font-size:15px; font-weight:700; color:#fff; margin:0; line-height:1.2; }
    .dcm-persona-chevron { margin-left:auto; color:#475569; font-size:12px; transition:0.3s; }
    .dcm-persona-desc { font-size:13px; color:#94a3b8; line-height:1.5; margin:0 0 0; }
    .dcm-links { max-height:0; overflow:hidden; transition:max-height 0.4s ease, margin 0.3s; }
    .dcm-links.dcm-active { max-height:200px; margin-top:16px; }
    .dcm-quick-link {
        display:flex; align-items:center; gap:10px;
        padding:10px 14px; border-radius:10px;
        background:rgba(var(--p-rgb),0.07); border:1px solid rgba(var(--p-rgb),0.15);
        color:#cbd5e1; font-size:13px; font-weight:600;
        text-decoration:none; margin-bottom:8px; transition:0.25s;
    }
    .dcm-quick-link:hover { background:rgba(var(--p-rgb),0.18); color:#fff; border-color:var(--p-color); }
    .dcm-quick-link i:first-child { color:var(--p-color); width:16px; }
    .dcm-modal-footer { display:flex; align-items:center; justify-content:space-between; padding-top:20px; border-top:1px solid rgba(255,255,255,0.06); }
    .dcm-skip-btn { background:none; border:none; cursor:pointer; color:#475569; font-size:14px; transition:0.25s; }
    .dcm-skip-btn:hover { color:#94a3b8; }
    .dcm-explore-btn { display:flex; align-items:center; gap:8px; background:rgba(59,130,246,0.1); border:1px solid rgba(59,130,246,0.2); color:#60a5fa; padding:10px 20px; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer; transition:0.25s; }
    .dcm-explore-btn:hover { background:rgba(59,130,246,0.2); color:#93c5fd; }
    @media(max-width:720px) { .dcm-personas{grid-template-columns:1fr;} .dcm-modal{padding:28px 20px 22px;} .dcm-modal-title{font-size:24px;} }
    `;

    const html = `
    <style>${css}</style>
    <div class="dcm-modal">
        <div class="dcm-modal-header">
            <div class="dcm-modal-eyebrow"><i class="fas fa-landmark"></i> &nbsp;DCM Core Institute</div>
            <h2 class="dcm-modal-title">Bienvenue — Comment souhaitez-vous commencer ?</h2>
            <p class="dcm-modal-sub">Sélectionnez votre profil pour un accès guidé aux ressources les plus pertinentes.</p>
        </div>
        <div class="dcm-personas">
            ${personas.map(renderPersonaCard).join('')}
        </div>
        <div class="dcm-modal-footer">
            <button class="dcm-skip-btn" onclick="window._dcmDismiss()">← Passer l'introduction</button>
            <button class="dcm-explore-btn" onclick="window._dcmDismiss()"><i class="fas fa-compass"></i> Explorer librement</button>
        </div>
    </div>`;

    // Inject into DOM after load
    function inject() {
        const overlay = document.createElement('div');
        overlay.id = 'dcm-guided-overlay';
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        window._dcmDismiss = dismiss;

        // ESC to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') dismiss();
        }, { once: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        setTimeout(inject, 400);
    }
})();
