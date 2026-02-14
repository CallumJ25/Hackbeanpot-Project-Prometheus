import { useState, useEffect } from 'react';
import { Storage } from './utils';
import { metrics, psychologyTopics, beginnerMistakes, chartLessons } from './educationalData';
import { 
  FadeInSection, 
  Quiz, 
  ProgressBar, 
  Navigation, 
  MiniCandleChart, 
  CandlestickBuilder 
} from './components';
import StockSimulation from './StockSimulation';
import Animation from './Animation';

function App() {
  const [currentSection, setCurrentSection] = useState('hero');
  const [soundEnabled, setSoundEnabled] = useState(() => Storage.load('soundEnabled', true));
  const [quizScores, setQuizScores] = useState(() => Storage.load('quizScores', {}));
  const [totalCorrect, setTotalCorrect] = useState(() => Storage.load('totalCorrect', 0));
  const [totalAnswered, setTotalAnswered] = useState(() => Storage.load('totalAnswered', 0));

  const sections = [
    { id: 'hero', name: 'Welcome' },
    { id: 'problem', name: 'The Problem' },
    { id: 'mission', name: 'Our Mission' },
    { id: 'charts', name: 'Chart Reading' },
    { id: 'metrics', name: 'Key Metrics' },
    { id: 'psychology', name: 'Psychology' },
    { id: 'mistakes', name: 'Common Mistakes' },
    { id: 'simulation', name: 'Simulation' },
    { id: 'conclusion', name: 'Conclusion' }
  ];

  useEffect(() => {
    Storage.save('quizScores', quizScores);
    Storage.save('totalCorrect', totalCorrect);
    Storage.save('totalAnswered', totalAnswered);
  }, [quizScores, totalCorrect, totalAnswered]);

  useEffect(() => {
    Storage.save('soundEnabled', soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuizComplete = (quizId, correct) => {
    if (!quizScores[quizId]) {
      setQuizScores(prev => ({ ...prev, [quizId]: correct }));
      setTotalAnswered(prev => prev + 1);
      if (correct) setTotalCorrect(prev => prev + 1);
    }
  };

  const resetProgress = () => {text-cream/80
    setQuizScores({});
    setTotalCorrect(0);
    setTotalAnswered(0);
    Storage.clear('quizScores');
    Storage.clear('totalCorrect');
    Storage.clear('totalAnswered');
  };

  const totalQuizzes = metrics.length + psychologyTopics.length + beginnerMistakes.length + chartLessons.length;

  return (
    <div className="min-h-screen bg-slate-900">
      <ProgressBar current={totalAnswered} total={totalQuizzes} />
      <Navigation sections={sections} currentSection={currentSection} />
      
      {/* Settings Toggle */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          title={soundEnabled ? 'Sound On' : 'Sound Off'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
        {totalAnswered > 0 && (
          <button
            onClick={resetProgress}
            className="bg-white/90 backdrop-blur px-3 py-2 rounded-full shadow-lg hover:bg-white transition-colors text-sm text-navy-light"
          >
            Reset
          </button>
        )}
      </div>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber/20 rounded-full blur-3xl" />
        </div>

        {/* Background column - 25% width */}
        <div className="absolute left-0 top-0 w-1/4 min-h-screen bg-black z-0">
          <Animation />
        </div>

        <div className="relative min-h-screen">
          <div className="absolute left-0 top-1/2 z-10" style={{ transform: 'translateY(-50%) translateX(-30%) rotate(-90deg)', transformOrigin: 'center' }}>
            <FadeInSection>
              <h2 className="font-display text-[10vw] font-bold text-emerald-400 tracking-tight whitespace-nowrap">
                Prometheus 
              </h2>
            </FadeInSection>
          </div>
        </div>

        <div className="container mx-auto px-6 py-20 text-right relative z-10">
          <FadeInSection delay={0.2}>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-teal mb-6 leading-tight">
              Can we talk about the
              <span className="block text-emerald-400">financial and economic state</span>
              of the world right now?
            </h1>
          </FadeInSection>
          
          <FadeInSection delay={0.4}>
            <p className="text-xl md:text-2xl text-cream max-w-2xl ml-auto mb-12 text-right">
              Knowledge shouldn't be a privilege.
            </p>
          </FadeInSection>
          
          <FadeInSection delay={0.6}>
            <a 
              href="#problem"
              className="inline-flex items-center gap-3 bg-teal text-cream px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-400 transition-colors shadow-lg hover:shadow-xl"
            >
              Let's talk.
              <span className="text-xl">↓</span>
            </a>
          </FadeInSection>

          <FadeInSection delay={0.8}>
            <div className="mt-20 flex flex-wrap justify-end gap-8 text-white">
              <div>4 Modules</div>
              <div>{totalQuizzes} Quizzes</div>
              <div>~30 min</div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 md:py-32 bg-navy text-cream">
        <div className="container mx-auto px-6">
          <FadeInSection>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-16 text-center">
              The problem
            </h2>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <FadeInSection delay={0.1}>
              <div className="bg-navy-light/50 rounded-2xl p-8 text-center">
                <div className="text-5xl md:text-6xl font-display font-bold text-amber mb-2">61%</div>
                <p className="text-cream/80">of Americans own stocks, but most don't understand what they own</p>
              </div>
            </FadeInSection>
            
            <FadeInSection delay={0.2}>
              <div className="bg-navy-light/50 rounded-2xl p-8 text-center">
                <div className="text-5xl md:text-6xl font-display font-bold text-coral mb-2">90%</div>
                <p className="text-cream/80">of day traders lose money, largely due to lack of education</p>
              </div>
            </FadeInSection>
            
            <FadeInSection delay={0.3}>
              <div className="bg-navy-light/50 rounded-2xl p-8 text-center">
                <div className="text-5xl md:text-6xl font-display font-bold text-teal-light mb-2">73%</div>
                <p className="text-cream/80">make investment decisions based on tips from friends or family</p>
              </div>
            </FadeInSection>
          </div>

          <FadeInSection delay={0.4}>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xl text-cream/80 mb-8">
                Financial education is often gatekept behind expensive courses, confusing jargon, or inaccessible institutions. 
                Yet understanding money is fundamental to building a secure future.
              </p>
              <p className="text-amber font-semibold text-lg">
                We believe everyone deserves the knowledge to make informed financial decisions.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <FadeInSection>
              <div className="text-center mb-16">
                <span className="inline-block bg-amber/10 text-amber px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  Our Mission
                </span>
                <h2 className="font-display text-3xl md:text-5xl font-bold text-cream/80 mb-4">
                  Democratizing Financial Literacy
                </h2>
                <p className="text-xl text-cream/80 max-w-2xl mx-auto">
                  Free, accessible education for anyone who wants to understand how money and markets work.
                </p>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-3 gap-6">
              <FadeInSection delay={0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                  <span className="text-4xl mb-4 block">🎯</span>
                  <h3 className="font-display text-xl font-bold text-navy mb-2">Practical</h3>
                  <p className="text-navy-light">Real concepts you can use immediately, not abstract theory.</p>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={0.2}>
                <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                  <span className="text-4xl mb-4 block">📚</span>
                  <h3 className="font-display text-xl font-bold text-navy mb-2">Approachable</h3>
                  <p className="text-navy-light">Plain language explanations. No finance degree required.</p>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={0.3}>
                <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                  <span className="text-4xl mb-4 block">⚠️</span>
                  <h3 className="font-display text-xl font-bold text-navy mb-2">Honest</h3>
                  <p className="text-navy-light">We show you risks and limitations, not just opportunities.</p>
                </div>
              </FadeInSection>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: Chart Reading */}
      <section id="charts" className="py-20 md:py-32 bg-cream-dark">
        <div className="container mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="inline-block bg-teal/10 text-teal px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Module 1
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-navy mb-4">
                Reading Stock Charts
              </h2>
              <p className="text-xl text-navy-light max-w-2xl mx-auto">
                Charts tell a story. Learn to read it.
              </p>
            </div>
          </FadeInSection>

          <div className="max-w-4xl mx-auto space-y-12">
            {chartLessons.map((lesson, index) => (
              <FadeInSection key={index} delay={0.1 * index}>
                <div className="bg-white rounded-2xl p-6 md:p-10 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{lesson.emoji}</span>
                    <h3 className="font-display text-2xl font-bold text-navy">{lesson.title}</h3>
                  </div>
                  
                  <p className="text-navy-light mb-6">{lesson.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      {lesson.points.map((point, i) => (
                        <div key={i} className="flex gap-3">
                          <span className="text-teal font-bold">•</span>
                          <div>
                            <span className="font-semibold text-navy">{point.term}:</span>
                            <span className="text-navy-light ml-1">{point.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {lesson.name === 'Candlesticks' && <MiniCandleChart />}
                  </div>

                  {lesson.insight && (
                    <div className="bg-amber/10 rounded-xl p-4 mb-6">
                      <p className="text-navy"><span className="font-semibold text-amber">💡 Key insight:</span> {lesson.insight}</p>
                    </div>
                  )}

                  <Quiz 
                    quiz={lesson.quiz} 
                    onComplete={(correct) => handleQuizComplete(`chart-${index}`, correct)}
                    soundEnabled={soundEnabled}
                  />
                </div>
              </FadeInSection>
            ))}

            <FadeInSection delay={0.5}>
              <CandlestickBuilder />
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Module 2: Key Metrics */}
      <section id="metrics" className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="inline-block bg-amber/10 text-amber px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Module 2
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-cream/80">
                Key Metrics
              </h2>
              <p className="text-xl text-cream/80 max-w-2xl mx-auto">
                Numbers that actually matter when evaluating a stock.
              </p>
            </div>
          </FadeInSection>

          <div className="max-w-4xl mx-auto space-y-12">
            {metrics.map((metric, index) => (
              <FadeInSection key={index} delay={0.1 * index}>
                <div className="bg-white rounded-2xl p-6 md:p-10 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{metric.emoji}</span>
                    <div>
                      <h3 className="font-display text-2xl font-bold text-navy">{metric.name}</h3>
                      <p className="text-navy-light">{metric.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-navy-light mb-6">{metric.description}</p>
                  
                  <div className="bg-navy/5 rounded-xl p-4 mb-6 font-mono text-sm">
                    <span className="text-navy font-semibold">{metric.formula}</span>
                  </div>

                  <div className="bg-cream rounded-xl p-4 mb-6">
                    <p className="text-navy"><span className="font-semibold">Example:</span> {metric.example}</p>
                  </div>

                  {metric.categories && (
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      {metric.categories.map((cat, i) => (
                        <div key={i} className="bg-cream-dark rounded-xl p-4">
                          <p className="font-semibold text-navy">{cat.name}</p>
                          <p className="text-teal font-mono text-sm">{cat.range}</p>
                          <p className="text-navy-light text-sm">{cat.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {metric.insight && (
                    <div className="bg-amber/10 rounded-xl p-4 mb-6">
                      <p className="text-navy"><span className="font-semibold text-amber">💡 Context:</span> {metric.insight}</p>
                    </div>
                  )}

                  <div className="bg-teal/10 rounded-xl p-4 mb-6">
                    <p className="text-navy"><span className="font-semibold text-teal">📌 Key takeaway:</span> {metric.keyTakeaway}</p>
                  </div>

                  <Quiz 
                    quiz={metric.quiz} 
                    onComplete={(correct) => handleQuizComplete(`metric-${index}`, correct)}
                    soundEnabled={soundEnabled}
                  />
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Psychology */}
      <section id="psychology" className="py-20 md:py-32 bg-navy text-cream">
        <div className="container mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="inline-block bg-cream/10 text-cream px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Module 3
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Investor Psychology
              </h2>
              <p className="text-xl text-cream/80 max-w-2xl mx-auto">
                Your brain is wired to make bad investment decisions. Here's why.
              </p>
            </div>
          </FadeInSection>

          <div className="max-w-4xl mx-auto space-y-12">
            {psychologyTopics.map((topic, index) => (
              <FadeInSection key={index} delay={0.1 * index}>
                <div className="bg-navy-light/50 rounded-2xl p-6 md:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{topic.emoji}</span>
                    <div>
                      <h3 className="font-display text-2xl font-bold">{topic.name}</h3>
                      <p className="text-cream/70">{topic.fullName}</p>
                    </div>
                  </div>
                  
                  <div className="bg-navy/50 rounded-xl p-4 mb-6">
                    <p className="text-cream/90 italic">"{topic.scenario}"</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <span className="text-coral font-semibold">The danger:</span>
                      <p className="text-cream/80 mt-1">{topic.danger}</p>
                    </div>
                    <div>
                      <span className="text-teal-light font-semibold">Real example:</span>
                      <p className="text-cream/80 mt-1">{topic.realExample}</p>
                    </div>
                    <div>
                      <span className="text-sage font-semibold">The antidote:</span>
                      <p className="text-cream/80 mt-1">{topic.antidote}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 md:p-8">
                    <Quiz 
                      quiz={topic.quiz} 
                      onComplete={(correct) => handleQuizComplete(`psych-${index}`, correct)}
                      soundEnabled={soundEnabled}
                    />
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Common Mistakes */}
      <section id="mistakes" className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="inline-block bg-coral/10 text-coral px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Module 4
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-cream/80 mb-4">
                Common Beginner Mistakes
              </h2>
              <p className="text-xl text-cream/80 max-w-2xl mx-auto">
                Learn from others' expensive lessons.
              </p>
            </div>
          </FadeInSection>

          <div className="max-w-4xl mx-auto space-y-12">
            {beginnerMistakes.map((mistake, index) => (
              <FadeInSection key={index} delay={0.1 * index}>
                <div className="bg-white rounded-2xl p-6 md:p-10 shadow-lg border-l-4 border-coral">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{mistake.emoji}</span>
                    <div>
                      <h3 className="font-display text-2xl font-bold text-navy">{mistake.name}</h3>
                      <p className="text-navy-light italic">"{mistake.saying}"</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 my-6">
                    <div className="bg-coral/10 rounded-xl p-4">
                      <span className="font-semibold text-coral">The mistake:</span>
                      <p className="text-navy mt-1">{mistake.mistake}</p>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-navy">Why it happens:</span>
                      <p className="text-navy-light mt-1">{mistake.whyItHappens}</p>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-navy">The consequence:</span>
                      <p className="text-navy-light mt-1">{mistake.consequence}</p>
                    </div>
                    
                    <div className="bg-amber/10 rounded-xl p-4">
                      <span className="font-semibold text-amber">Real example:</span>
                      <p className="text-navy mt-1">{mistake.realExample}</p>
                    </div>
                    
                    <div className="bg-sage/10 rounded-xl p-4">
                      <span className="font-semibold text-sage">The solution:</span>
                      <p className="text-navy mt-1">{mistake.solution}</p>
                    </div>
                  </div>

                  <Quiz 
                    quiz={mistake.quiz} 
                    onComplete={(correct) => handleQuizComplete(`mistake-${index}`, correct)}
                    soundEnabled={soundEnabled}
                  />
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Module 5: Stock Simulation */}
      <section id="simulation" className="py-20 md:py-32 bg-cream-dark">
        <div className="container mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="inline-block bg-teal/10 text-teal px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Final Challenge
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-navy mb-4">
                Test Your Knowledge
              </h2>
              <p className="text-xl text-navy-light max-w-2xl mx-auto">
                Pick stocks using historical data. See how your portfolio would have performed.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <StockSimulation />
          </FadeInSection>
        </div>
      </section>

      {/* Conclusion */}
      <section id="conclusion" className="py-20 md:py-32 bg-gradient-to-b from-cream to-cream-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <FadeInSection>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-navy mb-6">
                That's the fundamentals.
              </h2>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              {totalAnswered > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 inline-block">
                  <p className="text-navy-light mb-2">Quiz Score</p>
                  <p className="font-display text-4xl font-bold text-teal">
                    {totalCorrect} / {totalAnswered}
                  </p>
                </div>
              )}
            </FadeInSection>

            <FadeInSection delay={0.3}>
              <p className="text-xl text-navy-light mb-8">
                You've covered chart reading, key metrics, investor psychology, and common mistakes. This is a foundation—not the whole picture.
              </p>
            </FadeInSection>

            <FadeInSection delay={0.4}>
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
                <h3 className="font-display text-xl font-bold text-navy mb-4">Key points to remember:</h3>
                <ul className="text-left space-y-3 text-navy-light">
                  <li className="flex gap-3">
                    <span className="text-teal">•</span>
                    <span>Education reduces risk but never eliminates it</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-teal">•</span>
                    <span>Start small, learn continuously, stay humble</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-teal">•</span>
                    <span>Your emotions are often your worst enemy</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-teal">•</span>
                    <span>Time in the market beats timing the market</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-teal">•</span>
                    <span>When in doubt, diversified index funds are solid</span>
                  </li>
                </ul>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.5}>
              <div className="bg-amber/10 border-2 border-amber/30 rounded-2xl p-6">
                <p className="text-navy">
                  <span className="font-semibold">Reminder:</span> This was educational content, not financial advice. Do your own research and consider consulting a financial advisor.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.6}>
              <div className="mt-12 pt-12 border-t border-navy/10">
                <p className="font-display text-2xl font-bold text-navy">Project Prometheus</p>
                <p className="text-navy-light text-sm mt-2">Financial education for everyone.</p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
