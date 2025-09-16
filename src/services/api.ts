import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    timeout: 30000,
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
    (response: AxiosResponse) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('authToken');
            window.location.href = '/auth/login';
        } else if (error.response?.status >= 500) {
            // Handle server errors
            toast.error('Server error occurred. Please try again later.');
        } else if (error.response?.data?.message) {
            // Handle API errors with messages
            toast.error(error.response.data.message);
        } else if (error.message) {
            // Handle network errors
            toast.error(error.message);
        }
        
        return Promise.reject(error);
    }
);

export { api };
export default api;
