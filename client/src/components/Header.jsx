import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';

const Header = () => {
    const { user, logout, isOrganizer, isAdmin } = useAuth();
    const { selectedCity, openCityModal } = useCity();
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <header className="bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-[#2a2a2a] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 h-[70px] flex items-center gap-4 lg:gap-8">
                {/* Logo */}
                <Link to="/" className="text-2xl lg:text-3xl font-bold tracking-tight hover:opacity-90 transition-opacity">
                    <span className="text-white">me</span>
                    <span className="text-[#c41e3a]">pass</span>
                </Link>

                {/* City Selector */}
                <button
                    onClick={openCityModal}
                    className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-transparent border border-[#2a2a2a] rounded-full text-white text-sm font-medium hover:border-[#c41e3a] hover:bg-[#c41e3a]/10 transition-all"
                >
                    <svg className="w-4 h-4 text-[#c41e3a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                    </svg>
                    <span className="hidden sm:inline">{selectedCity || 'Select your City'}</span>
                    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </button>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block relative">
                    <input
                        type="text"
                        placeholder="Search events/concerts/gigs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-3 px-5 pr-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-white text-sm placeholder-gray-500 focus:border-[#c41e3a] focus:outline-none transition-colors"
                    />
                    <button
                        type="submit"
                        className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-[#c41e3a] to-[#9a1830] rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                    </button>
                </form>

                {/* Right Section */}
                <div className="flex items-center gap-3 ml-auto">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-1.5 pr-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-white text-sm font-medium hover:border-[#c41e3a] transition-colors"
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-[#c41e3a] to-[#9a1830] rounded-full flex items-center justify-center font-semibold text-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden md:inline max-w-[100px] truncate">{user.name}</span>
                                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>

                            {showUserMenu && (
                                <div className="absolute top-full right-0 mt-2 w-72 bg-[#121212] border border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                                    <div className="flex items-center gap-3 p-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-[#c41e3a] to-[#9a1830] rounded-full flex items-center justify-center font-bold text-lg">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                    <div className="h-px bg-[#2a2a2a]" />
                                    <Link
                                        to="/my-bookings"
                                        onClick={() => setShowUserMenu(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#252525] transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        My Bookings
                                    </Link>
                                    {isOrganizer && (
                                        <Link
                                            to="/organizer"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#252525] transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 20h9" />
                                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                            </svg>
                                            Organizer Dashboard
                                        </Link>
                                    )}
                                    {isAdmin && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#252525] transition-colors text-[#c41e3a]"
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                                            </svg>
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <div className="h-px bg-[#2a2a2a]" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-[#252525] transition-colors w-full text-left"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                            <polyline points="16 17 21 12 16 7" />
                                            <line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="bg-gradient-to-r from-[#c41e3a] to-[#9a1830] text-white font-semibold py-2.5 px-6 rounded-lg hover:from-[#e63946] hover:to-[#c41e3a] hover:shadow-lg hover:shadow-[#c41e3a]/30 transition-all text-sm">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
