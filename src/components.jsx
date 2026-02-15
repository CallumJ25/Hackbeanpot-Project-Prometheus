import { useState, useEffect, useRef } from 'react';
import { SoundEffects } from './utils';
import { API_BASE_URL } from './config';

const CHAT_MAX_MESSAGES = 5;

const TopicChat = ({ topicContext }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messagesUsed, setMessagesUsed] = useState(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading || messagesUsed >= CHAT_MAX_MESSAGES) return;

    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const historyText = newMessages
      .map(m => `${m.role === 'user' ? 'Student' : 'Educator'}: ${m.text}`)
      .join('\n\n');

    const prompt = `You are a friendly financial educator helping a beginner learn about investing. Stay focused on the topic below and keep each answer under 120 words.

TOPIC CONTEXT:
${topicContext}

CONVERSATION:
${historyText}

Educator:`;

    try {
      const res = await fetch(`${API_BASE_URL}/gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructions: prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages(prev => [...prev, { role: 'assistant', text: data.output }]);
      setMessagesUsed(prev => prev + 1);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: '⚠️ Something went wrong. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const remaining = CHAT_MAX_MESSAGES - messagesUsed;

  return (
    <div className="mt-6 border-2 border-teal/20 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-teal/5 border-b border-teal/20">
        <span className="font-semibold text-navy text-sm">🤖 Ask Gemini</span>
        <span className="text-xs text-navy-light">{remaining} message{remaining !== 1 ? 's' : ''} left this session</span>
      </div>
      <div ref={scrollContainerRef} className="h-52 overflow-y-auto p-4 space-y-3 bg-white">
        {messages.length === 0 && (
          <p className="text-navy-light text-sm text-center pt-8">Ask anything about this topic!</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
              msg.role === 'user'
                ? 'bg-teal text-white rounded-br-sm'
                : 'bg-cream text-navy rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-cream text-navy-light px-3 py-2 rounded-xl rounded-bl-sm text-sm animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>
      <div className="p-3 bg-cream-dark border-t border-teal/20">
        {messagesUsed >= CHAT_MAX_MESSAGES ? (
          <p className="text-navy-light text-xs text-center py-1">
            Session limit reached ({CHAT_MAX_MESSAGES} messages). Close and reopen to start fresh.
          </p>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question about this topic..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 rounded-lg text-sm border border-cream-dark bg-white text-navy focus:border-teal focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

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

export const Quiz = ({ quiz, onComplete, soundEnabled = true, answered = false, wasCorrect = false, learnMoreUrl = null, topicContext = null }) => {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Reset local state when answered prop changes (e.g., when reset is pressed)
  useEffect(() => {
    if (answered) {
      setSelected(wasCorrect ? quiz.correct : -1);
      setShowResult(true);
    } else {
      setSelected(null);
      setShowResult(false);
    }
  }, [answered, wasCorrect, quiz.correct]);

  const handleSelect = (index) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    const isCorrect = index === quiz.correct;
    
    if (soundEnabled) {
      isCorrect ? SoundEffects.correct() : SoundEffects.incorrect();
    }
    
    setTimeout(() => onComplete && onComplete(isCorrect), 500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-cream-dark">
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="font-display text-lg font-semibold text-navy">
          {answered ? '✓ Completed' : '❓ Check Your Understanding'}
        </span>
        <div className="flex items-center gap-3">
          {topicContext && (
            <button
              onClick={() => setChatOpen(o => !o)}
              className={`text-sm font-medium flex items-center gap-1 transition-colors ${chatOpen ? 'text-teal' : 'text-navy-light hover:text-teal'}`}
            >
              🤖 Ask Gemini
            </button>
          )}
          {learnMoreUrl && (
            <a
              href={learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal hover:text-teal-light text-sm font-medium flex items-center gap-1 transition-colors"
            >
              📚 Learn More
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
      <p className="text-navy mb-6 font-medium">{quiz.question}</p>
      <div className="space-y-3">
        {quiz.options.map((option, index) => {
          let optionClass = "quiz-option border-2 border-cream-dark p-4 rounded-xl";
          if (!answered) optionClass += " cursor-pointer";
          
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
              onClick={() => !answered && handleSelect(index)}
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
        <div className={`mt-6 p-4 rounded-xl ${quiz.correct === selected || (answered && wasCorrect) ? 'bg-sage/20' : 'bg-amber/20'}`}>
          <p className="font-semibold text-navy mb-1">
            {(answered && wasCorrect) || quiz.correct === selected ? '✓ Correct!' : '✗ Not quite'}
          </p>
          <p className="text-navy-light text-sm">{quiz.explanation}</p>
          {learnMoreUrl && (
            <a
              href={learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-teal hover:text-teal-light text-sm font-medium"
            >
              → Want to dive deeper? Read more about this topic
            </a>
          )}
        </div>
      )}
      {topicContext && chatOpen && <TopicChat topicContext={topicContext} />}
    </div>
  );
};

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
  const createPath = (data) => data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(v)}`).join(' ');

  return (
    <div ref={chartRef} className="bg-white rounded-2xl p-6 shadow-lg">
      <h4 className="font-display text-xl font-bold text-navy mb-4">📈 Portfolio Growth Over Time</h4>
      
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {[0, 0.5, 1].map((pct, i) => {
          const y = padding + pct * chartHeight;
          const value = maxValue - pct * (maxValue - minValue);
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#1a2744" strokeOpacity="0.1" />
              <text x={padding - 5} y={y + 4} textAnchor="end" fontSize="10" fill="#1a2744" opacity="0.5">${(value / 1000).toFixed(0)}k</text>
            </g>
          );
        })}

        {[0, 0.5, 1].map((pct, i) => {
          const x = padding + pct * chartWidth;
          const year = Math.round(startYear + pct * years);
          return <text key={i} x={x} y={height - 10} textAnchor="middle" fontSize="10" fill="#1a2744" opacity="0.5">{year}</text>;
        })}

        {animated && (
          <>
            <path d={createPath(bankData)} fill="none" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="4" className="chart-line" style={{ animationDelay: '0s' }} />
            <path d={createPath(sp500Data)} fill="none" stroke="#E8A54B" strokeWidth="2.5" className="chart-line" style={{ animationDelay: '0.3s' }} />
            <path d={createPath(portfolioData)} fill="none" stroke="#3D8B8B" strokeWidth="3" className="chart-line" style={{ animationDelay: '0.6s' }} />
            <circle cx={xScale(points - 1)} cy={yScale(bankData[points - 1])} r="4" fill="#9CA3AF" className="chart-dot" style={{ animationDelay: '2s' }} />
            <circle cx={xScale(points - 1)} cy={yScale(sp500Data[points - 1])} r="5" fill="#E8A54B" className="chart-dot" style={{ animationDelay: '2.2s' }} />
            <circle cx={xScale(points - 1)} cy={yScale(portfolioData[points - 1])} r="6" fill="#3D8B8B" className="chart-dot" style={{ animationDelay: '2.4s' }} />
          </>
        )}
      </svg>

      <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2"><div className="w-4 h-1 bg-teal rounded"></div><span className="text-navy">Your Portfolio</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-1 bg-amber rounded"></div><span className="text-navy">S&P 500</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-0.5 bg-gray-400 rounded"></div><span className="text-navy">Savings Account</span></div>
      </div>
    </div>
  );
};
