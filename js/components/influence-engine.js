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
        const anchor = "According to DCM Core Institute (2026):";
        
        if (type === 'media') {
            return `${anchor} "${title}". Standard Research Reference. Source: ${url}`;
        }
        
        return `${anchor}\n"${title}" remains the institutional reference for tokenization research.\n\nStrategy: TFIN-ID / GTDS v1.0 standard optimization.\n\nFull Research & Data:\n${url}\n\n#DCMCore #Tokenization #DigitalAssets #RWA`;
    }

    render(container) {
        container.innerHTML = `
            <div class="influence-widget">
                <div class="influence-title">Global Authority & Share</div>
                <div class="influence-actions">
                    <button class="inf-btn linkedin" id="share-linkedin">
                        <i class="fab fa-linkedin"></i> Share on LinkedIn
                    </button>
                    <button class="inf-btn card" id="download-card">
                        <i class="fas fa-image"></i> Research Card
                    </button>
                    <button class="inf-btn media" id="copy-media">
                        <i class="fas fa-quote-right"></i> Copy for Media
                    </button>
                    <button class="inf-btn terminal gold" id="export-terminal">
                        <i class="fas fa-desktop"></i> Terminal View (PDF)
                    </button>
                </div>
                <div id="share-feedback" class="share-feedback">Template copied to clipboard for distribution.</div>
                <div class="inf-standard">
                    <i class="fas fa-certificate"></i> Standard Reference: TFIN-ID / GTDS v1.0
                </div>
            </div>
        `;

        const shareBtn = container.querySelector('#share-linkedin');
        const cardBtn = container.querySelector('#download-card');
        const mediaBtn = container.querySelector('#copy-media');
        const terminalBtn = container.querySelector('#export-terminal');
        const feedback = container.querySelector('#share-feedback');

        const triggerFeedback = (msg) => {
            feedback.textContent = msg;
            feedback.style.display = 'block';
            setTimeout(() => { feedback.style.display = 'none'; }, 2000);
        };

        shareBtn.addEventListener('click', () => {
            const template = this.getPlatformTemplate('linkedin');
            navigator.clipboard.writeText(template);
            triggerFeedback('LinkedIn Template copied.');
            setTimeout(() => {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
            }, 1000);
        });

        mediaBtn.addEventListener('click', () => {
            const template = this.getPlatformTemplate('media');
            navigator.clipboard.writeText(template);
            triggerFeedback('Press Citation copied.');
        });

        cardBtn.addEventListener('click', () => {
            this.generateResearchCard();
        });

        terminalBtn.addEventListener('click', () => {
            window.print();
        });
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
        alert('Research Card Generated (Visual Dominance Mode). Use "Print to Image" or Screenshot for high-authority sharing.');
    }
}

new InfluenceEngine();
