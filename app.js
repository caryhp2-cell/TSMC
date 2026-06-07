// TSMC Investor Dashboard Application Logic

let rawStockData = [];
let chartInstance = null;

// Fallback embedded data (so the app works instantly without local server CORS issues)
const fallbackData = [
    {"date":"2026-01-02","price":1585.0},{"date":"2026-01-05","price":1670.0},{"date":"2026-01-06","price":1705.0},{"date":"2026-01-07","price":1675.0},{"date":"2026-01-08","price":1685.0},{"date":"2026-01-09","price":1680.0},{"date":"2026-01-12","price":1690.0},{"date":"2026-01-13","price":1710.0},{"date":"2026-01-14","price":1710.0},{"date":"2026-01-15","price":1690.0},{"date":"2026-01-16","price":1740.0},{"date":"2026-01-19","price":1760.0},{"date":"2026-01-20","price":1775.0},{"date":"2026-01-21","price":1740.0},{"date":"2026-01-22","price":1760.0},{"date":"2026-01-23","price":1770.0},{"date":"2026-01-26","price":1755.0},{"date":"2026-01-27","price":1780.0},{"date":"2026-01-28","price":1820.0},{"date":"2026-01-29","price":1805.0},{"date":"2026-01-30","price":1775.0},{"date":"2026-02-02","price":1765.0},{"date":"2026-02-03","price":1800.0},{"date":"2026-02-04","price":1785.0},{"date":"2026-02-05","price":1765.0},{"date":"2026-02-06","price":1780.0},{"date":"2026-02-09","price":1815.0},{"date":"2026-02-10","price":1880.0},{"date":"2026-02-11","price":1915.0},{"date":"2026-02-23","price":1900.0},{"date":"2026-02-24","price":1965.0},{"date":"2026-02-25","price":2015.0},{"date":"2026-02-26","price":1995.0},{"date":"2026-03-02","price":1975.0},{"date":"2026-03-03","price":1935.0},{"date":"2026-03-04","price":1865.0},{"date":"2026-03-05","price":1900.0},{"date":"2026-03-06","price":1890.0},{"date":"2026-03-09","price":1810.0},{"date":"2026-03-10","price":1850.0},{"date":"2026-03-11","price":1940.0},{"date":"2026-03-12","price":1885.0},{"date":"2026-03-13","price":1865.0},{"date":"2026-03-16","price":1845.0},{"date":"2026-03-17","price":1870.0},{"date":"2026-03-18","price":1905.0},{"date":"2026-03-19","price":1850.0},{"date":"2026-03-20","price":1840.0},{"date":"2026-03-23","price":1810.0},{"date":"2026-03-24","price":1810.0},{"date":"2026-03-25","price":1845.0},{"date":"2026-03-26","price":1840.0},{"date":"2026-03-27","price":1820.0},{"date":"2026-03-30","price":1780.0},{"date":"2026-03-31","price":1760.0},{"date":"2026-04-01","price":1855.0},{"date":"2026-04-02","price":1810.0},{"date":"2026-04-07","price":1860.0},{"date":"2026-04-08","price":1950.0},{"date":"2026-04-09","price":1955.0},{"date":"2026-04-10","price":2000.0},{"date":"2026-04-13","price":1990.0},{"date":"2026-04-14","price":2055.0},{"date":"2026-04-15","price":2080.0},{"date":"2026-04-16","price":2085.0},{"date":"2026-04-17","price":2030.0},{"date":"2026-04-20","price":2025.0},{"date":"2026-04-21","price":2050.0},{"date":"2026-04-22","price":2050.0},{"date":"2026-04-23","price":2080.0},{"date":"2026-04-24","price":2185.0},{"date":"2026-04-27","price":2265.0},{"date":"2026-04-28","price":2215.0},{"date":"2026-04-29","price":2180.0},{"date":"2026-04-30","price":2135.0},{"date":"2026-05-04","price":2275.0},{"date":"2026-05-05","price":2250.0},{"date":"2026-05-06","price":2250.0},{"date":"2026-05-07","price":2310.0},{"date":"2026-05-08","price":2290.0},{"date":"2026-05-11","price":2235.0},{"date":"2026-05-12","price":2255.0},{"date":"2026-05-13","price":2220.0},{"date":"2026-05-14","price":2270.0},{"date":"2026-05-15","price":2265.0},{"date":"2026-05-18","price":2240.0},{"date":"2026-05-19","price":2205.0},{"date":"2026-05-20","price":2185.0},{"date":"2026-05-21","price":2230.0},{"date":"2026-05-22","price":2255.0},{"date":"2026-05-25","price":2310.0},{"date":"2026-05-26","price":2270.0},{"date":"2026-05-27","price":2300.0},{"date":"2026-05-28","price":2295.0},{"date":"2026-05-29","price":2355.0},{"date":"2026-06-01","price":2355.0},{"date":"2026-06-02","price":2380.0},{"date":"2026-06-03","price":2425.0},{"date":"2026-06-04","price":2385.0},{"date":"2026-06-05","price":2365.0}
];

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// App Initialization
async function initApp() {
    setupEventListeners();
    await loadInitialData();
}

// Set up UI listeners
function setupEventListeners() {
    const fileInput = document.getElementById('csvFileInput');
    fileInput.addEventListener('change', handleFileSelect);
}

// Load default local CSV file, fallback to embedded data on failure (e.g. CORS)
async function loadInitialData() {
    const indicator = document.getElementById('statusIndicator');
    try {
        const response = await fetch('./tsmc_prices_2026.csv');
        if (!response.ok) throw new Error('Fetch failed');
        const text = await response.text();
        processCSVText(text);
        indicator.innerHTML = '<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:var(--color-green);"></span> Auto-loaded local CSV';
    } catch (e) {
        console.warn("Could not auto-load CSV file (likely CORS or file missing). Using preloaded historical data.", e);
        rawStockData = fallbackData;
        processCalculationsAndRender();
        indicator.innerHTML = '<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:var(--color-orange);"></span> Loaded Pre-baked Data (Fallback)';
    }
}

// Parse input file
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        processCSVText(text);
        
        const indicator = document.getElementById('statusIndicator');
        indicator.innerHTML = '<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:var(--color-green);"></span> Uploaded: ' + file.name;
    };
    reader.readAsText(file);
}

// Parse raw CSV string
function processCSVText(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return;

    const parsedData = [];
    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols.length >= 2) {
            const date = cols[0].trim();
            const price = parseFloat(cols[1]);
            if (date && !isNaN(price)) {
                parsedData.push({ date, price });
            }
        }
    }
    
    // Sort chronological
    parsedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    rawStockData = parsedData;
    
    processCalculationsAndRender();
}

// Perform calculations and trigger renders
function processCalculationsAndRender() {
    if (rawStockData.length === 0) return;

    // Calculate MA20
    for (let i = 0; i < rawStockData.length; i++) {
        if (i < 19) {
            rawStockData[i].ma20 = null;
        } else {
            let sum = 0;
            for (let j = i - 19; j <= i; j++) {
                sum += rawStockData[j].price;
            }
            rawStockData[i].ma20 = parseFloat((sum / 20).toFixed(2));
        }
    }

    renderMetrics();
    renderChart();
}

// Render KPI Summary metrics
function renderMetrics() {
    const prices = rawStockData.map(d => d.price);
    const maxVal = Math.max(...prices);
    const minVal = Math.min(...prices);
    const avgVal = prices.reduce((a, b) => a + b, 0) / prices.length;
    const latest = rawStockData[rawStockData.length - 1];
    const initial = rawStockData[0];
    
    const returnRate = ((latest.price - initial.price) / initial.price) * 100;

    // UI Updates
    document.getElementById('valLatest').textContent = `NT$ ${latest.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('subLatest').textContent = `As of ${latest.date}`;
    
    document.getElementById('valHigh').textContent = `NT$ ${maxVal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('valLow').textContent = `NT$ ${minVal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('valAvg').textContent = `NT$ ${avgVal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    
    const returnEl = document.getElementById('valReturn');
    returnEl.textContent = `${returnRate >= 0 ? '+' : ''}${returnRate.toFixed(2)}%`;
    returnEl.className = `card-value ${returnRate >= 0 ? 'text-positive' : 'text-negative'}`;
    document.getElementById('subReturn').textContent = `From ${initial.date} to ${latest.date}`;
}

// Render Interactive Chart.js
function renderChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    const labels = rawStockData.map(d => d.date);
    const prices = rawStockData.map(d => d.price);
    const ma20s = rawStockData.map(d => d.ma20);

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'TSMC Closing Price',
                    data: prices,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    pointRadius: 1.5,
                    fill: true
                },
                {
                    label: 'MA20 (20-Day Moving Average)',
                    data: ma20s,
                    borderColor: '#f59e0b',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.1,
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#9aa5b1'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#9aa5b1'
                    }
                }
            }
        }
    });
}
