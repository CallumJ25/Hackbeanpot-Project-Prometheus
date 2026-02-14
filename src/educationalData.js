// ==================== CHART LESSONS (no candlesticks) ====================
export const chartLessons = [
  {
    name: "Volume",
    emoji: "📊",
    title: "Understanding Volume",
    description: "Volume shows how many shares were traded. It helps confirm the strength of price movements.",
    learnMoreUrl: "https://www.investopedia.com/terms/v/volume.asp",
    points: [
      { term: "High volume + price move", description: "Strong conviction—move is more likely to continue" },
      { term: "Low volume + price move", description: "Weak conviction—move might reverse" },
      { term: "Volume spikes", description: "Something significant happened (news, earnings, etc.)" }
    ],
    insight: "Think of volume as the 'confidence' behind a price move. A breakout on high volume is more meaningful than one on low volume.",
    quiz: {
      question: "A stock breaks above its all-time high on volume 5x higher than average. What does this suggest?",
      options: [
        "The breakout will definitely continue",
        "Strong conviction—breakout more likely to hold",
        "The stock is being manipulated",
        "Volume doesn't matter for breakouts"
      ],
      correct: 1,
      explanation: "High volume on a breakout suggests strong buyer conviction. Not a guarantee, but a positive sign."
    }
  },
  {
    name: "Trends",
    emoji: "📈",
    title: "Identifying Trends",
    description: "Trends show the general direction. 'The trend is your friend'—it's generally easier to profit going with the trend than against it.",
    learnMoreUrl: "https://www.investopedia.com/terms/t/trend.asp",
    points: [
      { term: "Uptrend", description: "Higher highs AND higher lows over time" },
      { term: "Downtrend", description: "Lower highs AND lower lows over time" },
      { term: "Sideways/Range", description: "Price bouncing between levels, no clear direction" }
    ],
    insight: "Trying to catch falling knives (buying during downtrends) or shorting rockets (betting against uptrends) is risky. Waiting for trend changes is often smarter.",
    quiz: {
      question: "A stock makes a new high of $50, pulls back to $45, then makes a new high of $55, pulls back to $48. What's the trend?",
      options: [
        "Downtrend—it keeps falling from highs",
        "Uptrend—higher highs ($50→$55) and higher lows ($45→$48)",
        "Sideways—it's just bouncing around",
        "Can't determine from this information"
      ],
      correct: 1,
      explanation: "Higher highs (50→55) AND higher lows (45→48) = uptrend. Both conditions must be met."
    }
  },
  {
    name: "Support & Resistance",
    emoji: "🧱",
    title: "Support & Resistance Levels",
    description: "These are price levels where buying or selling pressure tends to emerge, causing price to bounce or stall.",
    learnMoreUrl: "https://www.investopedia.com/trading/support-and-resistance-basics/",
    points: [
      { term: "Support", description: "A floor where buyers step in, preventing further drops" },
      { term: "Resistance", description: "A ceiling where sellers emerge, preventing further rises" },
      { term: "Role reversal", description: "Broken resistance becomes support, broken support becomes resistance" }
    ],
    insight: "These levels aren't magic—they're zones where many traders placed orders. The more times a level holds, the more significant it becomes.",
    quiz: {
      question: "A stock has bounced off $40 three times over six months. It's now at $42. What is $40?",
      options: [
        "Resistance—it can't break above",
        "Support—buyers defend this level",
        "Neither—three times isn't significant",
        "A price target"
      ],
      correct: 1,
      explanation: "$40 is support—a level where buyers consistently step in. The more touches without breaking, the stronger the support."
    }
  }
];

// ==================== FINANCIAL METRICS ====================
export const metrics = [
  {
    name: "Market Cap",
    subtitle: "How Big Is This Company?",
    emoji: "🏢",
    description: "Market capitalization is the total value of a company's shares. Multiply the stock price by the total number of shares outstanding.",
    learnMoreUrl: "https://www.investopedia.com/terms/m/marketcapitalization.asp",
    formula: "Market Cap = Stock Price × Total Shares",
    example: "If a company has 1 million shares at $50 each, its market cap is $50 million.",
    categories: [
      { name: "Large Cap", range: "> $10 billion", description: "Established, generally stable (Apple, Microsoft)" },
      { name: "Mid Cap", range: "$2-10 billion", description: "Growing companies, moderate risk" },
      { name: "Small Cap", range: "< $2 billion", description: "Smaller companies, higher risk/reward" }
    ],
    keyTakeaway: "Market cap tells you the company's size. Larger isn't automatically better—it depends on what you're looking for.",
    quiz: {
      question: "A company has 2 million shares priced at $25 each. What's its market cap?",
      options: ["$25 million", "$50 million", "$75 million", "$100 million"],
      correct: 1,
      explanation: "2 million × $25 = $50 million"
    }
  },
  {
    name: "P/E Ratio",
    subtitle: "Is This Stock Expensive?",
    emoji: "⚖️",
    description: "The Price-to-Earnings ratio compares a company's stock price to its earnings. It shows how much investors pay for each dollar of earnings.",
    learnMoreUrl: "https://www.investopedia.com/terms/p/price-earningsratio.asp",
    formula: "P/E = Stock Price ÷ Earnings Per Share",
    example: "A stock at $100 with $5 EPS has a P/E of 20. You're paying $20 for every $1 of earnings.",
    insight: "A low P/E might mean undervalued—or that the company has problems. A high P/E might mean overvalued—or that investors expect strong growth. Context matters.",
    categories: [
      { name: "Low P/E", range: "< 15", description: "Potentially undervalued or troubled" },
      { name: "Average P/E", range: "15-25", description: "Fairly valued for most industries" },
      { name: "High P/E", range: "> 25", description: "Growth expectations or overvalued" }
    ],
    keyTakeaway: "P/E is a starting point, not a verdict. Compare within the same industry and understand why it's high or low.",
    quiz: {
      question: "A tech startup has a P/E of 80 while an established utility company has a P/E of 12. What's the most likely explanation?",
      options: [
        "The utility is a better investment",
        "The tech startup is overvalued",
        "Investors expect higher growth from the tech startup",
        "The utility company is failing"
      ],
      correct: 2,
      explanation: "High P/E often reflects growth expectations. Tech startups typically have higher P/E ratios because investors anticipate rapid earnings growth."
    }
  },
  {
    name: "EPS",
    subtitle: "Earnings Per Share",
    emoji: "💵",
    description: "EPS shows how much profit a company makes for each share of stock. It's a key indicator of profitability.",
    learnMoreUrl: "https://www.investopedia.com/terms/e/eps.asp",
    formula: "EPS = (Net Income - Dividends) ÷ Total Shares",
    example: "If a company earns $10 million and has 2 million shares, EPS = $5. Each share 'earned' $5.",
    insight: "Growing EPS over time is generally positive. Declining EPS could indicate trouble. But watch for companies artificially boosting EPS through stock buybacks.",
    keyTakeaway: "Look at EPS trends over multiple years, not just one quarter. Consistent growth matters more than a single good number.",
    quiz: {
      question: "Company A has EPS of $3 this year, up from $2 last year. Company B has EPS of $5 this year, down from $7 last year. Which is more concerning?",
      options: [
        "Company A—lower absolute EPS",
        "Company B—declining EPS trend",
        "Both are equally concerning",
        "Neither is concerning"
      ],
      correct: 1,
      explanation: "Declining EPS (Company B) is more concerning than lower absolute EPS. Trends matter more than single numbers."
    }
  },
  {
    name: "Beta",
    subtitle: "How Volatile Is This Stock?",
    emoji: "📉",
    description: "Beta measures how much a stock moves relative to the overall market. It indicates volatility and risk.",
    learnMoreUrl: "https://www.investopedia.com/terms/b/beta.asp",
    formula: "Beta = Stock's movement relative to market",
    example: "Beta of 1.5 means if the market goes up 10%, this stock typically goes up 15%. If the market drops 10%, it drops 15%.",
    categories: [
      { name: "Low Beta", range: "< 1", description: "Less volatile than the market (utilities, staples)" },
      { name: "Market Beta", range: "= 1", description: "Moves with the market" },
      { name: "High Beta", range: "> 1", description: "More volatile (tech, growth stocks)" }
    ],
    keyTakeaway: "High beta means higher potential returns but also higher risk. Match your investments to your risk tolerance and timeline.",
    quiz: {
      question: "You're retiring in 2 years and can't afford big losses. Which beta would be most appropriate?",
      options: ["Beta of 0.5", "Beta of 1.0", "Beta of 1.5", "Beta of 2.0"],
      correct: 0,
      explanation: "With a short timeline and need for stability, low beta (0.5) minimizes volatility risk."
    }
  },
  {
    name: "Dividend Yield",
    subtitle: "Getting Paid To Hold",
    emoji: "💰",
    description: "Dividend yield shows how much a company pays out in dividends relative to its stock price. It's passive income from your investments.",
    learnMoreUrl: "https://www.investopedia.com/terms/d/dividendyield.asp",
    formula: "Dividend Yield = Annual Dividends ÷ Stock Price × 100",
    example: "A $100 stock paying $4/year in dividends has a 4% yield. You earn 4% annually just for holding it.",
    insight: "High yields can be attractive, but extremely high yields (8%+) might signal trouble—the company may not sustain them, or the stock price crashed.",
    categories: [
      { name: "No Dividend", range: "0%", description: "Growth companies reinvesting profits" },
      { name: "Low Yield", range: "1-2%", description: "Balanced approach" },
      { name: "Moderate Yield", range: "2-4%", description: "Income-focused stocks" },
      { name: "High Yield", range: "4%+", description: "Strong income—verify sustainability" }
    ],
    keyTakeaway: "Don't chase yield blindly. Sustainable dividends from healthy companies beat high yields from struggling ones.",
    quiz: {
      question: "Stock A has a 2% yield and has increased dividends for 25 years. Stock B has an 8% yield but cut dividends last year. Which is generally safer for income?",
      options: [
        "Stock B—higher current yield",
        "Stock A—proven dividend history",
        "They're equally safe",
        "Neither is safe for income"
      ],
      correct: 1,
      explanation: "Dividend history matters more than current yield. Stock A's 25-year track record suggests reliability."
    }
  },
  {
    name: "Debt-to-Equity",
    subtitle: "How Much Does This Company Owe?",
    emoji: "📊",
    description: "This ratio compares what a company owes (debt) to what it owns (equity). It shows financial health and risk level.",
    learnMoreUrl: "https://www.investopedia.com/terms/d/debtequityratio.asp",
    formula: "D/E = Total Debt ÷ Shareholders' Equity",
    example: "D/E of 0.5 means for every $1 of equity, there's $0.50 of debt. D/E of 2 means $2 of debt for every $1 of equity.",
    insight: "Some debt is normal and can fuel growth. But too much debt means higher risk, especially during economic downturns when revenue drops but debt payments don't.",
    categories: [
      { name: "Low D/E", range: "< 0.5", description: "Conservative, stable" },
      { name: "Moderate D/E", range: "0.5-1.5", description: "Balanced leverage" },
      { name: "High D/E", range: "> 1.5", description: "Aggressive, higher risk" }
    ],
    keyTakeaway: "Compare D/E within the same industry. Capital-intensive industries (utilities, real estate) naturally have higher D/E.",
    quiz: {
      question: "Two retail companies: Company A has D/E of 0.3, Company B has D/E of 2.5. A recession hits. Which is likely more vulnerable?",
      options: [
        "Company A",
        "Company B",
        "They're equally vulnerable",
        "Can't determine from D/E alone"
      ],
      correct: 1,
      explanation: "Company B's high debt makes it more vulnerable during downturns—debt payments continue even if sales drop."
    }
  }
];

// ==================== PSYCHOLOGY TOPICS ====================
export const psychologyTopics = [
  {
    name: "FOMO",
    fullName: "Fear Of Missing Out",
    emoji: "😰",
    scenario: "Everyone's talking about a hot stock that's up 200% this month. Your friend just made $5,000. You feel the urge to buy now before it goes higher.",
    danger: "FOMO makes you buy at peaks. By the time 'everyone' knows about something, the easy gains are often gone. You end up buying high and selling low.",
    realExample: "During meme stock frenzies, many bought at peak prices driven by social media hype, only to see 50-80% losses within weeks.",
    antidote: "Have a plan before you invest. If a stock wasn't on your radar yesterday, ask why you suddenly need it today.",
    quiz: {
      question: "A stock you've never researched is up 150% this week due to social media buzz. What's the wisest approach?",
      options: [
        "Buy immediately before it goes higher",
        "Buy a small amount to not miss out completely",
        "Research first, accept you might miss this one",
        "Short the stock since it's obviously a bubble"
      ],
      correct: 2,
      explanation: "Missing an opportunity is better than losing money. There will always be more opportunities."
    }
  },
  {
    name: "Loss Aversion",
    fullName: "Losses Hurt More Than Gains Feel Good",
    emoji: "😣",
    scenario: "You bought a stock at $50. It drops to $35. You can't bring yourself to sell because that would 'make the loss real.' You hold, hoping it recovers.",
    danger: "Losses feel about twice as painful as equivalent gains feel good. This makes us hold losers too long and sell winners too early.",
    realExample: "Studies show investors hold losing stocks 1.5x longer than winners, hoping to 'break even'—often watching them fall further.",
    antidote: "Set stop-losses in advance. Ask: 'If I had cash instead of this stock today, would I buy it?' If no, consider selling regardless of your purchase price.",
    quiz: {
      question: "You bought at $100, now it's $60. The company's fundamentals have worsened. What does loss aversion typically make people do?",
      options: [
        "Sell and cut losses",
        "Hold and hope to break even",
        "Buy more to average down",
        "Research alternatives"
      ],
      correct: 1,
      explanation: "Loss aversion typically causes us to hold losers hoping to break even, even when fundamentals suggest we should exit."
    }
  },
  {
    name: "Herd Mentality",
    fullName: "Following The Crowd",
    emoji: "🐑",
    scenario: "Financial news says 'everyone' is buying tech stocks. Your coworkers are all talking about their gains. You feel foolish for not joining in.",
    danger: "Crowds create bubbles. When everyone buys, prices inflate beyond real value. When everyone panics, prices crash below fair value.",
    realExample: "The dot-com bubble (2000), housing crisis (2008), and various crypto bubbles all showed how crowd behavior amplifies both manias and crashes.",
    antidote: "Be skeptical when something is 'obvious' to everyone. As Warren Buffett says: 'Be fearful when others are greedy, and greedy when others are fearful.'",
    quiz: {
      question: "During a market panic, headlines scream 'SELL EVERYTHING!' and your portfolio is down 30%. What does herd mentality push you to do vs. what might be wiser?",
      options: [
        "Herd: Sell now / Wiser: Also sell to preserve capital",
        "Herd: Sell now / Wiser: Review fundamentals, possibly buy quality stocks on sale",
        "Herd: Buy more / Wiser: Sell to follow the smart money",
        "Herd: Do nothing / Wiser: Actively trade the volatility"
      ],
      correct: 1,
      explanation: "Panics often create buying opportunities for quality stocks. The herd sells at bottoms."
    }
  },
  {
    name: "Confirmation Bias",
    fullName: "Seeing What You Want To See",
    emoji: "🔍",
    scenario: "You love a company and buy its stock. Afterward, you only read positive news about it, dismiss negative reports, and seek out others who agree with you.",
    danger: "Confirmation bias blinds you to warning signs. You build confidence without building accuracy. Bad news gets filtered out until it's too late.",
    realExample: "Investors in major frauds (Enron, Theranos) often ignored red flags because they were emotionally invested in the success story.",
    antidote: "Actively seek out the bear case. Before buying, find the 3 best arguments against the investment. If you can't steelman the opposition, you don't understand the investment.",
    quiz: {
      question: "You own Stock X and love it. How should you approach research?",
      options: [
        "Focus on positive analysts to stay confident",
        "Only read the company's official communications",
        "Actively seek out critics and bear cases",
        "Avoid research—trust your initial thesis"
      ],
      correct: 2,
      explanation: "Seeking opposing views helps you understand risks and make informed decisions."
    }
  },
  {
    name: "Overconfidence",
    fullName: "Thinking You're Smarter Than The Market",
    emoji: "😎",
    scenario: "You made money on a few trades. You start to think you have a 'talent' for picking stocks. You increase your position sizes and trade more frequently.",
    danger: "Early success often comes from luck, not skill. Overconfidence leads to excessive trading, bigger bets, and eventually bigger losses.",
    realExample: "Studies show that the most active traders typically underperform passive investors by 6-7% annually—largely due to overconfidence.",
    antidote: "Track all your trades honestly, including losses. Compare your returns to simply buying an index fund. Most professionals can't beat the market consistently.",
    quiz: {
      question: "You've made money on 5 trades in a row. What's the most rational conclusion?",
      options: [
        "You have natural talent for stock picking",
        "Your strategy is proven—increase position sizes",
        "Could be skill, could be luck—need more data",
        "You should quit your job and trade full-time"
      ],
      correct: 2,
      explanation: "5 trades is far too small a sample to distinguish skill from luck. Even random picking would succeed sometimes."
    }
  }
];

// ==================== BEGINNER MISTAKES ====================
export const beginnerMistakes = [
  {
    name: "Not Diversifying",
    emoji: "🥚",
    saying: "Putting All Eggs In One Basket",
    mistake: "Investing everything in one stock, sector, or asset class because you're confident it will win.",
    whyItHappens: "Concentration feels exciting. Diversification feels boring. We overestimate our ability to pick winners.",
    consequence: "One bad pick can devastate your entire portfolio. Even great companies can fail unexpectedly.",
    realExample: "Employees of Enron, Lehman Brothers, and other failed companies lost retirement savings by concentrating in company stock.",
    solution: "Spread investments across different stocks, sectors, and asset classes. Index funds offer instant diversification.",
    quiz: {
      question: "You have $10,000 to invest. Which approach is most diversified?",
      options: [
        "$10,000 in your favorite tech stock",
        "$5,000 each in two tech stocks",
        "$2,500 each in tech, healthcare, finance, and consumer stocks",
        "$10,000 in a total market index fund"
      ],
      correct: 3,
      explanation: "An index fund holds hundreds of stocks across all sectors—maximum diversification with minimum effort."
    }
  },
  {
    name: "Timing The Market",
    emoji: "⏰",
    saying: "I'll Buy When It Drops More",
    mistake: "Waiting for the 'perfect' entry point or trying to predict short-term market movements.",
    whyItHappens: "We think we can outsmart the market. But markets are unpredictable in the short term.",
    consequence: "While waiting for a dip, you miss gains. Missing just the 10 best days in a decade can halve your returns.",
    realExample: "During the COVID crash (March 2020), many waited for 'further drops' and missed one of the fastest recoveries in history.",
    solution: "Time in the market beats timing the market. Dollar-cost averaging (investing regularly) removes the guessing game.",
    quiz: {
      question: "The market dropped 10%. You have cash to invest. What do most experts recommend?",
      options: [
        "Wait for it to drop more—catch the bottom",
        "Invest now—you can't predict the bottom",
        "Wait until it starts recovering to confirm the trend",
        "Invest half now, half if it drops further"
      ],
      correct: 1,
      explanation: "No one can reliably call bottoms. If you have money to invest and a long time horizon, invest it."
    }
  },
  {
    name: "Emotional Trading",
    emoji: "🎭",
    saying: "Panic Selling & Euphoria Buying",
    mistake: "Making investment decisions based on fear, greed, or excitement rather than logic.",
    whyItHappens: "Markets trigger strong emotions. Red days feel terrifying. Green days feel euphoric.",
    consequence: "Emotional traders buy at peaks (excitement) and sell at bottoms (fear)—the opposite of 'buy low, sell high.'",
    realExample: "In 2020, investors who panic-sold in March and waited to 'feel safe' missed a 70%+ recovery over the next year.",
    solution: "Write down your investment plan when calm. Follow it mechanically. Remove emotion from execution.",
    quiz: {
      question: "Your portfolio drops 20% in a week. You're panicking. What's the best immediate action?",
      options: [
        "Sell everything to stop the bleeding",
        "Buy more while it's cheap",
        "Do nothing—review your plan when calm",
        "Call your broker for advice"
      ],
      correct: 2,
      explanation: "Panic is the worst state for decision-making. Step back, breathe, and review your plan with a clear head."
    }
  },
  {
    name: "Ignoring Fees",
    emoji: "💸",
    saying: "It's Just 1%...",
    mistake: "Overlooking expense ratios, trading fees, and advisory fees because they seem small.",
    whyItHappens: "1-2% sounds trivial when you're focused on potential gains of 10%+.",
    consequence: "Over decades, fees compound dramatically. A 1% annual fee can cost you 25%+ of your final portfolio value over 30 years.",
    realExample: "$100,000 invested for 30 years at 7%: with 0.1% fees = ~$574,000. With 1% fees = ~$432,000. That's $142,000 lost to fees.",
    solution: "Choose low-cost index funds (0.03-0.20% expense ratios). Avoid funds with fees above 0.5% unless truly exceptional.",
    quiz: {
      question: "Fund A returns 8%/year with 1.5% fees. Fund B returns 7%/year with 0.1% fees. Over 30 years, which likely performs better for you?",
      options: [
        "Fund A—higher returns before fees",
        "Fund B—lower fees compound to bigger savings",
        "They're roughly equal",
        "Impossible to determine"
      ],
      correct: 1,
      explanation: "Net returns: Fund A = 6.5%, Fund B = 6.9%. Over 30 years, that 0.4% difference compounds significantly."
    }
  },
  {
    name: "Investing Money You Need",
    emoji: "🚨",
    saying: "I Can Always Sell If I Need It",
    mistake: "Investing your emergency fund or money you'll need within 1-3 years.",
    whyItHappens: "Keeping cash feels like 'wasting' potential returns.",
    consequence: "Markets often drop when emergencies cluster (recessions = job losses). You're forced to sell at the worst time.",
    realExample: "In 2008-2009, people who lost jobs often had to sell crashed investments at 40-50% losses to cover expenses.",
    solution: "Keep 3-6 months expenses in savings. Only invest money you won't need for 5+ years.",
    quiz: {
      question: "You have $20,000. You might need $5,000 for a car repair in 6 months. How should you allocate?",
      options: [
        "Invest all $20,000—you can sell if needed",
        "Keep $5,000 in savings, invest $15,000",
        "Keep all $20,000 in savings until the car is fixed",
        "Invest $18,000, keep $2,000 for minor emergencies"
      ],
      correct: 1,
      explanation: "Keep money you might need soon in savings. Invest only what you can truly leave alone for years."
    }
  }
];
