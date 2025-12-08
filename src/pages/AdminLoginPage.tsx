import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/admin/dashboard');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Back Link */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-6 sm:mb-8 text-sm sm:text-base"
                >
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to Store</span>
                </Link>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-2xl shadow-purple-500/30">
                            <i className="fas fa-shield-alt text-2xl sm:text-3xl text-white"></i>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Admin Login</h1>
                        <p className="text-purple-300/70 text-sm sm:text-base">Access the VarSys Admin Dashboard</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-5 sm:mb-6 backdrop-blur-xl">
                            <div className="flex items-start gap-3">
                                <i className="fas fa-exclamation-circle text-red-400 mt-0.5"></i>
                                <p className="text-red-200 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"></i>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
                                    placeholder="admin@varsys.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"></i>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt"></i>
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Note */}
                <p className="text-center text-purple-400/60 text-xs sm:text-sm mt-6 sm:mt-8">
                    Only authorized administrators can access this area.
                </p>
            </div>
        </div>
    );
}
