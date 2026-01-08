const mongoose = require('mongoose');

/**
 * Scholarship Schema
 * Stores comprehensive scholarship information from various sources
 */
const scholarshipSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: [true, 'Scholarship name is required'],
        trim: true,
        index: true
    },
    provider: {
        type: String,
        required: [true, 'Provider is required'],
        trim: true
    },
    description: {
        type: String,
        required: true
    },

    // Financial Details
    awardAmount: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'INR'
        },
        type: {
            type: String,
            enum: ['One-time', 'Annual', 'Monthly', 'Full Tuition', 'Variable'],
            default: 'One-time'
        }
    },

    // Eligibility Criteria
    eligibility: {
        courses: [{
            type: String
        }],
        educationalLevels: [{
            type: String,
            enum: ['High School', 'Undergraduate', 'Postgraduate', 'Doctorate', 'Diploma']
        }],
        minGPA: {
            type: Number,
            min: 0,
            max: 10
        },
        locations: {
            countries: [String],
            states: [String],
            cities: [String]
        },
        incomeCriteria: {
            maxIncome: Number,
            required: Boolean
        },
        genderSpecific: {
            type: String,
            enum: ['Male', 'Female', 'Non-binary', 'Any']
        },
        minorityOnly: Boolean,
        disabilityFriendly: Boolean,
        ageLimit: {
            min: Number,
            max: Number
        }
    },

    // Application Details
    applicationDeadline: {
        type: Date,
        required: true,
        index: true
    },
    applicationLink: {
        type: String,
        required: true
    },
    applicationProcess: String,
    requiredDocuments: [String],

    // Categorization
    category: {
        type: String,
        enum: [
            'Merit-based', 'Need-based', 'Sports', 'Arts',
            'Research', 'Minority', 'Women', 'Disability',
            'Government', 'Private', 'International', 'Other'
        ],
        default: 'Other'
    },
    tags: [String],

    // Source Information
    sourceUrl: String,
    sourcePlatform: {
        type: String,
        enum: ['Government Portal', 'University', 'Private Foundation', 'NGO', 'Corporate', 'Other']
    },

    // Sentiment Analysis (Optional)
    sentimentScore: {
        type: Number,
        min: -1,
        max: 1
    },
    sentimentLabel: {
        type: String,
        enum: ['Positive', 'Neutral', 'Negative']
    },

    // Metadata
    isActive: {
        type: Number,
        default: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    viewCount: {
        type: Number,
        default: 0
    },
    applicationCount: {
        type: Number,
        default: 0
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    lastScraped: Date
});

// Indexes for efficient querying
scholarshipSchema.index({ applicationDeadline: 1 });
scholarshipSchema.index({ 'eligibility.courses': 1 });
scholarshipSchema.index({ 'eligibility.educationalLevels': 1 });
scholarshipSchema.index({ category: 1 });
scholarshipSchema.index({ isActive: 1, applicationDeadline: 1 });

// Update timestamp on save
scholarshipSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
