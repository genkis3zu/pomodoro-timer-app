import React, { useState, useEffect, useCallback } from 'react';
import Timer from './components/Timer';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import HelpModal from './components/HelpModal';
import { supabase } from './lib/supabaseClient';

import { useAudioDrone } from './hooks/useAudioDrone';

function App() {
    const [session, setSession] = useState({ user: { id: 'mock-user-id', email: 'test@example.com' } }); // Mock session for testing
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState('work');
    const [currentTask, setCurrentTask] = useState('');
    const [history, setHistory] = useState([]);
    const [totalXP, setTotalXP] = useState(0);
    const [authNotification, setAuthNotification] = useState(null);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    useAudioDrone(audioEnabled && mode === 'work');

    // Auth State Listener & Hash Parser
    /*
    useEffect(() => {
        const hash = window.location.hash;
        if (hash && hash.includes('error=')) {
            const params = new URLSearchParams(hash.substring(1));
            const errorDescription = params.get('error_description');
            if (errorDescription) {
                setAuthNotification({ type: 'error', message: decodeURIComponent(errorDescription.replace(/\+/g, ' ')) });
                window.history.replaceState(null, null, ' ');
            }
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) setAuthNotification(null);
        });

        return () => subscription.unsubscribe();
    }, []);
    */

    // Fetch Data on Session Change
    useEffect(() => {
        if (session?.user) {
            fetchProfile();
            fetchHistory();
        } else {
            setHistory([]);
            setTotalXP(0);
        }
    }, [session]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('total_xp, level')
                .eq('id', session.user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            if (data) {
                setTotalXP(data.total_xp || 0);
            }
        } catch (error) {
            console.error('Error fetching profile:', error.message);
        }
    };

    const fetchHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('sessions')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            if (data) {
                const formattedHistory = data.map(item => ({
                    id: item.id,
                    timestamp: item.created_at,
                    mode: item.mode,
                    task: item.task,
                    xp: item.xp_gained
                }));
                setHistory(formattedHistory);
            }
        } catch (error) {
            console.error('Error fetching history:', error.message);
        }
    };

    const handleTimerComplete = useCallback(async () => {
        const xpGained = mode === 'work' ? 25 : 5;
        const newTotalXP = totalXP + xpGained;
        const newLevel = Math.floor(newTotalXP / 100) + 1;

        setTotalXP(newTotalXP);
        const newSession = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            mode,
            task: currentTask,
            xp: xpGained
        };
        setHistory(prev => [newSession, ...prev]);

        if (session?.user) {
            try {
                const { error: sessionError } = await supabase
                    .from('sessions')
                    .insert([
                        {
                            user_id: session.user.id,
                            start_time: new Date(Date.now() - (mode === 'work' ? 25 : 5) * 60000).toISOString(),
                            end_time: new Date().toISOString(),
                            mode,
                            task: currentTask,
                            xp_gained: xpGained
                        }
                    ]);
                if (sessionError) throw sessionError;

                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ total_xp: newTotalXP, level: newLevel, updated_at: new Date() })
                    .eq('id', session.user.id);

                if (profileError) throw profileError;

            } catch (error) {
                console.error('Error saving progress:', error.message);
            }
        }
    }, [mode, totalXP, currentTask, session]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    const getBackgroundClass = () => {
        return mode === 'work'
            ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'
            : 'bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900';
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
    }

    return (
        <div className={`min-h-screen w-full transition-colors duration-1000 ease-in-out ${getBackgroundClass()} breathing-bg text-white overflow-hidden font-sans selection:bg-pink-500/30 flex flex-col`}>
            {/* Header */}
            <header className="flex-none px-6 py-4 flex justify-between items-center glass border-b border-white/5 relative z-20">
                <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${mode === 'work' ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
                    <div>
                        <h1 className="text-xl font-bold tracking-widest uppercase">Pomodoro Focus</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
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
                        v1.1.0
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
                        <Timer mode={mode} setMode={setMode} onComplete={handleTimerComplete} />
                    </div>
                </div>

                {/* Right Panel: Dashboard or Auth */}
                <div className="h-full w-full glass rounded-[2rem] shadow-2xl flex flex-col relative border border-white/10 overflow-hidden">
                    <div className="h-full w-full relative flex flex-col">
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[100px] opacity-10 pointer-events-none ${mode === 'work' ? 'bg-indigo-500' : 'bg-teal-500'}`}></div>

                        {session ? (
                            <div className="flex-1 overflow-hidden p-6">
                                <Dashboard
                                    history={history}
                                    currentTask={currentTask}
                                    setCurrentTask={setCurrentTask}
                                    totalXP={totalXP}
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
            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
        </div>
    );
}

export default App;
