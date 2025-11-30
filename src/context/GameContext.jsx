import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const GameContext = createContext();

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

export const GameProvider = ({ children, session }) => {
    const [totalXP, setTotalXP] = useState(0);
    const [level, setLevel] = useState(1);
    const [history, setHistory] = useState([]);
    const [credits, setCredits] = useState(0); // New currency for shop
    const [inventory, setInventory] = useState([]); // Owned items
    const [systemLogs, setSystemLogs] = useState([]); // Operational logs

    // Fetch initial data
    useEffect(() => {
        if (session?.user) {
            fetchProfile();
            fetchHistory();
        } else {
            setTotalXP(0);
            setLevel(1);
            setHistory([]);
            setCredits(0);
            setInventory([]);
            setSystemLogs([]);
        }
    }, [session]);

    const addLog = (message, type = 'INFO') => {
        const newLog = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            message,
            type
        };
        setSystemLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
    };

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('total_xp, level') // We will need to add credits/inventory columns to DB later
                .eq('id', session.user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            if (data) {
                setTotalXP(data.total_xp || 0);
                setLevel(data.level || 1);
                // setCredits(data.credits || 0); 
                // setInventory(data.inventory || []);
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

    const addSession = async (mode, task, xpGained) => {
        const newTotalXP = totalXP + xpGained;
        const newLevel = Math.floor(newTotalXP / 100) + 1;
        const newCredits = credits + xpGained; // 1 XP = 1 Credit for now

        setTotalXP(newTotalXP);
        setLevel(newLevel);
        setCredits(newCredits);

        const newSession = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            mode,
            task,
            xp: xpGained
        };
        setHistory(prev => [newSession, ...prev]);
        addLog(`SESSION COMPLETE: ${task} (+${xpGained} XP)`, 'SUCCESS');

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
                            task,
                            xp_gained: xpGained
                        }
                    ]);
                if (sessionError) throw sessionError;

                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        total_xp: newTotalXP,
                        level: newLevel,
                        updated_at: new Date()
                        // credits: newCredits 
                    })
                    .eq('id', session.user.id);

                if (profileError) throw profileError;

            } catch (error) {
                console.error('Error saving progress:', error.message);
                addLog(`ERROR SAVING PROGRESS: ${error.message}`, 'ERROR');
            }
        }
    };

    const value = {
        totalXP,
        level,
        history,
        credits,
        inventory,
        systemLogs,
        addSession,
        addLog
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
