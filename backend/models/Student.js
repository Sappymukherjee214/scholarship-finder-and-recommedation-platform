const mongoose = require('mongoose');

/**
 * Student Profile Schema
 * Stores comprehensive student information for scholarship matching
 */
const studentSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  
  // Basic Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  
  // Academic Information
  courseOfStudy: {
    type: String,
    required: [true, 'Course of study is required'],
    enum: [
      'Computer Science', 'Engineering', 'Medicine', 'Business', 
      'Arts', 'Science', 'Law', 'Education', 'Agriculture',
      'Architecture', 'Pharmacy', 'Nursing', 'Other'
    ]
  },
  educationalLevel: {
    type: String,
    required: [true, 'Educational level is required'],
    enum: ['High School', 'Undergraduate', 'Postgraduate', 'Doctorate', 'Diploma']
  },
  gpa: {
    type: Number,
    min: 0,
    max: 10,
    required: [true, 'GPA/Academic score is required']
  },
  
  // Location
  currentLocation: {
    country: {
      type: String,
      required: true,
      default: 'India'
    },
    state: {
      type: String,
      required: true
    },
    city: String
  },
  
  // Optional Demographic Information
  incomeBracket: {
    type: String,
    enum: ['Below 1 Lakh', '1-3 Lakhs', '3-5 Lakhs', '5-8 Lakhs', 'Above 8 Lakhs', 'Prefer not to say'],
    default: 'Prefer not to say'
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
    default: 'Prefer not to say'
  },
  minorityStatus: {
    type: String,
    enum: ['SC', 'ST', 'OBC', 'General', 'EWS', 'Prefer not to say'],
    default: 'Prefer not to say'
  },
  hasDisability: {
    type: Boolean,
    default: false
  },
  disabilityDetails: String,
  
  // Field-specific Interests
  fieldInterests: [{
    type: String
  }],
  
  // Saved Scholarships
  savedScholarships: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scholarship'
  }],
  
  // Notification Preferences
  emailNotifications: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date,
  profileCompleted: {
    type: Boolean,
    default: false
  }
});

// Index for faster queries
studentSchema.index({ email: 1 });
studentSchema.index({ courseOfStudy: 1, educationalLevel: 1 });

module.exports = mongoose.model('Student', studentSchema);
