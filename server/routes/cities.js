const express = require('express');
const router = express.Router();
const City = require('../models/City');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/cities
// @desc    Get all active cities
// @access  Public
router.get('/', async (req, res) => {
    try {
        const cities = await City.find({ isActive: true }).sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: cities.length,
            cities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/cities
// @desc    Add a new city
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), upload.single('image'), async (req, res) => {
    try {
        const { name, state } = req.body;

        // Check if city exists
        const existingCity = await City.findOne({ name });
        if (existingCity) {
            return res.status(400).json({
                success: false,
                message: 'City already exists'
            });
        }

        // Get image path from uploaded file
        const image = req.file ? `/uploads/${req.file.filename}` : undefined;

        const city = await City.create({
            name,
            state,
            image
        });

        res.status(201).json({
            success: true,
            city
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/cities/:id
// @desc    Update a city
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };

        // If new image uploaded, update the path
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const city = await City.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (!city) {
            return res.status(404).json({
                success: false,
                message: 'City not found'
            });
        }

        res.status(200).json({
            success: true,
            city
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/cities/:id
// @desc    Delete a city
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const city = await City.findByIdAndDelete(req.params.id);

        if (!city) {
            return res.status(404).json({
                success: false,
                message: 'City not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'City deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
