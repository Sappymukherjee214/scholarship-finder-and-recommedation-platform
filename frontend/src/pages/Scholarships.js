import React, { useEffect, useState } from 'react';
import { scholarshipAPI, studentAPI } from '../services/api';
import {
    FaSearch, FaFilter, FaAward, FaClock, FaBookmark,
    FaExternalLinkAlt, FaStar, FaTimes
} from 'react-icons/fa';
import './Scholarships.css';

const Scholarships = () => {
    const [scholarships, setScholarships] = useState([]);
    const [savedScholarships, setSavedScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        minAmount: '',
        maxAmount: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchScholarships();
        fetchSavedScholarships();
    }, []);

    const fetchScholarships = async () => {
        try {
            setLoading(true);
            const params = {
                search: searchTerm,
                ...filters
            };
            const response = await scholarshipAPI.getAll(params);
            setScholarships(response.data.scholarships);
        } catch (error) {
            console.error('Error fetching scholarships:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedScholarships = async () => {
        try {
            const response = await studentAPI.getSavedScholarships();
            setSavedScholarships(response.data.scholarships);
        } catch (error) {
            console.error('Error fetching saved scholarships:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchScholarships();
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const applyFilters = () => {
        fetchScholarships();
        setShowFilters(false);
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            minAmount: '',
            maxAmount: ''
        });
        setSearchTerm('');
        fetchScholarships();
    };

    const handleSaveScholarship = async (scholarshipId) => {
        try {
            await studentAPI.saveScholarship(scholarshipId);
            fetchSavedScholarships();
        } catch (error) {
            console.error('Error saving scholarship:', error);
        }
    };

    const handleUnsaveScholarship = async (scholarshipId) => {
        try {
            await studentAPI.removeSavedScholarship(scholarshipId);
            fetchSavedScholarships();
        } catch (error) {
            console.error('Error removing scholarship:', error);
        }
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

    const getDaysRemaining = (deadline) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const days = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
        return days;
    };

    return (
        <div className="scholarships-page">
            <div className="container">
                <div className="page-header animate-fade-in">
                    <h1 className="page-title">
                        Browse <span className="text-gradient">Scholarships</span>
                    </h1>
                    <p className="page-subtitle">
                        Explore all available scholarships and find the perfect match for you
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="search-filter-bar card glass-effect">
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-input-wrapper">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search scholarships by name, provider, or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Search
                        </button>
                    </form>

                    <button
                        className="btn btn-secondary filter-toggle"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter />
                        Filters
                    </button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="filter-panel card glass-effect animate-slide-in-left">
                        <div className="filter-header">
                            <h3>Filter Scholarships</h3>
                            <button className="close-btn" onClick={() => setShowFilters(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="filter-content">
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    name="category"
                                    className="form-select"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All Categories</option>
                                    <option value="Merit-based">Merit-based</option>
                                    <option value="Need-based">Need-based</option>
                                    <option value="Women">Women</option>
                                    <option value="Minority">Minority</option>
                                    <option value="Research">Research</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Disability">Disability</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Min Amount (₹)</label>
                                    <input
                                        type="number"
                                        name="minAmount"
                                        className="form-input"
                                        placeholder="10000"
                                        value={filters.minAmount}
                                        onChange={handleFilterChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Max Amount (₹)</label>
                                    <input
                                        type="number"
                                        name="maxAmount"
                                        className="form-input"
                                        placeholder="100000"
                                        value={filters.maxAmount}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </div>

                            <div className="filter-actions">
                                <button className="btn btn-primary" onClick={applyFilters}>
                                    Apply Filters
                                </button>
                                <button className="btn btn-secondary" onClick={clearFilters}>
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div className="results-info">
                    <p>Found <strong>{scholarships.length}</strong> scholarships</p>
                </div>

                {/* Scholarships Grid */}
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading scholarships...</p>
                    </div>
                ) : scholarships.length === 0 ? (
                    <div className="empty-state card">
                        <FaAward className="empty-icon" />
                        <h3>No Scholarships Found</h3>
                        <p>Try adjusting your search or filters</p>
                        <button className="btn btn-primary" onClick={clearFilters}>
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="scholarships-grid">
                        {scholarships.map((scholarship, index) => {
                            const isSaved = savedScholarships.some(s => s._id === scholarship._id);
                            const daysRemaining = getDaysRemaining(scholarship.applicationDeadline);
                            const isUrgent = daysRemaining <= 7;

                            return (
                                <div
                                    key={scholarship._id}
                                    className="scholarship-card card animate-fade-in"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="scholarship-header">
                                        <div className="scholarship-badges">
                                            {isUrgent && (
                                                <span className="badge badge-error">
                                                    <FaClock />
                                                    {daysRemaining} days left
                                                </span>
                                            )}
                                            <span className="badge badge-primary">
                                                {scholarship.category}
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

export default Scholarships;
