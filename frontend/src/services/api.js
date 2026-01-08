import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('student');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/me')
};

// Student API
export const studentAPI = {
    getProfile: () => api.get('/students/profile'),
    updateProfile: (data) => api.put('/students/profile', data),
    saveScholarship: (id) => api.post(`/students/save-scholarship/${id}`),
    removeSavedScholarship: (id) => api.delete(`/students/save-scholarship/${id}`),
    getSavedScholarships: () => api.get('/students/saved-scholarships')
};

// Scholarship API
export const scholarshipAPI = {
    getAll: (params) => api.get('/scholarships', { params }),
    getById: (id) => api.get(`/scholarships/${id}`),
    getRecommendations: (params) => api.get('/scholarships/recommendations', { params }),
    trackApplication: (id) => api.post(`/scholarships/${id}/apply`),
    getStats: () => api.get('/scholarships/stats/overview')
};

export default api;
