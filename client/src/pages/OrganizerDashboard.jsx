import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';
import { API_URL, getImageUrl } from '../config/api';

const OrganizerDashboard = () => {
    const { token, user } = useAuth();
    const { cities } = useCity();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
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
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
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
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        try {
            const res = await axios.get(`${API_URL}/events/organizer/my-events`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(res.data.events || []);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setFormData({
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
        setImageFile(null);
        setImagePreview('');
        setEditingEvent(null);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('category', formData.category);
            submitData.append('date', formData.date);
            submitData.append('time', formData.time);
            submitData.append('venue', formData.venue);
            submitData.append('address', formData.address);
            submitData.append('cityId', formData.cityId);
            submitData.append('price', formData.price);
            submitData.append('capacity', formData.capacity);
            submitData.append('isFeatured', formData.isFeatured);
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            if (editingEvent) {
                await axios.put(`${API_URL}/events/${editingEvent._id}`, submitData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setSuccess('Event updated successfully!');
            } else {
                await axios.post(`${API_URL}/events`, submitData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setSuccess('Event created successfully!');
            }

            fetchMyEvents();
            setTimeout(() => {
                setShowForm(false);
                resetForm();
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to save event');
        }
    };

    const handleEdit = (event) => {
        setFormData({
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
        setImagePreview(getImageUrl(event.image));
        setImageFile(null);
        setEditingEvent(event);
        setShowForm(true);
    };

    const handleDelete = async (eventId) => {
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-10 h-10 border-3 border-[#2a2a2a] border-t-[#c41e3a] rounded-full animate-spin"></div>
                <p className="text-gray-500">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">Organizer Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome, {user?.name}</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="bg-gradient-to-r from-[#c41e3a] to-[#9a1830] text-white font-semibold py-3 px-6 rounded-lg hover:from-[#e63946] hover:to-[#c41e3a] transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Create Event
                </button>
            </div>

            {/* Event Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-[#121212] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between sticky top-0 bg-[#121212]">
                            <h2 className="text-xl font-bold">
                                {editingEvent ? 'Edit Event' : 'Create New Event'}
                            </h2>
                            <button
                                onClick={() => { setShowForm(false); resetForm(); }}
                                className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-[#252525] transition-colors text-xl"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors"
                                        placeholder="Enter event title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
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
                                        value={formData.cityId}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors"
                                    >
                                        <option value="">Select City</option>
                                        {(cities || []).map(city => (
                                            <option key={city._id} value={city._id}>{city.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Date *</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Time *</label>
                                    <input
                                        type="text"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
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
                                        value={formData.venue}
                                        onChange={handleChange}
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
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Full address"
                                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Ticket Price (₹) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
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
                                        value={formData.capacity}
                                        onChange={handleChange}
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
                                        onChange={handleImageChange}
                                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#c41e3a] file:text-white hover:file:bg-[#e63946]"
                                    />
                                    {imagePreview && (
                                        <div className="mt-3">
                                            <img src={imagePreview} alt="Preview" className="w-32 h-24 rounded-lg object-cover" />
                                        </div>
                                    )}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Description *</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        placeholder="Describe your event..."
                                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:border-[#c41e3a] focus:outline-none transition-colors resize-y"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); resetForm(); }}
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

            {/* Events List */}
            {events.length === 0 ? (
                <div className="text-center py-16 bg-[#1a1a1a] rounded-2xl">
                    <h3 className="text-xl font-semibold mb-2">No events yet</h3>
                    <p className="text-gray-500 mb-6">Create your first event to get started!</p>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="bg-gradient-to-r from-[#c41e3a] to-[#9a1830] text-white font-semibold py-3 px-6 rounded-lg"
                    >
                        Create Event
                    </button>
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
                                        onClick={() => handleEdit(event)}
                                        className="px-4 py-2 bg-[#252525] rounded-lg text-sm font-medium hover:bg-[#333] transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event._id)}
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
    );
};

export default OrganizerDashboard;
