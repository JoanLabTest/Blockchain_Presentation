#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SYNC ENGLISH EXPERT SITE
Mirroring the latest French enhancements to index_en.html
1. Inject Flux Comparison Module (English)
2. Upgrade Module 0 to Professional Definitions
3. Insert Risk Management Section
4. Inject Expert Architecture Phase 3 (English)
"""

import re

def main():
    print("🚀 Starting ENGLISH EXPERT SYNC...")
    
    try:
        with open('index_en.html', 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Error: {e}")
        return
        
    # ==========================================
    # 1. INJECT STYLES (If not present)
    # ==========================================
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
        
        /* Expert Step Styles */
        .expert-step { background: rgba(30, 41, 59, 0.5); border: 1px solid #334155; padding: 30px; border-radius: 8px; position: relative; }
        .expert-label { position: absolute; top: -15px; left: 30px; background: #ea580c; color: white; padding: 5px 15px; font-weight: bold; border-radius: 4px; font-size: 12px; }
    </style>
    '''
    
    if '/* --- COMPARATIF FLUX' not in content:
        if '</head>' in content:
            content = content.replace('</head>', styles + '\n</head>')
            print("✅ Styles injected")

    # ==========================================
    # 2. UPGRADE MODULE 0 (Professional)
    # ==========================================
    module0_pro = '''
    <!-- Module 0 : Fundamentals (Professional Version) -->
    <section id="fondamentaux" class="fade-in module-section">
        <div class="section-title">
            <span class="section-number">00</span>
            <h2>Digital Assets Fundamentals</h2>
            <p style="color: #94a3b8;">Terminology & Market Infrastructure</p>
        </div>

        <div class="definitions-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px; margin-top: 40px;">
            
            <div class="def-card" style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(148, 163, 184, 0.2); padding: 30px; border-radius: 12px; transition: all 0.3s;">
                <div class="icon-header" style="font-size: 3rem; margin-bottom: 15px;">📚</div>
                <h3 style="color: #10b981; margin-bottom: 15px;">DLT (Distributed Ledger Technology)</h3>
                <p class="definition" style="color: #e2e8f0; line-height: 1.8; margin-bottom: 15px;">
                    Distributed database technology allowing the recording, sharing, and synchronization of data across a network without a central validation authority.
                </p>
                <div class="tech-note" style="background: rgba(16, 185, 129, 0.1); padding: 15px; border-left: 3px solid #10b981; border-radius: 5px;">
                    <strong style="color: #10b981;">Pro Note:</strong> <span style="color: #cbd5e1;">Blockchain is a specific type of DLT that structures data into sequential blocks.</span>
                </div>
            </div>

            <div class="def-card" style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(148, 163, 184, 0.2); padding: 30px; border-radius: 12px; transition: all 0.3s;">
                <div class="icon-header" style="font-size: 3rem; margin-bottom: 15px;">🔐</div>
                <h3 style="color: #10b981; margin-bottom: 15px;">Digital Wallet & Custody</h3>
                <p class="definition" style="color: #e2e8f0; line-height: 1.8; margin-bottom: 15px;">
                    Interface for managing cryptographic key pairs.
                </p>
                <ul class="def-list" style="color: #cbd5e1; line-height: 1.8;">
                    <li><strong style="color: #10b981;">Public Key (IBAN):</strong> Receiving address visible on the network.</li>
                    <li><strong style="color: #10b981;">Private Key (Signature):</strong> Unique code allowing transaction authorization. Its loss results in permanent loss of assets.</li>
                </ul>
            </div>

            <div class="def-card" style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(148, 163, 184, 0.2); padding: 30px; border-radius: 12px; transition: all 0.3s;">
                <div class="icon-header" style="font-size: 3rem; margin-bottom: 15px;">📜</div>
                <h3 style="color: #10b981; margin-bottom: 15px;">Smart Contract</h3>
                <p class="definition" style="color: #e2e8f0; line-height: 1.8;">
                    Self-executing computer protocol that automatically enforces agreement terms (coupon payment, redemption) once pre-coded conditions are met.
                </p>
            </div>

        </div>
        
        <p class="caption" style="text-align: center; color: #94a3b8; margin-top: 40px; font-style: italic;">
            Figure 1: On-Chain Transaction Lifecycle vs Traditional Banking System
        </p>
    </section>
    '''
    
    # Replace Module 0
    # Search for "Module 0" header or section
    mod0_pattern = r'<!-- Module 0.*?</section>'
    if re.search(mod0_pattern, content, re.DOTALL):
        content = re.sub(mod0_pattern, module0_pro.strip(), content, flags=re.DOTALL, count=1)
        print("✅ Module 0 upgraded to Professional (English)")

    # ==========================================
    # 3. INJECT EXPERT ARCHITECTURE (Phase 3)
    # ==========================================
    expert_arch = '''
    <!-- Section : Expert Architecture (Phase 3) -->
    <section id="architecture-expert" class="fade-in expert-section" style="background: #0f172a; padding: 80px 0; border-top: 1px solid #1e293b;">
        <div class="section-title">
            <span class="section-number" style="background: #ea580c; color: white;">EXPERT LEVEL</span>
            <h2>Target Market Architecture</h2>
            <p style="color: #94a3b8;">Structuring a Digital Bond Issuance</p>
        </div>

        <div class="content-block" style="max-width: 1200px; margin: 0 auto; padding: 0 40px;">
            
            <div class="workflow-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 60px;">
                <!-- STEP 1 -->
                <div class="expert-step">
                    <div class="expert-label">PRE-TRADE</div>
                    <h4 style="color: white; margin-top: 10px; margin-bottom: 15px; font-size: 18px;">1. Structuring</h4>
                    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                        Defining <strong>Smart Contract</strong> parameters (ISIN, Maturity, Rate, Conventions). Encoding the legal Term Sheet.
                    </p>
                </div>

                <!-- STEP 2 -->
                <div class="expert-step">
                    <div class="expert-label">PRIMARY</div>
                    <h4 style="color: white; margin-top: 10px; margin-bottom: 15px; font-size: 18px;">2. Issuance (D-Day)</h4>
                    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                        Atomic <strong>Minting</strong> of tokens against DvP payment in Central Bank Money (via ECB Trigger solution).
                    </p>
                </div>

                <!-- STEP 3 -->
                <div class="expert-step">
                    <div class="expert-label">SERVICING</div>
                    <h4 style="color: white; margin-top: 10px; margin-bottom: 15px; font-size: 18px;">3. Lifecycle</h4>
                    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                        Automatic execution of coupons (Corporate Actions) and final redemption without manual Back-Office intervention.
                    </p>
                </div>
            </div>

            <!-- RISK FOCUS -->
            <div class="risk-focus" style="background: rgba(234, 88, 12, 0.1); border-left: 4px solid #ea580c; padding: 30px; border-radius: 0 8px 8px 0;">
                <h3 style="color: #ea580c; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-exclamation-triangle"></i> Risk Manager Focus
                </h3>
                <p style="color: #cbd5e1; margin-bottom: 20px;">Moving to Blockchain infrastructure radically transforms the nature of operational risks:</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                    <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 6px;">
                        <span style="color: #10b981; font-weight: bold; display: block; margin-bottom: 5px;">📉 Counterparty Risk</span>
                        <span style="color: #fff; font-size: 14px;">ELIMINATED (via instant Atomic DvP)</span>
                    </div>
                    <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 6px;">
                        <span style="color: #ef4444; font-weight: bold; display: block; margin-bottom: 5px;">📈 Operational Risk</span>
                        <span style="color: #fff; font-size: 14px;">INCREASED (critical private key/HSM management)</span>
                    </div>
                    <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 6px;">
                        <span style="color: #f59e0b; font-weight: bold; display: block; margin-bottom: 5px;">⚠️ Liquidity Risk</span>
                        <span style="color: #fff; font-size: 14px;">WATCH POINT (nascent secondary markets)</span>
                    </div>
                </div>
            </div>

        </div>
    </section>
    '''
    
    # Inject before Bond Issuance (id="obligation")
    target_pos = content.find('<section id="obligation"')
    if target_pos > 0:
        content = content[:target_pos] + expert_arch + '\n\n    ' + content[target_pos:]
        print("✅ Expert Architecture (Phase 3) injected (English)")


    # ==========================================
    # 4. INJECT FLUX COMPARISON MODULE
    # ==========================================
    flux_module = '''
    <!-- MODULE: THE INFRASTRUCTURE CLASH (COMPARISON FLOWS) -->
    <section id="comparatif-flux" class="fade-in section-alternate" style="padding: 80px 0; background: #0b1121;">
        <div class="section-title">
            <span class="section-number">07.2</span>
            <h2>The Infrastructure Clash</h2>
            <p style="color: #94a3b8;">Detailed Comparative Analysis: Traditional vs Digital Model</p>
        </div>

        <div class="content-block" style="max-width: 1200px; margin: 0 auto; padding: 0 40px;">
            
            <div class="tabs">
                <button class="tab-btn active" onclick="openTabFlux(event, 'flux-primaire')">Primary Market</button>
                <button class="tab-btn" onclick="openTabFlux(event, 'flux-secondaire')">Secondary Market</button>
                <button class="tab-btn" onclick="openTabFlux(event, 'flux-settlement')">Settlement</button>
            </div>

            <!-- TAB 1 : PRIMARY -->
            <div id="flux-primaire" class="tab-content active">
                <div class="grid-2-flux">
                    <!-- LEGACY -->
                    <div class="flux-box" style="border-top: 4px solid #64748b;">
                        <h3 style="color: #64748b; margin-bottom: 15px;">Legacy Model</h3>
                        <div class="flux-badge" style="background: #475569; color: white;">Crédit Foncier de France</div>
                        <div class="flow-step">
                            <span class="step-time">D-5</span> <strong>Syndication</strong>
                            <p style="font-size: 14px; color: #94a3b8; margin:0 0 0 10px;">Traditional Bookbuilding (Email/Bloomberg).</p>
                        </div>
                        <div class="flow-line"></div>
                        <div class="flow-step">
                            <span class="step-time">D-0</span> <strong>Global Note (Paper)</strong>
                            <p style="font-size: 14px; color: #94a3b8; margin:0 0 0 10px;">Manual signature, CSD vault deposit.</p>
                        </div>
                        <div class="flow-line"></div>
                        <div class="flow-step">
                            <span class="step-time">D+5</span> <strong>Settlement</strong>
                            <p style="font-size: 14px; color: #94a3b8; margin:0 0 0 10px;">Waterfall of transfers and reconciliations.</p>
                        </div>
                    </div>

                    <!-- DIGITAL -->
                    <div class="flux-box" style="border-top: 4px solid #10b981; background: rgba(16, 185, 129, 0.05);">
                        <h3 style="color: #10b981; margin-bottom: 15px;">Digital Model</h3>
                        <div class="flux-badge" style="background: #10b981; color: #000;">Natixis Pfandbriefbank</div>
                        <div class="flow-step">
                            <span class="step-time digital">H-2</span> <strong>Pricing</strong>
                            <p style="font-size: 14px; color: #94a3b8; margin:0 0 0 10px;">Identical negotiation.</p>
                        </div>
                        <div class="flow-line digital"></div>
                        <div class="flow-step">
                            <span class="step-time digital">H-0</span> <strong>Smart Contract</strong>
                            <p style="font-size: 14px; color: #94a3b8; margin:0 0 0 10px;">Native Tokenization (eWpG Law).</p>
                        </div>
                        <div class="flow-line digital"></div>
                        <div class="flow-step">
                            <span class="step-time digital">H+10m</span> <strong>Distribution T+0</strong>
                            <p style="font-size: 14px; color: #94a3b8; margin:0 0 0 10px;">Atomic P2P Delivery (Delivery vs Payment).</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB 2 : SECONDARY -->
            <div id="flux-secondaire" class="tab-content">
                <div class="grid-2-flux">
                    <div class="flux-box">
                        <h3 style="color: #64748b; margin-bottom: 15px;">Legacy SWIFT Chain</h3>
                        <p style="color:#cbd5e1; margin-bottom:15px;">Seller ➔ Custodian A (MT540) ➔ CSD ➔ Custodian B (MT541) ➔ Buyer</p>
                        <div style="margin-top: 20px; padding: 15px; background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; color: #ef4444;">
                            <strong>Risk:</strong> If a message is lost or malformed, trade fails. Standard delay T+2.
                        </div>
                    </div>
                    <div class="flux-box" style="background: rgba(16, 185, 129, 0.05);">
                        <h3 style="color: #10b981; margin-bottom: 15px;">Atomic Swap (Blockchain)</h3>
                        <p style="color:#cbd5e1; margin-bottom:15px;">Seller ↔ Smart Contract ↔ Buyer</p>
                        <div style="margin-top: 20px; padding: 15px; background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; color: #10b981;">
                            <strong>Revolution:</strong> Simultaneous exchange of asset and cash. Impossible to deliver without payment. T+0.
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB 3 : SETTLEMENT -->
            <div id="flux-settlement" class="tab-content">
                 <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background: #1e293b;">
                            <th style="text-align: left; padding: 15px; color: #94a3b8;">Criteria</th>
                            <th style="text-align: left; padding: 15px; color: #fff;">Conventional</th>
                            <th style="text-align: left; padding: 15px; color: #10b981;">Digital Bond</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #334155;">
                            <td style="padding: 15px; font-weight: bold; color: #e2e8f0;">Legal Basis</td>
                            <td style="padding: 15px; color: #cbd5e1;">Global Note (Paper)</td>
                            <td style="padding: 15px; color: #10b981;">Code (Smart Contract)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #334155;">
                            <td style="padding: 15px; font-weight: bold; color: #e2e8f0;">Reconciliation</td>
                            <td style="padding: 15px; color: #cbd5e1;">Manual (3 levels)</td>
                            <td style="padding: 15px; color: #10b981;">None (Shared Registry)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #334155;">
                            <td style="padding: 15px; font-weight: bold; color: #e2e8f0;">Settlement Delay</td>
                            <td style="padding: 15px; color: #cbd5e1;">T+2 to T+5</td>
                            <td style="padding: 15px; color: #10b981;">T+0 (Instant)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </section>
    
    <script>
    // SCRIPT SPECIFIC TO FLUX MODULE
    function openTabFlux(evt, tabName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tab-content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].classList.remove("active");
            tabcontent[i].style.display = "none"; 
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
    </script>
    '''

    # Inject after Expert Architecture
    insert_point = content.find('<!-- Section : Expert Architecture (Phase 3) -->')
    if insert_point > 0:
        end_section_match = re.search(r'</section>', content[insert_point:])
        if end_section_match:
            end_pos = insert_point + end_section_match.end()
            content = content[:end_pos] + '\n\n' + flux_module + '\n' + content[end_pos:]
            print("✅ Flux Comparison Module injected (English)")

    # ==========================================
    # 5. INJECT RISK MANAGEMENT SECTION
    # ==========================================
    risk_section = '''
    <!-- Section : Risk Management & Compliance -->
    <section id="risks" class="fade-in risk-management">
        <div class="section-title">
            <span class="section-number">09.5</span>
            <h2>Risk Management & Compliance</h2>
            <p style="color: #94a3b8;">Risk Mapping for Digital Assets</p>
        </div>

        <div class="risk-matrix" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px; margin-top: 40px;">
            
            <div class="risk-item" style="background: rgba(15, 23, 42, 0.6); border-left: 4px solid #f59e0b; padding: 25px; border-radius: 8px;">
                <div class="risk-header" style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <span class="risk-icon" style="font-size: 2.5rem;">🔑</span>
                    <h4 style="color: #f59e0b; margin: 0;">Operational Risk (Key Management)</h4>
                </div>
                <p style="color: #e2e8f0; margin-bottom: 10px;"><strong style="color: #ef4444;">Danger:</strong> Loss of private key or social engineering theft is irreversible.</p>
                <p style="color: #cbd5e1;"><strong style="color: #10b981;">Mitigation:</strong> Institutional custody solutions (MPC - Multi-Party Computation) and Hardware Security Modules (HSM).</p>
            </div>

            <div class="risk-item" style="background: rgba(15, 23, 42, 0.6); border-left: 4px solid #3b82f6; padding: 25px; border-radius: 8px;">
                <div class="risk-header" style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <span class="risk-icon" style="font-size: 2.5rem;">💧</span>
                    <h4 style="color: #3b82f6; margin: 0;">Liquidity Risk</h4>
                </div>
                <p style="color: #e2e8f0; margin-bottom: 10px;"><strong style="color: #ef4444;">Danger:</strong> Fragmented secondary market, difficulty selling large blocks without price impact.</p>
                <p style="color: #cbd5e1;"><strong style="color: #10b981;">Mitigation:</strong> Specialized Market Makers and market interconnection.</p>
            </div>

            <div class="risk-item" style="background: rgba(15, 23, 42, 0.6); border-left: 4px solid #8b5cf6; padding: 25px; border-radius: 8px;">
                <div class="risk-header" style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <span class="risk-icon" style="font-size: 2.5rem;">⚖️</span>
                    <h4 style="color: #8b5cf6; margin: 0;">Compliance & AML/CFT</h4>
                </div>
                <p style="color: #e2e8f0; margin-bottom: 10px;"><strong style="color: #ef4444;">Danger:</strong> Interaction with sanctioned addresses or money laundering.</p>
                <p style="color: #cbd5e1;"><strong style="color: #10b981;">Mitigation:</strong> Chain analysis tools (Chainalysis, TRM) for real-time wallet scoring (KYT - Know Your Transaction).</p>
            </div>

        </div>
    </section>
    '''
    
    # Insert Risk section before Glossary
    if '<!-- Section 10: Glossary' in content:
        content = content.replace('<!-- Section 10: Glossary', risk_section + '\n    <!-- Section 10: Glossary')
        print("✅ Risk Management section injected (English)")

    # Write final result
    with open('index_en.html', 'w', encoding='utf-8') as f:
        f.write(content)

    print("\n🎉 SYNC EXPERT COMPLETE - ENGLISH SITE IS A PERFECT MIRROR")

if __name__ == "__main__":
    main()
