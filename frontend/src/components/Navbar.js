import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaUser, FaBookmark, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated, student, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <nav className="navbar glass-effect">
            <div className="container navbar-container">
                <Link to="/" className="navbar-brand">
                    <FaGraduationCap className="navbar-icon" />
                    <span className="navbar-title">
                        Intern<span className="text-gradient">Fair</span>
                    </span>
                </Link>

                <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                <FaGraduationCap />
                                <span>Dashboard</span>
                            </Link>
                            <Link to="/scholarships" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                <FaBookmark />
                                <span>Scholarships</span>
                            </Link>
                            <Link to="/profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                <FaUser />
                                <span>Profile</span>
                            </Link>
                            <div className="nav-divider"></div>
                            <div className="nav-user">
                                <div className="user-avatar">
                                    {student?.fullName?.charAt(0).toUpperCase()}
                                </div>
                                <span className="user-name">{student?.fullName}</span>
                            </div>
                            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                Login
                            </Link>
                            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                <button className="btn btn-primary btn-sm">Get Started</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
