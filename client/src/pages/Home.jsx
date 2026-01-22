import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCity } from '../context/CityContext';
import HeroCarousel from '../components/HeroCarousel';
import EventCard from '../components/EventCard';
import { API_URL } from '../config/api';

const Home = () => {
    const { selectedCity } = useCity();
    const [events, setEvents] = useState([]);
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');

    const categories = [
        { value: '', label: 'All Events' },
        { value: 'concert', label: 'Concerts' },
        { value: 'festival', label: 'Festivals' },
        { value: 'sports', label: 'Sports' },
        { value: 'comedy', label: 'Comedy' },
        { value: 'theatre', label: 'Theatre' },
        { value: 'workshop', label: 'Workshops' },
        { value: 'trek', label: 'Treks' },
        { value: 'exhibition', label: 'Exhibitions' }
    ];

    useEffect(() => {
        if (selectedCity) {
            fetchEvents();
        }
    }, [selectedCity, category]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const params = { city: selectedCity };
            if (category) params.category = category;

            const [eventsRes, featuredRes] = await Promise.all([
                axios.get(`${API_URL}/events`, { params }),
                axios.get(`${API_URL}/events/featured`, { params: { city: selectedCity } })
            ]);

            setEvents(eventsRes.data?.events || []);
            setFeaturedEvents(featuredRes.data?.events || []);
        } catch (error) {
            console.error('Failed to fetch events:', error);
            setEvents([]);
            setFeaturedEvents([]);
        } finally {
            setLoading(false);
        }
    };

    if (!selectedCity) {
        return null;
    }

    return (
        <div className="min-h-[calc(100vh-70px)]">
            {/* Hero Carousel */}
            {featuredEvents.length > 0 && <HeroCarousel events={featuredEvents} />}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <div className="mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-1">
                        Upcoming Events in <span className="text-[#c41e3a]">{selectedCity}</span>
                    </h2>
                    <p className="text-gray-500">Discover amazing events happening in your city</p>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat.value}
                            onClick={() => setCategory(cat.value)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${category === cat.value
                                ? 'bg-gradient-to-r from-[#c41e3a] to-[#9a1830] text-white'
                                : 'bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:bg-[#252525] hover:text-white'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Events Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                        <div className="w-10 h-10 border-3 border-[#2a2a2a] border-t-[#c41e3a] rounded-full animate-spin"></div>
                        <p className="text-gray-500">Loading events...</p>
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-12">
                        {events.map(event => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        <svg className="w-20 h-20 mx-auto mb-6 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <h3 className="text-xl text-white mb-2">No events found</h3>
                        <p>There are no {category || 'upcoming'} events in {selectedCity} right now.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
