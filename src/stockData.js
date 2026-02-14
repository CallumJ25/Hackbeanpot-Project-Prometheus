// Historical stock data - First trading day prices (split-adjusted)
// Years: 2020-2025 | ~20 stocks per category
// Metrics: priceStart, priceNow, marketCap, pe, beta, dividendYield

const createYearData = (stocks, yearPrices, yearMetrics) => {
  return stocks.map((stock, i) => ({
    ...stock,
    priceStart: yearPrices[i],
    ...yearMetrics[i]
  }));
};

// Current prices as of Feb 2026
const CURRENT_PRICES = {
  // Tech
  AAPL: 261, MSFT: 401, GOOGL: 185, AMZN: 228, META: 680, NVDA: 185, TSLA: 415,
  ADBE: 485, CRM: 342, INTC: 22, AMD: 118, ORCL: 175, IBM: 258, CSCO: 63,
  QCOM: 175, TXN: 195, AVGO: 238, NOW: 1050, INTU: 635, AMAT: 185,
  // Healthcare
  JNJ: 158, UNH: 520, PFE: 26, ABBV: 195, MRK: 98, TMO: 585, LLY: 875,
  ABT: 125, BMY: 58, AMGN: 295, GILD: 115, CVS: 65, ISRG: 585, VRTX: 465,
  MDT: 85, CI: 335, DHR: 255, ZTS: 175, SYK: 395, HUM: 285,
  // Finance
  JPM: 275, BAC: 47, WFC: 78, GS: 625, MS: 135, C: 82, V: 340, MA: 565,
  AXP: 295, BLK: 1025, SCHW: 82, CB: 295, MMC: 225, PNC: 210, USB: 52,
  TFC: 48, COF: 195, ICE: 165, CME: 235, AON: 385,
  // Energy
  XOM: 108, CVX: 148, COP: 102, SLB: 42, EOG: 128, OXY: 48, PSX: 135,
  MPC: 155, VLO: 138, HAL: 32, WMB: 58, KMI: 28, OKE: 105, DVN: 42,
  FANG: 165, BKR: 42, HES: 145, TRGP: 198, MRO: 28, EPD: 32,
  // Consumer
  WMT: 92, HD: 405, COST: 985, PG: 168, KO: 63, PEP: 148, NKE: 72,
  MCD: 295, SBUX: 118, TGT: 125, LOW: 262, TJX: 125, CMG: 58, BKNG: 5150,
  ORLY: 1285, ROST: 155, DG: 82, DLTR: 68, YUM: 145, MAR: 285,
  // Industrial
  CAT: 365, HON: 216, UPS: 128, BA: 176, GE: 185, RTX: 128, DE: 425,
  LMT: 475, UNP: 245, MMM: 136, EMR: 128, ITW: 268, ETN: 345, PH: 685,
  GD: 285, NSC: 258, CSX: 38, PCAR: 118, WM: 225, FDX: 285
};

// Tech stocks base info
const techStocks = [
  { ticker: 'AAPL', name: 'Apple Inc.' },
  { ticker: 'MSFT', name: 'Microsoft' },
  { ticker: 'GOOGL', name: 'Alphabet' },
  { ticker: 'AMZN', name: 'Amazon' },
  { ticker: 'META', name: 'Meta Platforms' },
  { ticker: 'NVDA', name: 'NVIDIA' },
  { ticker: 'TSLA', name: 'Tesla' },
  { ticker: 'ADBE', name: 'Adobe' },
  { ticker: 'CRM', name: 'Salesforce' },
  { ticker: 'INTC', name: 'Intel' },
  { ticker: 'AMD', name: 'AMD' },
  { ticker: 'ORCL', name: 'Oracle' },
  { ticker: 'IBM', name: 'IBM' },
  { ticker: 'CSCO', name: 'Cisco Systems' },
  { ticker: 'QCOM', name: 'Qualcomm' },
  { ticker: 'TXN', name: 'Texas Instruments' },
  { ticker: 'AVGO', name: 'Broadcom' },
  { ticker: 'NOW', name: 'ServiceNow' },
  { ticker: 'INTU', name: 'Intuit' },
  { ticker: 'AMAT', name: 'Applied Materials' },
];

// Healthcare stocks base info
const healthcareStocks = [
  { ticker: 'JNJ', name: 'Johnson & Johnson' },
  { ticker: 'UNH', name: 'UnitedHealth' },
  { ticker: 'PFE', name: 'Pfizer' },
  { ticker: 'ABBV', name: 'AbbVie' },
  { ticker: 'MRK', name: 'Merck' },
  { ticker: 'TMO', name: 'Thermo Fisher' },
  { ticker: 'LLY', name: 'Eli Lilly' },
  { ticker: 'ABT', name: 'Abbott Labs' },
  { ticker: 'BMY', name: 'Bristol-Myers' },
  { ticker: 'AMGN', name: 'Amgen' },
  { ticker: 'GILD', name: 'Gilead Sciences' },
  { ticker: 'CVS', name: 'CVS Health' },
  { ticker: 'ISRG', name: 'Intuitive Surgical' },
  { ticker: 'VRTX', name: 'Vertex Pharma' },
  { ticker: 'MDT', name: 'Medtronic' },
  { ticker: 'CI', name: 'Cigna' },
  { ticker: 'DHR', name: 'Danaher' },
  { ticker: 'ZTS', name: 'Zoetis' },
  { ticker: 'SYK', name: 'Stryker' },
  { ticker: 'HUM', name: 'Humana' },
];

// Finance stocks base info
const financeStocks = [
  { ticker: 'JPM', name: 'JPMorgan Chase' },
  { ticker: 'BAC', name: 'Bank of America' },
  { ticker: 'WFC', name: 'Wells Fargo' },
  { ticker: 'GS', name: 'Goldman Sachs' },
  { ticker: 'MS', name: 'Morgan Stanley' },
  { ticker: 'C', name: 'Citigroup' },
  { ticker: 'V', name: 'Visa Inc.' },
  { ticker: 'MA', name: 'Mastercard' },
  { ticker: 'AXP', name: 'American Express' },
  { ticker: 'BLK', name: 'BlackRock' },
  { ticker: 'SCHW', name: 'Charles Schwab' },
  { ticker: 'CB', name: 'Chubb Ltd' },
  { ticker: 'MMC', name: 'Marsh McLennan' },
  { ticker: 'PNC', name: 'PNC Financial' },
  { ticker: 'USB', name: 'U.S. Bancorp' },
  { ticker: 'TFC', name: 'Truist Financial' },
  { ticker: 'COF', name: 'Capital One' },
  { ticker: 'ICE', name: 'Intercontinental Exchange' },
  { ticker: 'CME', name: 'CME Group' },
  { ticker: 'AON', name: 'Aon plc' },
];

// Energy stocks base info
const energyStocks = [
  { ticker: 'XOM', name: 'Exxon Mobil' },
  { ticker: 'CVX', name: 'Chevron' },
  { ticker: 'COP', name: 'ConocoPhillips' },
  { ticker: 'SLB', name: 'Schlumberger' },
  { ticker: 'EOG', name: 'EOG Resources' },
  { ticker: 'OXY', name: 'Occidental' },
  { ticker: 'PSX', name: 'Phillips 66' },
  { ticker: 'MPC', name: 'Marathon Petroleum' },
  { ticker: 'VLO', name: 'Valero Energy' },
  { ticker: 'HAL', name: 'Halliburton' },
  { ticker: 'WMB', name: 'Williams Companies' },
  { ticker: 'KMI', name: 'Kinder Morgan' },
  { ticker: 'OKE', name: 'ONEOK' },
  { ticker: 'DVN', name: 'Devon Energy' },
  { ticker: 'FANG', name: 'Diamondback Energy' },
  { ticker: 'BKR', name: 'Baker Hughes' },
  { ticker: 'HES', name: 'Hess Corporation' },
  { ticker: 'TRGP', name: 'Targa Resources' },
  { ticker: 'MRO', name: 'Marathon Oil' },
  { ticker: 'EPD', name: 'Enterprise Products' },
];

// Consumer stocks base info
const consumerStocks = [
  { ticker: 'WMT', name: 'Walmart' },
  { ticker: 'HD', name: 'Home Depot' },
  { ticker: 'COST', name: 'Costco' },
  { ticker: 'PG', name: 'Procter & Gamble' },
  { ticker: 'KO', name: 'Coca-Cola' },
  { ticker: 'PEP', name: 'PepsiCo' },
  { ticker: 'NKE', name: 'Nike Inc.' },
  { ticker: 'MCD', name: "McDonald's" },
  { ticker: 'SBUX', name: 'Starbucks' },
  { ticker: 'TGT', name: 'Target' },
  { ticker: 'LOW', name: "Lowe's" },
  { ticker: 'TJX', name: 'TJX Companies' },
  { ticker: 'CMG', name: 'Chipotle' },
  { ticker: 'BKNG', name: 'Booking Holdings' },
  { ticker: 'ORLY', name: "O'Reilly Auto" },
  { ticker: 'ROST', name: 'Ross Stores' },
  { ticker: 'DG', name: 'Dollar General' },
  { ticker: 'DLTR', name: 'Dollar Tree' },
  { ticker: 'YUM', name: 'Yum! Brands' },
  { ticker: 'MAR', name: 'Marriott' },
];

// Industrial stocks base info
const industrialStocks = [
  { ticker: 'CAT', name: 'Caterpillar' },
  { ticker: 'HON', name: 'Honeywell' },
  { ticker: 'UPS', name: 'UPS' },
  { ticker: 'BA', name: 'Boeing' },
  { ticker: 'GE', name: 'GE Aerospace' },
  { ticker: 'RTX', name: 'RTX Corporation' },
  { ticker: 'DE', name: 'Deere & Company' },
  { ticker: 'LMT', name: 'Lockheed Martin' },
  { ticker: 'UNP', name: 'Union Pacific' },
  { ticker: 'MMM', name: '3M Company' },
  { ticker: 'EMR', name: 'Emerson Electric' },
  { ticker: 'ITW', name: 'Illinois Tool Works' },
  { ticker: 'ETN', name: 'Eaton Corp' },
  { ticker: 'PH', name: 'Parker Hannifin' },
  { ticker: 'GD', name: 'General Dynamics' },
  { ticker: 'NSC', name: 'Norfolk Southern' },
  { ticker: 'CSX', name: 'CSX Corp' },
  { ticker: 'PCAR', name: 'PACCAR' },
  { ticker: 'WM', name: 'Waste Management' },
  { ticker: 'FDX', name: 'FedEx' },
];

// Historical price data by year (first trading day, split-adjusted)
const techPrices = {
  2020: [74.06, 158.78, 68.37, 93.75, 206.75, 5.93, 28.30, 329.81, 162.84, 59.62, 45.86, 53.01, 134.04, 47.61, 88.08, 128.29, 78.82, 282.35, 261.74, 61.18],
  2021: [132.69, 222.42, 86.77, 162.85, 273.16, 13.06, 243.26, 500.12, 222.53, 49.82, 91.71, 64.95, 125.88, 44.82, 152.03, 164.21, 109.15, 553.05, 379.45, 86.27],
  2022: [177.57, 334.75, 144.41, 166.72, 336.35, 29.42, 352.26, 566.09, 253.22, 51.50, 143.90, 87.33, 133.66, 63.37, 182.58, 194.17, 165.92, 643.36, 641.76, 157.36],
  2023: [130.28, 243.08, 89.58, 84.00, 124.74, 14.63, 108.10, 336.61, 132.59, 26.43, 64.77, 81.82, 140.89, 47.64, 110.18, 165.22, 139.99, 389.55, 389.47, 109.36],
  2024: [185.64, 374.58, 140.93, 151.94, 353.96, 48.17, 248.42, 596.92, 263.14, 50.25, 147.41, 105.32, 163.55, 50.48, 144.98, 169.86, 111.80, 706.20, 626.30, 158.33],
  2025: [243.85, 421.50, 192.50, 220.75, 598.50, 138.25, 410.44, 448.39, 343.18, 20.18, 119.72, 167.25, 220.68, 58.92, 157.81, 197.50, 224.55, 1084.50, 622.44, 175.81],
};

const healthcarePrices = {
  2020: [145.87, 293.65, 38.95, 88.54, 90.95, 324.35, 131.12, 86.85, 64.19, 241.03, 64.95, 74.29, 590.50, 218.65, 113.56, 204.42, 153.44, 132.35, 209.88, 365.42],
  2021: [154.85, 350.91, 36.81, 107.33, 81.80, 464.95, 168.35, 109.47, 62.05, 229.92, 58.33, 68.45, 818.88, 236.42, 117.14, 208.92, 222.68, 166.30, 244.53, 410.85],
  2022: [171.56, 502.14, 59.05, 135.45, 76.64, 667.24, 276.03, 140.97, 62.33, 225.06, 72.65, 103.17, 364.27, 219.92, 103.63, 228.92, 329.01, 243.92, 268.40, 463.84],
  2023: [176.65, 529.75, 51.24, 161.50, 110.95, 551.07, 365.20, 109.94, 71.92, 262.64, 85.75, 93.20, 266.64, 289.01, 77.77, 331.47, 265.31, 146.58, 244.65, 512.77],
  2024: [156.74, 527.70, 28.79, 154.38, 108.22, 530.85, 582.85, 110.02, 51.37, 288.02, 81.15, 79.07, 337.87, 407.00, 82.38, 300.02, 231.67, 197.24, 299.43, 453.00],
  2025: [144.50, 515.25, 26.50, 178.20, 99.85, 545.50, 785.25, 118.50, 55.80, 282.75, 92.50, 52.25, 528.50, 438.75, 88.50, 298.50, 248.75, 168.50, 368.50, 268.75],
};

const financePrices = {
  2020: [139.40, 35.22, 53.80, 229.93, 51.02, 79.89, 188.70, 298.59, 124.49, 502.70, 47.80, 155.68, 111.02, 160.36, 59.36, 56.37, 102.72, 92.58, 200.92, 208.12],
  2021: [127.07, 30.31, 30.19, 263.71, 68.53, 61.63, 218.73, 356.94, 120.50, 721.54, 52.98, 153.94, 117.01, 148.02, 46.92, 47.84, 99.47, 115.36, 181.87, 211.25],
  2022: [158.35, 44.58, 47.91, 383.47, 98.04, 60.25, 216.71, 359.00, 163.60, 913.98, 84.03, 193.30, 173.87, 200.92, 56.04, 58.48, 145.20, 136.78, 229.04, 300.35],
  2023: [134.10, 33.13, 41.27, 343.38, 85.15, 45.32, 207.88, 347.25, 147.88, 714.77, 83.20, 220.67, 165.58, 158.72, 43.48, 43.18, 93.29, 102.67, 167.85, 300.17],
  2024: [170.10, 33.67, 49.31, 385.52, 92.84, 51.32, 260.35, 426.51, 187.44, 816.22, 68.83, 226.05, 189.91, 150.19, 43.08, 36.87, 131.04, 128.07, 210.55, 297.54],
  2025: [242.50, 44.25, 73.50, 568.75, 125.50, 70.25, 318.50, 528.75, 278.50, 1008.25, 74.50, 282.75, 212.50, 195.75, 50.25, 45.75, 182.50, 158.75, 228.50, 372.50],
};

const energyPrices = {
  2020: [69.78, 120.51, 65.13, 40.08, 84.09, 41.15, 111.12, 60.09, 93.68, 24.59, 23.77, 21.15, 75.42, 26.08, 93.35, 25.68, 66.39, 41.35, 13.11, 24.82],
  2021: [41.50, 84.45, 39.78, 21.93, 47.78, 17.84, 68.89, 40.52, 56.15, 19.02, 20.84, 14.09, 40.02, 15.76, 48.94, 21.15, 51.00, 27.10, 6.51, 18.95],
  2022: [61.17, 117.35, 72.30, 29.94, 88.90, 29.34, 72.59, 64.16, 75.08, 22.90, 26.14, 15.87, 59.75, 44.59, 112.24, 24.20, 78.44, 52.35, 16.39, 22.65],
  2023: [110.30, 179.49, 118.13, 53.47, 129.73, 63.00, 104.67, 116.88, 128.65, 39.49, 33.18, 18.17, 65.18, 61.53, 137.62, 29.50, 142.49, 73.27, 27.09, 24.85],
  2024: [99.72, 149.47, 116.04, 52.14, 120.64, 59.15, 133.98, 149.36, 129.55, 36.11, 35.50, 17.60, 70.75, 45.31, 155.47, 34.05, 148.85, 86.85, 25.60, 27.22],
  2025: [105.50, 142.75, 98.50, 40.75, 125.50, 46.25, 128.50, 148.75, 132.50, 30.25, 55.50, 26.75, 98.50, 38.50, 158.75, 40.25, 142.50, 185.50, 26.75, 30.50],
};

const consumerPrices = {
  2020: [118.94, 218.69, 293.92, 124.90, 55.35, 136.67, 101.31, 197.61, 88.21, 128.64, 119.85, 61.12, 836.54, 2058.14, 438.91, 116.48, 157.41, 93.73, 100.70, 150.17],
  2021: [144.15, 265.62, 376.78, 139.14, 54.84, 148.30, 141.47, 214.58, 107.02, 176.48, 160.91, 68.38, 1383.74, 2227.27, 452.46, 122.68, 210.93, 108.18, 108.42, 122.30],
  2022: [144.69, 414.75, 567.76, 163.58, 59.21, 173.46, 166.67, 267.84, 116.97, 231.25, 257.99, 75.85, 1745.99, 2400.45, 706.96, 114.71, 236.11, 140.79, 138.57, 164.72],
  2023: [141.69, 315.45, 456.94, 151.56, 63.61, 180.68, 117.01, 264.12, 99.47, 148.33, 199.34, 79.45, 1382.59, 2017.63, 844.85, 116.35, 247.07, 141.66, 128.28, 149.48],
  2024: [156.74, 346.29, 658.38, 146.89, 58.92, 169.63, 107.43, 295.69, 94.79, 142.50, 224.75, 95.88, 2292.27, 3548.50, 955.61, 138.18, 135.05, 143.21, 130.75, 211.38],
  2025: [91.50, 385.50, 925.50, 162.50, 62.50, 145.50, 75.50, 285.50, 112.50, 118.50, 255.50, 118.50, 55.75, 4850.50, 1225.50, 148.50, 78.50, 65.50, 138.50, 265.50],
};

const industrialPrices = {
  2020: [147.90, 177.74, 116.79, 325.76, 11.16, 94.05, 173.26, 413.21, 181.20, 176.42, 76.54, 180.18, 92.71, 207.11, 176.94, 193.53, 72.25, 78.99, 113.60, 150.30],
  2021: [182.02, 212.54, 168.38, 214.06, 10.79, 71.47, 268.49, 354.98, 208.58, 175.47, 82.08, 204.71, 124.24, 285.42, 149.61, 238.35, 90.69, 88.56, 116.48, 259.69],
  2022: [206.08, 236.44, 214.08, 201.27, 94.00, 86.22, 343.15, 355.55, 251.93, 177.63, 93.21, 246.60, 171.73, 317.25, 207.73, 296.86, 37.56, 93.34, 166.93, 258.03],
  2023: [239.36, 214.14, 174.09, 191.90, 84.35, 100.62, 428.55, 492.89, 206.73, 120.00, 90.56, 220.04, 161.26, 322.67, 248.84, 250.83, 31.00, 100.18, 156.31, 172.55],
  2024: [295.32, 209.04, 156.87, 249.20, 127.58, 84.09, 398.50, 451.34, 242.41, 105.06, 91.94, 261.35, 240.03, 415.02, 255.01, 234.59, 34.49, 97.24, 180.24, 251.88],
  2025: [358.50, 212.50, 125.50, 168.50, 178.50, 122.50, 418.50, 468.50, 238.50, 132.50, 125.50, 262.50, 338.50, 658.50, 278.50, 252.50, 36.50, 115.50, 218.50, 278.50],
};

// Metrics data (pe, marketCap, beta, dividendYield) - varies slightly by year
const generateMetrics = (ticker, year) => {
  const baseMetrics = {
    // Tech
    AAPL: { pe: 28, marketCap: '2.8T', beta: 1.22, dividendYield: 0.5 },
    MSFT: { pe: 32, marketCap: '2.9T', beta: 0.92, dividendYield: 0.8 },
    GOOGL: { pe: 24, marketCap: '1.8T', beta: 1.05, dividendYield: 0.5 },
    AMZN: { pe: 55, marketCap: '1.9T', beta: 1.22, dividendYield: 0 },
    META: { pe: 26, marketCap: '1.7T', beta: 1.35, dividendYield: 0.4 },
    NVDA: { pe: 55, marketCap: '4.5T', beta: 1.72, dividendYield: 0 },
    TSLA: { pe: 85, marketCap: '1.3T', beta: 2.05, dividendYield: 0 },
    ADBE: { pe: 38, marketCap: '210B', beta: 1.18, dividendYield: 0 },
    CRM: { pe: 48, marketCap: '330B', beta: 1.08, dividendYield: 0.6 },
    INTC: { pe: -8, marketCap: '95B', beta: 0.58, dividendYield: 2.3 },
    AMD: { pe: 105, marketCap: '190B', beta: 1.75, dividendYield: 0 },
    ORCL: { pe: 32, marketCap: '485B', beta: 0.78, dividendYield: 1.2 },
    IBM: { pe: 24, marketCap: '235B', beta: 0.72, dividendYield: 2.8 },
    CSCO: { pe: 17, marketCap: '252B', beta: 0.88, dividendYield: 2.6 },
    QCOM: { pe: 19, marketCap: '195B', beta: 1.32, dividendYield: 2.0 },
    TXN: { pe: 32, marketCap: '178B', beta: 1.02, dividendYield: 2.8 },
    AVGO: { pe: 145, marketCap: '1.1T', beta: 0.98, dividendYield: 0.9 },
    NOW: { pe: 135, marketCap: '215B', beta: 0.95, dividendYield: 0 },
    INTU: { pe: 52, marketCap: '178B', beta: 1.02, dividendYield: 0.6 },
    AMAT: { pe: 22, marketCap: '152B', beta: 1.48, dividendYield: 0.8 },
    // Healthcare
    JNJ: { pe: 15, marketCap: '380B', beta: 0.55, dividendYield: 3.0 },
    UNH: { pe: 19, marketCap: '480B', beta: 0.70, dividendYield: 1.4 },
    PFE: { pe: 11, marketCap: '145B', beta: 0.65, dividendYield: 6.2 },
    ABBV: { pe: 19, marketCap: '345B', beta: 0.58, dividendYield: 3.4 },
    MRK: { pe: 15, marketCap: '248B', beta: 0.48, dividendYield: 3.2 },
    TMO: { pe: 28, marketCap: '225B', beta: 0.75, dividendYield: 0.2 },
    LLY: { pe: 72, marketCap: '830B', beta: 0.32, dividendYield: 0.6 },
    ABT: { pe: 25, marketCap: '215B', beta: 0.68, dividendYield: 1.8 },
    BMY: { pe: 15, marketCap: '118B', beta: 0.55, dividendYield: 4.2 },
    AMGN: { pe: 18, marketCap: '158B', beta: 0.58, dividendYield: 3.1 },
    GILD: { pe: 15, marketCap: '142B', beta: 0.45, dividendYield: 3.4 },
    CVS: { pe: 9, marketCap: '85B', beta: 0.78, dividendYield: 4.2 },
    ISRG: { pe: 75, marketCap: '205B', beta: 0.78, dividendYield: 0 },
    VRTX: { pe: 28, marketCap: '118B', beta: 0.42, dividendYield: 0 },
    MDT: { pe: 18, marketCap: '108B', beta: 0.70, dividendYield: 3.2 },
    CI: { pe: 12, marketCap: '98B', beta: 0.72, dividendYield: 1.7 },
    DHR: { pe: 26, marketCap: '182B', beta: 0.78, dividendYield: 0.4 },
    ZTS: { pe: 29, marketCap: '80B', beta: 0.82, dividendYield: 0.9 },
    SYK: { pe: 32, marketCap: '150B', beta: 0.72, dividendYield: 0.9 },
    HUM: { pe: 16, marketCap: '38B', beta: 0.70, dividendYield: 0.8 },
    // Finance
    JPM: { pe: 12, marketCap: '790B', beta: 1.12, dividendYield: 2.1 },
    BAC: { pe: 12, marketCap: '355B', beta: 1.35, dividendYield: 2.3 },
    WFC: { pe: 13, marketCap: '280B', beta: 1.15, dividendYield: 2.1 },
    GS: { pe: 15, marketCap: '205B', beta: 1.40, dividendYield: 2.1 },
    MS: { pe: 16, marketCap: '218B', beta: 1.35, dividendYield: 3.1 },
    C: { pe: 11, marketCap: '155B', beta: 1.48, dividendYield: 3.2 },
    V: { pe: 32, marketCap: '720B', beta: 0.85, dividendYield: 0.7 },
    MA: { pe: 38, marketCap: '535B', beta: 0.95, dividendYield: 0.5 },
    AXP: { pe: 22, marketCap: '218B', beta: 1.10, dividendYield: 1.0 },
    BLK: { pe: 24, marketCap: '158B', beta: 1.18, dividendYield: 2.0 },
    SCHW: { pe: 24, marketCap: '148B', beta: 1.05, dividendYield: 1.3 },
    CB: { pe: 13, marketCap: '125B', beta: 0.70, dividendYield: 1.3 },
    MMC: { pe: 28, marketCap: '112B', beta: 0.80, dividendYield: 1.2 },
    PNC: { pe: 13, marketCap: '85B', beta: 1.12, dividendYield: 3.1 },
    USB: { pe: 12, marketCap: '82B', beta: 1.00, dividendYield: 3.8 },
    TFC: { pe: 11, marketCap: '65B', beta: 1.10, dividendYield: 4.3 },
    COF: { pe: 11, marketCap: '75B', beta: 1.28, dividendYield: 1.2 },
    ICE: { pe: 32, marketCap: '92B', beta: 0.88, dividendYield: 1.1 },
    CME: { pe: 24, marketCap: '85B', beta: 0.42, dividendYield: 1.9 },
    AON: { pe: 28, marketCap: '88B', beta: 0.72, dividendYield: 0.7 },
    // Energy
    XOM: { pe: 13, marketCap: '475B', beta: 0.98, dividendYield: 3.4 },
    CVX: { pe: 14, marketCap: '275B', beta: 0.98, dividendYield: 4.2 },
    COP: { pe: 12, marketCap: '125B', beta: 1.48, dividendYield: 2.2 },
    SLB: { pe: 13, marketCap: '60B', beta: 1.75, dividendYield: 2.4 },
    EOG: { pe: 10, marketCap: '75B', beta: 1.35, dividendYield: 2.4 },
    OXY: { pe: 15, marketCap: '44B', beta: 1.88, dividendYield: 1.6 },
    PSX: { pe: 8, marketCap: '60B', beta: 1.35, dividendYield: 3.0 },
    MPC: { pe: 7, marketCap: '72B', beta: 1.45, dividendYield: 2.2 },
    VLO: { pe: 6, marketCap: '45B', beta: 1.52, dividendYield: 2.9 },
    HAL: { pe: 10, marketCap: '28B', beta: 1.80, dividendYield: 2.0 },
    WMB: { pe: 22, marketCap: '70B', beta: 1.05, dividendYield: 3.4 },
    KMI: { pe: 18, marketCap: '62B', beta: 0.85, dividendYield: 4.1 },
    OKE: { pe: 18, marketCap: '72B', beta: 1.25, dividendYield: 3.8 },
    DVN: { pe: 8, marketCap: '27B', beta: 1.95, dividendYield: 3.6 },
    FANG: { pe: 9, marketCap: '60B', beta: 1.68, dividendYield: 3.2 },
    BKR: { pe: 15, marketCap: '42B', beta: 1.35, dividendYield: 2.1 },
    HES: { pe: 22, marketCap: '45B', beta: 1.48, dividendYield: 1.2 },
    TRGP: { pe: 22, marketCap: '45B', beta: 1.65, dividendYield: 1.8 },
    MRO: { pe: 8, marketCap: '17B', beta: 1.98, dividendYield: 1.4 },
    EPD: { pe: 11, marketCap: '70B', beta: 0.92, dividendYield: 6.2 },
    // Consumer
    WMT: { pe: 38, marketCap: '742B', beta: 0.52, dividendYield: 0.9 },
    HD: { pe: 26, marketCap: '405B', beta: 1.02, dividendYield: 2.2 },
    COST: { pe: 58, marketCap: '435B', beta: 0.72, dividendYield: 0.5 },
    PG: { pe: 28, marketCap: '400B', beta: 0.45, dividendYield: 2.4 },
    KO: { pe: 26, marketCap: '272B', beta: 0.55, dividendYield: 2.8 },
    PEP: { pe: 25, marketCap: '202B', beta: 0.58, dividendYield: 3.5 },
    NKE: { pe: 22, marketCap: '108B', beta: 1.05, dividendYield: 2.0 },
    MCD: { pe: 25, marketCap: '212B', beta: 0.65, dividendYield: 2.2 },
    SBUX: { pe: 32, marketCap: '135B', beta: 0.85, dividendYield: 2.0 },
    TGT: { pe: 15, marketCap: '58B', beta: 0.98, dividendYield: 3.5 },
    LOW: { pe: 22, marketCap: '152B', beta: 1.08, dividendYield: 1.7 },
    TJX: { pe: 28, marketCap: '138B', beta: 0.92, dividendYield: 1.2 },
    CMG: { pe: 55, marketCap: '80B', beta: 1.25, dividendYield: 0 },
    BKNG: { pe: 28, marketCap: '178B', beta: 1.42, dividendYield: 0.8 },
    ORLY: { pe: 28, marketCap: '78B', beta: 0.88, dividendYield: 0 },
    ROST: { pe: 25, marketCap: '52B', beta: 0.95, dividendYield: 0.9 },
    DG: { pe: 15, marketCap: '18B', beta: 0.62, dividendYield: 2.8 },
    DLTR: { pe: 14, marketCap: '15B', beta: 0.78, dividendYield: 0 },
    YUM: { pe: 26, marketCap: '40B', beta: 0.92, dividendYield: 1.8 },
    MAR: { pe: 28, marketCap: '85B', beta: 1.45, dividendYield: 0.9 },
    // Industrial
    CAT: { pe: 16, marketCap: '185B', beta: 1.05, dividendYield: 1.4 },
    HON: { pe: 21, marketCap: '142B', beta: 1.08, dividendYield: 2.0 },
    UPS: { pe: 18, marketCap: '110B', beta: 1.12, dividendYield: 5.1 },
    BA: { pe: -15, marketCap: '108B', beta: 1.52, dividendYield: 0 },
    GE: { pe: 32, marketCap: '202B', beta: 1.18, dividendYield: 0.6 },
    RTX: { pe: 35, marketCap: '168B', beta: 0.82, dividendYield: 2.0 },
    DE: { pe: 14, marketCap: '118B', beta: 1.05, dividendYield: 1.2 },
    LMT: { pe: 18, marketCap: '118B', beta: 0.45, dividendYield: 2.6 },
    UNP: { pe: 22, marketCap: '148B', beta: 1.02, dividendYield: 2.2 },
    MMM: { pe: 15, marketCap: '75B', beta: 0.92, dividendYield: 2.2 },
    EMR: { pe: 28, marketCap: '72B', beta: 1.12, dividendYield: 1.6 },
    ITW: { pe: 26, marketCap: '80B', beta: 1.02, dividendYield: 2.1 },
    ETN: { pe: 35, marketCap: '138B', beta: 1.15, dividendYield: 1.1 },
    PH: { pe: 28, marketCap: '88B', beta: 1.22, dividendYield: 1.0 },
    GD: { pe: 20, marketCap: '78B', beta: 0.62, dividendYield: 1.9 },
    NSC: { pe: 22, marketCap: '60B', beta: 1.18, dividendYield: 2.0 },
    CSX: { pe: 18, marketCap: '75B', beta: 1.15, dividendYield: 1.2 },
    PCAR: { pe: 14, marketCap: '62B', beta: 1.08, dividendYield: 1.0 },
    WM: { pe: 32, marketCap: '95B', beta: 0.72, dividendYield: 1.3 },
    FDX: { pe: 16, marketCap: '70B', beta: 1.28, dividendYield: 1.9 },
  };
  return baseMetrics[ticker] || { pe: 20, marketCap: '50B', beta: 1.0, dividendYield: 1.5 };
};

// Build final data structure
const buildSectorData = (stocks, pricesByYear, currentPrices) => {
  const result = {};
  Object.keys(pricesByYear).forEach(year => {
    result[year] = stocks.map((stock, i) => ({
      ticker: stock.ticker,
      name: stock.name,
      priceStart: pricesByYear[year][i],
      priceNow: currentPrices[stock.ticker],
      ...generateMetrics(stock.ticker, parseInt(year))
    }));
  });
  return result;
};

// Ticker lists only. All stats (pe, eps, marketCap, beta) and prices (buy_price, sell_price)
// are fetched live from the /stats and /simulate lambda endpoints.
export const STOCKS_DATA = {
  tech: buildSectorData(techStocks, techPrices, CURRENT_PRICES),
  healthcare: buildSectorData(healthcareStocks, healthcarePrices, CURRENT_PRICES),
  finance: buildSectorData(financeStocks, financePrices, CURRENT_PRICES),
  energy: buildSectorData(energyStocks, energyPrices, CURRENT_PRICES),
  consumer: buildSectorData(consumerStocks, consumerPrices, CURRENT_PRICES),
  industrial: buildSectorData(industrialStocks, industrialPrices, CURRENT_PRICES),
};

// Get all unique stocks for search
export const ALL_STOCKS = [
  ...techStocks,
  ...healthcareStocks,
  ...financeStocks,
  ...energyStocks,
  ...consumerStocks,
  ...industrialStocks,
].map(s => ({ ...s, ...generateMetrics(s.ticker) }));

// Sector display names
export const SECTOR_NAMES = {
  tech: 'Technology',
  healthcare: 'Healthcare',
  finance: 'Finance',
  energy: 'Energy',
  consumer: 'Consumer',
  industrial: 'Industrial',
};
