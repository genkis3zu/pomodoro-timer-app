import React from 'react';

const Controls = ({ isActive, onToggle, onReset, mode, onSwitchMode, startLabel = 'START', stopLabel = 'PAUSE', audioEnabled, onToggleAudio }) => {
    return (
        <div className="flex flex-col items-center gap-8 mt-10">
            {/* Mode Switcher */}
            <div className="flex p-1 bg-black/20 rounded-full backdrop-blur-sm">
                <button
                    onClick={() => onSwitchMode('work')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${mode === 'work'
                        ? 'bg-blue-500/20 text-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    NETRUN
                </button>
                <button
                    onClick={() => onSwitchMode('break')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${mode === 'break'
                        ? 'bg-emerald-500/20 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    COOLDOWN
                </button>
            </div>

            {/* Main Controls */}
            <div className="flex items-center gap-6">
                <button
                    onClick={onToggleAudio}
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 ${audioEnabled ? 'bg-blue-500/20 text-blue-300' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    title="Toggle BGM"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        {audioEnabled ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        )}
                    </svg>
                </button>

                <button
                    onClick={onReset}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 transition-all hover:scale-105 active:scale-95"
                    title="Reset"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>

                <button
                    onClick={onToggle}
                    className={`px-10 py-4 rounded-2xl font-bold text-xl tracking-wide text-white shadow-lg transition-all hover:scale-105 active:scale-95 relative overflow-hidden ${isActive
                        ? 'bg-gradient-to-r from-rose-500 to-pink-600 shadow-rose-500/30 animate-pulse-slow'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-500/30'
                        }`}
                >
                    <span className={`relative z-10 ${isActive ? 'animate-shake-occasional' : ''}`}>
                        {isActive ? stopLabel : startLabel}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Controls;
