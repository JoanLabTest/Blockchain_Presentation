#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SURGICAL INTEGRATION: FLUX COMPARISON MODULE
Injects the "Choc des Infrastructures" comparison table into index.html
Preserves all existing Expert content (3500+ lines).
"""

import re

def main():
    print("🚀 Starting SURGICAL INTEGRATION of Flux Comparison Module...")
    
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Error: {e}")
        return

    # 1. CSS Styles for the new module
    # We'll inject this into the <head> or add it inline for the section
    # Better to add structure in the section itself for self-containment or append to styles
    
    styles = '''
    <style>
        /* --- COMPARATIF FLUX (INTEGRATED) --- */
        .tabs { display: flex; gap: 10px; margin-bottom: 30px; border-bottom: 1px solid #334155; }
        .tab-btn { background: transparent; border: none; color: #94a3b8; padding: 10px 20px; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: bold; font-size: 16px; transition: all 0.3s; border-bottom: 3px solid transparent; }
        .tab-btn:hover { color: #fff; }
        .tab-btn.active { color: #3b82f6; border-bottom-color: #3b82f6; }
        .tab-content { display: none; animation: fadeIn 0.5s; }
        .tab-content.active { display: block; }
        
        .flow-step { display: flex; align-items: center; gap: 15px; margin: 10px 0; }
        .step-time { background: #475569; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-family: 'monospace'; }
        .step-time.digital { background: #10b981; color: #000; }
        .flow-line { height: 20px; border-left: 2px dashed #475569; margin-left: 20px; }
        .flow-line.digital { border-color: #10b981; }
        
        @keyframes fadeIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
        
        .grid-2-flux { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        @media (max-width: 768px) { .grid-2-flux { grid-template-columns: 1fr; } }
        
        .flux-box { 
            background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; 
            border-radius: 16px; padding: 30px; transition: all 0.3s;
        }
        .flux-box:hover { transform: translateY(-3px); border-color: #3b82f6; }
        
        .flux-badge { padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 12px; text-transform: uppercase; display: inline-block; margin-bottom: 15px; }
    </style>
    '''

    # Need to insert styles before </head>
    if '</head>' in content:
        content = content.replace('</head>', styles + '\n</head>')
        print("✅ Styles injected")

    # 2. HTML Module Content
    flux_module = '''
    <!-- MODULE: LE CHOC DES INFRASTRUCTURES (COMPARATIF FLUX) -->
    <section id="comparatif-flux" class="fade-in section-alternate" style="padding: 80px 0; background: #0b1121;">
        <div class="section-title">
            <span class="section-number">07.2</span>
            <h2>Le Choc des Infrastructures</h2>
            <p style="color: #94a3b8;">Analyse comparative détaillée : Modèle Traditionnel vs Digital</p>
        </div>

        <div class="content-block" style="max-width: 1200px; margin: 0 auto; padding: 0 40px;">
            
            <div class="tabs">
                <button class="tab-btn active" onclick="openTabFlux(event, 'flux-primaire')">Marché Primaire</button>
                <button class="tab-btn" onclick="openTabFlux(event, 'flux-secondaire')">Marché Secondaire</button>
                <button class="tab-btn" onclick="openTabFlux(event, 'flux-settlement')">Règlement (Settlement)</button>
            </div>

            <!-- ONGLET 1 : PRIMAIRE -->
            <div id="flux-primaire" class="tab-content active">
                <div class="grid-2-flux">
                    <!-- CLASSIQUE -->
                    <div class="flux-box" style="border-top: 4px solid #64748b;">
                        <h3 style="color: #64748b; margin-bottom: 15px;">Modèle Classique</h3>
                        <div class="flux-badge" style="background: #475569; color: white;">Crédit Foncier de France</div>
                        <div class="flow-step">
                            <span class="step-time">J-5</span> <strong>Syndication</strong>
                            <p style="font-size: 14px; color: #94a3b8; margin:0 0 0 10px;">Bookbuilding traditionnel (Email/Bloomberg).</p>
                        </div>
                        <div class="flow-line"></div>
                        <div class="flow-step">
                            <span class="step-time">J-0</span> <strong>Global Note (Papier)</strong>
                            <p style="font-size: 14px; color: #94a3b8; margin:0 0 0 10px;">Signature manuelle, dépôt coffre-fort CSD.</p>
                        </div>
                        <div class="flow-line"></div>
                        <div class="flow-step">
                            <span class="step-time">J+5</span> <strong>Règlement</strong>
                            <p style="font-size: 14px; color: #94a3b8; margin:0 0 0 10px;">Cascade de virements et réconciliations.</p>
                        </div>
                    </div>

                    <!-- DIGITAL -->
                    <div class="flux-box" style="border-top: 4px solid #10b981; background: rgba(16, 185, 129, 0.05);">
                        <h3 style="color: #10b981; margin-bottom: 15px;">Modèle Digital</h3>
                        <div class="flux-badge" style="background: #10b981; color: #000;">Natixis Pfandbriefbank</div>
                        <div class="flow-step">
                            <span class="step-time digital">H-2</span> <strong>Pricing</strong>
                            <p style="font-size: 14px; color: #94a3b8; margin:0 0 0 10px;">Négociation identique.</p>
                        </div>
                        <div class="flow-line digital"></div>
                        <div class="flow-step">
                            <span class="step-time digital">H-0</span> <strong>Smart Contract</strong>
                            <p style="font-size: 14px; color: #94a3b8; margin:0 0 0 10px;">Tokenisation native (Loi eWpG).</p>
                        </div>
                        <div class="flow-line digital"></div>
                        <div class="flow-step">
                            <span class="step-time digital">H+10m</span> <strong>Distribution T+0</strong>
                            <p style="font-size: 14px; color: #94a3b8; margin:0 0 0 10px;">Livraison atomique P2P (Delivery vs Payment).</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ONGLET 2 : SECONDAIRE -->
            <div id="flux-secondaire" class="tab-content">
                <div class="grid-2-flux">
                    <div class="flux-box">
                        <h3 style="color: #64748b; margin-bottom: 15px;">La Chaîne SWIFT Héritée</h3>
                        <p style="color:#cbd5e1; margin-bottom:15px;">Vendeur ➔ Custodian A (MT540) ➔ CSD ➔ Custodian B (MT541) ➔ Acheteur</p>
                        <div style="margin-top: 20px; padding: 15px; background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; color: #ef4444;">
                            <strong>Risque :</strong> Si un message est perdu ou mal formaté, le trade échoue ("Fail"). Délai standard T+2.
                        </div>
                    </div>
                    <div class="flux-box" style="background: rgba(16, 185, 129, 0.05);">
                        <h3 style="color: #10b981; margin-bottom: 15px;">L'Atomic Swap (Blockchain)</h3>
                        <p style="color:#cbd5e1; margin-bottom:15px;">Vendeur ↔ Smart Contract ↔ Acheteur</p>
                        <div style="margin-top: 20px; padding: 15px; background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; color: #10b981;">
                            <strong>Révolution :</strong> Échange simultané de l'actif et du cash. Impossible de livrer sans être payé. T+0.
                        </div>
                    </div>
                </div>
            </div>

            <!-- ONGLET 3 : SETTLEMENT -->
            <div id="flux-settlement" class="tab-content">
                 <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background: #1e293b;">
                            <th style="text-align: left; padding: 15px; color: #94a3b8;">Critère</th>
                            <th style="text-align: left; padding: 15px; color: #fff;">Conventionnel</th>
                            <th style="text-align: left; padding: 15px; color: #10b981;">Digital Bond</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #334155;">
                            <td style="padding: 15px; font-weight: bold; color: #e2e8f0;">Support Juridique</td>
                            <td style="padding: 15px; color: #cbd5e1;">Global Note (Papier)</td>
                            <td style="padding: 15px; color: #10b981;">Code (Smart Contract)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #334155;">
                            <td style="padding: 15px; font-weight: bold; color: #e2e8f0;">Réconciliation</td>
                            <td style="padding: 15px; color: #cbd5e1;">Manuelle (3 niveaux)</td>
                            <td style="padding: 15px; color: #10b981;">Aucune (Registre Unique)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #334155;">
                            <td style="padding: 15px; font-weight: bold; color: #e2e8f0;">Délai Règlement</td>
                            <td style="padding: 15px; color: #cbd5e1;">T+2 à T+5</td>
                            <td style="padding: 15px; color: #10b981;">T+0 (Instantané)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </section>
    
    <script>
    // SCRIPT SPECIFIQUE POUR LE MODULE FLUX
    function openTabFlux(evt, tabName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tab-content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].classList.remove("active");
            tabcontent[i].style.display = "none"; // Ensure legacy support
        }
        
        tablinks = document.getElementsByClassName("tab-btn");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        
        var target = document.getElementById(tabName);
        if(target) {
            target.style.display = "block";
            setTimeout(() => { target.classList.add("active"); }, 10);
        }
        
        if(evt) evt.currentTarget.className += " active";
    }
    // Init Tabs per default if needed
    document.addEventListener("DOMContentLoaded", function() {
       // Optional init logic
    });
    </script>
    '''

    # 3. Insertion Logic
    # We want to insert this AFTER Module 7.1 (Bond Issuance) and BEFORE Module 7.2 (Benchmarks)
    # Or replace part of the "Business Case" we just added? 
    # Let's check where is the best fit.
    
    # We recently added "Architecture Expert (Phase 3)" section. This Flux module complements it perfectly.
    # It should go right AFTER that section.
    
    insert_point = content.find('<!-- Section : Architecture Expert (Phase 3) -->')
    if insert_point > 0:
        # Find the end of this section
        end_section_match = re.search(r'</section>', content[insert_point:])
        if end_section_match:
            end_pos = insert_point + end_section_match.end()
            
            # Insert AFTER the Expert Architecture section
            new_content = content[:end_pos] + '\n\n' + flux_module + '\n' + content[end_pos:]
            
            with open('index.html', 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("✅ Flux Comparison Module inserted surgically!")
            print("✅ Original content preserved (3500+ lines preserved)")

    else:
        print("⚠️ Could not find optimized insertion point, trying alternative...")
        # Fallback: Insert before Benchmarks
        bench_point = content.find('id="benchmarks"')
        if bench_point > 0:
             # Find the START of the section containing this ID
             section_start = content.rfind('<section', 0, bench_point)
             new_content = content[:section_start] + flux_module + '\n\n    ' + content[section_start:]
             with open('index.html', 'w', encoding='utf-8') as f:
                f.write(new_content)
             print("✅ Flux Comparison Module inserted before Benchmarks")


if __name__ == "__main__":
    main()
