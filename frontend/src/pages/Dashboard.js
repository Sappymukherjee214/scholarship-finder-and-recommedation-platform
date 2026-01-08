import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { scholarshipAPI, studentAPI } from '../services/api';
import {
    FaAward, FaClock, FaBookmark, FaExternalLinkAlt,
    FaChartLine, FaFire, FaStar, FaCheckCircle
} from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
    const { student } = useAuth();
    const [recommendations, setRecommendations] = useState([]);
    const [savedScholarships, setSavedScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [recsResponse, savedResponse, statsResponse] = await Promise.all([
                scholarshipAPI.getRecommendations({ limit: 12, minScore: 50 }),
                studentAPI.getSavedScholarships(),
                scholarshipAPI.getStats()
            ]);

            setRecommendations(recsResponse.data.recommendations);
            setSavedScholarships(savedResponse.data.scholarships);
            setStats(statsResponse.data.stats);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveScholarship = async (scholarshipId) => {
        try {
            await studentAPI.saveScholarship(scholarshipId);
            fetchDashboardData();
        } catch (error) {
            console.error('Error saving scholarship:', error);
        }
    };

    const handleUnsaveScholarship = async (scholarshipId) => {
        try {
            await studentAPI.removeSavedScholarship(scholarshipId);
            fetchDashboardData();
        } catch (error) {
            console.error('Error removing scholarship:', error);
        }
    };

    const getUrgencyBadge = (urgency) => {
        const badges = {
            critical: { label: 'Urgent', class: 'badge-error', icon: <FaFire /> },
            high: { label: 'Soon', class: 'badge-warning', icon: <FaClock /> },
            medium: { label: 'Moderate', class: 'badge-info', icon: <FaClock /> },
            low: { label: 'Plenty of Time', class: 'badge-success', icon: <FaCheckCircle /> }
        };
        return badges[urgency] || badges.low;
    };

    const formatAmount = (awardAmount) => {
        if (!awardAmount) return 'Variable';
        const amount = awardAmount.max || awardAmount.min || 0;
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const formatDeadline = (deadline) => {
        const date = new Date(deadline);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading your personalized recommendations...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                {/* Welcome Section */}
                <div className="dashboard-header animate-fade-in">
                    <div>
                        <h1 className="dashboard-title">
                            Welcome back, <span className="text-gradient">{student?.fullName}</span>
                        </h1>
                        <p className="dashboard-subtitle">
                            Here are your personalized scholarship recommendations
                        </p>
                    </div>
                    <Link to="/profile">
                        <button className="btn btn-secondary">
                            Complete Profile
                        </button>
                    </Link>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="stats-grid animate-slide-in-left">
                        <div className="stat-card card">
                            <div className="stat-icon" style={{ background: 'var(--gradient-primary)' }}>
                                <FaAward />
                            </div>
                            <div className="stat-content">
                                <div className="stat-value">{recommendations.length}</div>
                                <div className="stat-label">Matched Scholarships</div>
                            </div>
                        </div>

                        <div className="stat-card card">
                            <div className="stat-icon" style={{ background: 'var(--gradient-accent)' }}>
                                <FaBookmark />
                            </div>
                            <div className="stat-content">
                                <div className="stat-value">{savedScholarships.length}</div>
                                <div className="stat-label">Saved Scholarships</div>
                            </div>
                        </div>

                        <div className="stat-card card">
                            <div className="stat-icon" style={{ background: 'var(--gradient-secondary)' }}>
                                <FaClock />
                            </div>
                            <div className="stat-content">
                                <div className="stat-value">{stats.urgent}</div>
                                <div className="stat-label">Closing Soon</div>
                            </div>
                        </div>

                        <div className="stat-card card">
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                <FaChartLine />
                            </div>
                            <div className="stat-content">
                                <div className="stat-value">{stats.active}</div>
                                <div className="stat-label">Total Active</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recommendations Section */}
                <div className="section-header">
                    <h2 className="section-title">
                        <FaStar className="section-icon" />
                        Top Recommendations for You
                    </h2>
                    <Link to="/scholarships" className="view-all-link">
                        View All Scholarships
                    </Link>
                </div>

                {recommendations.length === 0 ? (
                    <div className="empty-state card">
                        <FaAward className="empty-icon" />
                        <h3>No Recommendations Yet</h3>
                        <p>Complete your profile to get personalized scholarship recommendations</p>
                        <Link to="/profile">
                            <button className="btn btn-primary">Complete Profile</button>
                        </Link>
                    </div>
                ) : (
                    <div className="scholarships-grid">
                        {recommendations.map((scholarship, index) => {
                            const isSaved = savedScholarships.some(s => s._id === scholarship._id);
                            const urgencyBadge = getUrgencyBadge(scholarship.deadlineInfo.urgency);

                            return (
                                <div
                                    key={scholarship._id}
                                    className="scholarship-card card animate-fade-in"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="scholarship-header">
                                        <div className="scholarship-badges">
                                            <span className={`badge ${urgencyBadge.class}`}>
                                                {urgencyBadge.icon}
                                                {urgencyBadge.label}
                                            </span>
                                            <span className="badge badge-primary">
                                                <FaStar />
                                                {scholarship.matchScore}% Match
                                            </span>
                                        </div>
                                        <button
                                            className={`bookmark-btn ${isSaved ? 'saved' : ''}`}
                                            onClick={() => isSaved ? handleUnsaveScholarship(scholarship._id) : handleSaveScholarship(scholarship._id)}
                                            title={isSaved ? 'Remove from saved' : 'Save scholarship'}
                                        >
                                            <FaBookmark />
                                        </button>
                                    </div>

                                    <h3 className="scholarship-title">{scholarship.name}</h3>
                                    <p className="scholarship-provider">{scholarship.provider}</p>

                                    <div className="scholarship-details">
                                        <div className="detail-item">
                                            <FaAward className="detail-icon" />
                                            <span>{formatAmount(scholarship.awardAmount)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <FaClock className="detail-icon" />
                                            <span>{formatDeadline(scholarship.applicationDeadline)}</span>
                                        </div>
                                    </div>

                                    <p className="scholarship-description">
                                        {scholarship.description.substring(0, 120)}...
                                    </p>

                                    <div className="scholarship-footer">
                                        <a
                                            href={scholarship.applicationLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary btn-sm"
                                            onClick={() => scholarshipAPI.trackApplication(scholarship._id)}
                                        >
                                            Apply Now
                                            <FaExternalLinkAlt />
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
