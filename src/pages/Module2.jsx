import { FadeInSection, Quiz } from '../components';
import { psychologyTopics } from '../educationalData';
import { PageNavigation } from '../PageLayout';

function Module2({ onQuizComplete, soundEnabled, quizScores }) {
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
              Module 2
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Investor Psychology
            </h1>
            <p className="text-xl text-cream/80 max-w-2xl mx-auto">
              Your brain is wired to make bad investment decisions. Here's why.
            </p>
          </div>
        </FadeInSection>

        <div className="max-w-4xl mx-auto space-y-12">
          {psychologyTopics.map((topic, index) => {
            const quizId = `psych-${index}`;
            const isAnswered = quizScores[quizId] !== undefined;
            const isVisible = index <= answeredCount;
            const wasCorrect = quizScores[quizId] === true;

            if (!isVisible) return null;

            return (
              <FadeInSection key={index} delay={0.1}>
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
                      learnMoreUrl={topic.learnMoreUrl}
                      topicContext={[
                        `Topic: ${topic.name} — ${topic.fullName}`,
                        `Scenario: ${topic.scenario}`,
                        `The Danger: ${topic.danger}`,
                        `Real Example: ${topic.realExample}`,
                        `The Antidote: ${topic.antidote}`,
                        `Quiz Question: ${topic.quiz.question}`,
                        `Quiz Options:\n${topic.quiz.options.map((o, i) => `  ${String.fromCharCode(65 + i)}. ${o}`).join('\n')}`,
                        `Correct Answer: ${String.fromCharCode(65 + topic.quiz.correct)}. ${topic.quiz.options[topic.quiz.correct]}`,
                        `Explanation: ${topic.quiz.explanation}`,
                      ].join('\n')}
                    />
                  </div>
                </div>
              </FadeInSection>
            );
          })}

          <div className="pt-8">
            <PageNavigation 
              prevPath="/module/1" 
              prevLabel="Key Metrics"
              nextPath="/module/3" 
              nextLabel="Common Mistakes"
              nextDisabled={!allAnswered}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Module2;
