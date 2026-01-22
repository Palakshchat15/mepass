import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { register } = useAuth();

    const initialRole = searchParams.get('role') || 'user';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: initialRole
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        const result = await register(
            formData.name,
            formData.email,
            formData.password,
            formData.phone,
            formData.role
        );

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-[calc(100vh-70px)] flex items-center justify-center p-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-[#121212] rounded-2xl p-8 border border-[#2a2a2a]">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="text-3xl font-bold tracking-tight mb-2">
                            <span className="text-white">me</span>
                            <span className="text-[#c41e3a]">pass</span>
                        </div>
                        <h1 className="text-2xl font-bold">Create Account</h1>
                        <p className="text-gray-500 mt-1">
                            {formData.role === 'organizer'
                                ? 'Register as an event organizer'
                                : 'Join MePass to book amazing events'}
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 mb-6 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 focus:outline-none transition-all"
                            />
                        </div>

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
                            <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 focus:outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 focus:outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 focus:outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Register as</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 focus:outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="user">User - Book Events</option>
                                <option value="organizer">Organizer - Host Events</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#c41e3a] to-[#9a1830] text-white font-semibold py-4 rounded-lg hover:from-[#e63946] hover:to-[#c41e3a] hover:shadow-lg hover:shadow-[#c41e3a]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
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
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#c41e3a] font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
