# TSMC Investor Dashboard (2026)

A premium, interactive web-based dashboard designed for TSMC (2330.TW) investors to analyze historical stock price trends, calculate moving averages (MA20), and review key financial reports and milestones.

---

## How It Works

The system operates in three main phases: **Data Fetching**, **Static Plotting**, and **Interactive Dashboard Serving**.

```mermaid
graph TD
    %% Phase 1: Data Acquisition
    subgraph Phase 1: Data Acquisition
        TWSE[Taiwan Stock Exchange API] -->|HTTPS Request| PyFetch[fetch_tsmc.py]
        PyFetch -->|Saves CSV| CSV[tsmc_prices_2026.csv]
    end

    %% Phase 2: Processing & Web Service
    subgraph Phase 2: Web Service & Calculations
        CSV -->|Read Data| PyPlot[plot_tsmc.py]
        PyPlot -->|Generates Chart Image| PNG[tsmc_ma20_chart.png]
        
        CSV -->|Auto-load Data| WebApp[index.html / app.js]
        Server[server.py] -->|Serves localhost:8000| WebApp
    end

    %% Phase 3: Client Rendering
    subgraph Phase 3: Interactive UI (Browser)
        WebApp -->|Frontend Calculation| MA20[Compute 20-Day Moving Average]
        WebApp -->|Data Metrics Engine| KPI[KPI Cards: High/Low/Return %]
        WebApp -->|ChartJS Engine| Chart[Interactive Line Chart]
        
        User((Investor / User)) -->|Upload Custom CSV| WebApp
        User -->|View Charts & Milestones| WebApp
    end

    style TWSE fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff
    style CSV fill:#1e3a8a,stroke:#3b82f6,stroke-width:2px,color:#fff
    style PNG fill:#b45309,stroke:#f59e0b,stroke-width:2px,color:#fff
    style WebApp fill:#065f46,stroke:#10b981,stroke-width:2px,color:#fff
```

### Component Interaction:
1. **`fetch_tsmc.py`**: Queries the official Taiwan Stock Exchange (TWSE) endpoint, handles Minguo-to-Western date conversions, filters range (2026/01/01 to 2026/06/05), and exports standard [tsmc_prices_2026.csv](tsmc_prices_2026.csv).
2. **`plot_tsmc.py`**: A python script that reads the CSV file to plot a high-resolution static chart (`tsmc_ma20_chart.png`) featuring the closing price and 20-day Moving Average (MA20).
3. **`server.py`**: Launches a local lightweight web server to serve the frontend assets without CORS limitations.
4. **`app.js` & `index.html`**: The interactive client interface. It parses the CSV file, calculates the 20-day moving average on-the-fly, updates summary cards (Max, Min, Return Rate), and draws an interactive line chart using Chart.js.

---

## Technical Highlights

- **Bypass Local CORS Limitations**: Supports automatic file fetching under a served environment, with a manual drag-and-drop CSV parser and embedded fallback static dataset for instant, standalone offline execution.
- **Client-Side Calculation Engine**: The 20-day moving average (MA20) is dynamically computed on the client side using a rolling mathematical window, ensuring zero lag.
- **Premium Dark-Mode Glassmorphism Design**: Developed with CSS grid layouts and glassmorphic aesthetics tailored for financial dashboards.
- **Data Integration**: Integrates TSMC's actual Q1 2026 and Q4 2025 financial reports (Revenue, Net Income, Margins, and EPS) alongside real-world expansion milestones (Taiwan 2nm N2, Arizona Fab, Kumamoto Fab).

---

## Step-by-Step Installation & Run Guide

Follow these instructions to set up the project on your computer from scratch.

### Step 1: Install Git & Python

#### Windows:
1. **Download Python**: Visit [python.org](https://www.python.org/downloads/) and download the latest installer. **CRITICAL: Check the box "Add Python to PATH" during installation.**
2. **Download Git**: Visit [git-scm.com](https://git-scm.com/download/win) and install Git with default options.

#### macOS:
Open your terminal and install via Xcode Command Line Tools:
```bash
xcode-select --install
```
(Alternatively, install Python from [python.org](https://www.python.org/downloads/)).

---

### Step 2: Download the Project

Open your Terminal (macOS) or PowerShell (Windows) and clone the repository:
```bash
git clone https://github.com/caryhp2-cell/TSMC.git
cd TSMC
```

---

### Step 3: Install Python Dependencies

Install the required visualization and analysis libraries (`pandas` and `matplotlib`):
```bash
pip install pandas matplotlib
```

---

### Step 4: Run the Application

#### 1. Fetch Latest Data (Optional - Pre-fetched data is included)
To query the Taiwan Stock Exchange and update the price database:
```bash
python fetch_tsmc.py
```

#### 2. Generate Static Chart
To update the static image visualization:
```bash
python plot_tsmc.py
```

#### 3. Start the Web Dashboard
Launch the local HTTP server to host the web application:
```bash
python server.py
```
Open your web browser and navigate to:
**[http://localhost:8000](http://localhost:8000)**

---

## File Structure

```text
TSMC/
├── .gitignore            # Git configuration file to exclude system files
├── README.md             # Project documentation and run guide (this file)
├── index.html            # Main HTML layout for the dashboard
├── style.css             # Custom CSS variables, glassmorphic layout styling
├── app.js                # Core JS logic: CSV parser, MA20 calculator, ChartJS rendering
├── fetch_tsmc.py         # Python crawler to download TSMC data from TWSE
├── plot_tsmc.py          # Python static graph generator using pandas & matplotlib
├── server.py             # Lightweight local HTTP server script
├── verify_dashboard.py   # Automated project check and verification script
├── tsmc_prices_2026.csv  # Extracted stock price data (Jan 2 - Jun 5, 2026)
└── tsmc_ma20_chart.png   # Generated static stock chart
```
