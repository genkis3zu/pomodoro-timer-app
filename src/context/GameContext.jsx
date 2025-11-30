import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CYBERWARE_CATALOG } from '../data/cyberware';

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
    const [inventory, setInventory] = useState(['theme_default']); // Owned items (IDs)
    const [equippedItems, setEquippedItems] = useState({
        theme: 'theme_default',
        audio: null,
        implants: []
    });
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
            setInventory(['theme_default']);
            setEquippedItems({ theme: 'theme_default', audio: null, implants: [] });
            setSystemLogs([]);
        }
    }, [session]);

    // Calculate Active Effects
    const activeEffects = useMemo(() => {
        let xpMultiplier = 1;
        let visualTheme = 'default';
        let audioPack = null;
        let overdriveCredit = 0;

        // Apply Theme
        const themeItem = CYBERWARE_CATALOG.find(i => i.id === equippedItems.theme);
        if (themeItem) visualTheme = themeItem.effect.value;

        // Apply Audio
        const audioItem = CYBERWARE_CATALOG.find(i => i.id === equippedItems.audio);
        if (audioItem) audioPack = audioItem.effect.value;

        // Apply Implants
        equippedItems.implants.forEach(implantId => {
            const item = CYBERWARE_CATALOG.find(i => i.id === implantId);
            if (item) {
                if (item.effect.type === 'xp_multiplier') xpMultiplier *= item.effect.value;
                if (item.effect.type === 'overdrive_credit') overdriveCredit += item.effect.value;
            }
        });

        return { xpMultiplier, visualTheme, audioPack, overdriveCredit };
    }, [equippedItems]);

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
                .select('total_xp, level, credits, inventory, equipped_items')
                .eq('id', session.user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            if (data) {
                setTotalXP(data.total_xp || 0);
                setLevel(data.level || 1);
                setCredits(data.credits || 0);
                setInventory(data.inventory || ['theme_default']);
                setEquippedItems(data.equipped_items || { theme: 'theme_default', audio: null, implants: [] });
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

    const buyItem = async (itemId) => {
        const item = CYBERWARE_CATALOG.find(i => i.id === itemId);
        if (!item) return { success: false, message: 'Item not found' };
        if (inventory.includes(itemId)) return { success: false, message: 'Item already owned' };
        if (credits < item.cost) return { success: false, message: 'Insufficient credits' };

        const newCredits = credits - item.cost;
        const newInventory = [...inventory, itemId];

        setCredits(newCredits);
        setInventory(newInventory);
        addLog(`PURCHASED: ${item.name} (-${item.cost} CR)`, 'SUCCESS');

        await saveProfile({ credits: newCredits, inventory: newInventory });
        return { success: true, message: 'Purchase successful' };
    };

    const equipItem = async (itemId, type) => {
        if (!inventory.includes(itemId)) return { success: false, message: 'Item not owned' };

        let newEquipped = { ...equippedItems };

        if (type === 'theme') {
            newEquipped.theme = itemId;
        } else if (type === 'audio') {
            newEquipped.audio = itemId === newEquipped.audio ? null : itemId; // Toggle
        } else if (type === 'implant') {
            // Toggle implant
            if (newEquipped.implants.includes(itemId)) {
                newEquipped.implants = newEquipped.implants.filter(id => id !== itemId);
            } else {
                // Limit implants? For now, unlimited slots.
                newEquipped.implants = [...newEquipped.implants, itemId];
            }
        }

        setEquippedItems(newEquipped);
        addLog(`EQUIPPED: ${CYBERWARE_CATALOG.find(i => i.id === itemId)?.name}`, 'INFO');
        await saveProfile({ equipped_items: newEquipped });
    };

    const saveProfile = async (updates) => {
        if (!session?.user) return;
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date()
                })
                .eq('id', session.user.id);
            if (error) throw error;
        } catch (error) {
            console.error('Error saving profile:', error.message);
            addLog(`ERROR SAVING PROFILE: ${error.message}`, 'ERROR');
        }
    };

    const addSession = async (mode, task, xpGained) => {
        // Apply XP Multiplier from active effects
        const finalXp = Math.floor(xpGained * activeEffects.xpMultiplier);

        const newTotalXP = totalXP + finalXp;
        const newLevel = Math.floor(newTotalXP / 100) + 1;
        const newCredits = credits + finalXp; // 1 XP = 1 Credit

        setTotalXP(newTotalXP);
        setLevel(newLevel);
        setCredits(newCredits);

        const newSession = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            mode,
            task,
            xp: finalXp
        };
        setHistory(prev => [newSession, ...prev]);
        addLog(`SESSION COMPLETE: ${task} (+${finalXp} XP)`, 'SUCCESS');

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
                            xp_gained: finalXp
                        }
                    ]);
                if (sessionError) throw sessionError;

                await saveProfile({
                    total_xp: newTotalXP,
                    level: newLevel,
                    credits: newCredits
                });

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
        equippedItems,
        activeEffects,
        systemLogs,
        addSession,
        addLog,
        buyItem,
        equipItem
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
