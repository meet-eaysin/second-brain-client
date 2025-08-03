import axios from 'axios';
import { getToken } from '@/modules/auth/utils/tokenUtils';

// Create axios instance with base configuration
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token (using consistent token utils)
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add debug logging for API calls
        if (import.meta.env.DEV) {
            console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        }
        
        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        // Add debug logging for successful responses
        if (import.meta.env.DEV) {
            console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
        }
        return response;
    },
    (error) => {
        // Enhanced error logging
        if (import.meta.env.DEV) {
            console.error(`❌ API Error: ${error.response?.status || 'Network'} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
        }
        
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
