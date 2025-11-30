import React from 'react';

const HelpModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg glass rounded-2xl p-8 border border-white/10 shadow-2xl overflow-hidden">
                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                {/* Header */}
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                        NEONFLOW GUIDE
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-6 relative z-10 text-white/90">
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-blue-300 uppercase tracking-wider">Terminology</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-200 font-mono text-xs border border-blue-500/30">NETRUN</span>
                                <span>Deep focus work session. Jack in and stay immersed.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 font-mono text-xs border border-emerald-500/30">COOLDOWN</span>
                                <span>Recovery break. Disconnect and recharge your neural link.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 font-mono text-xs border border-purple-500/30">XP</span>
                                <span>Experience Points. Earned by completing Netruns. Level up your focus.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">Controls</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="font-bold text-xs mb-1 text-white/70">JACK IN</div>
                                <div className="text-xs text-white/50">Start Timer</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="font-bold text-xs mb-1 text-white/70">JACK OUT</div>
                                <div className="text-xs text-white/50">Pause Timer</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-white/10 text-center relative z-10">
                    <p className="text-xs text-white/40 italic">
                        "Focus is the ultimate currency in the sprawl."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
