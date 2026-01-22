import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const from = location.state?.from || '/';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-[calc(100vh-70px)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-[#121212] rounded-2xl p-8 border border-[#2a2a2a]">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="text-3xl font-bold tracking-tight mb-2">
                            <span className="text-white">me</span>
                            <span className="text-[#c41e3a]">pass</span>
                        </div>
                        <h1 className="text-2xl font-bold">Welcome Back!</h1>
                        <p className="text-gray-500 mt-1">Login to continue booking amazing events</p>
                    </div>

                    {error && (
                        <div className="p-4 mb-6 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 focus:outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 focus:outline-none transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#c41e3a] to-[#9a1830] text-white font-semibold py-4 rounded-lg hover:from-[#e63946] hover:to-[#c41e3a] hover:shadow-lg hover:shadow-[#c41e3a]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#2a2a2a]"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-4 bg-[#121212] text-gray-500 text-sm">OR</span>
                        </div>
                    </div>

                    <p className="text-center text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[#c41e3a] font-semibold hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
