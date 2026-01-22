import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CityProvider } from './context/CityContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CityModal from './components/CityModal';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, requireOrganizer = false, requireAdmin = false }) => {
    const { isAuthenticated, isOrganizer, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-10 h-10 border-3 border-[#2a2a2a] border-t-[#c41e3a] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" />;
    }

    if (requireOrganizer && !isOrganizer && !isAdmin) {
        return <Navigate to="/" />;
    }

    return children;
};

// Layout Component
const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <CityModal />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
};

// App Routes
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/event/:id" element={<Layout><EventDetails /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/register" element={<Layout><Register /></Layout>} />
            <Route
                path="/my-bookings"
                element={
                    <ProtectedRoute>
                        <Layout><MyBookings /></Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/organizer"
                element={
                    <ProtectedRoute requireOrganizer>
                        <Layout><OrganizerDashboard /></Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute requireAdmin>
                        <Layout><AdminDashboard /></Layout>
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

// Main App Component
const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CityProvider>
                    <AppRoutes />
                </CityProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
