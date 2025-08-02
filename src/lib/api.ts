import axios from 'axios';

// Create axios instance with base configuration
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Only redirect to login for auth-related endpoints
            const isAuthEndpoint = error.config?.url?.includes('/auth/');

            if (isAuthEndpoint) {
                localStorage.removeItem('authToken');
                window.location.href = '/login';
            } else {
                // For other endpoints, just log the error in development
                if (import.meta.env.DEV) {
                    console.warn('API request failed with 401:', error.config?.url);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
