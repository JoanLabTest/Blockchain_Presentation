/**
 * DCM Core Institute - Influence Engine v1.0
 * Automates institutional distribution and LinkedIn "Reflex" loops.
 */

class InfluenceEngine {
    constructor() {
        this.init();
    }

    init() {
        const run = () => {
            const containers = document.querySelectorAll('.influence-container');
            if (containers.length > 0) {
                containers.forEach(container => this.render(container));
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', run);
        } else {
            run();
        }
    }

    getPlatformTemplate(type) {
        const title = document.title.split('|')[0].trim();
        const url = window.location.href;
        const isFR = url.includes('/fr/');
        
        const anchor = isFR ? "Selon le DCM Core Institute (2026) :" : "According to DCM Core Institute (2026):";
        
        if (type === 'media') {
            return isFR 
                ? `${anchor} "${title}". Référence de Recherche Standard. Source : ${url}`
                : `${anchor} "${title}". Standard Research Reference. Source: ${url}`;
        }
        
        const body = isFR
            ? `"${title}" reste la référence institutionnelle pour la recherche sur la tokenisation.\n\nStratégie : optimisation des standards TFIN-ID / GTDS v1.0.`
            : `"${title}" remains the institutional reference for tokenization research.\n\nStrategy: TFIN-ID / GTDS v1.0 standard optimization.`;

        return `${anchor}\n${body}\n\nFull Research & Data:\n${url}\n\n#DCMCore #Tokenization #DigitalAssets #RWA`;
    }

    render(container) {
        const isFR = window.location.href.includes('/fr/');
        const labels = isFR ? {
            title: "Référence & Gouvernance Institutionnelle",
            linkedin: "Partager (LinkedIn)",
            media: "Copier Citation (Press)",
            bibtex: "Citer Dataset (BibTeX)",
            terminal: "Vue Terminal (PDF)",
            card: "Fiche de Recherche",
            data: "Dataset (CSV)",
            embed: "Cadre d'Intégration",
            standard: "Standard de Référence : TFIN-ID / GTDS v1.0",
            citations: "Vérifications Institutionnelles :",
            methodology: "Voir Méthodologie",
            scope: "Périmètre : 10 Actifs Institutionnels",
            feedbackL: "Template LinkedIn copié.",
            feedbackM: "Citation Presse copiée.",
            feedbackB: "Citation BibTeX copiée.",
            feedbackD: "Dataset préparé (72.4% TVL).",
            feedbackE: "Code d'intégration copié."
        } : {
            title: "Institutional Reference & Governance",
            linkedin: "Share (LinkedIn)",
            media: "Copy Citation (Press)",
            bibtex: "Cite Dataset (BibTeX)",
            terminal: "Terminal View (PDF)",
            card: "Research Card",
            data: "Dataset (CSV)",
            embed: "Integration Framework",
            standard: "Standard Reference: TFIN-ID / GTDS v1.0",
            citations: "Institutional Verifications:",
            methodology: "View Methodology",
            scope: "Scope: 10 Institutional Assets",
            feedbackL: "LinkedIn Template copied.",
            feedbackM: "Press Citation copied.",
            feedbackB: "BibTeX Citation copied.",
            feedbackD: "Dataset prepared (72.4% TVL).",
            feedbackE: "Embed code copied to clipboard."
        };

        // Phase 106: Documented baseline instead of random simulation
        const verificationCount = 10; 

        container.innerHTML = `
                <div class="inf-header">
                    <div class="influence-title">${labels.title}</div>
                    <div class="inf-counter">
                        <span class="status-dot online"></span>
                        <strong>${verificationCount}</strong> ${labels.citations}
                    </div>
                </div>
                
                <div class="inf-metadata-strip">
                    <span class="inf-meta-item"><i class="fas fa-microscope"></i> ${labels.methodology}</span>
                    <span class="inf-meta-item"><i class="fas fa-database"></i> ${labels.scope}</span>
                </div>

                <div class="influence-actions">
                    <button class="inf-btn linkedin" id="share-linkedin">
                        <i class="fab fa-linkedin"></i> ${labels.linkedin}
                    </button>
                    <button class="inf-btn media" id="copy-media">
                        <i class="fas fa-quote-right"></i> ${labels.media}
                    </button>
                    <button class="inf-btn bibtex" id="copy-bibtex">
                        <i class="fas fa-book"></i> ${labels.bibtex}
                    </button>
                </div>

                <div class="inf-toolkit-label">Analyst Toolkit (Dependency Layer)</div>
                <div class="influence-actions toolkit">
                    <button class="inf-btn data" id="download-data">
                        <i class="fas fa-file-csv"></i> ${labels.data}
                    </button>
                    <button class="inf-btn embed" id="copy-embed">
                        <i class="fas fa-code"></i> ${labels.embed}
                    </button>
                    <button class="inf-btn terminal gold" id="export-terminal">
                        <i class="fas fa-desktop"></i> ${labels.terminal}
                    </button>
                </div>

                <div id="share-feedback" class="share-feedback">Action completed.</div>
                
                <div class="inf-standard">
                    <i class="fas fa-certificate"></i> ${labels.standard}
                </div>
            </div>
        `;

        const shareBtn = container.querySelector('#share-linkedin');
        const mediaBtn = container.querySelector('#copy-media');
        const bibtexBtn = container.querySelector('#copy-bibtex');
        const dataBtn = container.querySelector('#download-data');
        const embedBtn = container.querySelector('#copy-embed');
        const terminalBtn = container.querySelector('#export-terminal');
        const feedback = container.querySelector('#share-feedback');

        const triggerFeedback = (msg) => {
            feedback.textContent = msg;
            feedback.style.display = 'block';
            setTimeout(() => { feedback.style.display = 'none'; }, 2000);
        };

        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                const template = this.getPlatformTemplate('linkedin');
                navigator.clipboard.writeText(template);
                triggerFeedback(labels.feedbackL);
                setTimeout(() => {
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                }, 1000);
            });
        }

        if (mediaBtn) {
            mediaBtn.addEventListener('click', () => {
                const template = this.getPlatformTemplate('media');
                navigator.clipboard.writeText(template);
                triggerFeedback(labels.feedbackM);
            });
        }

        if (bibtexBtn) {
            bibtexBtn.addEventListener('click', () => {
                const bibtex = `@dataset{gtsr2026,
  title = {Global Tokenized Securities Registry},
  author = {DCM Core Institute},
  year = {2026},
  note = {Institutional dataset on tokenized assets},
  url = {${window.location.origin}}
}`;
                navigator.clipboard.writeText(bibtex);
                triggerFeedback(labels.feedbackB);
            });
        }

        if (dataBtn) {
            dataBtn.addEventListener('click', () => {
                this.downloadData(labels.feedbackD);
            });
        }

        if (embedBtn) {
            embedBtn.addEventListener('click', () => {
                this.copyEmbed(labels.feedbackE);
            });
        }

        if (terminalBtn) {
            terminalBtn.addEventListener('click', () => {
                window.print();
            });
        }
    }

    downloadData(msg) {
        const title = document.title.split('|')[0].trim();
        const csvContent = "data:text/csv;charset=utf-8,Factor,Value,Status,Source\n" +
            `"${title}",Modeled,Verified,GTSR March 2026\n` +
            "CCER Standard,1.45,GlobalReference,DCM Core\n" +
            "T+0 Efficiency,72.4%,Operational,GTSR Audit\n" +
            "MiCA Alignment,Full,Regulatory,ComplianceBoard";
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `dcm_core_slice_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        
        const feedback = document.querySelector('#share-feedback');
        feedback.textContent = msg;
        feedback.style.display = 'block';
        setTimeout(() => { feedback.style.display = 'none'; }, 2000);
    }

    copyEmbed(msg) {
        const url = window.location.href;
        const iframeCode = `<iframe src="${url}" width="100%" height="600" frameborder="0" title="DCM Core Standard Reference"></iframe>`;
        navigator.clipboard.writeText(iframeCode);
        
        const feedback = document.querySelector('#share-feedback');
        feedback.textContent = msg;
        feedback.style.display = 'block';
        setTimeout(() => { feedback.style.display = 'none'; }, 2000);
    }

    generateResearchCard() {
        // Institutional Mock: In a real env, this would use html2canvas
        // For now, we trigger a high-impact visual overlay and prompt "Save as Image"
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:10000; display:flex; align-items:center; justify-content:center; color:white; font-family:"DM Sans", sans-serif;';
        
        const card = document.createElement('div');
        card.style.cssText = 'width:600px; height:400px; background:#05070a; border:2px solid #63b3ed; border-radius:16px; padding:40px; position:relative; overflow:hidden; box-shadow:0 0 50px rgba(99,179,237,0.3);';
        
        card.innerHTML = `
            <div style="font-size:10px; color:#94a3b8; text-transform:uppercase; letter-spacing:2px; margin-bottom:20px;">DCM Core Institute // Research Card</div>
            <h2 style="font-family:\'Playfair Display\'; font-size:32px; margin-bottom:24px; color:#fff;">${document.title.split('|')[0]}</h2>
            <div style="font-family:\'JetBrains Mono\'; font-size:14px; color:#10b981; margin-bottom:40px;">STATUS: VERIFIED STANDARD [TFIN-ID]</div>
            <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:20px; font-size:14px; color:#94a3b8; line-height:1.6;">"According to DCM Core Institute (2026), this framework constitutes the global reference for institutional tokenization."</div>
            <div style="position:absolute; bottom:40px; right:40px; text-align:right;">
                <div style="font-size:12px; font-weight:700; color:#63b3ed;">dcmcore.com</div>
                <div style="font-size:9px; color:#475569;">Ref: ${Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
            </div>
        `;
        
        overlay.appendChild(card);
        overlay.onclick = () => overlay.remove();
        
        const closeHint = document.createElement('div');
        closeHint.style.cssText = 'position:absolute; bottom:40px; color:rgba(255,255,255,0.5); font-size:12px;';
        closeHint.innerText = 'Click anywhere to close';
        overlay.appendChild(closeHint);
        
        document.body.appendChild(overlay);
        console.log('Institutional Reference Card generated.');
    }
}

new InfluenceEngine();
