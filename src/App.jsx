import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Storage } from './utils';
import { metrics, psychologyTopics, beginnerMistakes, chartLessons } from './educationalData';
import { TopNav } from './PageLayout';

import Home from './pages/Home';
import Module1 from './pages/Module1';
import Module2 from './pages/Module2';
import Module3 from './pages/Module3';
import Module4 from './pages/Module4';
import Simulation from './pages/Simulation';
import Conclusion from './pages/Conclusion';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  const [soundEnabled, setSoundEnabled] = useState(() => Storage.load('soundEnabled', true));
  const [quizScores, setQuizScores] = useState(() => Storage.load('quizScores', {}));
  const [totalCorrect, setTotalCorrect] = useState(() => Storage.load('totalCorrect', 0));
  const [totalAnswered, setTotalAnswered] = useState(() => Storage.load('totalAnswered', 0));

  const totalQuizzes = metrics.length + psychologyTopics.length + beginnerMistakes.length + chartLessons.length;

  useEffect(() => {
    Storage.save('quizScores', quizScores);
    Storage.save('totalCorrect', totalCorrect);
    Storage.save('totalAnswered', totalAnswered);
  }, [quizScores, totalCorrect, totalAnswered]);

  useEffect(() => {
    Storage.save('soundEnabled', soundEnabled);
  }, [soundEnabled]);

  const handleQuizComplete = (quizId, correct) => {
    if (quizScores[quizId] === undefined) {
      setQuizScores(prev => ({ ...prev, [quizId]: correct }));
      setTotalAnswered(prev => prev + 1);
      if (correct) setTotalCorrect(prev => prev + 1);
    }
  };

  const resetProgress = () => {
    setQuizScores({});
    setTotalCorrect(0);
    setTotalAnswered(0);
    Storage.clear('quizScores');
    Storage.clear('totalCorrect');
    Storage.clear('totalAnswered');
  };

  return (
    <div className="min-h-screen bg-cream">
      <ScrollToTop />
      <TopNav 
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        totalCorrect={totalCorrect}
        totalAnswered={totalAnswered}
        resetProgress={resetProgress}
        quizScores={quizScores}
      />
      
      <Routes>
        <Route path="/" element={<Home totalQuizzes={totalQuizzes} />} />
        <Route path="/module/1" element={
          <Module1 
            onQuizComplete={handleQuizComplete} 
            soundEnabled={soundEnabled}
            quizScores={quizScores}
          />
        } />
        <Route path="/module/2" element={
          <Module2 
            onQuizComplete={handleQuizComplete} 
            soundEnabled={soundEnabled}
            quizScores={quizScores}
          />
        } />
        <Route path="/module/3" element={
          <Module3 
            onQuizComplete={handleQuizComplete} 
            soundEnabled={soundEnabled}
            quizScores={quizScores}
          />
        } />
        <Route path="/module/4" element={
          <Module4 
            onQuizComplete={handleQuizComplete} 
            soundEnabled={soundEnabled}
            quizScores={quizScores}
          />
        } />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/conclusion" element={
          <Conclusion 
            totalCorrect={totalCorrect}
            totalAnswered={totalAnswered}
          />
        } />
      </Routes>
    </div>
  );
}

export default App;
