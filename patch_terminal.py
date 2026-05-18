import os

def patch_file(filepath, is_fr=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_paper_en = """            <!-- Paper 4 (New SEPA Paper) -->
            <article class="paper-entry filter-item wp">
                <div class="paper-meta-row">
                    <span class="doi-badge">DCM-WP-2026-05</span>
                    <span class="paper-date">MAY 18, 2026</span>
                    <span style="margin-left: 16px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--term-blue); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">WP Rev. 1.0</span>
                    <span style="margin-left: 12px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #64748b;">Last Reviewed: 2026-Q2</span>
                    <span style="margin-left: auto; font-size: 11px; color: var(--term-text-sub);">18 PAGES</span>
                </div>
                
                <h2 class="paper-title">The Tokenized SEPA Rail: Bridging European Commercial Cash Flows and DLT Liquidity</h2>
                
                <div style="display: flex; gap: 20px; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); padding: 8px 0; margin-bottom: 14px; font-family: 'JetBrains Mono', monospace; font-size: 10px;">
                    <div><span style="color: #64748b;">HQLA Velocity Impact:</span> <span style="color: #10b981; font-weight: 700;">+14% [Modeled]</span></div>
                    <div><span style="color: #64748b;">System Model:</span> <a href="../methodology/governance.html" style="color: var(--term-blue); text-decoration: underline;">SCT Inst / MiCA EMT</a></div>
                </div>
                
                <p class="paper-excerpt">
                    As capital markets accelerate their transition toward Distributed Ledger Technologies (DLT), retail and corporate commercial flows remain siloed within legacy networks. This paper models the convergence of SEPA with tokenized infrastructure under the MiCA regime, analyzing trigger solutions against native E-Money Tokens.
                </p>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <a href="tokenized-sepa-integration.html" class="read-btn">Read Full Paper <i class="fas fa-arrow-right" style="margin-left: 4px; font-size: 10px;"></i></a>
                    <span style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--term-text-muted); background: rgba(255,255,255,0.03); padding: 4px 8px; border-radius: 4px; border: 1px dashed rgba(255,255,255,0.1);"><i class="fas fa-database" style="color: var(--term-text-sub); margin-right: 4px;"></i> Includes Flow Diagram</span>
                </div>
            </article>

"""

    new_paper_fr = """            <!-- Paper 4 (New SEPA Paper) -->
            <article class="paper-entry filter-item wp">
                <div class="paper-meta-row">
                    <span class="doi-badge">DCM-WP-2026-05</span>
                    <span class="paper-date">18 MAI 2026</span>
                    <span style="margin-left: 16px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--term-blue); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">WP Rev. 1.0</span>
                    <span style="margin-left: 12px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #64748b;">Last Reviewed: 2026-Q2</span>
                    <span style="margin-left: auto; font-size: 11px; color: var(--term-text-sub);">18 PAGES</span>
                </div>
                
                <h2 class="paper-title">Le Rail SEPA Tokenisé : Relier les Flux Commerciaux Européens et la Liquidité DLT</h2>
                
                <div style="display: flex; gap: 20px; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); padding: 8px 0; margin-bottom: 14px; font-family: 'JetBrains Mono', monospace; font-size: 10px;">
                    <div><span style="color: #64748b;">Impact Vélocité HQLA:</span> <span style="color: #10b981; font-weight: 700;">+14% [Modélisé]</span></div>
                    <div><span style="color: #64748b;">Modèle Système:</span> <a href="../methodology/gouvernance.html" style="color: var(--term-blue); text-decoration: underline;">SCT Inst / MiCA EMT</a></div>
                </div>
                
                <p class="paper-excerpt">
                    Alors que les marchés de capitaux accélèrent leur transition vers les technologies de registre distribué (DLT), les flux commerciaux restent cloisonnés dans des réseaux traditionnels. Ce document modélise la convergence de l'Espace unique de paiement en euros (SEPA) avec l'infrastructure tokenisée sous le régime MiCA.
                </p>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <a href="integration-sepa-tokenise.html" class="read-btn">Lire le Document Complet <i class="fas fa-arrow-right" style="margin-left: 4px; font-size: 10px;"></i></a>
                    <span style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--term-text-muted); background: rgba(255,255,255,0.03); padding: 4px 8px; border-radius: 4px; border: 1px dashed rgba(255,255,255,0.1);"><i class="fas fa-database" style="color: var(--term-text-sub); margin-right: 4px;"></i> Inclut Diagramme de Flux</span>
                </div>
            </article>

"""

    target = "            <!-- Paper 3"
    
    if is_fr:
        content = content.replace(target, new_paper_fr + target)
    else:
        content = content.replace(target, new_paper_en + target)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

patch_file('en/research/terminal.html', False)
patch_file('fr/research/terminal.html', True)

print("Terminal patched.")
