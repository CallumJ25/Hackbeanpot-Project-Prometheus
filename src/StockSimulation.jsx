import { useState, useMemo, useEffect } from 'react';
import { API_BASE_URL, SIMULATION_CONFIG, CATEGORIES, SP500_DATA, FUN_PURCHASES } from './config';
import { STOCKS_DATA, SECTOR_NAMES } from './stockData';
import { PortfolioChart } from './components';

function formatMarketCap(value) {
  if (!value) return null;
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(0)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  return `$${value}`;
}

const StockSimulation = () => {
  // Load saved state from localStorage
  const [step, setStep] = useState(() => 
    localStorage.getItem('sim_step') || 'setup'
  );
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('sim_config');
    return saved ? JSON.parse(saved) : {
      year: SIMULATION_CONFIG.defaultYear,
      investment: SIMULATION_CONFIG.defaultInvestment,
      customInvestment: '',
      numCategories: 3,
      stocksPerCategory: 2,
      investmentStrategy: 'lump',
      dcaMonthly: 500,
    };
  });
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const saved = localStorage.getItem('sim_categories');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedStocks, setSelectedStocks] = useState(() => {
    const saved = localStorage.getItem('sim_stocks');
    return saved ? JSON.parse(saved) : {};
  });
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(() => {
    const saved = localStorage.getItem('sim_categoryIndex');
    return saved ? parseInt(saved) : 0;
  });
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ peMin: '', peMax: '', betaMin: '', betaMax: '', dividendMin: '', dividendMax: '' });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('sim_step', step);
  }, [step]);

  useEffect(() => {
    localStorage.setItem('sim_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('sim_categories', JSON.stringify(selectedCategories));
  }, [selectedCategories]);

  useEffect(() => {
    localStorage.setItem('sim_stocks', JSON.stringify(selectedStocks));
  }, [selectedStocks]);

  useEffect(() => {
    localStorage.setItem('sim_categoryIndex', currentCategoryIndex.toString());
  }, [currentCategoryIndex]);


  const handleConfigSubmit = () => {
    setStep('categories');
  };

  const handleCategorySelect = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(c => c !== categoryId));
    } else if (selectedCategories.length < config.numCategories) {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleCategoriesSubmit = () => {
    setStep('stocks');
    setCurrentCategoryIndex(0);
    setSearchQuery('');
    setFilters({ peMin: '', peMax: '', betaMin: '', betaMax: '', dividendMin: '', dividendMax: '' });
  };

  const handleStockSelect = (stock) => {
    const categoryId = selectedCategories[currentCategoryIndex];
    const currentStocks = selectedStocks[categoryId] || [];

    if (currentStocks.find(s => s.ticker === stock.ticker)) {
      setSelectedStocks({ ...selectedStocks, [categoryId]: currentStocks.filter(s => s.ticker !== stock.ticker) });
    } else if (currentStocks.length < config.stocksPerCategory) {
      setSelectedStocks({ ...selectedStocks, [categoryId]: [...currentStocks, stock] });
    }
  };

  const handleStocksSubmit = async () => {
    if (currentCategoryIndex < selectedCategories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setSearchQuery('');
      setFilters({ peMin: '', peMax: '', betaMin: '', betaMax: '', dividendMin: '', dividendMax: '' });
    } else {
      setStep('results');
      setSimulationLoading(true);
      setSimulationError(null);
      setSimulationResult(null);
      try {
        const allTickers = Object.values(selectedStocks).flat().map(s => s.ticker);
        const res = await fetch(`${API_BASE_URL}/simulate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            starting_cash: config.investment,
            start_year: config.year,
            end_year: new Date().getFullYear(),
            tickers: allTickers,
          }),
        });
        const data = await res.json();
        setSimulationResult(data);
      } catch (err) {
        setSimulationError(err.message);
      } finally {
        setSimulationLoading(false);
      }
    }
  };

  const getResults = () => {
    if (!simulationResult) return null;

    const yearsHeld = new Date().getFullYear() - config.year + (new Date().getMonth() / 12);
    const monthsHeld = Math.floor(yearsHeld * 12);
    const allStocks = Object.values(selectedStocks).flat();

    let totalInvested, totalValue, stockResults;

    if (config.investmentStrategy === 'lump') {
      totalInvested = simulationResult.starting_cash;
      totalValue = simulationResult.final_cash;
      stockResults = allStocks.map(stock => {
        const b = simulationResult.ticker_breakdown?.[stock.ticker];
        if (!b || b.error) {
          return { ...stock, invested: totalInvested / allStocks.length, shares: 0, currentValue: 0, gain: 0, gainPercent: 0 };
        }
        return {
          ...stock,
          invested: b.initial_investment,
          shares: b.final_shares,
          currentValue: b.final_value,
          gain: b.final_value - b.initial_investment,
          gainPercent: b.roi * 100,
        };
      });
    } else {
      // DCA: compute locally using buy_price + sell_price from simulate response
      const numStocks = allStocks.length;
      const monthlyPerStock = config.dcaMonthly / numStocks;
      stockResults = allStocks.map(stock => {
        const b = simulationResult.ticker_breakdown?.[stock.ticker];
        const priceNow = b?.sell_price ?? 0;
        const startPrice = b?.buy_price ?? 0;
        let shares = 0, invested = 0;
        for (let month = 0; month < monthsHeld; month++) {
          const progress = month / monthsHeld;
          const priceAtMonth = startPrice + (priceNow - startPrice) * progress * 0.7;
          if (priceAtMonth > 0) shares += monthlyPerStock / priceAtMonth;
          invested += monthlyPerStock;
        }
        const currentValue = shares * priceNow;
        return {
          ...stock,
          invested,
          shares,
          currentValue,
          gain: currentValue - invested,
          gainPercent: invested > 0 ? ((currentValue - invested) / invested) * 100 : 0,
        };
      });
      totalInvested = stockResults.reduce((s, r) => s + r.invested, 0);
      totalValue = stockResults.reduce((s, r) => s + r.currentValue, 0);
    }

    const bankValue = config.investmentStrategy === 'lump'
      ? config.investment * Math.pow(1 + SIMULATION_CONFIG.bankInterestRate, yearsHeld)
      : (() => {
          let bankTotal = 0;
          const monthlyRate = SIMULATION_CONFIG.bankInterestRate / 12;
          for (let m = 0; m < monthsHeld; m++) bankTotal = (bankTotal + config.dcaMonthly) * (1 + monthlyRate);
          return bankTotal;
        })();

    const sp500Data = SP500_DATA[config.year];
    const sp500Return = sp500Data ? (sp500Data.now - sp500Data.start) / sp500Data.start : 0;
    const sp500Value = config.investmentStrategy === 'lump'
      ? config.investment * (1 + sp500Return)
      : (() => {
          let sp500Total = 0;
          const monthlyReturn = Math.pow(1 + sp500Return, 1 / monthsHeld) - 1;
          for (let m = 0; m < monthsHeld; m++) sp500Total = (sp500Total + config.dcaMonthly) * (1 + monthlyReturn);
          return sp500Total;
        })();

    return {
      stockResults,
      totalValue,
      totalInvested,
      totalGain: totalValue - totalInvested,
      totalGainPercent: totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0,
      comparisons: { mattress: totalInvested, bank: bankValue, sp500: sp500Value },
      yearsHeld: yearsHeld.toFixed(1),
      strategy: config.investmentStrategy,
    };
  };

  // Filter and search stocks — numeric filters use liveStats since stockData has no metrics
  const filteredStocks = useMemo(() => {
    let stocks = getAvailableStocks();

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      stocks = stocks.filter(s =>
        s.ticker.toLowerCase().includes(query) ||
        s.name.toLowerCase().includes(query)
      );
    }

    if (filters.peMin !== '') {
      stocks = stocks.filter(s => {
        const pe = liveStats[s.ticker]?.pe;
        return pe != null && pe >= parseFloat(filters.peMin);
      });
    }
    if (filters.peMax !== '') {
      stocks = stocks.filter(s => {
        const pe = liveStats[s.ticker]?.pe;
        return pe != null && pe <= parseFloat(filters.peMax);
      });
    }

    if (filters.betaMin !== '') {
      stocks = stocks.filter(s => {
        const beta = liveStats[s.ticker]?.beta;
        return beta != null && beta >= parseFloat(filters.betaMin);
      });
    }
    if (filters.betaMax !== '') {
      stocks = stocks.filter(s => {
        const beta = liveStats[s.ticker]?.beta;
        return beta != null && beta <= parseFloat(filters.betaMax);
      });
    }

    if (filters.dividendMin !== '') {
      stocks = stocks.filter(s => {
        const div = liveStats[s.ticker]?.dividendYield;
        return div != null && div >= parseFloat(filters.dividendMin);
      });
    }
    if (filters.dividendMax !== '') {
      stocks = stocks.filter(s => {
        const div = liveStats[s.ticker]?.dividendYield;
        return div != null && div <= parseFloat(filters.dividendMax);
      });
    }

    return stocks;
  }, [currentCategoryIndex, selectedCategories, config.year, searchQuery, filters, liveStats]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({ peMin: '', peMax: '', betaMin: '', betaMax: '', dividendMin: '', dividendMax: '' });
  };

  // Setup Step
  if (step === 'setup') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="font-display text-2xl font-bold text-navy mb-6">Configure Your Simulation</h3>

          <div className="space-y-6">
            <div>
              <label className="block text-navy font-medium mb-2">Starting Year</label>
              <p className="text-navy-light text-sm mb-3">Pick a year. You'll see stock data from that time and choose what to "invest" in.</p>
              <select
                value={config.year}
                onChange={(e) => setConfig({ ...config, year: parseInt(e.target.value) })}
                className="w-full p-3 rounded-lg border-2 border-cream-dark bg-white text-navy font-medium focus:border-teal focus:outline-none cursor-pointer"
              >
                {SIMULATION_CONFIG.availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <p className="text-navy-light text-xs mt-2">
                Try 2020 for pandemic crash, 2022 for tech downturn, or 2023 for AI boom.
              </p>
            </div>

            <div>
              <label className="block text-navy font-medium mb-2">Investment Amount</label>
              <div className="flex gap-1 md:gap-2 mb-3">
                {[50, 100, 500, 1000, 5000, 10000, 50000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setConfig({ ...config, investment: amount, customInvestment: '' })}
                    className={`px-2 md:px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      config.investment === amount && !config.customInvestment
                        ? 'bg-teal text-white' 
                        : 'bg-cream-dark text-navy hover:bg-teal/20'
                    }`}
                  >
                    ${amount.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-navy-light text-sm">Custom:</span>
                <div className="relative flex-1 max-w-[200px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy">$</span>
                  <input
                    type="text"
                    placeholder="Enter amount"
                    value={config.customInvestment || ''}
                    onChange={(e) => {
                      // Remove non-digits, then format with commas
                      const rawValue = e.target.value.replace(/[^\d]/g, '');
                      const numValue = parseInt(rawValue) || 0;
                      
                      // Enforce min/max
                      if (numValue > 1000000) return;
                      
                      // Format with commas
                      const formatted = numValue > 0 ? numValue.toLocaleString() : '';
                      
                      setConfig({ 
                        ...config, 
                        customInvestment: formatted,
                        investment: numValue >= 50 ? numValue : config.investment
                      });
                    }}
                    className={`w-full p-2 pl-7 rounded-lg border-2 text-navy font-medium focus:outline-none ${
                      config.customInvestment 
                        ? 'border-teal bg-teal/10' 
                        : 'border-cream-dark bg-white'
                    }`}
                  />
                </div>
                <span className="text-navy-light text-xs">($50 - $1,000,000)</span>
              </div>
            </div>

            <div>
              <label className="block text-navy font-medium mb-2">Investment Strategy</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfig({ ...config, investmentStrategy: 'lump' })}
                  className={`flex-1 p-4 rounded-lg border-2 text-left transition-all ${
                    config.investmentStrategy === 'lump'
                      ? 'border-teal bg-teal/10'
                      : 'border-cream-dark hover:border-teal/50'
                  }`}
                >
                  <div className="font-semibold text-navy">Lump Sum</div>
                  <div className="text-sm text-navy-light">Invest everything at once</div>
                </button>
                <button
                  onClick={() => setConfig({ ...config, investmentStrategy: 'dca' })}
                  className={`flex-1 p-4 rounded-lg border-2 text-left transition-all ${
                    config.investmentStrategy === 'dca'
                      ? 'border-teal bg-teal/10'
                      : 'border-cream-dark hover:border-teal/50'
                  }`}
                >
                  <div className="font-semibold text-navy">Dollar-Cost Average</div>
                  <div className="text-sm text-navy-light">Invest monthly over time</div>
                </button>
              </div>
              
              {config.investmentStrategy === 'dca' && (
                <div className="mt-4">
                  <label className="block text-navy text-sm font-medium mb-2">Monthly Investment</label>
                  <div className="flex flex-wrap gap-2">
                    {[100, 250, 500, 1000].map(amount => (
                      <button
                        key={amount}
                        onClick={() => setConfig({ ...config, dcaMonthly: amount })}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          config.dcaMonthly === amount 
                            ? 'bg-teal text-white' 
                            : 'bg-cream-dark text-navy hover:bg-teal/20'
                        }`}
                      >
                        ${amount}/mo
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-navy font-medium mb-2">Categories to Pick</label>
                <select
                  value={config.numCategories}
                  onChange={(e) => setConfig({ ...config, numCategories: parseInt(e.target.value) })}
                  className="w-full p-3 rounded-lg border-2 border-cream-dark bg-white text-navy focus:border-teal focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'category' : 'categories'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-navy font-medium mb-2">Stocks per Category</label>
                <select
                  value={config.stocksPerCategory}
                  onChange={(e) => setConfig({ ...config, stocksPerCategory: parseInt(e.target.value) })}
                  className="w-full p-3 rounded-lg border-2 border-cream-dark bg-white text-navy focus:border-teal focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'stock' : 'stocks'}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleConfigSubmit}
              disabled={config.investment < 50}
              className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                config.investment >= 50
                  ? 'bg-teal text-white hover:bg-teal-light'
                  : 'bg-cream-dark text-navy-light cursor-not-allowed'
              }`}
            >
              {config.investment < 50 ? 'Minimum investment is $50' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Categories Step
  if (step === 'categories') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="font-display text-2xl font-bold text-navy mb-2">Choose Sectors</h3>
          <p className="text-navy-light mb-6">Select {config.numCategories} {config.numCategories === 1 ? 'sector' : 'sectors'} to invest in.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategories.includes(cat.id);
              const isDisabled = !isSelected && selectedCategories.length >= config.numCategories;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  disabled={isDisabled}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    isSelected 
                      ? 'border-teal bg-teal/10' 
                      : isDisabled
                        ? 'border-cream-dark opacity-50 cursor-not-allowed'
                        : 'border-cream-dark hover:border-teal/50'
                  }`}
                >
                  <span className="text-3xl block mb-2">{cat.icon}</span>
                  <span className="font-medium text-navy">{cat.name}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleCategoriesSubmit}
            disabled={selectedCategories.length !== config.numCategories}
            className={`w-full py-3 rounded-xl font-semibold transition-colors ${
              selectedCategories.length === config.numCategories
                ? 'bg-navy text-white hover:bg-navy-light'
                : 'bg-cream-dark text-navy-light cursor-not-allowed'
            }`}
          >
            Continue to Stock Selection
          </button>
        </div>
      </div>
    );
  }

  // Stocks Step
  if (step === 'stocks') {
    const categoryId = selectedCategories[currentCategoryIndex];
    const category = CATEGORIES.find(c => c.id === categoryId);
    const currentSelections = selectedStocks[categoryId] || [];

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-navy-light text-sm">Category {currentCategoryIndex + 1} of {selectedCategories.length}</p>
              <h3 className="font-display text-2xl font-bold text-navy">
                {category?.icon} {SECTOR_NAMES[categoryId] || category?.name}
              </h3>
              <p className="text-navy-light">
                Select {config.stocksPerCategory} stocks • Data from January {config.year}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-teal">{currentSelections.length}/{config.stocksPerCategory}</div>
              <div className="text-sm text-navy-light">selected</div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by ticker or company name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pl-10 rounded-lg border-2 border-cream-dark bg-white text-navy focus:border-teal focus:outline-none"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-light">🔍</span>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  showFilters || Object.values(filters).some(v => v !== '')
                    ? 'border-teal bg-teal/10 text-teal'
                    : 'border-cream-dark text-navy hover:border-teal/50'
                }`}
              >
                ⚙️ Filters
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="p-4 bg-cream rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-navy">Filter Stocks</span>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-teal hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* P/E Ratio */}
                  <div>
                    <label className="block text-sm text-navy-light mb-1">P/E Ratio</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.peMin}
                        onChange={(e) => setFilters({ ...filters, peMin: e.target.value })}
                        className="w-full p-2 rounded border border-cream-dark text-sm focus:border-teal focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.peMax}
                        onChange={(e) => setFilters({ ...filters, peMax: e.target.value })}
                        className="w-full p-2 rounded border border-cream-dark text-sm focus:border-teal focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  {/* Beta */}
                  <div>
                    <label className="block text-sm text-navy-light mb-1">Beta (Volatility)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Min"
                        value={filters.betaMin}
                        onChange={(e) => setFilters({ ...filters, betaMin: e.target.value })}
                        className="w-full p-2 rounded border border-cream-dark text-sm focus:border-teal focus:outline-none"
                      />
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Max"
                        value={filters.betaMax}
                        onChange={(e) => setFilters({ ...filters, betaMax: e.target.value })}
                        className="w-full p-2 rounded border border-cream-dark text-sm focus:border-teal focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  {/* Dividend Yield */}
                  <div>
                    <label className="block text-sm text-navy-light mb-1">Dividend Yield %</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Min"
                        value={filters.dividendMin}
                        onChange={(e) => setFilters({ ...filters, dividendMin: e.target.value })}
                        className="w-full p-2 rounded border border-cream-dark text-sm focus:border-teal focus:outline-none"
                      />
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Max"
                        value={filters.dividendMax}
                        onChange={(e) => setFilters({ ...filters, dividendMax: e.target.value })}
                        className="w-full p-2 rounded border border-cream-dark text-sm focus:border-teal focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-navy-light">
                  💡 Tip: Low P/E may indicate value stocks, high beta means more volatility, dividend yield shows income potential.
                </p>
              </div>
            )}
          </div>

          {/* Stock Count */}
          <div className="mb-4 text-sm text-navy-light">
            Showing {filteredStocks.length} of {getAvailableStocks().length} stocks
            {(searchQuery || Object.values(filters).some(v => v !== '')) && (
              <button onClick={clearFilters} className="ml-2 text-teal hover:underline">
                Clear filters
              </button>
            )}
          </div>

          {/* Stock List */}
          <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
            {filteredStocks.length === 0 ? (
              <div className="text-center py-8 text-navy-light">
                No stocks match your criteria. Try adjusting your filters.
              </div>
            ) : (
              filteredStocks.map(stock => {
                const isSelected = currentSelections.find(s => s.ticker === stock.ticker);
                const isDisabled = !isSelected && currentSelections.length >= config.stocksPerCategory;
                
                return (
                  <button
                    key={stock.ticker}
                    onClick={() => handleStockSelect(stock)}
                    disabled={isDisabled}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected 
                        ? 'border-teal bg-teal/10' 
                        : isDisabled
                          ? 'border-cream-dark opacity-50 cursor-not-allowed'
                          : 'border-cream-dark hover:border-teal/50'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="min-w-0">
                        <span className="font-bold text-navy text-lg">{stock.ticker}</span>
                        <span className="text-navy-light ml-2 text-sm truncate">{stock.name}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs md:text-sm">
                        {statsLoading && !liveStats[stock.ticker] ? (
                          <span className="text-navy-light animate-pulse">Loading stats...</span>
                        ) : (() => {
                          const live = liveStats[stock.ticker];
                          const na = <span className="font-semibold text-navy-light">N/A</span>;
                          return (<>
                            <div className="bg-cream px-2 py-1 rounded">
                              <span className="text-navy-light">P/E: </span>
                              {live?.pe != null ? <span className="font-semibold text-navy">{live.pe}</span> : na}
                            </div>
                            <div className="bg-cream px-2 py-1 rounded">
                              <span className="text-navy-light">EPS: </span>
                              {live?.eps != null ? <span className="font-semibold text-navy">${live.eps}</span> : na}
                            </div>
                            <div className="bg-cream px-2 py-1 rounded">
                              <span className="text-navy-light">Beta: </span>
                              {live?.beta != null ? <span className="font-semibold text-navy">{live.beta}</span> : na}
                            </div>
                            <div className="bg-cream px-2 py-1 rounded">
                              <span className="text-navy-light">Div: </span>
                              {live?.dividendYield != null ? <span className="font-semibold text-navy">{live.dividendYield}%</span> : na}
                            </div>
                            <div className="bg-cream px-2 py-1 rounded hidden md:block">
                              <span className="text-navy-light">Cap: </span>
                              {live?.marketCap ? <span className="font-semibold text-navy">{live.marketCap}</span> : na}
                            </div>
                          </>);
                        })()}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <button
            onClick={handleStocksSubmit}
            disabled={currentSelections.length !== config.stocksPerCategory}
            className={`w-full py-3 rounded-xl font-semibold transition-colors ${
              currentSelections.length === config.stocksPerCategory
                ? 'bg-navy text-white hover:bg-navy-light'
                : 'bg-cream-dark text-navy-light cursor-not-allowed'
            }`}
          >
            {currentCategoryIndex < selectedCategories.length - 1 ? 'Next Category' : 'See Results'}
          </button>
        </div>
      </div>
    );
  }

  // Results Step
  if (step === 'results') {
    if (simulationLoading) {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <div className="text-4xl mb-4 animate-bounce">📊</div>
            <p className="text-navy font-semibold text-lg">Crunching the numbers...</p>
            <p className="text-navy-light mt-2">Fetching real historical data for your portfolio</p>
          </div>
        </div>
      );
    }

    if (simulationError || !simulationResult) {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-navy font-semibold text-lg">Failed to load simulation</p>
            <p className="text-navy-light mt-2">{simulationError || 'Unknown error'}</p>
            <button
              onClick={() => { setStep('setup'); setSelectedCategories([]); setSelectedStocks({}); setCurrentCategoryIndex(0); }}
              className="mt-6 bg-navy text-white px-6 py-2 rounded-xl font-semibold hover:bg-navy-light transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    const results = getResults();
    if (!results) return null;
    const isProfit = results.totalGain >= 0;

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Result */}
        <div className={`rounded-2xl p-8 text-center ${isProfit ? 'bg-sage/20' : 'bg-coral/20'}`}>
          <p className="text-navy-light mb-2">
            {results.strategy === 'dca' 
              ? `Your $${config.dcaMonthly}/month since ${config.year} ($${results.totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })} total) would now be worth`
              : `Your $${results.totalInvested.toLocaleString()} invested in ${config.year} would now be worth`
            }
          </p>
          <p className="font-display text-5xl md:text-6xl font-bold text-navy mb-2">
            ${results.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className={`text-xl font-semibold ${isProfit ? 'text-sage' : 'text-coral'}`}>
            {isProfit ? '+' : ''}{results.totalGainPercent.toFixed(1)}% ({isProfit ? '+' : ''}${results.totalGain.toLocaleString(undefined, { maximumFractionDigits: 0 })})
          </p>
        </div>

        {/* Portfolio Growth Chart */}
        <PortfolioChart
          startYear={config.year}
          endYear={new Date().getFullYear()}
          startValue={results.strategy === 'dca' ? 0 : results.totalInvested}
          endValue={results.totalValue}
          comparisons={results.comparisons}
        />

        {/* Stock Breakdown */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h4 className="font-display text-xl font-bold text-navy mb-4">Your Portfolio Breakdown</h4>
          <div className="space-y-3">
            {results.stockResults.map((stock, i) => (
              <div key={i} className="flex flex-wrap items-center justify-between p-3 bg-cream rounded-lg gap-2">
                <div>
                  <span className="font-bold text-navy">{stock.ticker}</span>
                  <span className="text-navy-light text-sm ml-2">({stock.shares.toFixed(2)} shares)</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-navy">${stock.currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  <span className={`ml-2 text-sm ${stock.gain >= 0 ? 'text-sage' : 'text-coral'}`}>
                    {stock.gain >= 0 ? '+' : ''}{stock.gainPercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparisons */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h4 className="font-display text-xl font-bold text-navy mb-4">What If You Had...</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-cream rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛏️</span>
                <span className="text-navy">Kept it under the mattress</span>
              </div>
              <span className="font-semibold text-navy">${results.comparisons.mattress.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-cream rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏦</span>
                <span className="text-navy">Savings account ({(SIMULATION_CONFIG.bankInterestRate * 100).toFixed(1)}% APY)</span>
              </div>
              <span className="font-semibold text-navy">${results.comparisons.bank.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-cream rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📈</span>
                <span className="text-navy">Invested in the S&P 500</span>
              </div>
              <span className="font-semibold text-navy">${results.comparisons.sp500.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-lg ${isProfit ? 'bg-teal/10 border-2 border-teal' : 'bg-coral/10 border-2 border-coral'}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">💼</span>
                <span className="text-navy font-semibold">Your portfolio</span>
              </div>
              <span className="font-bold text-navy">${results.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>

        {/* Fun Comparisons */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h4 className="font-display text-xl font-bold text-navy mb-4">What Your {isProfit ? 'Gains' : 'Portfolio'} Could Buy</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {FUN_PURCHASES.map((item, i) => {
              const amount = isProfit ? results.totalGain : results.totalValue;
              const quantity = Math.floor(amount / item.unitPrice);
              if (quantity <= 0) return null;

              return (
                <div key={i} className="flex items-center gap-3 p-3 bg-cream rounded-lg">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-navy">
                    <strong>{quantity.toLocaleString()}</strong> {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Try Again */}
        <div className="text-center">
          <button
            onClick={() => {
              setStep('setup');
              setSelectedCategories([]);
              setSelectedStocks({});
              setCurrentCategoryIndex(0);
              setSearchQuery('');
              setFilters({ peMin: '', peMax: '', betaMin: '', betaMax: '', dividendMin: '', dividendMax: '' });
              setConfig(prev => ({ ...prev, customInvestment: '' }));
            }}
            className="bg-navy text-white px-8 py-3 rounded-xl font-semibold hover:bg-navy-light transition-colors"
          >
            Try Different Picks
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default StockSimulation;