import React from 'react';
import ProgressBar from './ProgressBar';
import Controls from './Controls';
import { useTimer } from '../context/TimerContext';

const Timer = ({ audioEnabled, onToggleAudio, playAlarm }) => {
    const { mode, timeLeft, isActive, totalTime, toggleTimer, resetTimer, switchMode } = useTimer();

    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200 drop-shadow-sm">
                    NEONFLOW
                </h1>
                <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase ${mode === 'work' ? 'bg-blue-500/20 text-blue-200' : 'bg-emerald-500/20 text-emerald-200'
                    }`}>
                    {mode === 'work' ? 'NETRUN MODE' : 'COOLDOWN MODE'}
                </div>
            </div>

            <ProgressBar progress={progress} size={320} strokeWidth={12} mode={mode}>
                <div className="text-7xl font-mono font-bold tracking-tighter text-glow text-white">
                    {formatTime(timeLeft)}
                </div>
            </ProgressBar>

            <Controls
                isActive={isActive}
                onToggle={toggleTimer}
                onReset={resetTimer}
                mode={mode}
                onSwitchMode={switchMode}
                startLabel="JACK IN"
                stopLabel="JACK OUT"
                audioEnabled={audioEnabled}
                onToggleAudio={onToggleAudio}
            />
        </div>
    );
};

export default Timer;
