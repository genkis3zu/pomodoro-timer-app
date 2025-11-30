import React, { useState } from 'react';
import SystemLog from './SystemLog';

const Dashboard = ({ history, currentTask, setCurrentTask, totalXP, systemLogs }) => {
    const [viewMode, setViewMode] = useState('history'); // 'history' or 'system'
    const level = Math.floor(totalXP / 100) + 1;
    const xpProgress = totalXP % 100;

    return (
        <div className="h-full flex flex-col gap-6 text-white">
            {/* Header / Stats */}
            <div className="flex-none">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                            NEURAL LINK
                        </h2>
                        <div className="text-xs text-blue-300/70 font-mono">STATUS: ONLINE</div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-blue-300 font-bold">LEVEL {level}</div>
                        <div className="text-xs text-blue-300/50 font-mono">{totalXP} TOTAL XP</div>
                    </div>
                </div>

                {/* XP Bar */}
                <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5 relative">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 transition-all duration-1000 ease-out relative"
                        style={{ width: `${xpProgress}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Task Input */}
            <div className="flex-none">
                <label className="text-xs font-bold text-blue-300/70 uppercase tracking-wider mb-2 block">
                    Current Objective
                </label>
                <div className="relative group">
                    <input
                        type="text"
                        value={currentTask}
                        onChange={(e) => setCurrentTask(e.target.value)}
                        placeholder="ENTER MISSION OBJECTIVE..."
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
                    />
                    <div className="absolute inset-0 rounded-xl bg-blue-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
                </div>
            </div>

            {/* Logs Section */}
            <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-blue-300/70 uppercase tracking-wider block">
                        Data Logs
                    </label>
                    <div className="flex bg-slate-900/50 rounded-lg p-1 border border-white/5">
                        <button
                            onClick={() => setViewMode('history')}
                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${viewMode === 'history' ? 'bg-blue-500/20 text-blue-300' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            HISTORY
                        </button>
                        <button
                            onClick={() => setViewMode('system')}
                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${viewMode === 'system' ? 'bg-emerald-500/20 text-emerald-300' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            SYSTEM
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden bg-slate-900/30 rounded-xl border border-white/5 relative">
                    {viewMode === 'history' ? (
                        <div className="absolute inset-0 overflow-y-auto pr-2 space-y-2 p-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {history.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-white/20 italic text-sm border-2 border-dashed border-white/5 rounded-xl">
                                    <span>No data recorded</span>
                                </div>
                            ) : (
                                history.map((session) => (
                                    <div
                                        key={session.id}
                                        className="group flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all animate-fade-in"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1.5 h-8 rounded-full ${session.mode === 'work' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                                            <div>
                                                <div className="text-sm font-medium text-white/90">
                                                    {session.task || (session.mode === 'work' ? 'Netrun Session' : 'Cooldown')}
                                                </div>
                                                <div className="text-xs text-white/40 font-mono">
                                                    {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-bold text-blue-300">+{session.xp} XP</span>
                                            <span className="text-[10px] text-white/30 uppercase tracking-wider">{session.mode === 'work' ? 'NETRUN' : 'COOLDOWN'}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <SystemLog logs={systemLogs} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
