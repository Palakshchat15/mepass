const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const City = require('../models/City');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/events
// @desc    Get all events (with optional city filter)
// @access  Public
router.get('/', async (req, res) => {
    try {
        let query = { isActive: true };

        // Filter by city
        if (req.query.city) {
            query.cityName = req.query.city;
        }

        // Filter by category
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Filter for upcoming events only
        query.date = { $gte: new Date() };

        const events = await Event.find(query)
            .sort({ date: 1 })
            .populate('organizer', 'name');

        res.status(200).json({
            success: true,
            count: events.length,
            events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/events/admin/all
// @desc    Get ALL events for admin (including past events)
// @access  Private (Admin only)
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
    try {
        const events = await Event.find()
            .sort({ createdAt: -1 })
            .populate('organizer', 'name');

        res.status(200).json({
            success: true,
            count: events.length,
            events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/events/featured
// @desc    Get featured events
// @access  Public
router.get('/featured', async (req, res) => {
    try {
        let query = { isActive: true, isFeatured: true, date: { $gte: new Date() } };

        if (req.query.city) {
            query.cityName = req.query.city;
        }

        const events = await Event.find(query)
            .sort({ date: 1 })
            .limit(5)
            .populate('organizer', 'name');

        res.status(200).json({
            success: true,
            events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer', 'name email');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/events
// @desc    Create an event
// @access  Private (Organizer/Admin only)
router.post('/', protect, authorize('organizer', 'admin'), upload.single('image'), async (req, res) => {
    try {
        const { title, description, category, date, endDate, time, venue, address, cityId, price, capacity, isFeatured } = req.body;

        // Get city name
        const city = await City.findById(cityId);
        if (!city) {
            return res.status(400).json({
                success: false,
                message: 'Invalid city'
            });
        }

        // Get image path from uploaded file
        const image = req.file ? `/uploads/${req.file.filename}` : undefined;

        const event = await Event.create({
            title,
            description,
            category,
            date,
            endDate,
            time,
            venue,
            address,
            city: cityId,
            cityName: city.name,
            image,
            price,
            capacity,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            organizer: req.user.id,
            organizerName: req.user.name
        });

        // Update city event count
        await City.findByIdAndUpdate(cityId, { $inc: { eventCount: 1 } });

        res.status(201).json({
            success: true,
            event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private (Owner or Admin only)
router.put('/:id', protect, authorize('organizer', 'admin'), upload.single('image'), async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check ownership (unless admin)
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this event'
            });
        }

        const updateData = { ...req.body };

        // If new image uploaded, update the path
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        // Handle isFeatured boolean from FormData
        if (updateData.isFeatured !== undefined) {
            updateData.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
        }

        event = await Event.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private (Owner or Admin only)
router.delete('/:id', protect, authorize('organizer', 'admin'), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check ownership (unless admin)
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this event'
            });
        }

        await Event.findByIdAndDelete(req.params.id);

        // Update city event count
        await City.findByIdAndUpdate(event.city, { $inc: { eventCount: -1 } });

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/events/organizer/my-events
// @desc    Get organizer's events
// @access  Private (Organizer only)
router.get('/organizer/my-events', protect, authorize('organizer', 'admin'), async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: events.length,
            events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
