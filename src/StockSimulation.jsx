import { useState, useEffect } from 'react';
import { SIMULATION_CONFIG, CATEGORIES, SP500_DATA, FUN_PURCHASES, API_BASE_URL } from './config';
import { STOCKS_DATA } from './stockData';
import { PortfolioChart } from './components';

function formatMarketCap(value) {
  if (!value) return null;
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(0)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  return `$${value}`;
}

const StockSimulation = () => {
  const [step, setStep] = useState('setup');
  const [config, setConfig] = useState({
    year: SIMULATION_CONFIG.defaultYear,
    investment: SIMULATION_CONFIG.defaultInvestment,
    numCategories: 3,
    stocksPerCategory: 2,
    investmentStrategy: 'lump',
    dcaMonthly: 500,
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  // Live stats from /stats lambda: { [ticker]: { pe, marketCap, beta } }
  const [liveStats, setLiveStats] = useState({});
  const [statsLoading, setStatsLoading] = useState(false);

  // Simulation result from /simulate lambda
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [simulationError, setSimulationError] = useState(null);

  const getAvailableStocks = () => {
    const categoryId = selectedCategories[currentCategoryIndex];
    const categoryData = STOCKS_DATA[categoryId];
    if (!categoryData) return [];
    return categoryData[config.year] || categoryData[2024] || [];
  };

  // Fetch /stats for all tickers in the current category (skip already cached)
  useEffect(() => {
    if (step !== 'stocks') return;
    const stocks = getAvailableStocks();
    const uncached = stocks.map(s => s.ticker).filter(t => !liveStats[t]);
    if (!uncached.length) return;

    setStatsLoading(true);
    Promise.all(
      uncached.map(ticker =>
        fetch(`${API_BASE_URL}/stats?symbol=${ticker}`)
          .then(r => r.json())
          .then(data => ({ ticker, data }))
          .catch(() => ({ ticker, data: null }))
      )
    ).then(results => {
      const newStats = {};
      results.forEach(({ ticker, data }) => {
        if (data && !data.error) {
          newStats[ticker] = {
            pe: data.trailingPE ?? data.forwardPE ?? null,
            eps: data.trailingEps ?? null,
            marketCap: formatMarketCap(data.marketCap),
            beta: data.beta ?? null,
          };
        }
      });
      setLiveStats(prev => ({ ...prev, ...newStats }));
      setStatsLoading(false);
    });
  }, [step, currentCategoryIndex]);

  const handleConfigSubmit = () => setStep('categories');

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
                Try 2000 for dot-com era, 2008 for financial crisis, or 2020 for pandemic recovery.
              </p>
            </div>

            <div>
              <label className="block text-navy font-medium mb-2">Investment Amount</label>
              <div className="flex flex-wrap gap-2">
                {[1000, 5000, 10000, 25000, 50000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setConfig({ ...config, investment: amount })}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      config.investment === amount
                        ? 'bg-teal text-white'
                        : 'bg-cream-dark text-navy hover:bg-cream'
                    }`}
                  >
                    ${amount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-navy font-medium mb-2">Number of Categories</label>
              <div className="flex gap-2">
                {[3, 4, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => setConfig({ ...config, numCategories: num })}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      config.numCategories === num
                        ? 'bg-teal text-white'
                        : 'bg-cream-dark text-navy hover:bg-cream'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-navy font-medium mb-2">Stocks Per Category</label>
              <div className="flex gap-2">
                {[1, 2, 3].map(num => (
                  <button
                    key={num}
                    onClick={() => setConfig({ ...config, stocksPerCategory: num })}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      config.stocksPerCategory === num
                        ? 'bg-teal text-white'
                        : 'bg-cream-dark text-navy hover:bg-cream'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfigSubmit}
              className="w-full bg-navy text-white py-3 rounded-xl font-semibold hover:bg-navy-light transition-colors"
            >
              Choose Categories →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Category Selection Step
  if (step === 'categories') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="font-display text-2xl font-bold text-navy mb-2">Select {config.numCategories} Categories</h3>
          <p className="text-navy-light mb-6">Choose which sectors you want to invest in.</p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {CATEGORIES.map(category => {
              const isSelected = selectedCategories.includes(category.id);
              const isDisabled = !isSelected && selectedCategories.length >= config.numCategories;

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  disabled={isDisabled}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-teal bg-teal/10'
                      : isDisabled
                        ? 'border-cream-dark opacity-50 cursor-not-allowed'
                        : 'border-cream-dark hover:border-teal/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    <span className="font-semibold text-navy">{category.name}</span>
                  </div>
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
            Pick Stocks →
          </button>
        </div>
      </div>
    );
  }

  // Stock Selection Step
  if (step === 'stocks') {
    const currentCategory = CATEGORIES.find(c => c.id === selectedCategories[currentCategoryIndex]);
    const availableStocks = getAvailableStocks();
    const currentSelections = selectedStocks[selectedCategories[currentCategoryIndex]] || [];

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{currentCategory?.icon}</span>
            <h3 className="font-display text-2xl font-bold text-navy">{currentCategory?.name}</h3>
            {statsLoading && <span className="text-sm text-navy-light animate-pulse">Loading live stats...</span>}
          </div>
          <p className="text-navy-light mb-6">
            Select {config.stocksPerCategory} stock{config.stocksPerCategory > 1 ? 's' : ''}
            ({currentCategoryIndex + 1} of {selectedCategories.length} categories)
          </p>

          <div className="space-y-3 mb-6">
            {availableStocks.map(stock => {
              const isSelected = currentSelections.find(s => s.ticker === stock.ticker);
              const isDisabled = !isSelected && currentSelections.length >= config.stocksPerCategory;
              const live = liveStats[stock.ticker];

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
                    <div>
                      <span className="font-bold text-navy text-lg">{stock.ticker}</span>
                      <span className="text-navy-light ml-2">{stock.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {live?.pe != null && (
                        <div>
                          <span className="text-navy-light">P/E: </span>
                          <span className="font-semibold text-navy">{live.pe.toFixed(1)}</span>
                        </div>
                      )}
                      {live?.eps != null && (
                        <div>
                          <span className="text-navy-light">EPS: </span>
                          <span className="font-semibold text-navy">${live.eps.toFixed(2)}</span>
                        </div>
                      )}
                      {live?.marketCap && (
                        <div>
                          <span className="text-navy-light">Mkt Cap: </span>
                          <span className="font-semibold text-navy">{live.marketCap}</span>
                        </div>
                      )}
                      {live?.beta != null && (
                        <div>
                          <span className="text-navy-light">Beta: </span>
                          <span className="font-semibold text-navy">{live.beta.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
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
              ? `Your $${config.dcaMonthly}/month since ${config.year} (${results.totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })} total) would now be worth`
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
              setSimulationResult(null);
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
