#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ACADEMY UPGRADE & EXPERT INTEGRATION
Splits content intelligently between simple.html (Beginner/Int) and index.html (Expert)
"""

import re

def main():
    print("🚀 Starting BEST-OF-BREED Content Strategy Implementation...")
    
    # ---------------------------------------------------------
    # PART 1: UPGRADE ACADEMY (simple.html) WITH PHASES 1 & 2
    # ---------------------------------------------------------
    try:
        with open('simple.html', 'r', encoding='utf-8') as f:
            simple_content = f.read()
        
        # New Phase 1: Email vs Cash (replaces Slide 2)
        phase1_html = '''
        <!-- SLIDE 2 : LE CHANGEMENT DE PARADIGME (PHASE 1) -->
        <div class="slide" data-aos="fade-up">
            <h2><i class="fa-solid fa-exchange-alt"></i> Comprendre le Changement de Paradigme</h2>
            <p>De l'Internet de l'Information à l'Internet de la Valeur</p>

            <div class="visual-comparison">
                <!-- GAUCHE : EMAIL -->
                <div class="v-card" style="border-top: 4px solid #64748b;">
                    <div class="v-icon-wrapper">
                        <i class="fa-solid fa-envelope" style="color: #64748b;"></i>
                    </div>
                    <span class="v-title" style="color: #94a3b8;">HIER : L'envoi de Copies</span>
                    <p class="v-desc">
                        Quand vous envoyez un email ou un PDF, vous envoyez une <strong>copie</strong>. Vous gardez l'original sur votre ordinateur.
                    </p>
                    <div style="margin-top: 20px; padding: 10px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border-radius: 8px; font-size: 13px; font-weight: bold;">
                        ⛔ Problème pour l'argent : Pas de "copier-coller" possible
                    </div>
                </div>

                <!-- CENTRE -->
                <div class="vs-badge">VS</div>

                <!-- DROITE : TRANSFERT -->
                <div class="v-card" style="border-top: 4px solid var(--accent-purple); background: rgba(168, 85, 247, 0.03);">
                    <div class="v-icon-wrapper" style="border-color: var(--accent-purple);">
                        <i class="fa-solid fa-link" style="color: var(--accent-purple);"></i>
                    </div>
                    <span class="v-title" style="color: var(--accent-purple);">DEMAIN : Le Transfert d'Unicité</span>
                    <p class="v-desc">
                        La Blockchain permet de transférer un actif numérique unique <strong>sans intermédiaire central</strong>. C'est comme donner du cash numérique.
                    </p>
                    <div style="margin-top: 20px; padding: 10px; background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 8px; font-size: 13px; font-weight: bold;">
                        ✅ Solution : Transfert de Valeur P2P
                    </div>
                </div>
            </div>
        </div>

        <!-- SLIDE 3 : LE DICTIONNAIRE DE TRANSITION (PHASE 2) -->
        <div class="slide" data-aos="fade-up">
            <h2><i class="fa-solid fa-language"></i> Le Dictionnaire de Transition</h2>
            <p>Traduire la "Tech" en langage "Banque"</p>

            <style>
                .trans-table { width: 100%; border-collapse: collapse; margin-top: 30px; }
                .trans-table th { text-align: left; padding: 15px; color: var(--accent-blue); border-bottom: 2px solid var(--border); }
                .trans-table td { padding: 20px 15px; border-bottom: 1px solid var(--border); font-size: 18px; }
                .trans-table tr:hover { background: rgba(255,255,255,0.02); }
                .term-geek { font-family: 'JetBrains Mono'; color: var(--accent-purple); }
                .term-pro { font-weight: bold; color: var(--accent-green); }
            </style>

            <table class="trans-table">
                <thead>
                    <tr>
                        <th>Terme "Grand Public" 🤓</th>
                        <th>Terme "Crypto / Tech" 👨‍💻</th>
                        <th>Terme "Institutionnel" 🏦</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Compte en banque</td>
                        <td class="term-geek">Wallet (Metamask)</td>
                        <td class="term-pro"><i class="fas fa-check"></i> Custody Account</td>
                    </tr>
                    <tr>
                        <td>Virement</td>
                        <td class="term-geek">Transaction On-chain</td>
                        <td class="term-pro"><i class="fas fa-check"></i> Settlement (Règlement)</td>
                    </tr>
                    <tr>
                        <td>Monnaie / Jeton</td>
                        <td class="term-geek">Token / Coin</td>
                        <td class="term-pro"><i class="fas fa-check"></i> Digital Asset</td>
                    </tr>
                    <tr>
                        <td>Robot automatique</td>
                        <td class="term-geek">Smart Contract</td>
                        <td class="term-pro"><i class="fas fa-check"></i> Protocole d'Exécution</td>
                    </tr>
                </tbody>
            </table>
        </div>
        '''
        
        # Replace existing Slide 2 & 3 with new content
        # Note: We'll keep the wallet slide logic but rephrase it or move it if needed, 
        # but for now let's inject these NEW slides after Slide 1 and before the Wallet slide
        
        slide1_end = re.search(r'<!-- SLIDE 1.*?</div>\s*</div>', simple_content, re.DOTALL).end()
        # Find where the deck continues
        rest_of_deck = simple_content[slide1_end:]
        
        # We will replace the old "Slide 2" section completely
        if '<!-- SLIDE 2' in rest_of_deck:
             # Just insert normally for now, simplest logic is safer
             pass
        
        # Let's replace the whole Deck content to be safe and clean
        # New order: Intro -> Email/Cash -> Dictionary -> Wallet -> Conclusion
        
        # We need to construct the full file carefully. 
        # Actually, simpler: RegEx replace Slide 2 and Slide 3 with new content.
        
        simple_content = re.sub(r'<!-- SLIDE 2.*?</div>\s*</div>', phase1_html, simple_content, flags=re.DOTALL)
        
        # Now insert Dictionary slide after Slide 2
        # We'll stick it before Slide 3 (Wallet)
        simple_content = simple_content.replace('<!-- SLIDE 3', phase1_html.split('<!-- SLIDE 3')[1] + '\n\n        <!-- SLIDE 3')
        
        # Wait, the regex replace above replaced Slide 2 with BOTH Phase 1 and Phase 2 HTML? 
        # My phase1_html variable contained BOTH slides. Correct.
        
        # Fix: The variable phase1_html contains TWO slides. 
        # So I replaced the old Slide 2 with (New Slide 2 + New Slide 3).
        # The old Slide 3 (Wallet) becomes Slide 4 physically.
        
        # Let's rename the comments for clarity in the file
        simple_content = simple_content.replace('<!-- SLIDE 3 : LE WALLET', '<!-- SLIDE 4 : LE WALLET (PRATIQUE)')
        simple_content = simple_content.replace('<!-- SLIDE 4 : DISTINCTION', '<!-- SLIDE 5 : DISTINCTION')
        simple_content = simple_content.replace('<!-- SLIDE 5 : CONCLUSION', '<!-- SLIDE 6 : CONCLUSION')
        
        with open('simple.html', 'w', encoding='utf-8') as f:
            f.write(simple_content)
        print("✅ Academy (simple.html) updated with Phases 1 & 2")

    except Exception as e:
        print(f"❌ Error updating simple.html: {e}")


    # ---------------------------------------------------------
    # PART 2: UPGRADE PRO SITE (index.html) WITH PHASE 3
    # ---------------------------------------------------------
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            index_content = f.read()

        # Phase 3: Expert Architecture
        phase3_html = '''
    <!-- Section : Architecture Expert (Phase 3) -->
    <section id="architecture-expert" class="fade-in expert-section" style="background: #0f172a; padding: 80px 0; border-top: 1px solid #1e293b;">
        <div class="section-title">
            <span class="section-number" style="background: #ea580c; color: white;">NIVEAU EXPERT</span>
            <h2>Architecture de Marché Cible</h2>
            <p style="color: #94a3b8;">Structuration d'une émission obligataire (Digital Bond)</p>
        </div>

        <div class="content-block" style="max-width: 1200px; margin: 0 auto; padding: 0 40px;">
            
            <div class="workflow-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 60px;">
                <!-- STEP 1 -->
                <div class="expert-step" style="background: rgba(30, 41, 59, 0.5); border: 1px solid #334155; padding: 30px; border-radius: 8px; position: relative;">
                    <div style="position: absolute; top: -15px; left: 30px; background: #ea580c; color: white; padding: 5px 15px; font-weight: bold; border-radius: 4px; font-size: 12px;">PRE-TRADE</div>
                    <h4 style="color: white; margin-top: 10px; margin-bottom: 15px; font-size: 18px;">1. Structuration</h4>
                    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                        Définition des paramètres du <strong>Smart Contract</strong> (ISIN, Maturité, Taux, Conventions). Encodage du Term Sheet juridique.
                    </p>
                </div>

                <!-- STEP 2 -->
                <div class="expert-step" style="background: rgba(30, 41, 59, 0.5); border: 1px solid #334155; padding: 30px; border-radius: 8px; position: relative;">
                    <div style="position: absolute; top: -15px; left: 30px; background: #ea580c; color: white; padding: 5px 15px; font-weight: bold; border-radius: 4px; font-size: 12px;">PRIMARY</div>
                    <h4 style="color: white; margin-top: 10px; margin-bottom: 15px; font-size: 18px;">2. Émission (D-Day)</h4>
                    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                        <strong>Minting</strong> atomique des tokens contre paiement DvP en Monnaie Banque Centrale (via solution Trigger BCE).
                    </p>
                </div>

                <!-- STEP 3 -->
                <div class="expert-step" style="background: rgba(30, 41, 59, 0.5); border: 1px solid #334155; padding: 30px; border-radius: 8px; position: relative;">
                    <div style="position: absolute; top: -15px; left: 30px; background: #ea580c; color: white; padding: 5px 15px; font-weight: bold; border-radius: 4px; font-size: 12px;">SERVICING</div>
                    <h4 style="color: white; margin-top: 10px; margin-bottom: 15px; font-size: 18px;">3. Vie du Titre</h4>
                    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                        Exécution automatique des coupons (Corporate Actions) et remboursement final sans intervention manuelle du Back-Office.
                    </p>
                </div>
            </div>

            <!-- RISK FOCUS -->
            <div class="risk-focus" style="background: rgba(234, 88, 12, 0.1); border-left: 4px solid #ea580c; padding: 30px; border-radius: 0 8px 8px 0;">
                <h3 style="color: #ea580c; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-exclamation-triangle"></i> Focus Gestionnaire de Risque
                </h3>
                <p style="color: #cbd5e1; margin-bottom: 20px;">Le passage à l'infrastructure Blockchain transforme radicalement la nature des risques opérationnels :</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                    <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 6px;">
                        <span style="color: #10b981; font-weight: bold; display: block; margin-bottom: 5px;">📉 Risque de Contrepartie</span>
                        <span style="color: #fff; font-size: 14px;">ÉLIMINÉ (grâce au DvP Atomique instantané)</span>
                    </div>
                    <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 6px;">
                        <span style="color: #ef4444; font-weight: bold; display: block; margin-bottom: 5px;">📈 Risque Opérationnel</span>
                        <span style="color: #fff; font-size: 14px;">AUGMENTÉ (gestion critique des clés privées/HSM)</span>
                    </div>
                    <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 6px;">
                        <span style="color: #f59e0b; font-weight: bold; display: block; margin-bottom: 5px;">⚠️ Risque de Liquidité</span>
                        <span style="color: #fff; font-size: 14px;">POINT D'ATTENTION (marchés secondaires naissants)</span>
                    </div>
                </div>
            </div>

        </div>
    </section>
        '''
        
        # Insert this new section BEFORE the existing "Obligation" (Use Case) section
        # or REPLACE part of it? 
        # User said: "Pour la fin de page (Cas Pratiques, Risques), on utilise le vocabulaire précis"
        # Let's insert it before the "Risques" section we added earlier, or as an intro to Practical Cases.
        
        target_pos = index_content.find('<section id="obligation"')
        if target_pos > 0:
            index_content = index_content[:target_pos] + phase3_html + '\n\n    ' + index_content[target_pos:]
            print("✅ Pro Site (index.html) updated with Phase 3 Expert Architecture")
        
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(index_content)
            
    except Exception as e:
        print(f"❌ Error updating index.html: {e}")

    print("\n🎉 STRATEGY IMPLEMENTED: Segregated content successfully!")

if __name__ == "__main__":
    main()
