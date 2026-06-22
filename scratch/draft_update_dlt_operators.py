import os
import json
import re

def update_guides():
    json_path = "data/dlt-operators.json"
    en_guide_path = "en/research/eu-dlt-pilot-regime-guide.html"
    fr_guide_path = "fr/research/regime-pilote-dlt-guide-complet.html"
    
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found.")
        return
        
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    operators = data["operators"]
    
    # 1. Build English HTML table rows
    en_rows = []
    for op in operators:
        en_rows.append(f"""            <tr>
                <td><strong>{op['name']}</strong></td>
                <td>{op['type']}</td>
                <td>{op['jurisdiction']}</td>
                <td>{op['effective_date']}</td>
                <td>{op['exemptions']}</td>
            </tr>""")
            
    en_table_content = "\n".join(en_rows)
    en_table_html = f"""<!-- DLT_OPERATORS_TABLE_START -->
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Operator Name</th>
                <th>Infrastructure Type</th>
                <th>Jurisdiction (NCA)</th>
                <th>Effective Date</th>
                <th>Core Exemptions Granted</th>
            </tr>
        </thead>
        <tbody>
{en_table_content}
        </tbody>
    </table>
    <!-- DLT_OPERATORS_TABLE_END -->"""

    # 2. Build French HTML table rows
    fr_rows = []
    for op in operators:
        fr_rows.append(f"""            <tr>
                <td><strong>{op['name']}</strong></td>
                <td>{op['type_fr']}</td>
                <td>{op['jurisdiction_fr']}</td>
                <td>{op['effective_date_fr']}</td>
                <td>{op['exemptions_fr']}</td>
            </tr>""")
            
    fr_table_content = "\n".join(fr_rows)
    fr_table_html = f"""<!-- DLT_OPERATORS_TABLE_START -->
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Nom de l'opérateur</th>
                <th>Type d'infrastructure</th>
                <th>Juridiction (Autorité de tutelle)</th>
                <th>Date d'effet</th>
                <th>Dérogations majeures accordées</th>
            </tr>
        </thead>
        <tbody>
{fr_table_content}
        </tbody>
    </table>
    <!-- DLT_OPERATORS_TABLE_END -->"""

    # 3. Update English guide file if markers exist
    if os.path.exists(en_guide_path):
        with open(en_guide_path, "r", encoding="utf-8") as f:
            en_content = f.read()
            
        pattern = r"<!-- DLT_OPERATORS_TABLE_START -->.*?<!-- DLT_OPERATORS_TABLE_END -->"
        if re.search(pattern, en_content, re.DOTALL):
            new_content = re.sub(pattern, en_table_html, en_content, flags=re.DOTALL)
            with open(en_guide_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"✓ Successfully updated operators table in {en_guide_path}")
        else:
            print(f"Warning: Markers not found in {en_guide_path}. Table not updated.")
            
    # 4. Update French guide file if markers exist
    if os.path.exists(fr_guide_path):
        with open(fr_guide_path, "r", encoding="utf-8") as f:
            fr_content = f.read()
            
        pattern = r"<!-- DLT_OPERATORS_TABLE_START -->.*?<!-- DLT_OPERATORS_TABLE_END -->"
        if re.search(pattern, fr_content, re.DOTALL):
            new_content = re.sub(pattern, fr_table_html, fr_content, flags=re.DOTALL)
            with open(fr_guide_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"✓ Successfully updated operators table in {fr_guide_path}")
        else:
            print(f"Warning: Markers not found in {fr_guide_path}. Table not updated.")

if __name__ == "__main__":
    update_guides()
