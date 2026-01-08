const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/students/profile
 * @desc    Get student profile
 * @access  Private
 */
router.get('/profile', protect, async (req, res) => {
    try {
        const student = await Student.findById(req.student.id)
            .select('-password')
            .populate('savedScholarships');

        res.status(200).json({
            success: true,
            student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
});

/**
 * @route   PUT /api/students/profile
 * @desc    Update student profile
 * @access  Private
 */
router.put('/profile', protect, async (req, res) => {
    try {
        const allowedUpdates = [
            'fullName', 'courseOfStudy', 'educationalLevel', 'gpa',
            'currentLocation', 'incomeBracket', 'gender', 'minorityStatus',
            'hasDisability', 'disabilityDetails', 'fieldInterests',
            'emailNotifications'
        ];

        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        // Check if profile is now complete
        const requiredFields = ['fullName', 'courseOfStudy', 'educationalLevel', 'gpa', 'currentLocation'];
        const isComplete = requiredFields.every(field =>
            updates[field] !== undefined || req.student[field] !== undefined
        );

        if (isComplete) {
            updates.profileCompleted = true;
        }

        const student = await Student.findByIdAndUpdate(
            req.student.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/students/save-scholarship/:scholarshipId
 * @desc    Save/bookmark a scholarship
 * @access  Private
 */
router.post('/save-scholarship/:scholarshipId', protect, async (req, res) => {
    try {
        const student = await Student.findById(req.student.id);
        const scholarshipId = req.params.scholarshipId;

        // Check if already saved
        if (student.savedScholarships.includes(scholarshipId)) {
            return res.status(400).json({
                success: false,
                message: 'Scholarship already saved'
            });
        }

        student.savedScholarships.push(scholarshipId);
        await student.save();

        res.status(200).json({
            success: true,
            message: 'Scholarship saved successfully',
            savedScholarships: student.savedScholarships
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error saving scholarship',
            error: error.message
        });
    }
});

/**
 * @route   DELETE /api/students/save-scholarship/:scholarshipId
 * @desc    Remove saved scholarship
 * @access  Private
 */
router.delete('/save-scholarship/:scholarshipId', protect, async (req, res) => {
    try {
        const student = await Student.findById(req.student.id);
        const scholarshipId = req.params.scholarshipId;

        student.savedScholarships = student.savedScholarships.filter(
            id => id.toString() !== scholarshipId
        );
        await student.save();

        res.status(200).json({
            success: true,
            message: 'Scholarship removed from saved list',
            savedScholarships: student.savedScholarships
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error removing scholarship',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/students/saved-scholarships
 * @desc    Get all saved scholarships
 * @access  Private
 */
router.get('/saved-scholarships', protect, async (req, res) => {
    try {
        const student = await Student.findById(req.student.id)
            .populate('savedScholarships');

        res.status(200).json({
            success: true,
            scholarships: student.savedScholarships
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching saved scholarships',
            error: error.message
        });
    }
});

module.exports = router;
