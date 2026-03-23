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

    function renderPersonaCard(p, index) {
        return `
        <div class="dcm-persona-card" id="dcm-persona-${p.id}" style="--p-color: ${p.color}; --p-rgb: ${p.colorRgb}; animation-delay: ${0.1 + index * 0.1}s;" onclick="togglePersona('${p.id}')">
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
                <div class="dcm-links-header">EXPLOREZ VOTRE HUB DE PROFIL</div>
                ${p.links.map((l, i) => `<a href="${l.href}" class="dcm-quick-link" style="animation-delay: ${0.05 * i}s;" onclick="event.stopPropagation(); localStorage.setItem('${STORAGE_KEY}','1'); localStorage.setItem('dcm_persona_id', '${p.id}');"><i class="fas ${l.icon}"></i> ${l.text} <i class="fas fa-arrow-right" style="margin-left:auto;opacity:0.5;font-size:11px;"></i></a>`).join('')}
            </div>
        </div>`;
    }

    const css = `
    @keyframes dcmFadeUp { 
        from { opacity: 0; transform: translateY(20px); } 
        to { opacity: 1; transform: translateY(0); } 
    }
    @keyframes dcmLinkReveal { 
        from { opacity: 0; transform: translateX(-10px); } 
        to { opacity: 1; transform: translateX(0); } 
    }
    @keyframes dcmPulse {
        0% { box-shadow: 0 0 0 0 rgba(var(--p-rgb), 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(var(--p-rgb), 0); }
        100% { box-shadow: 0 0 0 0 rgba(var(--p-rgb), 0); }
    }

    #dcm-guided-overlay {
        position: fixed; inset: 0; z-index: 99999;
        background: rgba(2,6,23,0.94);
        backdrop-filter: blur(16px);
        display: flex; align-items: center; justify-content: center;
        padding: 20px;
        transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 1; transform: scale(1);
    }
    .dcm-modal {
        max-width: 940px; width: 100%;
        background: linear-gradient(145deg, rgba(15,23,42,0.98), rgba(2,6,23,0.99));
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 32px;
        padding: 60px 50px 40px;
        box-shadow: 0 50px 100px rgba(0,0,0,0.8), 0 0 40px rgba(59,130,246,0.05);
        position: relative;
        max-height: 92vh; overflow-y: auto;
        animation: dcmFadeUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }
    .dcm-modal-header { text-align: center; margin-bottom: 40px; }
    .dcm-modal-eyebrow {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px; font-weight: 700; letter-spacing: 3px;
        text-transform: uppercase;
        color: #d4af37;
        background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.2);
        display: inline-block; padding: 6px 16px; border-radius: 100px;
        margin-bottom: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    .dcm-modal-title { font-family: 'Outfit','Inter',sans-serif; font-size: 38px; font-weight: 800; color: #fff; margin: 0 0 12px; letter-spacing: -0.02em; }
    .dcm-modal-sub { color: #94a3b8; font-size: 17px; margin: 0; max-width: 600px; margin: 0 auto; line-height: 1.6; }
    .dcm-personas { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-bottom: 30px; }
    .dcm-persona-card {
        background: rgba(30,41,59,0.3);
        border: 1px solid rgba(255,255,255,0.05);
        border-radius: 20px; padding: 28px 24px 24px;
        cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative; overflow: hidden;
        animation: dcmFadeUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }
    .dcm-persona-card::before {
        content:''; position:absolute; top:0; left:0; right:0; height:4px;
        background: var(--p-color); opacity:0.3; transition:0.3s;
    }
    .dcm-persona-card:hover { 
        border-color: var(--p-color); 
        background: rgba(var(--p-rgb),0.08); 
        transform: translateY(-8px);
        box-shadow: 0 15px 35px rgba(0,0,0,0.4), 0 0 20px rgba(var(--p-rgb),0.1);
    }
    .dcm-persona-card:hover::before { opacity:1; }
    .dcm-persona-card.dcm-selected {
        border-color: var(--p-color);
        background: rgba(var(--p-rgb),0.12);
        animation: dcmPulse 2s infinite;
    }
    .dcm-persona-card.dcm-selected .dcm-persona-chevron { transform: rotate(180deg); color: var(--p-color); }
    
    .dcm-persona-top { display:flex; align-items:center; gap:16px; margin-bottom:15px; }
    .dcm-persona-icon { width:48px; height:48px; border-radius:14px; display:grid; place-items:center; font-size:22px; color:var(--p-color); background:rgba(var(--p-rgb),0.15); flex-shrink:0; transition: 0.3s; }
    .dcm-persona-card:hover .dcm-persona-icon { transform: scale(1.1) rotate(-5deg); background: var(--p-color); color: #fff; }
    
    .dcm-persona-badge { font-size:10px; font-weight:800; letter-spacing:1.5px; color:var(--p-color); text-transform:uppercase; margin-bottom:4px; }
    .dcm-persona-title { font-size:17px; font-weight:700; color:#fff; margin:0; line-height:1.2; }
    .dcm-persona-chevron { margin-left:auto; color:#475569; font-size:12px; transition:0.4s cubic-bezier(0.4,0,0.2,1); }
    .dcm-persona-desc { font-size:14px; color:#94a3b8; line-height:1.6; margin:0; transition: 0.3s; }
    .dcm-persona-card.dcm-selected .dcm-persona-desc { opacity: 0.7; font-size: 13px; }
    
    .dcm-links { max-height:0; overflow:hidden; transition:max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), margin 0.4s; }
    .dcm-links.dcm-active { max-height:300px; margin-top:20px; }
    .dcm-links-header {
        font-size: 10px; font-weight: 800; color: #475569; letter-spacing: 1.5px;
        margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .dcm-quick-link {
        display:flex; align-items:center; gap:12px;
        padding:12px 16px; border-radius:12px;
        background:rgba(var(--p-rgb),0.08); border:1px solid rgba(var(--p-rgb),0.15);
        color:#cbd5e1; font-size:13px; font-weight:600;
        text-decoration:none; margin-bottom:10px; transition:0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: dcmLinkReveal 0.4s both;
    }
    .dcm-quick-link:hover { background:rgba(var(--p-rgb),0.2); color:#fff; border-color:var(--p-color); transform: translateX(6px); }
    .dcm-quick-link i:first-child { color:var(--p-color); width:18px; font-size: 14px; }
    
    .dcm-modal-footer { display:flex; align-items:center; justify-content:space-between; padding-top:24px; border-top:1px solid rgba(255,255,255,0.08); }
    .dcm-skip-btn { background:none; border:none; cursor:pointer; color:#64748b; font-size:14px; transition:0.25s; font-weight:600; }
    .dcm-skip-btn:hover { color:#fff; }
    .dcm-explore-btn { display:flex; align-items:center; gap:10px; background:rgba(59,130,246,0.12); border:1px solid rgba(59,130,246,0.25); color:#60a5fa; padding:12px 24px; border-radius:14px; font-size:14px; font-weight:700; cursor:pointer; transition:0.3s; }
    .dcm-explore-btn:hover { background:rgba(59,130,246,0.2); color:#fff; border-color:#3b82f6; box-shadow: 0 0 20px rgba(59,130,246,0.2); }
    @media(max-width:860px) { .dcm-personas{grid-template-columns:1fr;} .dcm-modal{padding:40px 24px 30px;} .dcm-modal-title{font-size:28px;} }
    `;

    const html = `
    <style>${css}</style>
    <div class="dcm-modal">
        <div class="dcm-modal-header">
            <div class="dcm-modal-eyebrow"><i class="fas fa-landmark"></i> &nbsp;DCM Core Institute</div>
            <h2 class="dcm-modal-title">Élevez Votre Intelligence Institutionnelle</h2>
            <p class="dcm-modal-sub">Personnalisez votre expérience pour accéder aux cadres, registres et rapports pertinents pour votre rôle.</p>
        </div>
        <div class="dcm-personas">
            ${personas.map((p, i) => renderPersonaCard(p, i)).join('')}
        </div>
        <div class="dcm-modal-footer">
            <button class="dcm-skip-btn" onclick="window._dcmDismiss()">← Passer l'introduction</button>
            <button class="dcm-explore-btn" onclick="window._dcmDismiss()"><i class="fas fa-compass"></i> Commencer l'Exploration</button>
        </div>
    </div>`;

    function togglePersona(id) {
        const overlay = document.getElementById('dcm-guided-overlay');
        const allCards = overlay.querySelectorAll('.dcm-persona-card');
        const allLinks = overlay.querySelectorAll('.dcm-links');
        const currentCard = document.getElementById(`dcm-persona-${id}`);
        const currentLinks = document.getElementById(`dcm-links-${id}`);

        const isActive = currentLinks.classList.contains('dcm-active');

        // Reset others
        allCards.forEach(c => c.classList.remove('dcm-selected'));
        allLinks.forEach(l => l.classList.remove('dcm-active'));

        if (!isActive) {
            currentCard.classList.add('dcm-selected');
            currentLinks.classList.add('dcm-active');
        }
    }

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
