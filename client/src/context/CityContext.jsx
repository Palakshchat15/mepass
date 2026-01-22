import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

const CityContext = createContext();

export const useCity = () => {
    const context = useContext(CityContext);
    if (!context) {
        throw new Error('useCity must be used within a CityProvider');
    }
    return context;
};

export const CityProvider = ({ children }) => {
    const [selectedCity, setSelectedCity] = useState(
        localStorage.getItem('mepass_city') || null
    );
    const [cities, setCities] = useState([]);
    const [showCityModal, setShowCityModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        if (!loading && !selectedCity && Array.isArray(cities) && cities.length > 0) {
            setShowCityModal(true);
        }
    }, [loading, selectedCity, cities]);

    const fetchCities = async () => {
        try {
            const res = await axios.get(`${API_URL}/cities`);
            setCities(res.data?.cities || []);
        } catch (error) {
            console.error('Failed to fetch cities:', error);
            setCities([]);
        } finally {
            setLoading(false);
        }
    };

    const selectCity = (cityName) => {
        setSelectedCity(cityName);
        localStorage.setItem('mepass_city', cityName);
        setShowCityModal(false);
    };

    const openCityModal = () => {
        setShowCityModal(true);
    };

    const closeCityModal = () => {
        if (selectedCity) {
            setShowCityModal(false);
        }
    };

    const value = {
        selectedCity,
        cities,
        loading,
        showCityModal,
        selectCity,
        openCityModal,
        closeCityModal,
        refreshCities: fetchCities
    };

    return (
        <CityContext.Provider value={value}>
            {children}
        </CityContext.Provider>
    );
};

export default CityContext;
