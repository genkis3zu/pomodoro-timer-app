import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Auth = ({ notification }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState(null);

    // Effect to set error from prop
    React.useEffect(() => {
        if (notification && notification.type === 'error') {
            setError(notification.message);
        }
    }, [notification]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: window.location.origin,
                    },
                });
                if (error) throw error;
                alert('Registration successful! Please check your email to confirm your account before logging in.');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold tracking-wider mb-2">SYNC PROGRESS</h1>
                <p className="text-gray-400 text-xs">Sign in to save your history & XP</p>
            </div>

            <form onSubmit={handleAuth} className="flex flex-col gap-4">
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
                        placeholder="you@example.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
                        placeholder="••••••••"
                        required
                    />
                </div>

                {error && (
                    <div className="text-red-400 text-xs text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
                >
                    {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
            </div>
        </div>
    );
};

export default Auth;
