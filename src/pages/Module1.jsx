import { FadeInSection, Quiz, LockedContent } from '../components';
import { chartLessons } from '../educationalData';
import { PageNavigation } from '../PageLayout';

function Module1({ onQuizComplete, soundEnabled, quizScores }) {
  // Check how many quizzes have been answered in this module
  const getAnsweredCount = () => {
    let count = 0;
    for (let i = 0; i < chartLessons.length; i++) {
      if (quizScores[`chart-${i}`] !== undefined) count++;
      else break; // Stop at first unanswered
    }
    return count;
  };

  const answeredCount = getAnsweredCount();
  const allAnswered = answeredCount >= chartLessons.length;

  return (
    <div className="min-h-screen bg-cream-dark pt-20 pb-32 md:pb-12">
      <div className="container mx-auto px-6">
        <FadeInSection>
          <div className="text-center mb-16">
            <span className="inline-block bg-teal/10 text-teal px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Module 1
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-navy mb-4">
              Reading Stock Charts
            </h1>
            <p className="text-xl text-navy-light max-w-2xl mx-auto">
              Charts tell a story. Learn to read it.
            </p>
            <p className="text-sm text-navy-light mt-4">
              Progress: {answeredCount} / {chartLessons.length} completed
            </p>
          </div>
        </FadeInSection>

        <div className="max-w-4xl mx-auto space-y-12">
          {chartLessons.map((lesson, index) => {
            const quizId = `chart-${index}`;
            const isAnswered = quizScores[quizId] !== undefined;
            const isLocked = index > answeredCount;
            const wasCorrect = quizScores[quizId] === true;

            return (
              <div key={index}>
                <LockedContent isLocked={isLocked} message="Complete the question above to unlock this section">
                  <FadeInSection delay={0.1}>
                    <div className="bg-white rounded-2xl p-6 md:p-10 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{lesson.emoji}</span>
                        <h3 className="font-display text-2xl font-bold text-navy">{lesson.title}</h3>
                      </div>
                      
                      <p className="text-navy-light mb-6">{lesson.description}</p>
                      
                      <div className="space-y-3 mb-6">
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

                      {lesson.insight && (
                        <div className="bg-amber/10 rounded-xl p-4 mb-6">
                          <p className="text-navy"><span className="font-semibold text-amber">💡 Key insight:</span> {lesson.insight}</p>
                        </div>
                      )}

                      <Quiz 
                        quiz={lesson.quiz} 
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
            prevPath="/" 
            prevLabel="Home"
            nextPath="/module/2" 
            nextLabel="Key Metrics"
            nextDisabled={!allAnswered}
          />
        </div>
      </div>
    </div>
  );
}

export default Module1;
