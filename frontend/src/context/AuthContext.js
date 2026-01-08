import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        const savedStudent = localStorage.getItem('student');

        if (token && savedStudent) {
            try {
                const response = await authAPI.getProfile();
                setStudent(response.data.student);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Auth check failed:', error);
                logout();
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { token, student } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('student', JSON.stringify(student));

            setStudent(student);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (data) => {
        try {
            const response = await authAPI.register(data);
            const { token, student } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('student', JSON.stringify(student));

            setStudent(student);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('student');
        setStudent(null);
        setIsAuthenticated(false);
    };

    const updateStudent = (updatedStudent) => {
        setStudent(updatedStudent);
        localStorage.setItem('student', JSON.stringify(updatedStudent));
    };

    const value = {
        student,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateStudent
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
