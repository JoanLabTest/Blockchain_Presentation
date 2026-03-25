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

    getPlatformTemplate() {
        const title = document.title.split('|')[0].trim();
        const url = window.location.href;
        return `[DCM Core Insight] ${title}\n\nStrategic analysis of tokenized capital markets. Essential reading for institutional CIOs and RWA analysts.\n\nRead more: ${url}\n\n#DCMCore #Tokenization #RWA #MiCA`;
    }

    render(container) {
        container.innerHTML = `
            <div class="influence-widget">
                <div class="influence-title">Share Institutional Insight</div>
                <div class="influence-actions">
                    <button class="inf-btn linkedin" id="share-linkedin">
                        <i class="fab fa-linkedin"></i> Share on LinkedIn
                    </button>
                    <button class="inf-btn terminal" id="export-terminal">
                        <i class="fas fa-desktop"></i> Terminal View (PDF)
                    </button>
                </div>
                <div id="share-feedback" class="share-feedback">Template copied to clipboard for distribution.</div>
            </div>
        `;

        const shareBtn = container.querySelector('#share-linkedin');
        const terminalBtn = container.querySelector('#export-terminal');
        const feedback = container.querySelector('#share-feedback');

        shareBtn.addEventListener('click', () => {
            const template = this.getPlatformTemplate();
            navigator.clipboard.writeText(template);
            feedback.style.display = 'block';
            setTimeout(() => {
                feedback.style.display = 'none';
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
            }, 1500);
        });

        terminalBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

new InfluenceEngine();
