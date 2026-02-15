import { Link, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Add this import

const modules = [
  { path: '/', name: 'Home', short: '🏠', questions: 0, prefix: null },
  { path: '/module/1', name: 'Key Metrics', short: '1', questions: 5, prefix: 'metric' },
  { path: '/module/2', name: 'Psychology', short: '2', questions: 5, prefix: 'psych' },
  { path: '/module/3', name: 'Mistakes', short: '3', questions: 5, prefix: 'mistake' },
  { path: '/simulation', name: 'Simulation', short: '🎮', questions: 0, prefix: null },
  { path: '/conclusion', name: 'Conclusion', short: '✓', questions: 0, prefix: null },
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

export const TopNav = ({ soundEnabled, setSoundEnabled, totalCorrect, totalAnswered, resetProgress, quizScores = {}, session, onOpenAuth }) => {
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

  // Check if a module is complete
  const isModuleComplete = (prefix, total) => {
    if (!prefix || total === 0) return true;
    return getModuleProgress(prefix, total) >= total;
  };

  // Check if a module is unlocked (previous module is complete)
  const isModuleUnlocked = (index) => {
    if (index === 0) return true; // Home always unlocked
    if (index === 1) return true; // Module 1 always unlocked
    
    // For modules 2-3, check if previous module is complete
    const prevModule = modules[index - 1];
    if (prevModule && prevModule.prefix) {
      return isModuleComplete(prevModule.prefix, prevModule.questions);
    }
    
    // Simulation requires Module 3 complete
    if (index === 4) {
      return isModuleComplete('mistake', 5);
    }
    
    // Conclusion is always accessible if simulation is
    if (index === 5) {
      return isModuleComplete('mistake', 5);
    }
    
    return true;
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {/* Vertical sidebar - desktop */}
      <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden md:block">
        <div className="flex flex-col items-center gap-3 bg-black backdrop-blur px-3 py-4 rounded-2xl shadow-lg">
          {modules.map((mod, index) => {
            const isActive = location.pathname === mod.path;
            const unlocked = isModuleUnlocked(index);
            
            return (
              <div key={mod.path} className="flex flex-col items-center">
                {unlocked ? (
                  <Link
                    to={mod.path}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      isActive 
                        ? 'bg-emerald-400 text-white scale-110' 
                        : 'bg-teal text-cream hover:bg-emerald-400'
                    }`}
                    title={mod.name}
                  >
                    {mod.short}
                  </Link>
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-gray-200 text-gray-400 cursor-not-allowed"
                    title={`Complete previous module to unlock ${mod.name}`}
                  >
                    {mod.short}
                  </div>
                )}
                
                {/* Question dots - only show for current module */}
                {isActive && mod.questions > 0 && (
                  <div className="flex flex-col gap-1 mt-2">
                    {Array.from({ length: mod.questions }).map((_, i) => {
                      const quizKey = `${mod.prefix}-${i}`;
                      const isAnswered = quizScores[quizKey] !== undefined;
                      const isCorrect = quizScores[quizKey]?.correct === true;
                      
                      return (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all ${
                            isAnswered 
                              ? (isCorrect ? 'bg-teal' : 'bg-coral') 
                              : 'bg-cream-dark'
                          }`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Settings - top right */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 md:right-20">
        {session ? (
          <>
            <Link
              to="/dashboard"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300 font-semibold hover:scale-105"
            >
              Leaderboard
            </Link>
            <button
              onClick={handleSignOut}
              className="bg-white/90 backdrop-blur px-6 py-2 rounded-full shadow-lg hover:bg-red-50 transition-all duration-300 text-red-600 font-semibold hover:scale-105"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300 font-semibold hover:scale-105"
          >
            Sign In
          </button>
        )}
        {totalAnswered > 0 && (
          <div className="bg-white/90 backdrop-blur px-3 py-2 rounded-full shadow-lg text-sm text-navy font-semibold">
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
          <div className="flex justify-center">
            <button
              onClick={resetProgress}
            >
              <Link 
                to="/module/1"
                className="bg-white/90 backdrop-blur px-6 py-2 rounded-full shadow-lg hover:bg-white transition-colors text-navy-light text-center font-semibold"
              >
                Reset
              </Link>
            </button>
          </div>
        )}
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-cream-dark">
        <div className="flex justify-around py-2">
          {modules.map((mod, index) => {
            const isActive = location.pathname === mod.path;
            const unlocked = isModuleUnlocked(index);
            
            if (!unlocked) {
              return (
                <div
                  key={mod.path}
                  className="flex flex-col items-center p-2 text-gray-300 cursor-not-allowed"
                >
                  <span className="text-lg">{mod.short}</span>
                </div>
              );
            }
            
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
                    {Array.from({ length: mod.questions }).map((_, i) => {
                      const quizKey = `${mod.prefix}-${i}`;
                      const isAnswered = quizScores[quizKey] !== undefined;
                      const isCorrect = quizScores[quizKey]?.correct === true;
                      
                      return (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isAnswered 
                              ? (isCorrect ? 'bg-teal' : 'bg-coral') 
                              : 'bg-cream-dark'
                          }`}
                        />
                      );
                    })}
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