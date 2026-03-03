/* CITATION SYSTEM - INSTITUTIONAL AUTHORITY */

document.addEventListener('DOMContentLoaded', () => {
    injectCitationModal();
    initQuotingSystem();
});

function injectCitationModal() {
    // Prevent duplicate injection
    if (document.getElementById('citation-modal')) return;

    const modalHTML = `
    <div id="citation-modal" class="search-modal-backdrop" style="display:none;">
        <div class="search-modal-content" style="max-width: 600px;">
            <div class="search-header">
                <h3><i class="fas fa-quote-right" style="color:var(--accent-gold)"></i> Citer cette Recherche</h3>
                <button class="close-search" onclick="closeCitation()"><i class="fas fa-times"></i></button>
            </div>
            <div style="padding: 20px;">
                <p style="font-size: 14px; color: #94a3b8; margin-bottom: 20px;">Utilisez les formats ci-dessous pour intégrer cette recherche dans vos mémos d'investissement ou papiers académiques.</p>
                
                <!-- APA -->
                <div style="margin-bottom: 20px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span style="font-weight:bold; color:white; font-size:12px;">FORMAT APA (7th Ed.)</span>
                        <button onclick="copyToClipboard('apa-text')" style="background:none; border:none; color:var(--accent-blue); cursor:pointer; font-size:12px;"><i class="far fa-copy"></i> Copier</button>
                    </div>
                    <div id="apa-text" style="background:#0f172a; padding:15px; border-radius:6px; font-family:'Times New Roman', serif; color:#e2e8f0; font-size:14px; border:1px solid #334155;">
                        <!-- JS Generated -->
                    </div>
                </div>

                <!-- BIBTEX -->
                <div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span style="font-weight:bold; color:white; font-size:12px;">BIBTEX (LaTeX)</span>
                        <button onclick="copyToClipboard('bibtex-text')" style="background:none; border:none; color:var(--accent-blue); cursor:pointer; font-size:12px;"><i class="far fa-copy"></i> Copier</button>
                    </div>
                    <div id="bibtex-text" style="background:#0f172a; padding:15px; border-radius:6px; font-family:'JetBrains Mono', monospace; color:#cbd5e1; font-size:12px; border:1px solid #334155; white-space: pre-wrap;">
                        <!-- JS Generated -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function initQuotingSystem() {
    // 1. Create 'Cite' button if context permits (e.g. near title)
    // For this implementation, we will look for a specific container or append to h1/navbar
    const heroH1 = document.querySelector('h1');
    if (heroH1 && !document.querySelector('.cite-btn-hero')) {
        const citeBtn = document.createElement('button');
        citeBtn.className = 'cite-btn-hero';
        citeBtn.innerHTML = '<i class="fas fa-quote-right"></i> Citer';
        citeBtn.style.cssText = `
            background: rgba(255,255,255,0.1); 
            border: 1px solid rgba(255,255,255,0.2); 
            color: #ccc; 
            padding: 5px 12px; 
            border-radius: 20px; 
            font-size: 12px; 
            cursor: pointer; 
            margin-left: 15px; 
            vertical-align: middle;
            transition: all 0.3s;
        `;
        citeBtn.onmouseover = () => { citeBtn.style.borderColor = 'var(--accent-gold)'; citeBtn.style.color = 'white'; };
        citeBtn.onmouseout = () => { citeBtn.style.borderColor = 'rgba(255,255,255,0.2)'; citeBtn.style.color = '#ccc'; };
        citeBtn.onclick = openCitation;
        
        // Append next to H1 or inside a container depending on layout
        // For safety, we append it after the H1 text
        heroH1.appendChild(citeBtn);
    }
}

function openCitation() {
    const modal = document.getElementById('citation-modal');
    if (!modal) return;

    // Generate Citation Data
    const title = document.querySelector('meta[property="og:title"]')?.content || document.title;
    const url = window.location.href;
    const author = document.querySelector('meta[name="author"]')?.content || "DCM Digital Hub";
    const year = new Date().getFullYear();
    const dateToday = new Date().toISOString().split('T')[0];

    // APA
    const apaString = `${author}. (${year}). <em>${title}</em>. DCM Digital Research. ${url}`;
    document.getElementById('apa-text').innerHTML = apaString;

    // BibTeX
    const slug = title.split(' ')[0].toLowerCase() + year;
    const bibtexString = `@misc{${slug},
  author = {${author}},
  title = {${title}},
  year = {${year}},
  note = {Accessed: ${dateToday}},
  url = {${url}}
}`;
    document.getElementById('bibtex-text').innerText = bibtexString;

    // Show Modal
    modal.style.display = 'flex';
}

function closeCitation() {
    document.getElementById('citation-modal').style.display = 'none';
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Citation copiée !");
    });
}
