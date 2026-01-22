const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide city name'],
        unique: true,
        trim: true
    },
    state: {
        type: String,
        required: [true, 'Please provide state name'],
        trim: true
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/100x100?text=City'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    eventCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('City', citySchema);
