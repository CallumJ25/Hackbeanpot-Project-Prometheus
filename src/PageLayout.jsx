import { Link, useLocation } from 'react-router-dom';

const modules = [
  { path: '/', name: 'Home', short: '🏠', questions: 0 },
  { path: '/module/1', name: 'Chart Reading', short: '1', questions: 3, prefix: 'chart' },
  { path: '/module/2', name: 'Key Metrics', short: '2', questions: 6, prefix: 'metric' },
  { path: '/module/3', name: 'Psychology', short: '3', questions: 5, prefix: 'psych' },
  { path: '/module/4', name: 'Mistakes', short: '4', questions: 5, prefix: 'mistake' },
  { path: '/simulation', name: 'Simulation', short: '🎮', questions: 0 },
  { path: '/conclusion', name: 'Conclusion', short: '✓', questions: 0 },
];

export const PageNavigation = ({ prevPath, nextPath, prevLabel, nextLabel, nextDisabled = false }) => {
  return (
    <div className="flex justify-between items-center max-w-4xl mx-auto mt-12 pt-8 border-t border-navy/10">
      {prevPath ? (
        <Link
          to={prevPath}
          className="flex items-center gap-2 px-6 py-3 bg-cream-dark text-navy rounded-xl font-semibold hover:bg-navy hover:text-white transition-colors"
        >
          <span>←</span>
          <span className="hidden sm:inline">{prevLabel || 'Previous'}</span>
        </Link>
      ) : (
        <div />
      )}
      
      {nextPath && (
        nextDisabled ? (
          <div className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-400 rounded-xl font-semibold cursor-not-allowed">
            <span className="hidden sm:inline">{nextLabel || 'Next'}</span>
            <span>🔒</span>
          </div>
        ) : (
          <Link
            to={nextPath}
            className="flex items-center gap-2 px-6 py-3 bg-teal text-white rounded-xl font-semibold hover:bg-teal-light transition-colors"
          >
            <span className="hidden sm:inline">{nextLabel || 'Next'}</span>
            <span>→</span>
          </Link>
        )
      )}
    </div>
  );
};

export const TopNav = ({ soundEnabled, setSoundEnabled, totalCorrect, totalAnswered, resetProgress, quizScores = {} }) => {
  const location = useLocation();
  
  // Count answered questions for a module
  const getModuleProgress = (prefix, total) => {
    if (!prefix || total === 0) return 0;
    let count = 0;
    for (let i = 0; i < total; i++) {
      if (quizScores[`${prefix}-${i}`] !== undefined) count++;
    }
    return count;
  };

  return (
    <>
      {/* Vertical sidebar - desktop */}
      <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden md:block">
        <div className="flex flex-col items-center gap-3 bg-white/90 backdrop-blur px-3 py-4 rounded-2xl shadow-lg">
          {modules.map((mod) => {
            const isActive = location.pathname === mod.path;
            const answeredCount = getModuleProgress(mod.prefix, mod.questions);
            
            return (
              <div key={mod.path} className="flex flex-col items-center">
                <Link
                  to={mod.path}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-teal text-white scale-110' 
                      : 'bg-cream-dark text-navy hover:bg-teal/20'
                  }`}
                  title={mod.name}
                >
                  {mod.short}
                </Link>
                
                {/* Question dots - only show for current module */}
                {isActive && mod.questions > 0 && (
                  <div className="flex flex-col gap-1 mt-2">
                    {Array.from({ length: mod.questions }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i < answeredCount 
                            ? 'bg-teal' 
                            : 'bg-cream-dark'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Settings - top right */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 md:right-20">
        {totalAnswered > 0 && (
          <div className="bg-white/90 backdrop-blur px-3 py-2 rounded-full shadow-lg text-sm text-navy">
            {totalCorrect}/{totalAnswered}
          </div>
        )}
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

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-cream-dark">
        <div className="flex justify-around py-2">
          {modules.map((mod) => {
            const isActive = location.pathname === mod.path;
            const answeredCount = getModuleProgress(mod.prefix, mod.questions);
            
            return (
              <Link
                key={mod.path}
                to={mod.path}
                className={`flex flex-col items-center p-2 ${
                  isActive ? 'text-teal' : 'text-navy-light'
                }`}
              >
                <span className="text-lg">{mod.short}</span>
                {/* Small progress bar for mobile */}
                {isActive && mod.questions > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: mod.questions }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          i < answeredCount ? 'bg-teal' : 'bg-cream-dark'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default PageNavigation;
