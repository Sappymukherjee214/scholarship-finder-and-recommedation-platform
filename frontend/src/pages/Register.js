import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FaUser, FaEnvelope, FaLock, FaGraduationCap,
    FaMapMarkerAlt, FaChartLine, FaUserPlus, FaExclamationCircle
} from 'react-icons/fa';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        courseOfStudy: '',
        educationalLevel: '',
        gpa: '',
        state: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.gpa < 0 || formData.gpa > 10) {
            setError('GPA must be between 0 and 10');
            return;
        }

        setLoading(true);

        const registrationData = {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            courseOfStudy: formData.courseOfStudy,
            educationalLevel: formData.educationalLevel,
            gpa: parseFloat(formData.gpa),
            currentLocation: {
                country: 'India',
                state: formData.state
            }
        };

        const result = await register(registrationData);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container auth-container-wide animate-fade-in">
                <div className="auth-card card glass-effect">
                    <div className="auth-header">
                        <h1 className="auth-title">Create Your Account</h1>
                        <p className="auth-subtitle">Start your scholarship journey today</p>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            <FaExclamationCircle />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <FaUser />
                                    <span>Full Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    className="form-input"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <FaEnvelope />
                                    <span>Email Address</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="your.email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <FaLock />
                                    <span>Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-input"
                                    placeholder="Minimum 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <FaLock />
                                    <span>Confirm Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-input"
                                    placeholder="Re-enter password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <FaGraduationCap />
                                    <span>Course of Study</span>
                                </label>
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
                                <label className="form-label">
                                    <FaGraduationCap />
                                    <span>Educational Level</span>
                                </label>
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
                                    <span>GPA / Academic Score (out of 10)</span>
                                </label>
                                <input
                                    type="number"
                                    name="gpa"
                                    className="form-input"
                                    placeholder="8.5"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={formData.gpa}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <FaMapMarkerAlt />
                                    <span>State</span>
                                </label>
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
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <>
                                    <FaUserPlus />
                                    <span>Create Account</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
