const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide event title'],
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: [true, 'Please provide event description'],
        maxlength: 2000
    },
    category: {
        type: String,
        enum: ['concert', 'festival', 'sports', 'comedy', 'theatre', 'workshop', 'exhibition', 'trek', 'other'],
        default: 'other'
    },
    date: {
        type: Date,
        required: [true, 'Please provide event date']
    },
    endDate: {
        type: Date
    },
    time: {
        type: String,
        required: [true, 'Please provide event time']
    },
    venue: {
        type: String,
        required: [true, 'Please provide venue']
    },
    address: {
        type: String
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    cityName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/400x300?text=Event'
    },
    price: {
        type: Number,
        required: [true, 'Please provide ticket price'],
        min: 0
    },
    capacity: {
        type: Number,
        required: [true, 'Please provide event capacity'],
        min: 1
    },
    bookedCount: {
        type: Number,
        default: 0
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    organizerName: {
        type: String
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual for available tickets
eventSchema.virtual('availableTickets').get(function () {
    return this.capacity - this.bookedCount;
});

// Ensure virtuals are included in JSON output
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
