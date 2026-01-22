import React, { useState } from 'react';
import { useCity } from '../context/CityContext';
import { getImageUrl } from '../config/api';

const CityModal = () => {
    const { showCityModal, closeCityModal, cities, selectCity, selectedCity } = useCity();
    const [searchQuery, setSearchQuery] = useState('');

    if (!showCityModal) return null;

    const filteredCities = cities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const popularCities = ['Mumbai', 'Delhi', 'Bangalore', 'Ahmedabad', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata'];

    return (
        <div
            className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-[1000] p-4"
            onClick={selectedCity ? closeCityModal : undefined}
        >
            <div className="w-full max-w-xl text-center relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
                {/* Logo */}
                <div className="text-4xl font-bold tracking-tight mb-8">
                    <span className="text-white">me</span>
                    <span className="text-[#c41e3a]">pass</span>
                </div>

                {/* Welcome Text */}
                <h2 className="text-3xl font-bold mb-2">Welcome to MePass!</h2>
                <p className="text-gray-400 mb-4">Let's get started by selecting your city</p>
                <p className="text-lg font-semibold mb-8">Please Select Your City to Continue...</p>

                {/* Search */}
                <div className="relative max-w-md mx-auto mb-6">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search for your city"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-3.5 px-5 pl-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-white placeholder-gray-500 focus:border-[#c41e3a] focus:outline-none transition-colors"
                    />
                </div>

                {/* Use Current Location */}
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2a5298] to-[#1e3c72] rounded-full text-white text-sm font-medium mb-10 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#2a5298]/40 transition-all">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="3" />
                        <line x1="12" y1="2" x2="12" y2="4" />
                        <line x1="12" y1="20" x2="12" y2="22" />
                        <line x1="2" y1="12" x2="4" y2="12" />
                        <line x1="20" y1="12" x2="22" y2="12" />
                    </svg>
                    Use current location
                </button>

                {/* Popular Cities */}
                <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Popular Cities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
                        {(filteredCities.length > 0 ? filteredCities : cities).slice(0, 8).map(city => (
                            <button
                                key={city._id}
                                onClick={() => selectCity(city.name)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${selectedCity === city.name
                                    ? 'bg-[#c41e3a]/10 border-2 border-[#c41e3a]'
                                    : 'bg-transparent border-2 border-transparent hover:bg-[#1a1a1a] hover:border-[#2a2a2a]'
                                    }`}
                            >
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-[#1a1a1a]">
                                    {getImageUrl(city.image) ? (
                                        <img src={getImageUrl(city.image)} alt={city.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-r from-[#c41e3a] to-[#9a1830] flex items-center justify-center text-2xl font-bold">
                                            {city.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm font-medium">{city.name}</span>
                            </button>
                        ))}
                        {filteredCities.length === 0 && cities.length === 0 && popularCities.map(cityName => (
                            <button
                                key={cityName}
                                onClick={() => selectCity(cityName)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${selectedCity === cityName
                                    ? 'bg-[#c41e3a]/10 border-2 border-[#c41e3a]'
                                    : 'bg-transparent border-2 border-transparent hover:bg-[#1a1a1a] hover:border-[#2a2a2a]'
                                    }`}
                            >
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#c41e3a] to-[#9a1830] flex items-center justify-center text-2xl font-bold">
                                    {cityName.charAt(0)}
                                </div>
                                <span className="text-sm font-medium">{cityName}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Close button */}
                {selectedCity && (
                    <button
                        onClick={closeCityModal}
                        className="absolute -top-10 right-0 w-10 h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full flex items-center justify-center text-white text-2xl hover:bg-[#252525] hover:border-[#c41e3a] transition-all"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export default CityModal;
