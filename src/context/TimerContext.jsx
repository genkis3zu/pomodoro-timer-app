import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TimerContext = createContext();

export const useTimer = () => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error('useTimer must be used within a TimerProvider');
    }
    return context;
};

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export const TimerProvider = ({ children, onTimerComplete, onLog }) => {
    const [mode, setMode] = useState('work');
    const [timeLeft, setTimeLeft] = useState(WORK_TIME);
    const [isActive, setIsActive] = useState(false);
    const [totalTime, setTotalTime] = useState(WORK_TIME);
    const [showOverdrivePrompt, setShowOverdrivePrompt] = useState(false);
    const [overdriveActive, setOverdriveActive] = useState(false);

    // Update totalTime and reset timeLeft when mode changes
    useEffect(() => {
        const newTotalTime = mode === 'work' ? WORK_TIME : BREAK_TIME;
        setTotalTime(newTotalTime);
        setTimeLeft(newTotalTime);
        setIsActive(false);
        setShowOverdrivePrompt(false);
        setOverdriveActive(false);
        if (onLog) onLog(`MODE SWITCHED: ${mode.toUpperCase()}`, 'INFO');
    }, [mode]);

    // Timer Interval Logic
    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            if (mode === 'work' && !overdriveActive) {
                // Trigger Overdrive Prompt for Work mode
                setShowOverdrivePrompt(true);
                if (onLog) onLog('SESSION ENDED. AWAITING OVERDRIVE RESPONSE.', 'WARNING');
            } else {
                // Auto-complete for Break mode or if already in Overdrive (and it ends?)
                // If Overdrive ends (e.g. +10 mins done), maybe we prompt again or just finish?
                // For simplicity, let's finish if Overdrive ends.
                if (onTimerComplete) {
                    onTimerComplete(mode, overdriveActive);
                }
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode, onTimerComplete, overdriveActive]);

    const toggleTimer = useCallback(() => {
        setIsActive((prev) => {
            const newState = !prev;
            if (onLog) onLog(newState ? 'TIMER RESUMED' : 'TIMER PAUSED', 'INFO');
            return newState;
        });
    }, [onLog]);

    const resetTimer = useCallback(() => {
        setIsActive(false);
        setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME);
        setShowOverdrivePrompt(false);
        setOverdriveActive(false);
        if (onLog) onLog('TIMER RESET', 'WARNING');
    }, [mode, onLog]);

    const switchMode = useCallback((newMode) => {
        setMode(newMode);
    }, []);

    const startOverdrive = useCallback(() => {
        setShowOverdrivePrompt(false);
        setOverdriveActive(true);
        const overdriveTime = 10 * 60; // 10 minutes extension
        setTimeLeft(overdriveTime);
        setTotalTime(overdriveTime); // Update total time for progress bar? Or keep original? 
        // If we update totalTime, progress bar resets. That's probably fine for a "new" phase.
        setIsActive(true);
        if (onLog) onLog('OVERDRIVE INITIATED: +10 MIN', 'SUCCESS');
    }, [onLog]);

    const endSession = useCallback(() => {
        setShowOverdrivePrompt(false);
        if (onLog) onLog('JACK OUT: SESSION TERMINATED', 'INFO');
        if (onTimerComplete) {
            onTimerComplete(mode, overdriveActive);
        }
    }, [mode, overdriveActive, onTimerComplete, onLog]);

    const value = {
        mode,
        timeLeft,
        isActive,
        totalTime,
        toggleTimer,
        resetTimer,
        switchMode,
        setMode: switchMode,
        showOverdrivePrompt,
        overdriveActive,
        startOverdrive,
        endSession
    };

    return (
        <TimerContext.Provider value={value}>
            {children}
        </TimerContext.Provider>
    );
};
