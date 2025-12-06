import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Auth = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage({ text: 'Activation link sent to neural feed (email).', type: 'success' });
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="w-full max-w-md bg-slate-900/80 border border-blue-500/30 rounded-2xl p-8 shadow-[0_0_20px_rgba(59,130,246,0.2)] backdrop-blur-md relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-500/10 rounded-tl-full pointer-events-none"></div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 uppercase">
                        Neural Link
                    </h2>
                    <p className="text-xs text-blue-400/60 font-mono mt-2">AUTHENTICATION REQUIRED</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-blue-300/80 uppercase tracking-wider mb-2">
                            Identity (Email)
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-800/50 border border-blue-500/20 rounded-lg px-4 py-3 text-white placeholder-blue-500/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
                            placeholder="runner@net.city"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-blue-300/80 uppercase tracking-wider mb-2">
                            Access Key (Password)
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-800/50 border border-blue-500/20 rounded-lg px-4 py-3 text-white placeholder-blue-500/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
                            placeholder="••••••••"
                        />
                    </div>

                    {message.text && (
                        <div className={`text-xs font-mono p-3 rounded border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-300' : 'bg-green-500/10 border-green-500/50 text-green-300'}`}>
                            {message.type === 'error' ? '[ERROR]: ' : '[SUCCESS]: '}
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Connecting...
                            </>
                        ) : (
                            isSignUp ? 'Initialize Link' : 'Jack In'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setMessage({ text: '', type: '' });
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider underline decoration-blue-500/30 hover:decoration-blue-500"
                    >
                        {isSignUp ? 'Already connected? Login' : 'New connection? Sign Up'}
                    </button>
                    <p className="mt-4 text-[10px] text-slate-500 font-mono">
                        SECURE CONNECTION :: ENCRYPTED BY NETWATCH
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
