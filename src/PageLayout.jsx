import { Link, useLocation } from 'react-router-dom';

const modules = [
  { path: '/', name: 'Home', short: '🏠' },
  { path: '/module/1', name: 'Chart Reading', short: '1' },
  { path: '/module/2', name: 'Key Metrics', short: '2' },
  { path: '/module/3', name: 'Psychology', short: '3' },
  { path: '/module/4', name: 'Mistakes', short: '4' },
  { path: '/simulation', name: 'Simulation', short: '🎮' },
  { path: '/conclusion', name: 'Conclusion', short: '✓' },
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

export const TopNav = ({ soundEnabled, setSoundEnabled, totalCorrect, totalAnswered, resetProgress }) => {
  const location = useLocation();
  
  return (
    <>
      {/* Progress dots - desktop */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg">
          {modules.map((mod, index) => {
            const isActive = location.pathname === mod.path;
            return (
              <Link
                key={mod.path}
                to={mod.path}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-teal text-white scale-110' 
                    : 'bg-cream-dark text-navy hover:bg-teal/20'
                }`}
                title={mod.name}
              >
                {mod.short}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Settings - top right */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
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
            return (
              <Link
                key={mod.path}
                to={mod.path}
                className={`flex flex-col items-center p-2 ${
                  isActive ? 'text-teal' : 'text-navy-light'
                }`}
              >
                <span className="text-lg">{mod.short}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default PageNavigation;
