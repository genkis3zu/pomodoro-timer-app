import React, { useState, useEffect, useRef } from 'react';
import ProgressBar from './ProgressBar';
import Controls from './Controls';

const WORK_TIME = 2; // 2 seconds for testing
const BREAK_TIME = 2; // 2 seconds for testing

const Timer = ({ mode, setMode, onComplete, alarmUrl, alarmVolume = 0.5 }) => {
    const [timeLeft, setTimeLeft] = useState(WORK_TIME);
    const [isActive, setIsActive] = useState(false);
    const audioContextRef = useRef(null);

    const totalTime = mode === 'work' ? WORK_TIME : BREAK_TIME;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    useEffect(() => {
        // Reset timer when mode changes externally
        setIsActive(false);
        setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME);
    }, [mode]);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            playAlarm();
            if (onComplete) onComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, onComplete]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME);
    };

    const playAlarm = () => {
        if (alarmUrl) {
            const audio = new Audio(alarmUrl);
            audio.volume = alarmVolume;
            audio.play().catch(e => console.error("Alarm playback failed:", e));
            return;
        }

        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);

        gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.5);
    };

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
                onSwitchMode={setMode}
                startLabel="JACK IN"
                stopLabel="JACK OUT"
            />
        </div>
    );
};

export default Timer;
