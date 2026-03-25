/**
 * DCM Core Institute - Research Citation Engine v1.0
 * Generates academic citations (APA, BibTeX, Harvard) for institutional distribution.
 */

class CitationEngine {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            const containers = document.querySelectorAll('.cite-container');
            containers.forEach(container => this.render(container));
        });
    }

    getMetadata() {
        return {
            title: document.title.split('|')[0].trim(),
            url: window.location.href,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            year: new Date().getFullYear(),
            author: 'DCM Core Institute'
        };
    }

    generateAPA(m) {
        return `${m.author}. (${m.year}). ${m.title}. Retrieved from ${m.url}`;
    }

    generateBibTeX(m) {
        const id = m.title.toLowerCase().replace(/\s+/g, '-').substring(0, 15);
        return `@techreport{dcm-${id}-${m.year},\n  author = {${m.author}},\n  title = {${m.title}},\n  institution = {DCM Core Institute},\n  year = {${m.year}},\n  url = {${m.url}}\n}`;
    }

    render(container) {
        const m = this.getMetadata();
        container.innerHTML = `
            <div class="citation-widget">
                <div class="cite-header">
                    <span><i class="fas fa-quote-right"></i> Cite this Research</span>
                    <div class="cite-tabs">
                        <button class="cite-tab active" data-format="apa">APA</button>
                        <button class="cite-tab" data-format="bibtex">BibTeX</button>
                    </div>
                </div>
                <div class="cite-body">
                    <pre id="citation-text">${this.generateAPA(m)}</pre>
                    <button class="cite-copy" id="copy-citation"><i class="far fa-copy"></i> Copy</button>
                </div>
            </div>
        `;

        const tabs = container.querySelectorAll('.cite-tab');
        const textElem = container.querySelector('#citation-text');
        const copyBtn = container.querySelector('#copy-citation');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const format = tab.dataset.format;
                textElem.textContent = format === 'apa' ? this.generateAPA(m) : this.generateBibTeX(m);
            });
        });

        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(textElem.textContent);
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
            }, 2000);
        });
    }
}

new CitationEngine();
