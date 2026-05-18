/* 
   CITATION & TELEMETRY ACCESS SYSTEM
   Phase 28 - Data Exposure Layer (ODbL 1.0 Compliant)
*/

document.addEventListener('DOMContentLoaded', () => {
    injectCitationModal();
    initQuotingSystem();
    initStickyCitation();
    initReflexTrigger();
});

function getDatasetPaths() {
    const href = window.location.href;
    let jsonPath = 'api/v1/metadata.json';
    let downloadName = 'dcm_core_metadata.json';
    let fileType = 'JSON';

    if (href.includes('eba-rt1-latency')) {
        jsonPath = 'api/v1/rt1-latency.json';
        downloadName = 'rt1_latency.json';
    } else if (href.includes('target2-weekend-liquidity')) {
        jsonPath = 'api/v1/target2-settlement.json';
        downloadName = 'target2_settlement.json';
    } else if (href.includes('lcr-collateral-velocity') || href.includes('lcr-velocite-collateral')) {
        jsonPath = 'api/v1/lcr-velocity.json';
        downloadName = 'lcr_velocity.json';
    } else if (href.includes('tfin-id')) {
        jsonPath = 'api/v1/tfin-schema.json';
        downloadName = 'tfin_schema.json';
    } else if (href.includes('stablecoin-market-structure') || href.includes('structure-marche-stablecoins')) {
        jsonPath = 'data/stablecoin-market-data-2026.csv';
        downloadName = 'stablecoin_market_data_2026.csv';
        fileType = 'CSV';
    }

    // Determine how many parent directories we need to traverse
    let prefix = '';
    if (href.includes('/research/market-memos/')) {
        prefix = '../../';
    } else if (href.includes('/research/desk-notes/') || href.includes('/standards/blueprints/') || href.includes('/research/') || href.includes('/standards/')) {
        prefix = '../../';
    } else if (href.includes('/fr/') || href.includes('/en/')) {
        prefix = '../';
    }

    return {
        url: prefix + jsonPath,
        absoluteUrl: 'https://dcmcore.com/' + jsonPath,
        name: downloadName,
        type: fileType
    };
}

function injectCitationModal() {
    if (document.getElementById('citation-modal')) return;

    const isEN = document.documentElement.lang === 'en';
    const modalHTML = `
    <div id="citation-modal" class="search-modal-backdrop" style="display:none; position:fixed; inset:0; background:rgba(2,6,23,0.85); backdrop-filter:blur(10px); z-index:20000; align-items:center; justify-content:center;">
        <div class="search-modal-content" style="max-width: 650px; width:90%; background:#0f172a; border:1px solid rgba(255,255,255,0.1); border-radius:16px; box-shadow:0 25px 50px rgba(0,0,0,0.5); overflow:hidden; animation: modalFadeIn 0.3s ease-out;">
            <div class="search-header" style="padding:20px; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between; align-items:center;">
                <h3 style="margin:0; font-family:'Outfit', sans-serif; font-size:18px; color:white;"><i class="fas fa-quote-right" style="color:#d4af37; margin-right:10px;"></i> ${isEN ? 'Bibliographic Metadata' : 'Métadonnées Bibliographiques'}</h3>
                <button onclick="closeCitation()" style="background:none; border:none; color:#94a3b8; cursor:pointer; font-size:18px;"><i class="fas fa-times"></i></button>
            </div>
            <div style="padding: 25px;">
                <!-- SHORT CITATION -->
                <div style="margin-bottom: 20px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span style="font-weight:700; color:#d4af37; font-size:11px; text-transform:uppercase; letter-spacing:1px;">Short Citation</span>
                        <button onclick="copyToClipboard('short-text')" style="background:none; border:none; color:#3b82f6; cursor:pointer; font-size:11px; font-weight:600;"><i class="far fa-copy"></i> ${isEN ? 'Copy' : 'Copier'}</button>
                    </div>
                    <div id="short-text" style="background:rgba(255,255,255,0.03); padding:15px; border-radius:8px; color:#e2e8f0; font-size:13px; border:1px solid rgba(255,255,255,0.05); font-style:italic;">
                        <!-- JS Generated -->
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-bottom:25px;">
                    <!-- APA -->
                    <div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                            <span style="font-weight:700; color:white; font-size:11px; text-transform:uppercase; letter-spacing:1px;">APA (7th Ed.)</span>
                            <button onclick="copyToClipboard('apa-text')" style="background:none; border:none; color:#3b82f6; cursor:pointer; font-size:11px; font-weight:600;"><i class="far fa-copy"></i></button>
                        </div>
                        <div id="apa-text" style="background:rgba(255,255,255,0.03); padding:15px; border-radius:8px; font-family:'Times New Roman', serif; color:#94a3b8; font-size:12px; border:1px solid rgba(255,255,255,0.05); height:100px; overflow-y:auto;">
                            <!-- JS Generated -->
                        </div>
                    </div>

                    <!-- BIBTEX -->
                    <div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                            <span style="font-weight:700; color:white; font-size:11px; text-transform:uppercase; letter-spacing:1px;">BibTeX</span>
                            <button onclick="copyToClipboard('bibtex-text')" style="background:none; border:none; color:#3b82f6; cursor:pointer; font-size:11px; font-weight:600;"><i class="far fa-copy"></i></button>
                        </div>
                        <div id="bibtex-text" style="background:rgba(255,255,255,0.03); padding:15px; border-radius:8px; font-family:'JetBrains Mono', monospace; color:#94a3b8; font-size:11px; border:1px solid rgba(255,255,255,0.05); height:100px; overflow-y:auto; white-space: pre-wrap;">
                            <!-- JS Generated -->
                        </div>
                    </div>
                </div>

                <!-- DIRECT MACHINE ACTIONS -->
                <div style="border-top:1px solid rgba(255,255,255,0.05); padding-top:20px; display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                    <button onclick="handleDirectDownload()" id="download-dataset-btn" style="background:#d4af37; color:black; border:none; border-radius:8px; padding:12px; font-weight:700; font-size:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:0.2s; font-family:'Outfit';">
                        <i class="fas fa-download"></i> <span>${isEN ? 'Download Dataset' : 'Télécharger le Jeu de Données'}</span>
                    </button>
                    <button onclick="copyAPIEndpoint()" id="copy-endpoint-btn" style="background:rgba(255,255,255,0.05); color:white; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:12px; font-weight:700; font-size:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:0.2s; font-family:'Outfit';">
                        <i class="fas fa-link"></i> <span>${isEN ? 'Copy API Endpoint' : 'Copier le Point d\'Entrée API'}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <style>
        @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function initQuotingSystem() {
    const isEN = document.documentElement.lang === 'en';
    const heroContent = document.querySelector('.academic-hero .container') || document.querySelector('h1')?.parentElement;
    
    if (heroContent && !document.querySelector('.cite-trigger')) {
        const citeBtn = document.createElement('button');
        citeBtn.className = 'cite-trigger';
        citeBtn.innerHTML = `<i class="fas fa-quote-right" style="margin-right:8px; color:#d4af37;"></i> ${isEN ? 'Cite this Research' : 'Citer cette Recherche'}`;
        citeBtn.style.cssText = `
            display: inline-flex;
            align-items: center;
            background: rgba(212, 175, 55, 0.05); 
            border: 1px solid rgba(212, 175, 55, 0.2); 
            color: #d4af37; 
            padding: 8px 18px; 
            border-radius: 50px; 
            font-size: 13px; 
            font-weight: 600;
            cursor: pointer; 
            margin-top: 15px; 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Inter', sans-serif;
        `;
        citeBtn.onmouseover = () => { 
            citeBtn.style.background = 'rgba(212, 175, 55, 0.1)'; 
            citeBtn.style.transform = 'translateY(-2px)';
            citeBtn.style.boxShadow = '0 5px 15px rgba(212, 175, 55, 0.15)';
        };
        citeBtn.onmouseout = () => { 
            citeBtn.style.background = 'rgba(212, 175, 55, 0.05)'; 
            citeBtn.style.transform = 'translateY(0)';
            citeBtn.style.boxShadow = 'none';
        };
        citeBtn.onclick = openCitation;
        
        const p = heroContent.querySelector('p');
        if (p) {
            p.insertAdjacentElement('afterend', citeBtn);
        } else {
            heroContent.appendChild(citeBtn);
        }
    }
}

function initStickyCitation() {
    const isEN = document.documentElement.lang === 'en';
    const stickyBtn = document.createElement('button');
    stickyBtn.id = 'sticky-cite-btn';
    stickyBtn.innerHTML = `<i class="fas fa-quote-right" style="color:black;"></i> ${isEN ? 'CITE' : 'CITER'}`;
    stickyBtn.style.cssText = `
        position: fixed; bottom: 30px; left: 30px;
        background: #d4af37; color: black;
        border: none; border-radius: 50px;
        padding: 12px 24px; font-size: 13px; font-weight: 800;
        cursor: pointer; z-index: 15000;
        box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        display: none; align-items: center; gap: 8px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translateY(100px);
        font-family: 'Outfit', sans-serif;
        letter-spacing: 1px;
    `;
    stickyBtn.onmouseover = () => stickyBtn.style.transform = 'translateY(-5px) scale(1.05)';
    stickyBtn.onmouseout = () => stickyBtn.style.transform = 'translateY(0) scale(1)';
    stickyBtn.onclick = openCitation;
    document.body.appendChild(stickyBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            stickyBtn.style.display = 'flex';
            setTimeout(() => { 
                stickyBtn.style.transform = 'translateY(0)'; 
                stickyBtn.style.opacity = '1'; 
            }, 10);
        } else {
            stickyBtn.style.transform = 'translateY(100px)';
            stickyBtn.style.opacity = '0';
            setTimeout(() => { 
                if (window.scrollY <= 600) stickyBtn.style.display = 'none'; 
            }, 400);
        }
    });
}

function initReflexTrigger() {
    const container = document.querySelector('.exec-summary') || document.querySelector('section#ch1');
    if (!container || document.getElementById('reflex-trigger-block')) return;

    const isEN = document.documentElement.lang === 'en';
    const isStablecoin = window.location.href.includes('stablecoin');
    
    const summaryText = isStablecoin 
        ? (isEN ? "Stablecoins are no longer a single market. They are structurally bifurcated: USDC (Regulated Settlement Layer) vs USDT (Global Liquidity Layer)." : "Les stablecoins ne sont plus un marché unique. Ils sont structurellement divisés : USDC (Règlement Régulé) vs USDT (Liquidité Globale).")
        : (isEN ? "Tokenization is entering the Phase 2 of infrastructure: moving from experimental pilots to production-grade atomic settlement at scale." : "La tokenisation entre dans sa Phase 2 : le passage des pilotes expérimentaux au règlement atomique en production à grande échelle.");

    const triggerHTML = `
    <div id="reflex-trigger-block" style="margin: 40px 0; padding: 30px; background: rgba(59,130,246,0.05); border: 1px solid rgba(59,130,246,0.15); border-radius: 16px; border-left: 5px solid #d4af37;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
            <div>
                <span style="font-family:'JetBrains Mono'; font-size:10px; color:#d4af37; font-weight:700; text-transform:uppercase; letter-spacing:2px;">Citation Reflex Trigger</span>
                <h4 style="font-family:'Outfit'; font-size:18px; color:white; margin:5px 0 0 0;">${isEN ? 'In-Workflow Integration' : 'Intégration Workflow'}</h4>
                <p style="font-size:12px; color:#64748b; margin:5px 0 0 0;">${isEN ? 'Designed for Analysts & Board Memos' : 'Conçu pour les Analystes & Mémos Stratégiques'}</p>
            </div>
            <i class="fas fa-bolt" style="color:#d4af37; font-size:24px; opacity:0.3;"></i>
        </div>

        <div style="display:grid; grid-template-columns: 1fr; gap:12px;">
            <div style="background:rgba(255,255,255,0.02); padding:15px; border-radius:8px; display:flex; justify-content:space-between; align-items:center; border:1px solid rgba(255,255,255,0.05);">
                <div style="flex:1;">
                    <span style="font-size:10px; color:#475569; font-weight:700; text-transform:uppercase;">${isEN ? 'Signature Insight' : 'Insight Signature'}</span>
                    <p id="reflex-summary" style="font-size:13px; color:#e2e8f0; margin:5px 0 0 0; font-style:italic;">"${summaryText}"</p>
                </div>
                <button onclick="copyReflex('reflex-summary')" style="background:transparent; border:1px solid rgba(255,255,255,0.1); color:#3b82f6; border-radius:6px; padding:8px 12px; font-size:11px; cursor:pointer; font-weight:700; transition:0.3s; white-space:nowrap; margin-left:15px;">
                    <i class="far fa-copy"></i> ${isEN ? 'Copy Insight' : 'Copier'}
                </button>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                <button onclick="openCitation()" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white; padding:15px; border-radius:8px; cursor:pointer; font-size:12px; font-weight:800; display:flex; align-items:center; justify-content:center; gap:8px;">
                    <i class="fas fa-quote-right"></i> ${isEN ? 'Get Bibliographic Metadata' : 'Obtenir les Métadonnées'}
                </button>
                <button onclick="handleDirectDownload()" style="background:#d4af37; color:black; border:none; padding:15px; border-radius:8px; cursor:pointer; font-size:12px; font-weight:900; display:flex; align-items:center; justify-content:center; gap:8px;">
                    <i class="fas fa-download"></i> ${isEN ? 'Download Telemetry Dataset' : 'Télécharger le Jeu de Données'}
                </button>
            </div>
        </div>
        
        <div style="margin-top:15px; text-align:center;">
             <span style="font-size:9px; color:#475569; text-transform:uppercase; letter-spacing:1px; font-weight:600;">DCM Core Global Source Validation // BIS & ECB Methodology Compliant</span>
        </div>
    </div>
    `;

    container.insertAdjacentHTML('afterend', triggerHTML);
}

function copyReflex(id) {
    const text = document.getElementById(id).innerText;
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    const url = window.location.href;
    const isEN = document.documentElement.lang === 'en';

    navigator.clipboard.writeText(`${text} Source: DCM Core Institute, Audit Snapshot 2026 (${url})`).then(() => {
        btn.innerHTML = `<i class="fas fa-check"></i> ${isEN ? 'Copied' : 'Copié'}`;
        btn.style.color = '#10b981';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.color = '#3b82f6';
        }, 2000);
    });
}

function handleDirectDownload() {
    const paths = getDatasetPaths();
    const btn = document.getElementById('download-dataset-btn');
    const originalText = btn ? btn.innerHTML : null;
    const isEN = document.documentElement.lang === 'en';

    if (btn) {
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${isEN ? 'Downloading...' : 'Téléchargement...'}`;
    }
    
    const link = document.createElement('a');
    link.href = paths.url;
    link.download = paths.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (btn) {
        setTimeout(() => {
            btn.innerHTML = `<i class="fas fa-check"></i> ${isEN ? 'Completed' : 'Terminé'}`;
            btn.style.background = '#10b981';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '#d4af37';
            }, 2000);
        }, 800);
    }
}

function copyAPIEndpoint() {
    const paths = getDatasetPaths();
    const btn = document.getElementById('copy-endpoint-btn');
    const originalText = btn.innerHTML;
    const isEN = document.documentElement.lang === 'en';

    navigator.clipboard.writeText(paths.absoluteUrl).then(() => {
        btn.innerHTML = `<i class="fas fa-check"></i> ${isEN ? 'Copied Link' : 'Lien Copié'}`;
        btn.style.borderColor = '#10b981';
        btn.style.color = '#10b981';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.borderColor = '';
            btn.style.color = '';
        }, 2000);
    });
}

function openCitation() {
    const modal = document.getElementById('citation-modal');
    if (!modal) return;

    const title = document.querySelector('meta[property="og:title"]')?.content || document.title.split('|')[0].trim();
    const url = window.location.href;
    const author = document.querySelector('meta[name="author"]')?.content || "DCM Core Institute";
    const year = new Date().getFullYear();
    const dateToday = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const shortString = `${author} (${year}). ${title} — Institutional Research Report.`;
    document.getElementById('short-text').innerText = shortString;

    const apaString = `${author}. (${year}). <em>${title}</em>. DCM Digital Research Infrastructure. Retrieved from ${url}`;
    document.getElementById('apa-text').innerHTML = apaString;

    const slug = title.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + year;
    const bibtexString = `@techreport{${slug},
  author = {${author}},
  title = {${title}},
  institution = {DCM Core Institute},
  year = {${year}},
  url = {${url}},
  note = {Accessed: ${dateToday}}
}`;
    document.getElementById('bibtex-text').innerText = bibtexString;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

function closeCitation() {
    document.getElementById('citation-modal').style.display = 'none';
    document.body.style.overflow = ''; 
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).innerText;
    const btn = event.currentTarget;
    const originalContent = btn.innerHTML;
    const isEN = document.documentElement.lang === 'en';

    navigator.clipboard.writeText(text).then(() => {
        btn.innerHTML = `<i class="fas fa-check"></i> ${isEN ? 'Copied' : 'Copié'}`;
        btn.style.color = '#10b981';
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.color = '';
        }, 2000);
    });
}
