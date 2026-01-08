const express = require('express');
const router = express.Router();
const Scholarship = require('../models/Scholarship');
const { protect } = require('../middleware/auth');
const ScholarshipMatcher = require('../utils/matchingAlgorithm');

/**
 * @route   GET /api/scholarships
 * @desc    Get all active scholarships with optional filters
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { category, minAmount, maxAmount, search, page = 1, limit = 20 } = req.query;

        // Build query
        const query = { isActive: true };

        if (category) {
            query.category = category;
        }

        if (minAmount || maxAmount) {
            query['awardAmount.min'] = {};
            if (minAmount) query['awardAmount.min'].$gte = Number(minAmount);
            if (maxAmount) query['awardAmount.max'].$lte = Number(maxAmount);
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { provider: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter out expired scholarships
        query.applicationDeadline = { $gte: new Date() };

        const scholarships = await Scholarship.find(query)
            .sort({ applicationDeadline: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Scholarship.countDocuments(query);

        res.status(200).json({
            success: true,
            count: scholarships.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            scholarships
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching scholarships',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/scholarships/recommendations
 * @desc    Get personalized scholarship recommendations
 * @access  Private
 */
router.get('/recommendations', protect, async (req, res) => {
    try {
        const { limit = 50, minScore = 50 } = req.query;

        // Get all active scholarships
        const scholarships = await Scholarship.find({
            isActive: true,
            applicationDeadline: { $gte: new Date() }
        });

        // Get recommendations using matching algorithm
        const recommendations = ScholarshipMatcher.getRecommendations(
            req.student,
            scholarships,
            { limit: Number(limit), minScore: Number(minScore) }
        );

        res.status(200).json({
            success: true,
            count: recommendations.length,
            recommendations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating recommendations',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/scholarships/:id
 * @desc    Get single scholarship by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const scholarship = await Scholarship.findById(req.params.id);

        if (!scholarship) {
            return res.status(404).json({
                success: false,
                message: 'Scholarship not found'
            });
        }

        // Increment view count
        scholarship.viewCount += 1;
        await scholarship.save();

        res.status(200).json({
            success: true,
            scholarship
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching scholarship',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/scholarships/:id/apply
 * @desc    Track scholarship application
 * @access  Private
 */
router.post('/:id/apply', protect, async (req, res) => {
    try {
        const scholarship = await Scholarship.findById(req.params.id);

        if (!scholarship) {
            return res.status(404).json({
                success: false,
                message: 'Scholarship not found'
            });
        }

        // Increment application count
        scholarship.applicationCount += 1;
        await scholarship.save();

        res.status(200).json({
            success: true,
            message: 'Application tracked successfully',
            applicationLink: scholarship.applicationLink
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error tracking application',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/scholarships/stats/overview
 * @desc    Get scholarship statistics
 * @access  Public
 */
router.get('/stats/overview', async (req, res) => {
    try {
        const totalScholarships = await Scholarship.countDocuments({ isActive: true });
        const activeScholarships = await Scholarship.countDocuments({
            isActive: true,
            applicationDeadline: { $gte: new Date() }
        });

        const categoryStats = await Scholarship.aggregate([
            { $match: { isActive: true, applicationDeadline: { $gte: new Date() } } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const urgentScholarships = await Scholarship.countDocuments({
            isActive: true,
            applicationDeadline: {
                $gte: new Date(),
                $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
            }
        });

        res.status(200).json({
            success: true,
            stats: {
                total: totalScholarships,
                active: activeScholarships,
                urgent: urgentScholarships,
                byCategory: categoryStats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
});

module.exports = router;
