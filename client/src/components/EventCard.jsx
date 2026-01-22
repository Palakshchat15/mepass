import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../config/api';

const EventCard = ({ event }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        return { day, month };
    };

    const { day, month } = formatDate(event.date);

    return (
        <Link to={`/event/${event._id}`} className="group block bg-[#1a1a1a] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
            <div className="relative h-56 overflow-hidden">
                <img
                    src={getImageUrl(event.image)}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Date Badge */}
                <div className="absolute bottom-3 left-3 bg-white/95 text-[#0a0a0a] px-3.5 py-2 rounded-lg flex flex-col items-center leading-none shadow-lg">
                    <span className="text-xl font-extrabold">{day}</span>
                    <span className="text-[11px] font-semibold uppercase mt-0.5">{month}</span>
                </div>
                {/* Featured Badge */}
                {event.isFeatured && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-[#c41e3a] to-[#9a1830] text-white px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wide">
                        Featured
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-base font-semibold leading-tight mb-2 line-clamp-2">
                    {event.title}
                </h3>
                <p className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                    </svg>
                    <span className="truncate">{event.venue}, {event.cityName}</span>
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-[#2a2a2a]">
                    <span className="text-base font-bold text-[#c41e3a]">
                        {event.price === 0 ? 'Free' : `₹${event.price}`}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 bg-[#252525] px-2.5 py-1 rounded-full">
                        {event.category}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
