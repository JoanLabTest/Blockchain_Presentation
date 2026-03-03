import re

FR_FILE = "competitive-landscape.html"
EN_FILE = "en/competitive-landscape.html"

# NEW FR CONTENT FOR BENCHMARK TABLE
FR_NEW_TABLE = """<table
                class="w-full text-left border-collapse bg-slate-900/40 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
                <thead>
                    <tr class="bg-slate-800/80">
                        <th class="p-5 text-xs uppercase tracking-widest text-slate-400 font-bold border-b border-slate-700 w-1/4">Domaine d'Expertise</th>
                        <th class="p-5 text-xs uppercase tracking-widest text-slate-400 font-bold border-b border-slate-700 w-1/4">Outils Risk Legacy<br/><span class="text-[10px] font-normal opacity-70">Ex: IBM OpenPages, ServiceNow, Murex</span></th>
                        <th class="p-5 text-xs uppercase tracking-widest text-slate-400 font-bold border-b border-slate-700 w-1/4">Analytique & Compliance<br/><span class="text-[10px] font-normal opacity-70">Ex: Chainalysis, TRM Labs, Elliptic</span></th>
                        <th class="p-5 text-xs uppercase tracking-widest text-slate-100 font-bold border-b border-slate-700 w-1/4">DCM Digital<br/><span class="text-[10px] font-normal text-blue-400">Governance OS</span></th>
                    </tr>
                </thead>
                <tbody class="text-sm">
                    <tr class="border-b border-slate-800 hover:bg-slate-800/20">
                        <td class="p-5 text-slate-300 font-medium">Objectif Principal</td>
                        <td class="p-5 text-slate-500">Conformité Documentaire & Risque Statistique</td>
                        <td class="p-5 text-slate-500">Investigation on-chain (AML/KYT)</td>
                        <td class="p-5 text-blue-400 font-bold">Pilotage Prudentiel & Capital Management</td>
                    </tr>
                    <tr class="border-b border-slate-800 hover:bg-slate-800/20">
                        <td class="p-5 text-slate-300 font-medium">Profondeur Gouvernance DLT (DLT Governance Depth)</td>
                        <td class="p-5 text-slate-600 text-center"><i class="fas fa-times text-red-500/50 mr-2"></i> Aucune (Données Statiques)</td>
                        <td class="p-5 text-slate-600 text-center"><i class="fas fa-times text-red-500/50 mr-2"></i> Aucune (Transactionnel Uniquement)</td>
                        <td class="p-5 text-emerald-400 font-bold"><i class="fas fa-check-circle mr-2"></i> Native, Déterministe & Temps Réel</td>
                    </tr>
                    <tr class="border-b border-slate-800 hover:bg-slate-800/20">
                        <td class="p-5 text-slate-300 font-medium">Alignement Prudentiel (Board-Ready MRM)</td>
                        <td class="p-5 text-emerald-500/80 text-center"><i class="fas fa-check-circle mr-2"></i> Fort (Bâle III, SR 11-7)</td>
                        <td class="p-5 text-slate-600 text-center"><i class="fas fa-times text-red-500/50 mr-2"></i> Déconnecté</td>
                        <td class="p-5 text-emerald-400 font-bold"><i class="fas fa-check-circle mr-2"></i> Bridge DORA / MiCA / Bâle III</td>
                    </tr>
                </tbody>
            </table>"""

# NEW EN CONTENT FOR BENCHMARK TABLE
EN_NEW_TABLE = """<table
                class="w-full text-left border-collapse bg-slate-900/40 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
                <thead>
                    <tr class="bg-slate-800/80">
                        <th class="p-5 text-xs uppercase tracking-widest text-slate-400 font-bold border-b border-slate-700 w-1/4">Area of Expertise</th>
                        <th class="p-5 text-xs uppercase tracking-widest text-slate-400 font-bold border-b border-slate-700 w-1/4">Legacy Risk Tools<br/><span class="text-[10px] font-normal opacity-70">Ex: IBM OpenPages, ServiceNow, Murex</span></th>
                        <th class="p-5 text-xs uppercase tracking-widest text-slate-400 font-bold border-b border-slate-700 w-1/4">Analytics & Compliance<br/><span class="text-[10px] font-normal opacity-70">Ex: Chainalysis, TRM Labs, Elliptic</span></th>
                        <th class="p-5 text-xs uppercase tracking-widest text-slate-100 font-bold border-b border-slate-700 w-1/4">DCM Digital<br/><span class="text-[10px] font-normal text-blue-400">Governance OS</span></th>
                    </tr>
                </thead>
                <tbody class="text-sm">
                    <tr class="border-b border-slate-800 hover:bg-slate-800/20">
                        <td class="p-5 text-slate-300 font-medium">Primary Focus</td>
                        <td class="p-5 text-slate-500">Documentary Compliance & Statistical Risk</td>
                        <td class="p-5 text-slate-500">On-chain Investigation (AML/KYT)</td>
                        <td class="p-5 text-blue-400 font-bold">Prudential Steering & Capital Management</td>
                    </tr>
                    <tr class="border-b border-slate-800 hover:bg-slate-800/20">
                        <td class="p-5 text-slate-300 font-medium">DLT Governance Depth</td>
                        <td class="p-5 text-slate-600 text-center"><i class="fas fa-times text-red-500/50 mr-2"></i> None (Static Data)</td>
                        <td class="p-5 text-slate-600 text-center"><i class="fas fa-times text-red-500/50 mr-2"></i> None (Transactional Only)</td>
                        <td class="p-5 text-emerald-400 font-bold"><i class="fas fa-check-circle mr-2"></i> Native, Deterministic & Real-Time</td>
                    </tr>
                    <tr class="border-b border-slate-800 hover:bg-slate-800/20">
                        <td class="p-5 text-slate-300 font-medium">Prudential Alignment (Board-Ready MRM)</td>
                        <td class="p-5 text-emerald-500/80 text-center"><i class="fas fa-check-circle mr-2"></i> Strong (Basel III, SR 11-7)</td>
                        <td class="p-5 text-slate-600 text-center"><i class="fas fa-times text-red-500/50 mr-2"></i> Disconnected</td>
                        <td class="p-5 text-emerald-400 font-bold"><i class="fas fa-check-circle mr-2"></i> Bridge DORA / MiCA / Basel III</td>
                    </tr>
                </tbody>
            </table>"""

def update_file(filename, new_table):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex to match the entire existing table
    pattern = re.compile(r'<table\s+class="w-full text-left border-collapse bg-slate-900/40[^>]*>.*?</table>', re.DOTALL)
    
    if pattern.search(content):
        new_content = pattern.sub(new_table, content, count=1)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filename}")
    else:
        print(f"Could not find table in {filename}")

update_file(FR_FILE, FR_NEW_TABLE)
update_file(EN_FILE, EN_NEW_TABLE)
