import re

FR_FILE = "case-study-tokenized-bond.html"
EN_FILE = "en/case-study-tokenized-bond.html"

FR_TABLE = """
        <!-- METHODOLOGICAL TRANSPARENCY TABLE (PHASE 1) -->
        <h3 class="text-xl font-bold text-white mb-6 mt-10" data-aos="fade-up">Transparence Méthodologique de l'Étude de Cas</h3>
        <div class="sim-table-container mb-6" data-aos="fade-up">
            <table class="sim-table">
                <thead>
                    <tr>
                        <th class="w-1/4">Étape de Calcul</th>
                        <th class="w-3/4">Valeur & Explication</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong><i class="fas fa-sign-in-alt text-blue-400 mr-2"></i> Inputs (Données d'Entrée)</strong></td>
                        <td>Émission obligataire : <strong>500M€</strong> | Réseau : <strong>SWIAT</strong> (DLT Institutionnelle Permissionnée) | Type de Règlement : <strong>Wholesale CBDC</strong>.</td>
                    </tr>
                    <tr>
                        <td><strong><i class="fas fa-lightbulb text-purple-400 mr-2"></i> Hypothèses</strong></td>
                        <td>
                            <ul class="list-disc pl-5 mt-1 space-y-1 text-slate-300">
                                <li><strong>Basel III OpRisk Standard :</strong> Modèle interne d'allocation de capital.</li>
                                <li><strong>Proxy Loss Given Event (LGE) = 1.0 :</strong> Perte totale supposée en cas de défaillance réseau pour maximiser la prudence.</li>
                                <li><strong>Probability of Event (PoE) :</strong> <span class="text-orange-400">2.50%</span> sans gouvernance (Legacy) vs <span class="text-emerald-400">0.85%</span> avec audit continu et DCM Governance OS.</li>
                                <li><strong>Capital Multiplier :</strong> 5x selon les seuils d'exigence réglementaire prudentielle.</li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td><strong><i class="fas fa-calculator text-emerald-400 mr-2"></i> Calculs (Mathématiques)</strong></td>
                        <td class="val-mono text-sm text-slate-300">
                            Capital Charge = EAD × PoE × LGE × Multiplier<br/>
                            Legacy = 500M × 0.025 × 1.0 × 5 = <span class="text-orange-400">62.50M€</span><br/>
                            DCM = 500M × 0.0085 × 1.0 × 5 = <span class="text-emerald-400">21.25M€</span>
                        </td>
                    </tr>
                    <tr class="bg-blue-900/20 border-t border-blue-500/30">
                        <td><strong><i class="fas fa-flag-checkered text-white mr-2"></i> Output (Capital Impact)</strong></td>
                        <td><strong class="text-emerald-400">Libération Brute : +41.25M€</strong> (Réduction de l'allocation requise de 66%).<br/><span class="text-xs text-slate-400">Nécessite ensuite d'y soustraire la friction d'intégration (cf. section suivante).</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="mb-10 text-xs text-slate-500 border-l-2 border-slate-600 pl-4 py-1 italic" data-aos="fade-up">
            <strong>Disclaimer Méthodologique :</strong> Cette simulation de libération de capital (RWA Optimization) est fournie à titre illustratif pour l'évaluation empirique des gains liés au pilotage de l'infrastructure DLT. Les paramètres (EAD, PoE, Mult) doivent être validés de manière indépendante par les départements Model Risk Management (MRM) des institutions concernées et conformes aux lignes directrices ECB / Bâle III spécifiques au profil de la banque correspondante.
        </div>
"""

EN_TABLE = """
        <!-- METHODOLOGICAL TRANSPARENCY TABLE (PHASE 1) -->
        <h3 class="text-xl font-bold text-white mb-6 mt-10" data-aos="fade-up">Case Study Methodological Transparency</h3>
        <div class="sim-table-container mb-6" data-aos="fade-up">
            <table class="sim-table">
                <thead>
                    <tr>
                        <th class="w-1/4">Calculation step</th>
                        <th class="w-3/4">Value & Explanation</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong><i class="fas fa-sign-in-alt text-blue-400 mr-2"></i> Inputs</strong></td>
                        <td>Bond issuance: <strong>500M€</strong> | Network: <strong>SWIAT</strong> (Institutional Permissioned DLT) | Settlement Type: <strong>Wholesale CBDC</strong>.</td>
                    </tr>
                    <tr>
                        <td><strong><i class="fas fa-lightbulb text-purple-400 mr-2"></i> Assumptions</strong></td>
                        <td>
                            <ul class="list-disc pl-5 mt-1 space-y-1 text-slate-300">
                                <li><strong>Basel III OpRisk Standard:</strong> Internal capital allocation model.</li>
                                <li><strong>Proxy Loss Given Event (LGE) = 1.0:</strong> Assumed total loss in case of network failure to maximize prudence.</li>
                                <li><strong>Probability of Event (PoE):</strong> <span class="text-orange-400">2.50%</span> without governance (Legacy) vs <span class="text-emerald-400">0.85%</span> with continuous audit and DCM Governance OS.</li>
                                <li><strong>Capital Multiplier:</strong> 5x according to prudential regulatory requirement thresholds.</li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td><strong><i class="fas fa-calculator text-emerald-400 mr-2"></i> Calculations</strong></td>
                        <td class="val-mono text-sm text-slate-300">
                            Capital Charge = EAD × PoE × LGE × Multiplier<br/>
                            Legacy = 500M × 0.025 × 1.0 × 5 = <span class="text-orange-400">62.50M€</span><br/>
                            DCM = 500M × 0.0085 × 1.0 × 5 = <span class="text-emerald-400">21.25M€</span>
                        </td>
                    </tr>
                    <tr class="bg-blue-900/20 border-t border-blue-500/30">
                        <td><strong><i class="fas fa-flag-checkered text-white mr-2"></i> Output (Capital Impact)</strong></td>
                        <td><strong class="text-emerald-400">Gross Capital Release: +41.25M€</strong> (Required allocation reduced by 66%).<br/><span class="text-xs text-slate-400">Requires subsequent deduction of integration friction (see next section).</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="mb-10 text-xs text-slate-500 border-l-2 border-slate-600 pl-4 py-1 italic" data-aos="fade-up">
            <strong>Methodological Disclaimer:</strong> This capital release simulation (RWA Optimization) is provided for illustrative purposes for the empirical evaluation of gains related to DLT infrastructure monitoring. The parameters (EAD, PoE, Mult) must be independently validated by the Model Risk Management (MRM) departments of the concerned institutions and comply with ECB / Basel III guidelines specific to the corresponding bank's profile.
        </div>
"""

def insert_table(filename, table_html):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the insertion point: right after the math-block ends 
    # Look for: </div>\n        <!-- INTEGRATION COST (FRICTION) -->
    target = '</div>\n        <!-- INTEGRATION COST (FRICTION) -->'
    replacement = '</div>' + table_html + '        <!-- INTEGRATION COST (FRICTION) -->'
    
    if target in content:
        new_content = content.replace(target, replacement)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Table inserted successfully into {filename}")
    else:
        print(f"Could not find insertion point in {filename}")

if __name__ == "__main__":
    insert_table(FR_FILE, FR_TABLE)
    insert_table(EN_FILE, EN_TABLE)
