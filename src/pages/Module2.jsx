import { FadeInSection, Quiz, LockedContent } from '../components';
import { metrics } from '../educationalData';
import { PageNavigation } from '../PageLayout';

function Module2({ onQuizComplete, soundEnabled, quizScores }) {
  const getAnsweredCount = () => {
    let count = 0;
    for (let i = 0; i < metrics.length; i++) {
      if (quizScores[`metric-${i}`] !== undefined) count++;
      else break;
    }
    return count;
  };

  const answeredCount = getAnsweredCount();
  const allAnswered = answeredCount >= metrics.length;

  return (
    <div className="min-h-screen bg-cream pt-20 pb-32 md:pb-12">
      <div className="container mx-auto px-6">
        <FadeInSection>
          <div className="text-center mb-16">
            <span className="inline-block bg-amber/10 text-amber px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Module 2
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-navy mb-4">
              Key Metrics
            </h1>
            <p className="text-xl text-navy-light max-w-2xl mx-auto">
              Numbers that actually matter when evaluating a stock.
            </p>
            <p className="text-sm text-navy-light mt-4">
              Progress: {answeredCount} / {metrics.length} completed
            </p>
          </div>
        </FadeInSection>

        <div className="max-w-4xl mx-auto space-y-12">
          {metrics.map((metric, index) => {
            const quizId = `metric-${index}`;
            const isAnswered = quizScores[quizId] !== undefined;
            const isLocked = index > answeredCount;
            const wasCorrect = quizScores[quizId] === true;

            return (
              <div key={index}>
                <LockedContent isLocked={isLocked} message="Complete the question above to unlock this section">
                  <FadeInSection delay={0.1}>
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
                        onComplete={(correct) => onQuizComplete(quizId, correct)}
                        soundEnabled={soundEnabled}
                        answered={isAnswered}
                        wasCorrect={wasCorrect}
                      />
                    </div>
                  </FadeInSection>
                </LockedContent>
              </div>
            );
          })}

          <PageNavigation 
            prevPath="/module/1" 
            prevLabel="Chart Reading"
            nextPath="/module/3" 
            nextLabel="Psychology"
            nextDisabled={!allAnswered}
          />
        </div>
      </div>
    </div>
  );
}

export default Module2;
