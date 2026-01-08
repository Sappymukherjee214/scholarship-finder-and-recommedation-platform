import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Suppress ResizeObserver warning (harmless browser notification)
// This warning is common in React apps with animations and doesn't affect functionality
const originalError = console.error;
console.error = (...args) => {
    if (
        typeof args[0] === 'string' &&
        args[0].includes('ResizeObserver loop completed with undelivered notifications')
    ) {
        return; // Suppress this specific warning
    }
    originalError.apply(console, args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
