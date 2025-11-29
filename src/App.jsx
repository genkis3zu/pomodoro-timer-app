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
                // Map Supabase data to local format if needed, or use directly
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
        if (!session?.user) return;

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

        try {
            // 1. Insert Session
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

            // 2. Update Profile
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ total_xp: newTotalXP, level: newLevel, updated_at: new Date() })
                .eq('id', session.user.id);

            if (profileError) throw profileError;

        } catch (error) {
            console.error('Error saving progress:', error.message);
            // Revert optimistic update if needed (omitted for simplicity)
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setHistory([]);
        setTotalXP(0);
    };

    const getBackgroundClass = () => {
        return mode === 'work'
            ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'
            : 'bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900';
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
    }

    if (!session) {
        return <Auth />;
    }

    return (
        <div className={`min-h-screen transition-colors duration-1000 ease-in-out ${getBackgroundClass()} text-white overflow-y-auto font-sans selection:bg-pink-500/30`}>
            <div className="container mx-auto min-h-screen p-6 lg:p-12 flex flex-col max-w-7xl">
                {/* Header */}
                <header className="mb-8 flex justify-between items-center glass px-8 py-5 rounded-3xl border border-white/10 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${mode === 'work' ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-widest uppercase">Pomodoro Focus</h1>
                            <p className="text-xs text-gray-400 tracking-wide mt-0.5">Master your time, master your mind.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-gray-300">
                            v1.0.0
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 items-start">
                    {/* Left Panel: Timer */}
                    <div className="h-full flex flex-col">
                        <div className="glass p-12 rounded-[2.5rem] shadow-2xl w-full h-full min-h-[600px] flex flex-col items-center justify-center relative border border-white/10 overflow-hidden">
                            {/* Decorative background glow */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[120px] opacity-10 pointer-events-none ${mode === 'work' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                            <div className="relative z-10 w-full flex-1 flex flex-col justify-center">
                                <Timer mode={mode} setMode={setMode} onComplete={handleTimerComplete} />
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Dashboard */}
                    <div className="h-full flex flex-col">
                        <div className="h-full min-h-[600px]">
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
        </div>
    );
}

export default App;
