import { Link } from 'react-router-dom';
import { FadeInSection } from '../components';

function Home({ totalQuizzes }) {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 py-20 text-center relative z-10">
          <FadeInSection>
            <h2 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-navy tracking-tight mb-10">
              Project Prometheus
            </h2>
          </FadeInSection>
          
          <FadeInSection delay={0.2}>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-navy mb-6 leading-tight">
              Can we talk about the
              <span className="block text-teal">financial and economic state</span>
              of the world right now?
            </h1>
          </FadeInSection>
          
          <FadeInSection delay={0.4}>
            <p className="text-xl md:text-2xl text-navy-light max-w-2xl mx-auto mb-12">
              Knowledge shouldn't be a privilege.
            </p>
          </FadeInSection>
          
          <FadeInSection delay={0.6}>
            <a 
              href="#problem"
              className="inline-flex items-center gap-3 bg-navy text-cream px-8 py-4 rounded-full font-semibold text-lg hover:bg-navy-light transition-colors shadow-lg hover:shadow-xl"
            >
              Learn More
              <span className="text-xl">↓</span>
            </a>
          </FadeInSection>

          <FadeInSection delay={0.8}>
            <div className="mt-20 flex flex-wrap justify-center gap-8 text-navy-light">
              <div>3 Modules</div>
              <div>{totalQuizzes} Quizzes</div>
              <div>~20 min</div>
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
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <FadeInSection>
              <div className="text-center mb-16">
                <span className="inline-block bg-amber/10 text-amber px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  Our Mission
                </span>
                <h2 className="font-display text-3xl md:text-5xl font-bold text-navy mb-4">
                  Democratizing Financial Literacy
                </h2>
                <p className="text-xl text-navy-light max-w-2xl mx-auto">
                  Free, accessible education for anyone who wants to understand how money and markets work.
                </p>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
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

            <FadeInSection delay={0.4}>
              <div className="text-center">
                <Link 
                  to="/module/1"
                  className="inline-flex items-center gap-3 bg-teal text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-teal-light transition-colors shadow-lg hover:shadow-xl"
                >
                  Start Learning
                  <span className="text-xl">→</span>
                </Link>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
