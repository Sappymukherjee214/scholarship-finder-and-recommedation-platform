import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { scholarshipAPI } from '../services/api';
import {
    FaRocket, FaSearch, FaBrain, FaBell, FaChartLine,
    FaUsers, FaAward, FaClock, FaArrowRight
} from 'react-icons/fa';
import './Home.css';

const Home = () => {
    const { isAuthenticated } = useAuth();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await scholarshipAPI.getStats();
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const features = [
        {
            icon: <FaSearch />,
            title: 'Centralized Search',
            description: 'Access thousands of scholarships from multiple trusted sources in one place',
            color: 'var(--accent-cyan)'
        },
        {
            icon: <FaBrain />,
            title: 'Smart Matching',
            description: 'AI-powered algorithm matches you with the most relevant scholarships',
            color: 'var(--accent-purple)'
        },
        {
            icon: <FaBell />,
            title: 'Deadline Alerts',
            description: 'Never miss an opportunity with timely notifications and reminders',
            color: 'var(--accent-amber)'
        },
        {
            icon: <FaChartLine />,
            title: 'Personalized Dashboard',
            description: 'Track your applications and saved scholarships in one organized view',
            color: 'var(--accent-emerald)'
        }
    ];

    const steps = [
        {
            number: '01',
            title: 'Create Your Profile',
            description: 'Tell us about your academic background, location, and preferences'
        },
        {
            number: '02',
            title: 'Get Matched',
            description: 'Our algorithm finds scholarships that match your unique profile'
        },
        {
            number: '03',
            title: 'Apply & Win',
            description: 'Apply directly through our platform and track your progress'
        }
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content animate-fade-in">
                        <div className="hero-badge">
                            <FaRocket />
                            <span>Discover Your Future</span>
                        </div>

                        <h1 className="hero-title">
                            Find Scholarships That
                            <br />
                            <span className="text-gradient">Match Your Dreams</span>
                        </h1>

                        <p className="hero-description">
                            Stop wasting time searching across multiple platforms. InternFair uses intelligent
                            matching to connect you with scholarships tailored to your profile, saving you time
                            and maximizing your chances of success.
                        </p>

                        <div className="hero-actions">
                            {isAuthenticated ? (
                                <Link to="/dashboard">
                                    <button className="btn btn-primary btn-lg">
                                        Go to Dashboard
                                        <FaArrowRight />
                                    </button>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register">
                                        <button className="btn btn-primary btn-lg">
                                            Get Started Free
                                            <FaArrowRight />
                                        </button>
                                    </Link>
                                    <Link to="/scholarships">
                                        <button className="btn btn-secondary btn-lg">
                                            Browse Scholarships
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {stats && (
                            <div className="hero-stats">
                                <div className="stat-item">
                                    <FaAward className="stat-icon" />
                                    <div>
                                        <div className="stat-value">{stats.active}+</div>
                                        <div className="stat-label">Active Scholarships</div>
                                    </div>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-item">
                                    <FaClock className="stat-icon" />
                                    <div>
                                        <div className="stat-value">{stats.urgent}</div>
                                        <div className="stat-label">Closing Soon</div>
                                    </div>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-item">
                                    <FaUsers className="stat-icon" />
                                    <div>
                                        <div className="stat-value">10K+</div>
                                        <div className="stat-label">Students Helped</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="hero-visual animate-slide-in-right">
                        <div className="floating-card card-1">
                            <div className="card-icon" style={{ background: 'var(--gradient-primary)' }}>
                                <FaAward />
                            </div>
                            <div className="card-content">
                                <div className="card-title">Merit Scholarship</div>
                                <div className="card-amount">₹50,000</div>
                                <div className="card-match">95% Match</div>
                            </div>
                        </div>

                        <div className="floating-card card-2">
                            <div className="card-icon" style={{ background: 'var(--gradient-accent)' }}>
                                <FaBrain />
                            </div>
                            <div className="card-content">
                                <div className="card-title">Research Grant</div>
                                <div className="card-amount">₹1,00,000</div>
                                <div className="card-match">88% Match</div>
                            </div>
                        </div>

                        <div className="floating-card card-3">
                            <div className="card-icon" style={{ background: 'var(--gradient-secondary)' }}>
                                <FaChartLine />
                            </div>
                            <div className="card-content">
                                <div className="card-title">Women in STEM</div>
                                <div className="card-amount">₹75,000</div>
                                <div className="card-match">92% Match</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Why Choose InternFair?</h2>
                        <p className="section-description">
                            We've built the most comprehensive and intelligent scholarship platform
                        </p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="feature-card card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="feature-icon" style={{ color: feature.color }}>
                                    {feature.icon}
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-description">
                            Three simple steps to find your perfect scholarship
                        </p>
                    </div>

                    <div className="steps-container">
                        {steps.map((step, index) => (
                            <div key={index} className="step-item">
                                <div className="step-number">{step.number}</div>
                                <div className="step-content">
                                    <h3 className="step-title">{step.title}</h3>
                                    <p className="step-description">{step.description}</p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="step-connector"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="cta-section">
                        {!isAuthenticated && (
                            <Link to="/register">
                                <button className="btn btn-primary btn-lg">
                                    Start Your Journey Today
                                    <FaArrowRight />
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
