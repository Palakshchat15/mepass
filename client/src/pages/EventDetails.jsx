import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, token } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState(1);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const res = await axios.get(`${API_URL}/events/${id}`);
            setEvent(res.data.event);
        } catch (error) {
            console.error('Failed to fetch event:', error);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleBooking = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/event/${id}` } });
            return;
        }

        setBooking(true);
        setError('');
        setSuccess('');

        try {
            const res = await axios.post(
                `${API_URL}/bookings`,
                { eventId: id, tickets },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess(`Booking confirmed! Your booking ID is ${res.data.booking.bookingId}`);
            setEvent(prev => ({
                ...prev,
                bookedCount: prev.bookedCount + tickets
            }));
        } catch (error) {
            setError(error.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-10 h-10 border-3 border-[#2a2a2a] border-t-[#c41e3a] rounded-full animate-spin"></div>
                <p className="text-gray-500">Loading event...</p>
            </div>
        );
    }

    if (!event) return null;

    const availableTickets = event.capacity - event.bookedCount;

    return (
        <div className="pb-12">
            {/* Hero Banner */}
            <div
                className="h-[350px] relative bg-cover bg-center"
                style={{ backgroundImage: `url(${event.image})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 to-[#0a0a0a]/90" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 pt-6">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Events
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="grid lg:grid-cols-[1fr_400px] gap-8 -mt-24 relative z-20">
                    {/* Main Info */}
                    <div className="bg-[#1a1a1a] rounded-2xl p-6 lg:p-8">
                        <span className="inline-block bg-[#c41e3a] text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
                            {event.category}
                        </span>
                        <h1 className="text-2xl lg:text-4xl font-extrabold leading-tight mb-6">{event.title}</h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-8 py-6 border-y border-[#2a2a2a] mb-8">
                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-[#c41e3a] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                <div>
                                    <span className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Date</span>
                                    <span className="text-sm font-medium">{formatDate(event.date)}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-[#c41e3a] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <div>
                                    <span className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Time</span>
                                    <span className="text-sm font-medium">{event.time}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-[#c41e3a] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                    <circle cx="12" cy="9" r="2.5" />
                                </svg>
                                <div>
                                    <span className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Venue</span>
                                    <span className="text-sm font-medium">{event.venue}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="text-base font-semibold text-gray-400 mb-3">About This Event</h3>
                            <p className="text-gray-400 leading-relaxed whitespace-pre-line">{event.description}</p>
                        </div>

                        {event.address && (
                            <div className="mb-8">
                                <h3 className="text-base font-semibold text-gray-400 mb-3">Location</h3>
                                <p className="text-gray-400">{event.address}, {event.cityName}</p>
                            </div>
                        )}

                        {event.organizerName && (
                            <div>
                                <h3 className="text-base font-semibold text-gray-400 mb-3">Organized By</h3>
                                <p className="text-gray-400">{event.organizerName}</p>
                            </div>
                        )}
                    </div>

                    {/* Booking Card */}
                    <div className="bg-[#1a1a1a] rounded-2xl p-6 lg:p-8 h-fit lg:sticky lg:top-24">
                        <div className="text-center mb-6">
                            <span className="block text-sm text-gray-500 mb-1">Price per ticket</span>
                            <span className="text-4xl font-extrabold text-[#c41e3a]">
                                {event.price === 0 ? 'Free' : `₹${event.price}`}
                            </span>
                        </div>

                        <div className="text-center mb-6">
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${availableTickets < 20
                                ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                                : 'bg-green-500/10 border-green-500 text-green-500'
                                }`}>
                                {availableTickets > 0 ? `${availableTickets} tickets available` : 'Sold Out'}
                            </span>
                        </div>

                        {availableTickets > 0 && (
                            <>
                                <div className="mb-6">
                                    <label className="block text-sm text-gray-400 mb-3">Number of Tickets</label>
                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            onClick={() => setTickets(Math.max(1, tickets - 1))}
                                            disabled={tickets <= 1}
                                            className="w-11 h-11 bg-[#252525] rounded-full text-2xl hover:bg-[#c41e3a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            −
                                        </button>
                                        <span className="text-2xl font-bold w-10 text-center">{tickets}</span>
                                        <button
                                            onClick={() => setTickets(Math.min(10, Math.min(availableTickets, tickets + 1)))}
                                            disabled={tickets >= Math.min(10, availableTickets)}
                                            className="w-11 h-11 bg-[#252525] rounded-full text-2xl hover:bg-[#c41e3a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-4 border-t border-[#2a2a2a] mb-6">
                                    <span className="text-sm text-gray-400">Total Amount</span>
                                    <span className="text-2xl font-extrabold">₹{event.price * tickets}</span>
                                </div>

                                {error && (
                                    <div className="p-4 mb-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="p-4 mb-4 bg-green-500/10 border border-green-500 rounded-lg text-green-500 text-sm">
                                        {success}
                                    </div>
                                )}

                                <button
                                    onClick={handleBooking}
                                    disabled={booking || success}
                                    className="w-full bg-gradient-to-r from-[#c41e3a] to-[#9a1830] text-white font-semibold py-4 rounded-xl hover:from-[#e63946] hover:to-[#c41e3a] hover:shadow-lg hover:shadow-[#c41e3a]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {booking ? 'Processing...' : success ? 'Booked!' : 'Book Now'}
                                </button>

                                {!isAuthenticated && (
                                    <p className="text-center mt-4 text-sm text-gray-500">
                                        Please <Link to="/login" className="text-[#c41e3a] font-medium">login</Link> to book tickets
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
