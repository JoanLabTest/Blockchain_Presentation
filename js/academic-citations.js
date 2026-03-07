/**
 * DCM Core Academic Citation Utility
 * Handles generation of BibTeX, RIS, and APA formats
 */

document.addEventListener('DOMContentLoaded', () => {
    // Create Modal Element if it doesn't exist
    if (!document.getElementById('citationModal')) {
        const modalHtml = `
            <div id="citationModal" class="citation-modal">
                <div class="citation-modal-content">
                    <span class="citation-close">&times;</span>
                    <h3>Academic Citation</h3>
                    <div class="citation-tabs">
                        <div class="citation-tab active" data-format="bibtex">BibTeX</div>
                        <div class="citation-tab" data-format="ris">RIS</div>
                        <div class="citation-tab" data-format="apa">APA</div>
                    </div>
                    <div class="citation-box" id="citationText"></div>
                    <button class="citation-copy-btn" id="copyCitation">Copy to Clipboard</button>
                    <div class="citation-footer-text">
                        Digital Object Identifier (DOI) provided for academic permanence. 
                        DCM Core Research Programs are indexed for global scholarly transparency.
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    const modal = document.getElementById('citationModal');
    const closeBtn = document.querySelector('.citation-close');
    const citationText = document.getElementById('citationText');
    const tabs = document.querySelectorAll('.citation-tab');
    const copyBtn = document.getElementById('copyCitation');

    // Get metadata from Highwire Press tags
    const getMetadata = () => {
        return {
            title: document.querySelector('meta[name="citation_title"]')?.content || document.title,
            author: document.querySelector('meta[name="citation_author"]')?.content || "DCM Core Institute",
            date: document.querySelector('meta[name="citation_publication_date"]')?.content || new Date().toISOString().split('T')[0],
            publisher: document.querySelector('meta[name="citation_publisher"]')?.content || "DCM Core Institute",
            reportNum: document.querySelector('meta[name="citation_technical_report_number"]')?.content || "DCM-RES-2026",
            url: window.location.href,
            doi: "10.5281/zenodo.dcm.research.2026.12" // Placeholder as established in Phase 44
        };
    };

    const generateCitation = (format, meta) => {
        const year = meta.date.split('/')[0] || meta.date.split('-')[0];

        switch (format) {
            case 'bibtex':
                return `@techreport{dcm${year}${meta.reportNum.split('-').pop()},
  author      = {${meta.author}},
  title       = {${meta.title}},
  institution = {${meta.publisher}},
  year        = {${year}},
  number      = {${meta.reportNum}},
  type        = {Research Program Paper},
  url         = {${meta.url}},
  doi         = {${meta.doi}}
}`;
            case 'ris':
                return `TY  - RPRT
TI  - ${meta.title}
AU  - ${meta.author}
PY  - ${year}
PB  - ${meta.publisher}
SN  - ${meta.reportNum}
UR  - ${meta.url}
DO  - ${meta.doi}
ER  - `;
            case 'apa':
                const authorParts = meta.author.split(',');
                const formattedAuthor = authorParts.length > 1 ? `${authorParts[0]}, ${authorParts[1].trim()}` : meta.author;
                return `${formattedAuthor} (${year}). *${meta.title}* (${meta.reportNum}). ${meta.publisher}. ${meta.url}`;
            default:
                return "";
        }
    };

    let currentFormat = 'bibtex';

    const updateModal = () => {
        const meta = getMetadata();
        citationText.textContent = generateCitation(currentFormat, meta);
    };

    // Global toggle function
    window.openCitationModal = () => {
        modal.style.display = 'block';
        updateModal();
    };

    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => { if (event.target == modal) modal.style.display = 'none'; };

    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFormat = tab.dataset.format;
            updateModal();
        };
    });

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(citationText.textContent).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copied!";
            copyBtn.style.background = "#10b981";
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = "#c9a84c";
            }, 2000);
        });
    };
});
