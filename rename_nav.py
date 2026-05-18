import os
import glob

def replace_in_files(dir_path):
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                # EN Replacements
                new_content = content.replace("Research Gateway", "Publications & Data")
                new_content = new_content.replace("Programmable Finance Architecture", "Market Infrastructure Observations")
                new_content = new_content.replace("Frameworks & Protocols", "Market Notes & Protocols")
                new_content = new_content.replace(">Frameworks<", ">Market Notes<")
                new_content = new_content.replace("Institute Frameworks", "Institute Notes")
                
                # FR Replacements
                new_content = new_content.replace("Portail de Recherche & d'Accès aux Données", "Publications & Données")
                # Add more French translations if needed
                
                if new_content != content:
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"Updated {path}")

replace_in_files("en")
replace_in_files("fr")
