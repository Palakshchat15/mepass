import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';
import { API_URL, getImageUrl } from '../config/api';

const AdminDashboard = () => {
    const { token, user } = useAuth();
    const { refreshCities: refreshGlobalCities } = useCity();
    const [activeTab, setActiveTab] = useState('cities');

    // Cities state
    const [cities, setCities] = useState([]);
    const [citiesLoading, setCitiesLoading] = useState(true);
    const [showCityForm, setShowCityForm] = useState(false);
    const [editingCity, setEditingCity] = useState(null);
    const [cityFormData, setCityFormData] = useState({
        name: '',
        state: ''
    });
    const [cityImageFile, setCityImageFile] = useState(null);
    const [cityImagePreview, setCityImagePreview] = useState('');

    // Events state
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [showEventForm, setShowEventForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [eventFormData, setEventFormData] = useState({
        title: '',
        description: '',
        category: 'concert',
        date: '',
        time: '',
        venue: '',
        address: '',
        cityId: '',
        price: '',
        capacity: '',
        isFeatured: false
    });
    const [eventImageFile, setEventImageFile] = useState(null);
    const [eventImagePreview, setEventImagePreview] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const categories = [
        { value: 'concert', label: 'Concert' },
        { value: 'festival', label: 'Festival' },
        { value: 'sports', label: 'Sports' },
        { value: 'comedy', label: 'Comedy' },
        { value: 'theatre', label: 'Theatre' },
        { value: 'workshop', label: 'Workshop' },
        { value: 'trek', label: 'Trek' },
        { value: 'exhibition', label: 'Exhibition' },
        { value: 'other', label: 'Other' }
    ];

    useEffect(() => {
        fetchCities();
        fetchAllEvents();
    }, []);

    // ===== CITIES FUNCTIONS =====
    const fetchCities = async () => {
        try {
            const res = await axios.get(`${API_URL}/cities`);
            setCities(res.data?.cities || []);
        } catch (error) {
            console.error('Failed to fetch cities:', error);
        } finally {
            setCitiesLoading(false);
        }
    };

    const handleCityChange = (e) => {
        const { name, value } = e.target;
        setCityFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCityImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCityImageFile(file);
            setCityImagePreview(URL.createObjectURL(file));
        }
    };

    const resetCityForm = () => {
        setCityFormData({ name: '', state: '' });
        setCityImageFile(null);
        setCityImagePreview('');
        setEditingCity(null);
        setError('');
        setSuccess('');
    };

    const handleCitySubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            formData.append('name', cityFormData.name);
            formData.append('state', cityFormData.state);
            if (cityImageFile) {
                formData.append('image', cityImageFile);
            }

            if (editingCity) {
                await axios.put(`${API_URL}/cities/${editingCity._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setSuccess('City updated successfully!');
            } else {
                await axios.post(`${API_URL}/cities`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setSuccess('City created successfully!');
            }
            fetchCities();
            refreshGlobalCities();
            setTimeout(() => {
                setShowCityForm(false);
                resetCityForm();
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to save city');
        }
    };

    const handleEditCity = (city) => {
        setCityFormData({
            name: city.name,
            state: city.state
        });
        setCityImagePreview(getImageUrl(city.image));
        setCityImageFile(null);
        setEditingCity(city);
        setShowCityForm(true);
    };

    const handleDeleteCity = async (cityId) => {
        if (!window.confirm('Are you sure you want to delete this city?')) return;

        try {
            await axios.delete(`${API_URL}/cities/${cityId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCities(cities.filter(c => c._id !== cityId));
            refreshGlobalCities();
        } catch (error) {
            alert('Failed to delete city');
        }
    };

    // ===== EVENTS FUNCTIONS =====
    const fetchAllEvents = async () => {
        try {
            const res = await axios.get(`${API_URL}/events/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(res.data?.events || []);
        } catch (error) {
            console.error('Failed to fetch events:', error);
            try {
                const res = await axios.get(`${API_URL}/events`);
                setEvents(res.data?.events || []);
            } catch (e) {
                console.error('Fallback also failed:', e);
            }
        } finally {
            setEventsLoading(false);
        }
    };

    const handleEventChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEventImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEventImageFile(file);
            setEventImagePreview(URL.createObjectURL(file));
        }
    };

    const resetEventForm = () => {
        setEventFormData({
            title: '',
            description: '',
            category: 'concert',
            date: '',
            time: '',
            venue: '',
            address: '',
            cityId: '',
            price: '',
            capacity: '',
            isFeatured: false
        });
        setEventImageFile(null);
        setEventImagePreview('');
        setEditingEvent(null);
        setError('');
        setSuccess('');
    };

    const handleEventSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            formData.append('title', eventFormData.title);
            formData.append('description', eventFormData.description);
            formData.append('category', eventFormData.category);
            formData.append('date', eventFormData.date);
            formData.append('time', eventFormData.time);
            formData.append('venue', eventFormData.venue);
            formData.append('address', eventFormData.address);
            formData.append('cityId', eventFormData.cityId);
            formData.append('price', eventFormData.price);
            formData.append('capacity', eventFormData.capacity);
            formData.append('isFeatured', eventFormData.isFeatured);
            if (eventImageFile) {
                formData.append('image', eventImageFile);
            }

            if (editingEvent) {
                await axios.put(`${API_URL}/events/${editingEvent._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setSuccess('Event updated successfully!');
            } else {
                await axios.post(`${API_URL}/events`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setSuccess('Event created successfully!');
            }
            fetchAllEvents();
            setTimeout(() => {
                setShowEventForm(false);
                resetEventForm();
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to save event');
        }
    };

    const handleEditEvent = (event) => {
        setEventFormData({
            title: event.title,
            description: event.description,
            category: event.category,
            date: event.date.split('T')[0],
            time: event.time,
            venue: event.venue,
            address: event.address || '',
            cityId: event.city,
            price: event.price.toString(),
            capacity: event.capacity.toString(),
            isFeatured: event.isFeatured
        });
        setEventImagePreview(getImageUrl(event.image));
        setEventImageFile(null);
        setEditingEvent(event);
        setShowEventForm(true);
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            await axios.delete(`${API_URL}/events/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(events.filter(e => e._id !== eventId));
        } catch (error) {
            alert('Failed to delete event');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome, {user?.name}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-[#2a2a2a]">
                <button
                    onClick={() => setActiveTab('cities')}
                    className={`px-6 py-3 font-semibold transition-all border-b-2 -mb-px ${activeTab === 'cities'
                        ? 'text-[#c41e3a] border-[#c41e3a]'
                        : 'text-gray-500 border-transparent hover:text-white'
                        }`}
                >
                    Cities
                </button>
                <button
                    onClick={() => setActiveTab('events')}
                    className={`px-6 py-3 font-semibold transition-all border-b-2 -mb-px ${activeTab === 'events'
                        ? 'text-[#c41e3a] border-[#c41e3a]'
                        : 'text-gray-500 border-transparent hover:text-white'
                        }`}
                >
                    Events
                </button>
            </div>

            {/* Cities Tab Content */}
            {activeTab === 'cities' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Manage Cities</h2>
                        <button
                            onClick={() => { resetCityForm(); setShowCityForm(true); }}
                            className="bg-gradient-to-r from-[#c41e3a] to-[#9a1830] text-white font-semibold py-3 px-6 rounded-lg hover:from-[#e63946] hover:to-[#c41e3a] transition-all flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Add City
                        </button>
                    </div>

                    {citiesLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                            <div className="w-10 h-10 border-3 border-[#2a2a2a] border-t-[#c41e3a] rounded-full animate-spin"></div>
                        </div>
                    ) : cities.length === 0 ? (
                        <div className="text-center py-16 bg-[#1a1a1a] rounded-2xl">
                            <h3 className="text-xl font-semibold mb-2">No cities yet</h3>
                            <p className="text-gray-500">Add your first city to get started!</p>
                        </div>
                    ) : (
                        <div className="bg-[#1a1a1a] rounded-xl overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-[#252525]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Image</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">City Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">State</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Events</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2a2a2a]">
                                    {cities.map(city => (
                                        <tr key={city._id} className="hover:bg-[#252525] transition-colors">
                                            <td className="px-6 py-4">
                                                <img
                                                    src={getImageUrl(city.image)}
                                                    alt={city.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                            </td>
                                            <td className="px-6 py-4 font-medium">{city.name}</td>
                                            <td className="px-6 py-4 text-gray-400">{city.state}</td>
                                            <td className="px-6 py-4 text-gray-400">{city.eventCount || 0}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditCity(city)}
                                                        className="px-3 py-1.5 bg-[#252525] rounded-lg text-sm font-medium hover:bg-[#333] transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCity(city._id)}
                                                        className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Events Tab Content */}
            {activeTab === 'events' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Manage Events</h2>
                        <button
                            onClick={() => { resetEventForm(); setShowEventForm(true); }}
                            className="bg-gradient-to-r from-[#c41e3a] to-[#9a1830] text-white font-semibold py-3 px-6 rounded-lg hover:from-[#e63946] hover:to-[#c41e3a] transition-all flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Add Event
                        </button>
                    </div>

                    {eventsLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                            <div className="w-10 h-10 border-3 border-[#2a2a2a] border-t-[#c41e3a] rounded-full animate-spin"></div>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-16 bg-[#1a1a1a] rounded-2xl">
                            <h3 className="text-xl font-semibold mb-2">No events yet</h3>
                            <p className="text-gray-500">Create your first event to get started!</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {events.map(event => (
                                <div key={event._id} className="bg-[#1a1a1a] rounded-xl overflow-hidden flex flex-col sm:flex-row">
                                    <div className="sm:w-48 h-32 sm:h-auto">
                                        <img
                                            src={getImageUrl(event.image)}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 p-4 sm:p-6">
                                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold">{event.title}</h3>
                                                <p className="text-sm text-gray-500">{event.cityName}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {event.isFeatured && (
                                                    <span className="px-2 py-1 bg-[#c41e3a]/20 text-[#c41e3a] text-xs font-semibold rounded">
                                                        Featured
                                                    </span>
                                                )}
                                                <span className="px-2 py-1 bg-[#252525] text-gray-400 text-xs font-semibold rounded uppercase">
                                                    {event.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                                            <span>{formatDate(event.date)} • {event.time}</span>
                                            <span>{event.bookedCount || 0}/{event.capacity} booked</span>
                                            <span className="font-semibold text-white">₹{event.price}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleEditEvent(event)}
                                                className="px-4 py-2 bg-[#252525] rounded-lg text-sm font-medium hover:bg-[#333] transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEvent(event._id)}
                                                className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* City Form Modal */}
            {showCityForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#121212] rounded-2xl w-full max-w-md">
                        <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                {editingCity ? 'Edit City' : 'Add New City'}
                            </h2>
                            <button
                                onClick={() => { setShowCityForm(false); resetCityForm(); }}
                                className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-[#252525] transition-colors text-xl"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCitySubmit} className="p-6 space-y-5">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-500 text-sm">
                                    {success}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">City Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={cityFormData.name}
                                    onChange={handleCityChange}
                                    required
                                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors"
                                    placeholder="Enter city name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">State *</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={cityFormData.state}
                                    onChange={handleCityChange}
                                    required
                                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors"
                                    placeholder="Enter state"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">City Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCityImageChange}
                                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#c41e3a] file:text-white hover:file:bg-[#e63946]"
                                />
                                {cityImagePreview && (
                                    <div className="mt-3">
                                        <img src={cityImagePreview} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowCityForm(false); resetCityForm(); }}
                                    className="flex-1 py-3 bg-[#2a2a2a] rounded-lg font-semibold hover:bg-[#333] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-[#c41e3a] to-[#9a1830] text-white font-semibold py-3 rounded-lg hover:from-[#e63946] hover:to-[#c41e3a] transition-all"
                                >
                                    {editingCity ? 'Update City' : 'Add City'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Event Form Modal */}
            {showEventForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-[#121212] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between sticky top-0 bg-[#121212]">
                            <h2 className="text-xl font-bold">
                                {editingEvent ? 'Edit Event' : 'Create New Event'}
                            </h2>
                            <button
                                onClick={() => { setShowEventForm(false); resetEventForm(); }}
                                className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-[#252525] transition-colors text-xl"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleEventSubmit} className="p-6 space-y-5">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-500 text-sm">
                                    {success}
                                </div>
                            )}

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Event Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={eventFormData.title}
                                        onChange={handleEventChange}
                                        required
                                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors"
                                        placeholder="Enter event title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Category *</label>
                                    <select
                                        name="category"
                                        value={eventFormData.category}
                                        onChange={handleEventChange}
                                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">City *</label>
                                    <select
                                        name="cityId"
                                        value={eventFormData.cityId}
                                        onChange={handleEventChange}
                                        required
                                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors"
                                    >
                                        <option value="">Select City</option>
                                        {cities.map(city => (
                                            <option key={city._id} value={city._id}>{city.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Date *</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={eventFormData.date}
                                        onChange={handleEventChange}
                                        required
                                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Time *</label>
                                    <input
                                        type="text"
                                        name="time"
                                        value={eventFormData.time}
                                        onChange={handleEventChange}
                                        required
                                        placeholder="e.g., 7:00 PM"
                                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Venue *</label>
                                    <input
                                        type="text"
                                        name="venue"
                                        value={eventFormData.venue}
                                        onChange={handleEventChange}
                                        required
                                        placeholder="Venue name"
                                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={eventFormData.address}
                                        onChange={handleEventChange}
                                        placeholder="Full address"
                                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Ticket Price (₹) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={eventFormData.price}
                                        onChange={handleEventChange}
                                        required
                                        min="0"
                                        placeholder="0 for free events"
                                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Capacity *</label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        value={eventFormData.capacity}
                                        onChange={handleEventChange}
                                        required
                                        min="1"
                                        placeholder="Total tickets"
                                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Event Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleEventImageChange}
                                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#c41e3a] file:text-white hover:file:bg-[#e63946]"
                                    />
                                    {eventImagePreview && (
                                        <div className="mt-3">
                                            <img src={eventImagePreview} alt="Preview" className="w-32 h-24 rounded-lg object-cover" />
                                        </div>
                                    )}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Description *</label>
                                    <textarea
                                        name="description"
                                        value={eventFormData.description}
                                        onChange={handleEventChange}
                                        required
                                        rows={4}
                                        placeholder="Describe your event..."
                                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors resize-y"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isFeatured"
                                            checked={eventFormData.isFeatured}
                                            onChange={handleEventChange}
                                            className="w-5 h-5 rounded border-[#2a2a2a] bg-[#1a1a1a] text-[#c41e3a] focus:ring-[#c41e3a]"
                                        />
                                        <span className="text-sm">Feature this event on homepage</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowEventForm(false); resetEventForm(); }}
                                    className="flex-1 py-3 bg-[#2a2a2a] rounded-lg font-semibold hover:bg-[#333] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-[#c41e3a] to-[#9a1830] text-white font-semibold py-3 rounded-lg hover:from-[#e63946] hover:to-[#c41e3a] transition-all"
                                >
                                    {editingEvent ? 'Update Event' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
