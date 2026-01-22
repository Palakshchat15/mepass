import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../config/api';

const HeroCarousel = ({ events = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Safe length calculation
    const eventsLength = Array.isArray(events) ? events.length : 0;

    useEffect(() => {
        if (!isAutoPlaying || eventsLength <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % eventsLength);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, eventsLength, currentIndex]);

    // Early return if events is not valid (after hooks)
    if (!Array.isArray(events) || events.length === 0) {
        return null;
    }

    const goToSlide = (index) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % events.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const currentEvent = events[currentIndex];

    const formatDate = (dateString, endDateString) => {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric' };
        let formatted = date.toLocaleDateString('en-US', options).toUpperCase();

        if (endDateString) {
            const endDate = new Date(endDateString);
            formatted += ` - ${endDate.toLocaleDateString('en-US', options).toUpperCase()}`;
        }

        return formatted;
    };

    return (
        <div className="relative h-[500px] overflow-hidden mb-12">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center blur-[20px] scale-110 transition-all duration-500"
                style={{ backgroundImage: `url(${getImageUrl(currentEvent.image)})` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/95 via-[#0a0a0a]/80 to-[#0a0a0a]/40" />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 h-full flex items-center justify-between gap-12">
                <div className="max-w-lg">
                    <div className="inline-block bg-[#c41e3a] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 animate-fade-in">
                        {formatDate(currentEvent.date, currentEvent.endDate)}, {currentEvent.time}
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4 animate-slide-up">
                        {currentEvent.title}
                    </h1>
                    <p className="flex items-center gap-2 text-gray-400 text-lg mb-8 animate-slide-up">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                            <circle cx="12" cy="9" r="2.5" />
                        </svg>
                        {currentEvent.venue}, {currentEvent.cityName}
                    </p>
                    <Link
                        to={`/event/${currentEvent._id}`}
                        className="inline-block bg-gradient-to-r from-[#c41e3a] to-[#9a1830] text-white font-semibold py-4 px-8 rounded-xl hover:from-[#e63946] hover:to-[#c41e3a] hover:shadow-lg hover:shadow-[#c41e3a]/30 hover:-translate-y-0.5 transition-all animate-slide-up"
                    >
                        Book Now
                    </Link>
                </div>

                {/* Thumbnails */}
                <div className="hidden lg:flex gap-4">
                    {events.slice(0, 5).map((event, index) => (
                        <button
                            key={event._id}
                            onClick={() => goToSlide(index)}
                            className={`w-40 h-56 rounded-xl overflow-hidden border-[3px] transition-all duration-300 ${index === currentIndex
                                ? 'border-[#c41e3a] scale-105 shadow-lg shadow-[#c41e3a]/30 opacity-100'
                                : 'border-transparent opacity-60 hover:opacity-90 hover:-translate-y-1'
                                }`}
                        >
                            <img src={getImageUrl(event.image)} alt={event.title} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            {events.length > 1 && (
                <>
                    <button
                        onClick={goToPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-20"
                    >
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-20"
                    >
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {events.slice(0, 5).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                            ? 'bg-[#c41e3a] w-8'
                            : 'bg-white/40 hover:bg-white/60'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
