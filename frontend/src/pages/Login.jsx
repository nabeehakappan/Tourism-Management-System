import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plane, Lock, User } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/login',
                {
                    username,
                    password
                }
            );

            const user = response.data.user;

            // Store logged-in user for this session
            localStorage.setItem('traveliaUser', JSON.stringify(user));

            // Redirect based on role
            if (user.role === 'ADMIN') {
                navigate('/');
            } else {
                navigate('/packages');
            }

        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Unable to login. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center px-6">

            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#252525] text-white rounded-full mb-5">
                        <Plane size={21} strokeWidth={1.7} />
                    </div>

                    <h1 className="font-serif text-4xl text-[#252525] tracking-tight">
                        TRAVELIA
                    </h1>

                    <p className="text-sm text-gray-500 mt-2">
                        Your journey begins here.
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white border border-gray-200 p-8 shadow-sm">

                    <div className="mb-7">
                        <h2 className="text-2xl font-serif text-[#252525]">
                            Welcome back
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Sign in to continue to TRAVELIA.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>

                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="w-full border border-gray-300 pl-10 pr-4 py-3 text-sm outline-none focus:border-[#252525]"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>

                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full border border-gray-300 pl-10 pr-4 py-3 text-sm outline-none focus:border-[#252525]"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
                                {error}
                            </div>
                        )}

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#252525] text-white py-3 text-sm font-medium hover:bg-[#3a3a3a] transition disabled:opacity-60"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>

                    </form>

                    {/* Demo accounts */}
                    <div className="mt-7 pt-6 border-t border-gray-100">
                        <p className="text-xs text-gray-400 mb-3">
                            Demo accounts
                        </p>

                        <div className="text-xs text-gray-500 space-y-1">
                            <p>
                                <span className="font-medium">Admin:</span>{' '}
                                admin / admin123
                            </p>

                            <p>
                                <span className="font-medium">User:</span>{' '}
                                aarav / aarav123
                            </p>
                        </div>
                    </div>

                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    © 2026 TRAVELIA Tourism Management System
                </p>

            </div>
        </div>
    );
}

