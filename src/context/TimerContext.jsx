import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';

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
const OVERDRIVE_TIME = 10 * 60;

const initialState = {
    mode: 'work',
    timeLeft: WORK_TIME,
    isActive: false,
    totalTime: WORK_TIME,
    showOverdrivePrompt: false,
    overdriveActive: false
};

const timerReducer = (state, action) => {
    switch (action.type) {
        case 'SWITCH_MODE': {
            const newTime = action.mode === 'work' ? WORK_TIME : BREAK_TIME;
            return {
                ...state,
                mode: action.mode,
                totalTime: newTime,
                timeLeft: newTime,
                isActive: false,
                showOverdrivePrompt: false,
                overdriveActive: false
            };
        }
        case 'TICK':
            return { ...state, timeLeft: state.timeLeft - 1 };
        case 'TIMER_COMPLETE':
            return { ...state, isActive: false, showOverdrivePrompt: true };
        case 'TIMER_FINISH':
            return { ...state, isActive: false, showOverdrivePrompt: false };
        case 'START_OVERDRIVE':
            return {
                ...state,
                overdriveActive: true,
                timeLeft: OVERDRIVE_TIME,
                totalTime: OVERDRIVE_TIME,
                isActive: true,
                showOverdrivePrompt: false
            };
        case 'TOGGLE':
            return { ...state, isActive: !state.isActive };
        case 'RESET': {
            const resetTime = state.mode === 'work' ? WORK_TIME : BREAK_TIME;
            return {
                ...state,
                isActive: false,
                timeLeft: resetTime,
                showOverdrivePrompt: false,
                overdriveActive: false
            };
        }
        case 'END_SESSION':
            return { ...state, showOverdrivePrompt: false };
        default:
            return state;
    }
};

export const TimerProvider = ({ children, onTimerComplete, onLog }) => {
    const [state, dispatch] = useReducer(timerReducer, initialState);
    const prevModeRef = useRef(state.mode);

    // Log mode changes (using ref to detect actual changes)
    useEffect(() => {
        if (prevModeRef.current !== state.mode) {
            if (onLog) onLog(`MODE SWITCHED: ${state.mode.toUpperCase()}`, 'INFO');
            prevModeRef.current = state.mode;
        }
    }, [state.mode, onLog]);

    // Timer Interval Logic - only handles tick
    useEffect(() => {
        if (!state.isActive || state.timeLeft <= 0) return;
        const interval = setInterval(() => dispatch({ type: 'TICK' }), 1000);
        return () => clearInterval(interval);
    }, [state.isActive, state.timeLeft]);

    // Timer completion detection - separate effect
    useEffect(() => {
        if (state.timeLeft === 0 && state.isActive) {
            if (state.mode === 'work' && !state.overdriveActive) {
                dispatch({ type: 'TIMER_COMPLETE' });
                if (onLog) onLog('SESSION ENDED. AWAITING OVERDRIVE RESPONSE.', 'WARNING');
            } else {
                dispatch({ type: 'TIMER_FINISH' });
                if (onTimerComplete) {
                    onTimerComplete(state.mode, state.overdriveActive);
                }
            }
        }
    }, [state.timeLeft, state.isActive, state.mode, state.overdriveActive, onTimerComplete, onLog]);

    const toggleTimer = useCallback(() => {
        dispatch({ type: 'TOGGLE' });
        if (onLog) onLog(state.isActive ? 'TIMER PAUSED' : 'TIMER RESUMED', 'INFO');
    }, [onLog, state.isActive]);

    const resetTimer = useCallback(() => {
        dispatch({ type: 'RESET' });
        if (onLog) onLog('TIMER RESET', 'WARNING');
    }, [onLog]);

    const switchMode = useCallback((newMode) => {
        dispatch({ type: 'SWITCH_MODE', mode: newMode });
    }, []);

    const startOverdrive = useCallback(() => {
        dispatch({ type: 'START_OVERDRIVE' });
        if (onLog) onLog('OVERDRIVE INITIATED: +10 MIN', 'SUCCESS');
    }, [onLog]);

    const endSession = useCallback(() => {
        dispatch({ type: 'END_SESSION' });
        if (onLog) onLog('JACK OUT: SESSION TERMINATED', 'INFO');
        if (onTimerComplete) {
            onTimerComplete(state.mode, state.overdriveActive);
        }
    }, [state.mode, state.overdriveActive, onTimerComplete, onLog]);

    const value = {
        mode: state.mode,
        timeLeft: state.timeLeft,
        isActive: state.isActive,
        totalTime: state.totalTime,
        toggleTimer,
        resetTimer,
        switchMode,
        setMode: switchMode,
        showOverdrivePrompt: state.showOverdrivePrompt,
        overdriveActive: state.overdriveActive,
        startOverdrive,
        endSession
    };

    return (
        <TimerContext.Provider value={value}>
            {children}
        </TimerContext.Provider>
    );
};
