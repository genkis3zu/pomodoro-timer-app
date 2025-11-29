import React, { useState } from 'react';

const Dashboard = ({ history, currentTask, setCurrentTask, totalXP }) => {
    const level = Math.floor(totalXP / 100) + 1;
    const xpProgress = totalXP % 100;

    return (
        <div className="h-full flex flex-col gap-6 text-white p-4">
            {/* Header / Stats */}
            <div className="glass p-6 rounded-2xl">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h2 className="text-sm uppercase tracking-wider text-gray-400 font-semibold">Focus Level</h2>
                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">
                            {level}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-400">Total XP</div>
                        <div className="text-xl font-mono text-white">{totalXP}</div>
                    </div>
                </div>
                {/* XP Bar */}
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-300 to-yellow-500 transition-all duration-1000 ease-out"
                        style={{ width: `${xpProgress}%` }}
                    />
                </div>
                <div className="text-xs text-right mt-1 text-gray-500">{xpProgress} / 100 XP to next level</div>
            </div>

            {/* Task Input */}
            <div className="glass p-6 rounded-2xl">
                <label className="block text-sm font-medium text-gray-400 mb-2">Current Focus</label>
                <input
                    type="text"
                    value={currentTask}
                    onChange={(e) => setCurrentTask(e.target.value)}
                    placeholder="What are you working on?"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
            </div>

            {/* History List */}
            <div className="glass p-6 rounded-2xl flex-1 overflow-hidden flex flex-col">
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Session History</h3>
                <div className="overflow-y-auto pr-2 space-y-3 custom-scrollbar flex-1">
                    {history.length === 0 ? (
                        <div className="text-center text-gray-600 py-8 italic">
                            No sessions yet. Start focusing!
                        </div>
                    ) : (
                        history.map((session) => (
                            <div key={session.id} className="bg-white/5 rounded-xl p-3 flex justify-between items-center hover:bg-white/10 transition-colors border border-white/5">
                                <div>
                                    <div className="font-medium text-gray-200">{session.task || 'Untitled Session'}</div>
                                    <div className="text-xs text-gray-500">{new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                                <div className={`text-xs font-bold px-2 py-1 rounded-md ${session.mode === 'work' ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'
                                    }`}>
                                    +{session.xp} XP
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
