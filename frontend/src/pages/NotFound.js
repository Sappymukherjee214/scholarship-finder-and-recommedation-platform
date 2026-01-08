import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="error-code">404</div>
                <h1 className="error-title">Page Not Found</h1>
                <p className="error-description">
                    Oops! The page you're looking for doesn't exist.
                    It might have been moved or deleted.
                </p>
                <div className="error-actions">
                    <Link to="/" className="btn-primary">
                        Go Home
                    </Link>
                    <Link to="/scholarships" className="btn-secondary">
                        Browse Scholarships
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
