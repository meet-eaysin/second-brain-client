import axios, {
    type AxiosInstance,
    type AxiosResponse,
    type InternalAxiosRequestConfig
} from 'axios';
import {
    getToken,
    removeTokens,
    setToken,
    getRefreshToken
} from "@/modules/auth/utils/tokenUtils.ts";
import {useAuthStore} from "@/modules/auth/store/authStore.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request details for debugging (development only)
        if (import.meta.env.DEV && config.method?.toUpperCase() === 'POST' && config.url?.includes('/databases')) {
            console.log('📤 Database API Request:', {
                method: config.method,
                url: config.url,
                data: config.data
            });
        }

        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Log response details for debugging database API calls (development only)
        if (import.meta.env.DEV && response.config.url?.includes('/databases')) {
            console.log('📥 Database API Response:', {
                method: response.config.method,
                url: response.config.url,
                status: response.status,
                data: response.data
            });
        }
        return response;
    },
    async (error) => {
        // Log error details for debugging database API calls (development only)
        if (import.meta.env.DEV && error.config?.url?.includes('/databases')) {
            console.error('❌ Database API Error:', {
                method: error.config.method,
                url: error.config.url,
                status: error.response?.status,
                data: error.response?.data,
                requestData: error.config.data
            });
        }
        const originalRequest = error.config;

        // Handle 401 Unauthorized - Token expired/invalid
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = getRefreshToken();
            if (refreshToken) {
                try {
                    console.log('Attempting to refresh token...');
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                        refreshToken
                    });

                    const { accessToken } = response.data.data;
                    setToken(accessToken);

                    // Retry the original request with new token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    console.log('Token refreshed successfully, retrying original request');
                    return apiClient(originalRequest);
                } catch (refreshError: unknown) {
                    console.error('Token refresh failed:', refreshError);

                    // Clear tokens and redirect to login
                    removeTokens();
                    useAuthStore.getState().clearUser();
                    useAuthStore.getState().setError('Session expired. Please sign in again.');

                    // Only redirect if not already on auth pages
                    const currentPath = window.location.pathname;
                    if (!currentPath.startsWith('/auth')) {
                        window.location.href = '/auth/sign-in';
                    }

                    return Promise.reject(refreshError);
                }
            } else {
                console.log('No refresh token available, redirecting to login');

                // Clear tokens and redirect to login
                removeTokens();
                useAuthStore.getState().clearUser();
                useAuthStore.getState().setError('Please sign in to continue.');

                // Only redirect if not already on auth pages
                const currentPath = window.location.pathname;
                if (!currentPath.startsWith('/auth')) {
                    window.location.href = '/auth/sign-in';
                }
            }
        }

        // Handle 403 Forbidden - Insufficient permissions
        if (error.response?.status === 403) {
            useAuthStore.getState().setError('You do not have permission to access this resource.');
        }

        // Handle network errors
        if (!error.response) {
            useAuthStore.getState().setError('Network error. Please check your connection.');
        }

        return Promise.reject(error);
    }
);

export default apiClient;
