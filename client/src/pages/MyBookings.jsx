import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

const MyBookings = () => {
    const { token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${API_URL}/bookings/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(res.data.bookings);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-10 h-10 border-3 border-[#2a2a2a] border-t-[#c41e3a] rounded-full animate-spin"></div>
                <p className="text-gray-500">Loading bookings...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
            <h1 className="text-2xl lg:text-3xl font-bold mb-8">My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="text-center py-16 bg-[#1a1a1a] rounded-2xl">
                    <svg className="w-20 h-20 mx-auto mb-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                    <p className="text-gray-500 mb-6">You haven't booked any events yet.</p>
                    <Link to="/" className="bg-gradient-to-r from-[#c41e3a] to-[#9a1830] text-white font-semibold py-3 px-6 rounded-lg hover:from-[#e63946] hover:to-[#c41e3a] transition-all">
                        Browse Events
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking._id} className="bg-[#1a1a1a] rounded-xl overflow-hidden flex flex-col sm:flex-row">
                            <div className="sm:w-48 h-32 sm:h-auto">
                                <img
                                    src={booking.event?.image || 'https://via.placeholder.com/200x150?text=Event'}
                                    alt={booking.event?.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 p-4 sm:p-6">
                                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                                    <h3 className="text-lg font-semibold">{booking.event?.title || 'Event'}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed'
                                        ? 'bg-green-500/10 text-green-500'
                                        : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        {formatDate(booking.event?.date)}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                            <circle cx="12" cy="9" r="2.5" />
                                        </svg>
                                        {booking.event?.venue}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#2a2a2a]">
                                    <div className="text-sm">
                                        <span className="text-gray-500">Booking ID:</span>{' '}
                                        <span className="font-mono font-semibold text-[#c41e3a]">{booking.bookingId}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-500">{booking.tickets} ticket(s)</span>
                                        <span className="font-bold text-lg">₹{booking.totalPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
