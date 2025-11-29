import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import Dashboard from './components/Dashboard';

function App() {
  const [mode, setMode] = useState('work');
  const [currentTask, setCurrentTask] = useState('');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('pomodoro_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [totalXP, setTotalXP] = useState(() => {
    const saved = localStorage.getItem('pomodoro_xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('pomodoro_history', JSON.stringify(history));
    localStorage.setItem('pomodoro_xp', totalXP.toString());
  }, [history, totalXP]);

  const handleTimerComplete = () => {
    const xpGained = mode === 'work' ? 25 : 5;
    const newSession = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      mode,
      task: currentTask,
      xp: xpGained
    };

    setHistory(prev => [newSession, ...prev]);
    setTotalXP(prev => prev + xpGained);
  };

  const getBackgroundClass = () => {
    return mode === 'work'
      ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'
      : 'bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900';
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 ease-in-out ${getBackgroundClass()} text-white overflow-hidden`}>
      <div className="container mx-auto h-screen p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Panel: Timer */}
          <div className="flex items-center justify-center h-full">
            <div className="glass p-12 rounded-3xl shadow-2xl w-full max-w-xl aspect-square flex items-center justify-center relative overflow-hidden">
              {/* Decorative background glow */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full blur-[100px] opacity-20 ${mode === 'work' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
              <div className="relative z-10">
                <Timer mode={mode} setMode={setMode} onComplete={handleTimerComplete} />
              </div>
            </div>
          </div>

          {/* Right Panel: Dashboard */}
          <div className="h-full hidden lg:block">
            <Dashboard
              history={history}
              currentTask={currentTask}
              setCurrentTask={setCurrentTask}
              totalXP={totalXP}
            />
          </div>

          {/* Mobile Dashboard (Optional: could be a toggle or stacked below) */}
          <div className="lg:hidden">
            <Dashboard
              history={history}
              currentTask={currentTask}
              setCurrentTask={setCurrentTask}
              totalXP={totalXP}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
