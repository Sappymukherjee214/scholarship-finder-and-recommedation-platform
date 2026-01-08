const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new student
 * @access  Public
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, fullName, courseOfStudy, educationalLevel, gpa, currentLocation } = req.body;

        // Check if student already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Student with this email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create student
        const student = await Student.create({
            email,
            password: hashedPassword,
            fullName,
            courseOfStudy,
            educationalLevel,
            gpa,
            currentLocation,
            profileCompleted: false
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: student._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            student: {
                id: student._id,
                email: student.email,
                fullName: student.fullName,
                profileCompleted: student.profileCompleted
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering student',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login student
 * @access  Public
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find student with password field
        const student = await Student.findOne({ email }).select('+password');

        if (!student) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, student.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        student.lastLogin = Date.now();
        await student.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: student._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            student: {
                id: student._id,
                email: student.email,
                fullName: student.fullName,
                profileCompleted: student.profileCompleted
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in student
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
    try {
        const student = await Student.findById(req.student.id).select('-password');

        res.status(200).json({
            success: true,
            student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching student data',
            error: error.message
        });
    }
});

module.exports = router;
