import { FadeInSection, Quiz } from '../components';
import { beginnerMistakes } from '../educationalData';
import { PageNavigation } from '../PageLayout';

function Module3({ onQuizComplete, soundEnabled, quizScores }) {
  const getAnsweredCount = () => {
    let count = 0;
    for (let i = 0; i < beginnerMistakes.length; i++) {
      if (quizScores[`mistake-${i}`] !== undefined) count++;
      else break;
    }
    return count;
  };

  const answeredCount = getAnsweredCount();
  const allAnswered = answeredCount >= beginnerMistakes.length;

  return (
    <div className="min-h-screen bg-cream pt-20 pb-32 md:pb-12">
      <div className="container mx-auto px-6">
        <FadeInSection>
          <div className="text-center mb-16">
            <span className="inline-block bg-coral/10 text-coral px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Module 3
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-navy mb-4">
              Common Beginner Mistakes
            </h1>
            <p className="text-xl text-navy-light max-w-2xl mx-auto">
              Learn from others' expensive lessons.
            </p>
          </div>
        </FadeInSection>

        <div className="max-w-4xl mx-auto space-y-12">
          {beginnerMistakes.map((mistake, index) => {
            const quizId = `mistake-${index}`;
            const isAnswered = quizScores[quizId] !== undefined;
            const isVisible = index <= answeredCount;
            const wasCorrect = quizScores[quizId] === true;

            if (!isVisible) return null;

            return (
              <FadeInSection key={index} delay={0.1}>
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
                    onComplete={(correct) => onQuizComplete(quizId, correct)}
                    soundEnabled={soundEnabled}
                    answered={isAnswered}
                    wasCorrect={wasCorrect}
                    learnMoreUrl={mistake.learnMoreUrl}
                  />
                </div>
              </FadeInSection>
            );
          })}

          <PageNavigation 
            prevPath="/module/2" 
            prevLabel="Psychology"
            nextPath="/simulation" 
            nextLabel="Try the Simulation"
            nextDisabled={!allAnswered}
          />
        </div>
      </div>
    </div>
  );
}

export default Module3;
