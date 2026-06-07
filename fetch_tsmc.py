import urllib.request
import ssl
import json
import time
import csv
from datetime import datetime

def fetch_tsmc_data():
    target_start = datetime(2026, 1, 1)
    target_end = datetime(2026, 6, 5)
    
    # Months to fetch: 2026-01 to 2026-06
    dates_to_query = [
        "20260101",
        "20260201",
        "20260301",
        "20260401",
        "20260501",
        "20260601"
    ]
    
    results = []
    ctx = ssl._create_unverified_context()
    
    for idx, date_str in enumerate(dates_to_query):
        url = f"https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date={date_str}&stockNo=2330"
        print(f"[{idx+1}/{len(dates_to_query)}] Fetching data for {date_str[:6]}... URL: {url}")
        
        try:
            req = urllib.request.Request(
                url, 
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            )
            with urllib.request.urlopen(req, context=ctx) as response:
                raw_data = response.read()
                data_json = json.loads(raw_data.decode('utf-8'))
                
                if data_json.get("stat") == "OK" and "data" in data_json:
                    monthly_data = data_json["data"]
                    # Columns: ["日期", "成交股數", "成交金額", "開盤價", "最高價", "最低價", "收盤價", "漲跌價差", "成交筆數"]
                    for row in monthly_data:
                        minguo_date = row[0] # e.g. "115/01/02"
                        parts = minguo_date.split('/')
                        if len(parts) == 3:
                            year = int(parts[0]) + 1911
                            month = int(parts[1])
                            day = int(parts[2])
                            current_date = datetime(year, month, day)
                            
                            if target_start <= current_date <= target_end:
                                closing_price = float(row[6].replace(',', ''))
                                date_formatted = current_date.strftime("%Y-%m-%d")
                                results.append((date_formatted, closing_price))
                else:
                    print(f"Warning: Failed to parse data for {date_str[:6]}. Stat: {data_json.get('stat')}")
        except Exception as e:
            print(f"Error fetching data for {date_str[:6]}: {e}")
            
        # Delay to avoid IP ban from TWSE
        if idx < len(dates_to_query) - 1:
            print("Waiting 3 seconds before next request...")
            time.sleep(3)
            
    # Sort results by date
    results.sort(key=lambda x: x[0])
    return results

def save_and_print(results):
    csv_file = "tsmc_prices_2026.csv"
    
    # Write to CSV
    with open(csv_file, mode='w', newline='', encoding='utf-8-sig') as f:
        writer = csv.writer(f)
        writer.writerow(["Date", "TSMC_Closing_Price"])
        for date, price in results:
            writer.writerow([date, price])
            
    print("\n" + "="*40)
    print(f"Data successfully fetched and saved to {csv_file}")
    print(f"Total Trading Days: {len(results)}")
    print("="*40)
    print("Date       | Closing Price")
    print("-" * 25)
    for date, price in results:
        print(f"{date} | {price:.2f}")
    print("="*40)

if __name__ == "__main__":
    data = fetch_tsmc_data()
    save_and_print(data)
