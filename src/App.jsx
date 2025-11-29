import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { supabase } from './lib/supabaseClient';

function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState('work');
    const [currentTask, setCurrentTask] = useState('');
    const [history, setHistory] = useState([]);
    const [totalXP, setTotalXP] = useState(0);

    // Auth State Listener
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

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

    const handleTimerComplete = async () => {
        const xpGained = mode === 'work' ? 25 : 5;
        const newTotalXP = totalXP + xpGained;
        const newLevel = Math.floor(newTotalXP / 100) + 1;

        // Optimistic UI Update
        setTotalXP(newTotalXP);
        const newSession = {
            id: Date.now(), // Temporary ID
            timestamp: new Date().toISOString(),
            mode,
            task: currentTask,
            xp: xpGained
        };
        setHistory(prev => [newSession, ...prev]);

        // Only sync if logged in
        if (session?.user) {
            try {
                const { error: sessionError } = await supabase
                    .from('sessions')
                    .insert([
                        {
                            user_id: session.user.id,
                            start_time: new Date(Date.now() - (mode === 'work' ? 25 : 5) * 60000).toISOString(), // Approx start
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
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
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
        <div className={`min-h-screen w-full transition-colors duration-1000 ease-in-out ${getBackgroundClass()} text-white overflow-hidden font-sans selection:bg-pink-500/30 flex flex-col`}>
            {/* Header - Fixed height or minimal padding */}
            <header className="flex-none px-6 py-4 flex justify-between items-center glass border-b border-white/5 relative z-20">
                <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${mode === 'work' ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
                    <div>
                        <h1 className="text-xl font-bold tracking-widest uppercase">Pomodoro Focus</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-gray-300">
                        v1.0.0
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

            {/* Main Content - Fills remaining height */}
            <div className="flex-1 w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 relative z-10 overflow-hidden">

                {/* Left Panel: Timer */}
                <div className="h-full w-full glass rounded-[2rem] shadow-2xl flex flex-col items-center justify-center relative border border-white/10 overflow-hidden">
                    {/* Decorative background glow */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[120px] opacity-10 pointer-events-none ${mode === 'work' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                    <div className="relative z-10 w-full flex-1 flex flex-col justify-center">
                        <Timer mode={mode} setMode={setMode} onComplete={handleTimerComplete} />
                    </div>
                </div>

                {/* Right Panel: Dashboard or Auth */}
                <div className="h-full w-full glass rounded-[2rem] shadow-2xl flex flex-col relative border border-white/10 overflow-hidden">
                    <div className="h-full w-full relative flex flex-col">
                        {/* Decorative background glow for Right Panel */}
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
                                {/* Inner Glow */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

                                <Auth />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
