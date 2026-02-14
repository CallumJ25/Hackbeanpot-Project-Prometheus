// ==================== SIMULATION CONFIGURATION ====================
export const SIMULATION_CONFIG = {
  availableYears: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
  defaultYear: 2020,
  defaultInvestment: 10000,
  bankInterestRate: 0.045, // 4.5% APY
};

// ==================== STOCK CATEGORIES ====================
export const CATEGORIES = [
  { id: 'tech', name: 'Technology', icon: '💻' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { id: 'finance', name: 'Finance', icon: '🏦' },
  { id: 'energy', name: 'Energy', icon: '⚡' },
  { id: 'consumer', name: 'Consumer Goods', icon: '🛒' },
  { id: 'industrial', name: 'Industrial', icon: '🏭' },
];

// ==================== CANDLESTICK PATTERNS ====================
export const CANDLE_PATTERNS = [
  { 
    name: 'Doji', 
    description: 'Indecision - open and close nearly equal', 
    detect: (c) => Math.abs(c.close - c.open) < (c.high - c.low) * 0.1 && (c.high - c.low) > 0 
  },
  { 
    name: 'Hammer', 
    description: 'Potential bullish reversal - small body, long lower wick', 
    detect: (c) => {
      const body = Math.abs(c.close - c.open);
      const lowerWick = Math.min(c.open, c.close) - c.low;
      const upperWick = c.high - Math.max(c.open, c.close);
      return body > 0 && lowerWick > body * 2 && upperWick < body * 0.5;
    }
  },
  { 
    name: 'Shooting Star', 
    description: 'Potential bearish reversal - small body, long upper wick', 
    detect: (c) => {
      const body = Math.abs(c.close - c.open);
      const upperWick = c.high - Math.max(c.open, c.close);
      const lowerWick = Math.min(c.open, c.close) - c.low;
      return body > 0 && upperWick > body * 2 && lowerWick < body * 0.5;
    }
  },
  { 
    name: 'Marubozu', 
    description: 'Strong conviction - full body, minimal wicks', 
    detect: (c) => {
      const body = Math.abs(c.close - c.open);
      const range = c.high - c.low;
      return range > 0 && body > range * 0.85;
    }
  },
  { 
    name: 'Spinning Top', 
    description: 'Indecision - small body, equal wicks', 
    detect: (c) => {
      const body = Math.abs(c.close - c.open);
      const range = c.high - c.low;
      const upperWick = c.high - Math.max(c.open, c.close);
      const lowerWick = Math.min(c.open, c.close) - c.low;
      return range > 0 && body < range * 0.3 && Math.abs(upperWick - lowerWick) < range * 0.2;
    }
  },
];

// ==================== S&P 500 BENCHMARK DATA ====================
export const SP500_DATA = {
  2000: { start: 1469.25, now: 5950.25 },
  2001: { start: 1320.28, now: 5950.25 },
  2002: { start: 1148.08, now: 5950.25 },
  2003: { start: 879.82, now: 5950.25 },
  2004: { start: 1111.92, now: 5950.25 },
  2005: { start: 1181.27, now: 5950.25 },
  2006: { start: 1248.29, now: 5950.25 },
  2007: { start: 1418.30, now: 5950.25 },
  2008: { start: 1468.36, now: 5950.25 },
  2009: { start: 903.25, now: 5950.25 },
  2010: { start: 1115.10, now: 5950.25 },
  2011: { start: 1257.62, now: 5950.25 },
  2012: { start: 1257.60, now: 5950.25 },
  2013: { start: 1426.19, now: 5950.25 },
  2014: { start: 1848.36, now: 5950.25 },
  2015: { start: 2058.90, now: 5950.25 },
  2016: { start: 2043.94, now: 5950.25 },
  2017: { start: 2238.83, now: 5950.25 },
  2018: { start: 2673.61, now: 5950.25 },
  2019: { start: 2506.85, now: 5950.25 },
  2020: { start: 3230.78, now: 5950.25 },
  2021: { start: 3756.07, now: 5950.25 },
  2022: { start: 4766.18, now: 5950.25 },
  2023: { start: 3824.14, now: 5950.25 },
  2024: { start: 4769.83, now: 5950.25 },
  2025: { start: 5881.63, now: 5950.25 },
  2026: { start: 5950.25, now: 5950.25 },
};

// ==================== FUN PURCHASE COMPARISONS ====================
export const FUN_PURCHASES = [
  { name: 'cups of coffee', unitPrice: 5.50, icon: '☕' },
  { name: 'Netflix subscriptions (monthly)', unitPrice: 15.49, icon: '📺' },
  { name: 'Chipotle burritos', unitPrice: 12.50, icon: '🌯' },
  { name: 'movie tickets', unitPrice: 15.00, icon: '🎬' },
  { name: 'gallons of gas', unitPrice: 3.25, icon: '⛽' },
  { name: 'paperback books', unitPrice: 16.00, icon: '📚' },
];
