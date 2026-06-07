import os
import csv
import sys

def verify():
    workspace = os.path.dirname(os.path.abspath(__file__))
    files_to_check = [
        "index.html",
        "style.css",
        "app.js",
        "server.py",
        "tsmc_prices_2026.csv"
    ]
    
    print("=== TSMC Investor Dashboard Integrity Check (Revision 1) ===")
    all_ok = True
    
    # 1. File existence checks
    for f in files_to_check:
        full_path = os.path.join(workspace, f)
        if os.path.exists(full_path):
            print(f"[OK] File exists: {f}")
        else:
            print(f"[FAIL] Missing file: {f}")
            all_ok = False
            
    # 2. Check HTML structure for key elements
    html_path = os.path.join(workspace, "index.html")
    if os.path.exists(html_path):
        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()
            required_terms = [
                'id="priceChart"',
                'id="csvFileInput"',
                'src="app.js"',
                'href="style.css"',
                'https://cdn.jsdelivr.net/npm/chart.js',
                'Important Financial Reports',
                'Key Milestones'
            ]
            for term in required_terms:
                if term in content:
                    print(f"[OK] index.html contains requirement: {term}")
                else:
                    print(f"[FAIL] index.html missing requirement: {term}")
                    all_ok = False
            
            # Make sure the old historical data table body is gone
            if 'id="tableBody"' in content:
                print("[FAIL] index.html still contains old tableBody element")
                all_ok = False
            else:
                print("[OK] index.html successfully removed old transaction tableBody element")

    # 3. Check CSV integrity
    csv_path = os.path.join(workspace, "tsmc_prices_2026.csv")
    if os.path.exists(csv_path):
        try:
            with open(csv_path, 'r', encoding='utf-8-sig') as f:
                reader = csv.reader(f)
                header = next(reader)
                if header == ["Date", "TSMC_Closing_Price"]:
                    print("[OK] CSV header is correct")
                else:
                    print(f"[FAIL] Unexpected CSV header: {header}")
                    all_ok = False
                
                row_count = sum(1 for row in reader)
                if row_count == 100:
                    print(f"[OK] CSV contains exactly 100 trading days")
                else:
                    print(f"[FAIL] Expected 100 rows in CSV, found {row_count}")
                    all_ok = False
        except Exception as e:
            print(f"[FAIL] Error reading CSV: {e}")
            all_ok = False
            
    if all_ok:
        print("\n>>> ALL CHECKS PASSED SUCCESSFULLY! <<<")
        sys.exit(0)
    else:
        print("\n>>> CHECK FAILED. Please review the errors above. <<<")
        sys.exit(1)

if __name__ == "__main__":
    verify()
