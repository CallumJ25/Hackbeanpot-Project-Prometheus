import { useState, useEffect, useRef } from 'react';
import { SoundEffects } from './utils';
import { CANDLE_PATTERNS } from './config';

// ==================== FADE IN SECTION ====================
export const FadeInSection = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`fade-in ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

// ==================== QUIZ COMPONENT ====================
export const Quiz = ({ quiz, onComplete, moduleColor = "teal", quizId, soundEnabled = true }) => {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    const isCorrect = index === quiz.correct;
    
    if (soundEnabled) {
      isCorrect ? SoundEffects.correct() : SoundEffects.incorrect();
    }
    
    setTimeout(() => onComplete && onComplete(isCorrect), 1500);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(index);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-cream-dark">
      <div className="flex items-center gap-2 mb-4">
        <span className="font-display text-lg font-semibold text-navy">Check Your Understanding</span>
      </div>
      <p className="text-navy mb-6 font-medium">{quiz.question}</p>
      <div className="space-y-3" role="radiogroup" aria-label="Quiz options">
        {quiz.options.map((option, index) => {
          let optionClass = "quiz-option border-2 border-cream-dark p-4 rounded-xl cursor-pointer";
          if (showResult) {
            if (index === quiz.correct) {
              optionClass += " bg-sage/20 border-sage";
            } else if (index === selected && index !== quiz.correct) {
              optionClass += " bg-coral/20 border-coral";
            }
          }

          return (
            <div
              key={index}
              className={optionClass}
              onClick={() => handleSelect(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={showResult ? -1 : 0}
              role="radio"
              aria-checked={selected === index}
              aria-disabled={showResult}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  showResult && index === quiz.correct ? 'bg-sage text-white' :
                  showResult && index === selected && index !== quiz.correct ? 'bg-coral text-white' :
                  'bg-cream-dark text-navy'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-navy">{option}</span>
              </div>
            </div>
          );
        })}
      </div>
      {showResult && (
        <div className={`mt-6 p-4 rounded-xl ${selected === quiz.correct ? 'bg-sage/20' : 'bg-amber/20'}`} role="alert">
          <p className="font-semibold text-navy mb-1">
            {selected === quiz.correct ? '✓ Correct' : '✗ Not quite'}
          </p>
          <p className="text-navy-light text-sm">{quiz.explanation}</p>
        </div>
      )}
    </div>
  );
};

// ==================== PROGRESS BAR ====================
export const ProgressBar = ({ current, total }) => (
  <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-cream-dark">
    <div 
      className="progress-bar h-full bg-gradient-to-r from-teal to-amber"
      style={{ width: `${(current / total) * 100}%` }}
    />
  </div>
);

// ==================== NAVIGATION ====================
export const Navigation = ({ sections, currentSection }) => (
  <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
    <div className="flex flex-col gap-3">
      {sections.map((section, index) => (
        <a
          key={index}
          href={`#${section.id}`}
          className={`w-3 h-3 rounded-full transition-all ${
            currentSection === section.id 
              ? 'bg-emerald-400 scale-125' 
              : 'bg-teal hover:bg-navy/40'
          }`}
          title={section.name}
        />
      ))}
    </div>
  </nav>
);

// ==================== MINI CANDLE CHART ====================
export const MiniCandleChart = () => {
  const candles = [
    { open: 40, close: 55, high: 60, low: 35, green: true },
    { open: 55, close: 50, high: 62, low: 48, green: false },
    { open: 50, close: 65, high: 70, low: 48, green: true },
    { open: 65, close: 60, high: 72, low: 55, green: false },
    { open: 60, close: 75, high: 80, low: 58, green: true },
    { open: 75, close: 85, high: 90, low: 70, green: true },
    { open: 85, close: 78, high: 92, low: 75, green: false },
  ];

  return (
    <div className="flex items-end justify-center gap-2 h-32 p-4 bg-navy/5 rounded-xl">
      {candles.map((candle, i) => {
        const bodyTop = Math.max(candle.open, candle.close);
        const bodyBottom = Math.min(candle.open, candle.close);
        const bodyHeight = bodyTop - bodyBottom;
        
        return (
          <div key={i} className="relative flex flex-col items-center chart-candle" style={{ animationDelay: `${i * 0.1}s` }}>
            <div 
              className="w-0.5 bg-navy/40"
              style={{ height: `${(candle.high - bodyTop) * 1.2}px` }}
            />
            <div 
              className={`w-4 rounded-sm ${candle.green ? 'bg-sage' : 'bg-coral'}`}
              style={{ height: `${Math.max(bodyHeight * 1.2, 4)}px` }}
            />
            <div 
              className="w-0.5 bg-navy/40"
              style={{ height: `${(bodyBottom - candle.low) * 1.2}px` }}
            />
          </div>
        );
      })}
    </div>
  );
};

// ==================== CANDLESTICK BUILDER ====================
export const CandlestickBuilder = () => {
  const [candles, setCandles] = useState([
    { open: 50, close: 55, high: 58, low: 48 },
    { open: 55, close: 52, high: 57, low: 50 },
  ]);
  const [selectedCandle, setSelectedCandle] = useState(null);
  const [detectedPatterns, setDetectedPatterns] = useState([]);

  const detectPatterns = (candleList) => {
    const patterns = [];
    candleList.forEach((candle, i) => {
      CANDLE_PATTERNS.forEach(pattern => {
        if (pattern.detect(candle)) {
          patterns.push({ index: i, ...pattern });
        }
      });
    });
    return patterns;
  };

  useEffect(() => {
    setDetectedPatterns(detectPatterns(candles));
  }, [candles]);

  const addCandle = () => {
    const lastCandle = candles[candles.length - 1];
    const basePrice = lastCandle ? lastCandle.close : 50;
    const change = (Math.random() - 0.5) * 10;
    const newOpen = basePrice;
    const newClose = basePrice + change;
    const high = Math.max(newOpen, newClose) + Math.random() * 3;
    const low = Math.min(newOpen, newClose) - Math.random() * 3;
    setCandles([...candles, { open: newOpen, close: newClose, high, low }]);
  };

  const updateCandle = (index, field, value) => {
    const updated = [...candles];
    updated[index] = { ...updated[index], [field]: parseFloat(value) };
    const c = updated[index];
    c.high = Math.max(c.high, c.open, c.close);
    c.low = Math.min(c.low, c.open, c.close);
    setCandles(updated);
  };

  const removeCandle = (index) => {
    if (candles.length > 1) {
      setCandles(candles.filter((_, i) => i !== index));
      setSelectedCandle(null);
    }
  };

  const resetCandles = () => {
    setCandles([{ open: 50, close: 55, high: 58, low: 48 }]);
    setSelectedCandle(null);
  };

  const chartHeight = 200;
  const chartWidth = Math.max(400, candles.length * 50);
  const allPrices = candles.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...allPrices) - 2;
  const maxPrice = Math.max(...allPrices) + 2;
  const priceRange = maxPrice - minPrice;

  const priceToY = (price) => chartHeight - ((price - minPrice) / priceRange) * chartHeight;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h4 className="font-display text-xl font-bold text-navy mb-4">Build Your Own Chart</h4>
      <p className="text-navy-light text-sm mb-4">Click candles to edit them. Add candles to see patterns form.</p>
      
      <div className="overflow-x-auto mb-4">
        <svg width={chartWidth} height={chartHeight + 40} className="bg-navy/5 rounded-lg">
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
            <g key={i}>
              <line 
                x1="0" y1={pct * chartHeight} 
                x2={chartWidth} y2={pct * chartHeight} 
                stroke="#1a2744" strokeOpacity="0.1" 
              />
              <text x="5" y={pct * chartHeight + 12} fill="#1a2744" fontSize="10" opacity="0.5">
                ${(maxPrice - pct * priceRange).toFixed(0)}
              </text>
            </g>
          ))}
          
          {candles.map((candle, i) => {
            const x = 30 + i * 45;
            const isGreen = candle.close >= candle.open;
            const bodyTop = priceToY(Math.max(candle.open, candle.close));
            const bodyBottom = priceToY(Math.min(candle.open, candle.close));
            const bodyHeight = Math.max(bodyBottom - bodyTop, 2);
            const isSelected = selectedCandle === i;
            const hasPattern = detectedPatterns.some(p => p.index === i);
            
            return (
              <g 
                key={i} 
                onClick={() => setSelectedCandle(isSelected ? null : i)}
                className="builder-candle cursor-pointer"
                style={{ filter: isSelected ? 'drop-shadow(0 0 6px rgba(61, 139, 139, 0.6))' : 'none' }}
              >
                <line 
                  x1={x} y1={priceToY(candle.high)} 
                  x2={x} y2={bodyTop} 
                  stroke={isGreen ? '#81B29A' : '#E07A5F'} 
                  strokeWidth="2" 
                />
                <rect 
                  x={x - 10} y={bodyTop} 
                  width="20" height={bodyHeight} 
                  fill={isGreen ? '#81B29A' : '#E07A5F'}
                  rx="2"
                />
                <line 
                  x1={x} y1={bodyBottom} 
                  x2={x} y2={priceToY(candle.low)} 
                  stroke={isGreen ? '#81B29A' : '#E07A5F'} 
                  strokeWidth="2" 
                />
                {hasPattern && (
                  <circle cx={x} cy={chartHeight + 15} r="6" fill="#E8A54B" />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={addCandle}
          className="px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-light transition-colors"
        >
          Add Candle
        </button>
        <button
          onClick={resetCandles}
          className="px-4 py-2 bg-cream-dark text-navy rounded-lg hover:bg-cream transition-colors"
        >
          Reset
        </button>
      </div>

      {selectedCandle !== null && (
        <div className="bg-cream p-4 rounded-xl mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-navy">Edit Candle {selectedCandle + 1}</span>
            <button
              onClick={() => removeCandle(selectedCandle)}
              className="text-coral hover:text-coral/70 text-sm"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['open', 'close', 'high', 'low'].map(field => (
              <div key={field}>
                <label className="text-xs text-navy-light capitalize">{field}</label>
                <input
                  type="number"
                  value={candles[selectedCandle][field].toFixed(2)}
                  onChange={(e) => updateCandle(selectedCandle, field, e.target.value)}
                  className="w-full p-2 border border-cream-dark rounded-lg text-sm"
                  step="0.5"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {detectedPatterns.length > 0 && (
        <div className="bg-amber/10 p-4 rounded-xl">
          <p className="font-semibold text-navy mb-2">Patterns Detected:</p>
          <div className="space-y-1">
            {detectedPatterns.map((pattern, i) => (
              <p key={i} className="text-sm text-navy-light">
                <span className="text-amber">●</span> Candle {pattern.index + 1}: <strong>{pattern.name}</strong> - {pattern.description}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== PORTFOLIO CHART ====================
export const PortfolioChart = ({ startYear, endYear, startValue, endValue, comparisons }) => {
  const chartRef = useRef(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (chartRef.current) observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  const years = endYear - startYear;
  const points = Math.min(years + 1, 12);
  
  const generatePath = (start, end, volatility = 0.1) => {
    const data = [];
    let value = start;
    
    for (let i = 0; i < points; i++) {
      data.push(value);
      const progress = i / (points - 1);
      const targetValue = start + (end - start) * progress;
      const noise = (Math.random() - 0.5) * volatility * value;
      value = targetValue + noise * (1 - progress);
    }
    data[data.length - 1] = end;
    return data;
  };

  const portfolioData = generatePath(startValue, endValue, 0.15);
  const sp500Data = generatePath(startValue, comparisons.sp500, 0.1);
  const bankData = generatePath(startValue, comparisons.bank, 0);

  const width = 500;
  const height = 200;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const allValues = [...portfolioData, ...sp500Data, ...bankData, startValue];
  const maxValue = Math.max(...allValues) * 1.1;
  const minValue = Math.min(...allValues) * 0.9;

  const xScale = (i) => padding + (i / (points - 1)) * chartWidth;
  const yScale = (v) => padding + chartHeight - ((v - minValue) / (maxValue - minValue)) * chartHeight;

  const createPath = (data) => {
    return data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(v)}`).join(' ');
  };

  return (
    <div ref={chartRef} className="bg-white rounded-2xl p-6 shadow-lg">
      <h4 className="font-display text-xl font-bold text-navy mb-4">Portfolio Growth Over Time</h4>
      
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {[0, 0.5, 1].map((pct, i) => {
          const y = padding + pct * chartHeight;
          const value = maxValue - pct * (maxValue - minValue);
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#1a2744" strokeOpacity="0.1" />
              <text x={padding - 5} y={y + 4} textAnchor="end" fontSize="10" fill="#1a2744" opacity="0.5">
                ${(value / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}

        {[0, 0.5, 1].map((pct, i) => {
          const x = padding + pct * chartWidth;
          const year = Math.round(startYear + pct * years);
          return (
            <text key={i} x={x} y={height - 10} textAnchor="middle" fontSize="10" fill="#1a2744" opacity="0.5">
              {year}
            </text>
          );
        })}

        {animated && (
          <>
            <path
              d={createPath(bankData)}
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeDasharray="4"
              className="chart-line"
              style={{ animationDelay: '0s' }}
            />

            <path
              d={createPath(sp500Data)}
              fill="none"
              stroke="#E8A54B"
              strokeWidth="2.5"
              className="chart-line"
              style={{ animationDelay: '0.3s' }}
            />

            <path
              d={createPath(portfolioData)}
              fill="none"
              stroke="#3D8B8B"
              strokeWidth="3"
              className="chart-line"
              style={{ animationDelay: '0.6s' }}
            />

            <circle cx={xScale(points - 1)} cy={yScale(bankData[points - 1])} r="4" fill="#9CA3AF" 
              className="chart-dot" style={{ animationDelay: '2s' }} />
            <circle cx={xScale(points - 1)} cy={yScale(sp500Data[points - 1])} r="5" fill="#E8A54B" 
              className="chart-dot" style={{ animationDelay: '2.2s' }} />
            <circle cx={xScale(points - 1)} cy={yScale(portfolioData[points - 1])} r="6" fill="#3D8B8B" 
              className="chart-dot" style={{ animationDelay: '2.4s' }} />
          </>
        )}
      </svg>

      <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-teal rounded"></div>
          <span className="text-navy">Your Portfolio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-amber rounded"></div>
          <span className="text-navy">S&P 500</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-gray-400 rounded" style={{ borderStyle: 'dashed' }}></div>
          <span className="text-navy">Savings Account</span>
        </div>
      </div>
    </div>
  );
};
