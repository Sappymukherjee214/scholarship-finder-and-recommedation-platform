import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import {
    FaUser, FaGraduationCap, FaMapMarkerAlt, FaChartLine,
    FaDollarSign, FaVenusMars, FaUsers, FaWheelchair, FaSave, FaCheckCircle
} from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
    const { student, updateStudent } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        courseOfStudy: '',
        educationalLevel: '',
        gpa: '',
        state: '',
        city: '',
        incomeBracket: '',
        gender: '',
        minorityStatus: '',
        hasDisability: false,
        disabilityDetails: '',
        fieldInterests: [],
        emailNotifications: true
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (student) {
            setFormData({
                fullName: student.fullName || '',
                courseOfStudy: student.courseOfStudy || '',
                educationalLevel: student.educationalLevel || '',
                gpa: student.gpa || '',
                state: student.currentLocation?.state || '',
                city: student.currentLocation?.city || '',
                incomeBracket: student.incomeBracket || 'Prefer not to say',
                gender: student.gender || 'Prefer not to say',
                minorityStatus: student.minorityStatus || 'Prefer not to say',
                hasDisability: student.hasDisability || false,
                disabilityDetails: student.disabilityDetails || '',
                fieldInterests: student.fieldInterests || [],
                emailNotifications: student.emailNotifications !== false
            });
        }
    }, [student]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        setError('');
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const updateData = {
                fullName: formData.fullName,
                courseOfStudy: formData.courseOfStudy,
                educationalLevel: formData.educationalLevel,
                gpa: parseFloat(formData.gpa),
                currentLocation: {
                    country: 'India',
                    state: formData.state,
                    city: formData.city
                },
                incomeBracket: formData.incomeBracket,
                gender: formData.gender,
                minorityStatus: formData.minorityStatus,
                hasDisability: formData.hasDisability,
                disabilityDetails: formData.disabilityDetails,
                fieldInterests: formData.fieldInterests,
                emailNotifications: formData.emailNotifications
            };

            const response = await studentAPI.updateProfile(updateData);
            updateStudent(response.data.student);
            setSuccess(true);

            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="page-header animate-fade-in">
                    <h1 className="page-title">
                        Your <span className="text-gradient">Profile</span>
                    </h1>
                    <p className="page-subtitle">
                        Complete your profile to get better scholarship recommendations
                    </p>
                </div>

                {success && (
                    <div className="alert alert-success">
                        <FaCheckCircle />
                        <span>Profile updated successfully!</span>
                    </div>
                )}

                {error && (
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="profile-form">
                    {/* Basic Information */}
                    <div className="form-section card glass-effect">
                        <div className="section-header">
                            <FaUser className="section-icon" />
                            <h2 className="section-title">Basic Information</h2>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    className="form-input"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="form-section card glass-effect">
                        <div className="section-header">
                            <FaGraduationCap className="section-icon" />
                            <h2 className="section-title">Academic Information</h2>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Course of Study *</label>
                                <select
                                    name="courseOfStudy"
                                    className="form-select"
                                    value={formData.courseOfStudy}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select your course</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Medicine">Medicine</option>
                                    <option value="Business">Business</option>
                                    <option value="Arts">Arts</option>
                                    <option value="Science">Science</option>
                                    <option value="Law">Law</option>
                                    <option value="Education">Education</option>
                                    <option value="Agriculture">Agriculture</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Educational Level *</label>
                                <select
                                    name="educationalLevel"
                                    className="form-select"
                                    value={formData.educationalLevel}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select your level</option>
                                    <option value="High School">High School</option>
                                    <option value="Undergraduate">Undergraduate</option>
                                    <option value="Postgraduate">Postgraduate</option>
                                    <option value="Doctorate">Doctorate</option>
                                    <option value="Diploma">Diploma</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <FaChartLine />
                                    GPA / Academic Score (out of 10) *
                                </label>
                                <input
                                    type="number"
                                    name="gpa"
                                    className="form-input"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={formData.gpa}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="form-section card glass-effect">
                        <div className="section-header">
                            <FaMapMarkerAlt className="section-icon" />
                            <h2 className="section-title">Location</h2>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">State *</label>
                                <select
                                    name="state"
                                    className="form-select"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select your state</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="West Bengal">West Bengal</option>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Rajasthan">Rajasthan</option>
                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                                    <option value="Kerala">Kerala</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">City (Optional)</label>
                                <input
                                    type="text"
                                    name="city"
                                    className="form-input"
                                    placeholder="Enter your city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Optional Information */}
                    <div className="form-section card glass-effect">
                        <div className="section-header">
                            <FaUsers className="section-icon" />
                            <h2 className="section-title">Additional Information (Optional)</h2>
                            <p className="section-description">
                                This information helps us find more relevant scholarships for you
                            </p>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <FaDollarSign />
                                    Annual Family Income
                                </label>
                                <select
                                    name="incomeBracket"
                                    className="form-select"
                                    value={formData.incomeBracket}
                                    onChange={handleChange}
                                >
                                    <option value="Prefer not to say">Prefer not to say</option>
                                    <option value="Below 1 Lakh">Below ₹1 Lakh</option>
                                    <option value="1-3 Lakhs">₹1-3 Lakhs</option>
                                    <option value="3-5 Lakhs">₹3-5 Lakhs</option>
                                    <option value="5-8 Lakhs">₹5-8 Lakhs</option>
                                    <option value="Above 8 Lakhs">Above ₹8 Lakhs</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <FaVenusMars />
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    className="form-select"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="Prefer not to say">Prefer not to say</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Non-binary">Non-binary</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    name="minorityStatus"
                                    className="form-select"
                                    value={formData.minorityStatus}
                                    onChange={handleChange}
                                >
                                    <option value="Prefer not to say">Prefer not to say</option>
                                    <option value="General">General</option>
                                    <option value="OBC">OBC</option>
                                    <option value="SC">SC</option>
                                    <option value="ST">ST</option>
                                    <option value="EWS">EWS</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="hasDisability"
                                    checked={formData.hasDisability}
                                    onChange={handleChange}
                                />
                                <FaWheelchair />
                                <span>I have a disability or special needs</span>
                            </label>
                        </div>

                        {formData.hasDisability && (
                            <div className="form-group">
                                <label className="form-label">Disability Details</label>
                                <textarea
                                    name="disabilityDetails"
                                    className="form-textarea"
                                    rows="3"
                                    placeholder="Please provide details (optional)"
                                    value={formData.disabilityDetails}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="emailNotifications"
                                    checked={formData.emailNotifications}
                                    onChange={handleChange}
                                />
                                <span>Send me email notifications about new scholarships and deadlines</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <FaSave />
                                    <span>Save Profile</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
