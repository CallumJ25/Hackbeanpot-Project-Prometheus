import { FadeInSection, Quiz, LockedContent } from '../components';
import { psychologyTopics } from '../educationalData';
import { PageNavigation } from '../PageLayout';

function Module3({ onQuizComplete, soundEnabled, quizScores }) {
  const getAnsweredCount = () => {
    let count = 0;
    for (let i = 0; i < psychologyTopics.length; i++) {
      if (quizScores[`psych-${i}`] !== undefined) count++;
      else break;
    }
    return count;
  };

  const answeredCount = getAnsweredCount();
  const allAnswered = answeredCount >= psychologyTopics.length;

  return (
    <div className="min-h-screen bg-navy text-cream pt-20 pb-32 md:pb-12">
      <div className="container mx-auto px-6">
        <FadeInSection>
          <div className="text-center mb-16">
            <span className="inline-block bg-cream/10 text-cream px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Module 3
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Investor Psychology
            </h1>
            <p className="text-xl text-cream/80 max-w-2xl mx-auto">
              Your brain is wired to make bad investment decisions. Here's why.
            </p>
            <p className="text-sm text-cream/60 mt-4">
              Progress: {answeredCount} / {psychologyTopics.length} completed
            </p>
          </div>
        </FadeInSection>

        <div className="max-w-4xl mx-auto space-y-12">
          {psychologyTopics.map((topic, index) => {
            const quizId = `psych-${index}`;
            const isAnswered = quizScores[quizId] !== undefined;
            const isLocked = index > answeredCount;
            const wasCorrect = quizScores[quizId] === true;

            return (
              <div key={index}>
                <LockedContent isLocked={isLocked} message="Complete the question above to unlock this section">
                  <FadeInSection delay={0.1}>
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
                          onComplete={(correct) => onQuizComplete(quizId, correct)}
                          soundEnabled={soundEnabled}
                          answered={isAnswered}
                          wasCorrect={wasCorrect}
                        />
                      </div>
                    </div>
                  </FadeInSection>
                </LockedContent>
              </div>
            );
          })}

          <div className="pt-8">
            <PageNavigation 
              prevPath="/module/2" 
              prevLabel="Key Metrics"
              nextPath="/module/4" 
              nextLabel="Common Mistakes"
              nextDisabled={!allAnswered}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Module3;
