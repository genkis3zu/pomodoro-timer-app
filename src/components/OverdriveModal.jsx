import React from 'react';

const OverdriveModal = ({ onOverdrive, onJackOut }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-md p-1 rounded-2xl bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 animate-pulse-slow">
                <div className="bg-slate-900 rounded-xl p-8 text-center border border-white/10 relative overflow-hidden">
                    {/* Background Effect */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400 mb-2 tracking-widest uppercase">
                        System Warning
                    </h2>
                    <p className="text-red-200/80 font-mono text-sm mb-8 border-b border-red-500/30 pb-4">
                        CONNECTION UNSTABLE. SESSION LIMIT REACHED.
                    </p>

                    <div className="space-y-4 relative z-10">
                        <button
                            onClick={onOverdrive}
                            className="w-full group relative px-6 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-lg transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                            <div className="relative flex items-center justify-between">
                                <span className="text-xl font-bold text-red-100 group-hover:text-white tracking-wider">
                                    INITIATE OVERDRIVE
                                </span>
                                <span className="text-xs font-mono text-red-300 bg-red-900/50 px-2 py-1 rounded">
                                    +10 MIN / 1.5x XP
                                </span>
                            </div>
                        </button>

                        <button
                            onClick={onJackOut}
                            className="w-full px-6 py-3 text-gray-400 hover:text-white font-mono text-sm tracking-widest hover:bg-white/5 rounded-lg transition-colors"
                        >
                            JACK OUT (FINISH SESSION)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverdriveModal;
