const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    tickets: {
        type: Number,
        required: [true, 'Please specify number of tickets'],
        min: 1,
        max: 10
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'confirmed'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'completed'
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    bookingId: {
        type: String,
        unique: true
    }
});

// Generate unique booking ID before saving
bookingSchema.pre('save', function (next) {
    if (!this.bookingId) {
        this.bookingId = 'MP' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
