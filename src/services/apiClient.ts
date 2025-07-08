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
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = getRefreshToken();
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                        refreshToken
                    });

                    const { accessToken } = response.data.data;
                    setToken(accessToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    removeTokens();
                    useAuthStore.getState().clearUser();
                    window.location.href = '/auth/sign-in';
                    return Promise.reject(refreshError);
                }
            } else {
                removeTokens();
                useAuthStore.getState().clearUser();
                window.location.href = '/auth/sign-in';
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
