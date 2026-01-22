const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://mepass-frontend.onrender.com',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/cities', require('./routes/cities'));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'MePass API is running' });
});

// Seed route for initial data
app.post('/api/seed', async (req, res) => {
    try {
        const City = require('./models/City');
        const User = require('./models/User');

        // Create initial cities
        const cities = [
            { name: 'Mumbai', state: 'Maharashtra', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=100' },
            { name: 'Delhi', state: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=100' },
            { name: 'Bangalore', state: 'Karnataka', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=100' },
            { name: 'Ahmedabad', state: 'Gujarat', image: 'https://images.unsplash.com/photo-1609948543911-7246000e4a91?w=100' },
            { name: 'Pune', state: 'Maharashtra', image: 'https://images.unsplash.com/photo-1572782252655-9c8771392601?w=100' },
            { name: 'Chennai', state: 'Tamil Nadu', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=100' },
            { name: 'Hyderabad', state: 'Telangana', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=100' },
            { name: 'Kolkata', state: 'West Bengal', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=100' }
        ];

        for (const cityData of cities) {
            await City.findOneAndUpdate(
                { name: cityData.name },
                cityData,
                { upsert: true, new: true }
            );
        }

        // Create admin user
        const adminExists = await User.findOne({ email: 'admin@mepass.in' });
        if (!adminExists) {
            await User.create({
                name: 'Admin',
                email: 'admin@mepass.in',
                password: 'admin123',
                role: 'admin'
            });
        }

        // Create demo organizer
        const organizerExists = await User.findOne({ email: 'organizer@mepass.in' });
        if (!organizerExists) {
            await User.create({
                name: 'Demo Organizer',
                email: 'organizer@mepass.in',
                password: 'organizer123',
                role: 'organizer'
            });
        }

        res.json({ success: true, message: 'Database seeded successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
