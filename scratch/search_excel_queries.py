import openpyxl
import pandas as pd

excel_path = "/Users/joanl/Downloads/dcmcore.com-Performance-on-Search-2026-05-27.xlsx"

# Let's load the workbook using pandas
print("Loading excel file...")
xl = pd.ExcelFile(excel_path)

print("Sheets in file:", xl.sheet_names)

for sheet in xl.sheet_names:
    df = xl.parse(sheet)
    print(f"\n--- Sheet: {sheet} ---")
    print(df.head(2))
    
    # Check if there is any column with text queries
    # Let's search for "dlt" or "pilot" in the dataframe
    for col in df.columns:
        if df[col].dtype == 'object':
            # Check if any row contains 'dlt pilot'
            matches = df[df[col].astype(str).str.contains('dlt pilot|pilot regime', case=False, na=False)]
            if not matches.empty:
                print(f"Found matches in column '{col}':")
                print(matches)
