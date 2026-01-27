import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Timer from './components/Timer';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import HelpModal from './components/HelpModal';
import SettingsModal from './components/SettingsModal';
import OverdriveModal from './components/OverdriveModal';
import ShopModal from './components/ShopModal';
import { supabase } from './lib/supabaseClient';
import { getPresets } from './lib/audioPresets';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { TimerProvider, useTimer } from './context/TimerContext';
import { GameProvider, useGame } from './context/GameContext';

// Inner component to consume contexts
const AppContent = ({ session }) => {
    const [currentTask, setCurrentTask] = useState('');
    const [authNotification] = useState(null);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);

    const { mode, showOverdrivePrompt, startOverdrive, endSession } = useTimer();
    const { history, totalXP, systemLogs, activeEffects } = useGame();

    const [showShop, setShowShop] = useState(false);

    // Audio Settings State - initialized with presets
    const initialAudioSettings = useMemo(() => {
        const presets = getPresets();
        const workPreset = presets.find(p => p.category === 'work');
        const breakPreset = presets.find(p => p.category === 'break');
        const alarmPreset = presets.find(p => p.category === 'alarm');
        return {
            work: { source: 'preset', presetId: workPreset?.id, volume: 0.5 },
            break: { source: 'preset', presetId: breakPreset?.id, volume: 0.5 },
            alarm: { source: 'preset', presetId: alarmPreset?.id, volume: 0.8 }
        };
    }, []);
    const [audioSettings, setAudioSettings] = useState(initialAudioSettings);

    // Determine current ambient source
    const getCurrentAudioSource = () => {
        const settings = audioSettings[mode];
        if (settings.source === 'custom') return settings.customUrl;
        if (settings.source === 'preset' && settings.presetId) {
            const preset = getPresets().find(p => p.id === settings.presetId);
            return preset?.url;
        }
        return null;
    };

    const currentAudioUrl = getCurrentAudioSource();
    const currentVolume = audioSettings[mode].volume;

    // Ambient Audio Player
    const shouldPlayAmbient = audioEnabled && !isAlarmPlaying && !isPreviewing;

    useAudioPlayer({
        src: currentAudioUrl,
        volume: currentVolume,
        loop: true,
        enabled: shouldPlayAmbient
    });

    // Alarm Player
    const alarmUrl = (() => {
        const settings = audioSettings.alarm;
        if (settings.source === 'custom') return settings.customUrl;
        if (settings.source === 'preset' && settings.presetId) {
            const preset = getPresets().find(p => p.id === settings.presetId);
            return preset?.url;
        }
        return null;
    })();

    const playAlarm = useCallback(() => {
        if (!alarmUrl) return;
        setIsAlarmPlaying(true);
        const audio = new Audio(alarmUrl);
        audio.volume = audioSettings.alarm.volume;
        audio.play().catch(e => console.error("Alarm failed:", e));

        audio.onended = () => {
            setIsAlarmPlaying(false);
        };
    }, [alarmUrl, audioSettings.alarm.volume]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    const getBackgroundClass = () => {
        const theme = activeEffects.visualTheme;

        if (theme === 'matrix') {
            return 'bg-black text-green-500 font-mono'; // Simplified matrix theme
        }
        if (theme === 'neon_samurai') {
            return mode === 'work'
                ? 'bg-gradient-to-br from-pink-900 via-purple-900 to-slate-900'
                : 'bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900';
        }
        if (theme === 'gold') {
            return 'bg-gradient-to-br from-slate-900 via-yellow-900/20 to-slate-900 border-yellow-500/20';
        }

        // Default
        return mode === 'work'
            ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'
            : 'bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900';
    };

    return (
        <div className={`min-h-screen w-full transition-colors duration-1000 ease-in-out ${getBackgroundClass()} breathing-bg text-white overflow-hidden font-sans selection:bg-pink-500/30 flex flex-col`}>
            {/* Header */}
            <header className="flex-none px-6 py-4 flex justify-between items-center glass border-b border-white/5 relative z-20">
                <div className="flex items-center gap-4">
                    <img src="/icon.png" alt="Logo" className="w-8 h-8 animate-pulse-slow" />
                    <div>
                        <h1 className="text-xl font-bold tracking-widest uppercase">Pomodoro Focus</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        title="Settings"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.42 24.42 0 010 3.46" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setShowHelp(true)}
                        className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        title="Guide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setAudioEnabled(!audioEnabled)}
                        className={`p-2 rounded-full transition-all ${audioEnabled ? 'bg-blue-500/20 text-blue-300' : 'text-gray-500 hover:text-gray-300'}`}
                        title="Toggle Ambient Drone"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            {audioEnabled ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                            )}
                        </svg>
                    </button>
                    <div className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-gray-300">
                        v1.3.0
                    </div>
                    {session && (
                        <button
                            onClick={handleSignOut}
                            className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                        >
                            Sign Out
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 relative z-10 overflow-hidden">
                {/* Left Panel: Timer */}
                <div className="h-full w-full glass rounded-[2rem] shadow-2xl flex flex-col items-center justify-center relative border border-white/10 overflow-hidden">
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[120px] opacity-10 pointer-events-none ${mode === 'work' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                    <div className="relative z-10 w-full flex-1 flex flex-col justify-center">
                        <Timer
                            audioEnabled={audioEnabled}
                            onToggleAudio={() => setAudioEnabled(!audioEnabled)}
                            playAlarm={playAlarm}
                        />
                    </div>
                </div>

                {/* Right Panel: Dashboard or Auth */}
                <div className="h-full w-full glass rounded-[2rem] border border-white/10 relative overflow-hidden shadow-2xl backdrop-blur-xl">
                    <div className="h-full w-full relative flex flex-col">
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[100px] opacity-10 pointer-events-none ${mode === 'work' ? 'bg-indigo-500' : 'bg-teal-500'}`}></div>
                        {session ? (
                            <div className="flex-1 overflow-hidden p-6">
                                <Dashboard
                                    history={history}
                                    currentTask={currentTask}
                                    setCurrentTask={setCurrentTask}
                                    totalXP={totalXP}
                                    systemLogs={systemLogs}
                                    onOpenShop={() => setShowShop(true)}
                                />
                            </div>
                        ) : (
                            <div className="h-full w-full flex flex-col gap-6 text-white p-8 items-center justify-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>
                                <Auth notification={authNotification} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showSettings && (
                <SettingsModal
                    onClose={() => setShowSettings(false)}
                    audioSettings={audioSettings}
                    onUpdateSettings={setAudioSettings}
                    onPreviewChange={setIsPreviewing}
                />
            )}
            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
            {showOverdrivePrompt && (
                <OverdriveModal
                    onOverdrive={startOverdrive}
                    onJackOut={endSession}
                />
            )}
            {showShop && <ShopModal onClose={() => setShowShop(false)} />}
        </div>
    );
};

function App() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <GameProvider session={session}>
            <TimerWrapper session={session} />
        </GameProvider>
    );
}

const TimerWrapper = ({ session }) => {
    const { addSession, addLog } = useGame();

    const handleTimerComplete = (mode, isOverdrive) => {
        let xpGained = mode === 'work' ? 25 : 5;
        if (isOverdrive) {
            xpGained = Math.floor(xpGained * 1.5); // 1.5x multiplier for overdrive
        }

        addSession(mode, "Focus Session", xpGained);
    };

    return (
        <TimerProvider onTimerComplete={handleTimerComplete} onLog={addLog}>
            <AppContent session={session} />
        </TimerProvider>
    );
};

export default App;
