import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

def generate_chart():
    # 1. Load data
    csv_file = "tsmc_prices_2026.csv"
    df = pd.read_csv(csv_file)
    
    # Convert date and sort
    df['Date'] = pd.to_datetime(df['Date'])
    df = df.sort_values('Date').reset_index(drop=True)
    
    # 2. Calculate MA20 (20-day Moving Average)
    df['MA20'] = df['TSMC_Closing_Price'].rolling(window=20).mean()
    
    # 3. Setup Plot Styles
    plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
    fig, ax = plt.subplots(figsize=(12, 6), dpi=150)
    
    # Colors
    color_close = '#0070c0' # Premium Blue
    color_ma20 = '#ff9900'  # Warm Orange/Amber
    
    # Plotting Lines
    ax.plot(df['Date'], df['TSMC_Closing_Price'], label='TSMC Closing Price', color=color_close, linewidth=2)
    ax.plot(df['Date'], df['MA20'], label='MA20 (20-Day Moving Average)', color=color_ma20, linewidth=1.8, linestyle='--')
    
    # Styling Title & Labels
    ax.set_title('TSMC (2330) Price Trend with MA20 (2026/01 - 2026/06)', fontsize=14, fontweight='bold', pad=15)
    ax.set_xlabel('Date', fontsize=11, labelpad=10)
    ax.set_ylabel('Price (TWD)', fontsize=11, labelpad=10)
    
    # X-axis format (monthly ticks)
    ax.xaxis.set_major_locator(mdates.MonthLocator())
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m'))
    fig.autofmt_xdate() # Auto-rotate date labels
    
    # Legend
    ax.legend(loc='upper left', frameon=True, facecolor='white', edgecolor='lightgray', fontsize=10)
    
    # Grid customization
    ax.grid(True, linestyle=':', alpha=0.6, color='gray')
    
    # Layout adjustment
    plt.tight_layout()
    
    # Save Image
    output_img = "tsmc_ma20_chart.png"
    plt.savefig(output_img, dpi=300)
    print(f"Chart successfully generated and saved to {output_img}")

if __name__ == "__main__":
    generate_chart()
