import axios, {
    type AxiosInstance,
    type AxiosResponse,
    type InternalAxiosRequestConfig
} from 'axios'
import {getToken, removeToken, setToken} from "@/modules/auth/utils/tokenUtils.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken()
        if (token) {
            config.headers = config.headers || {}
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for token refresh
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem('refreshToken')
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken
                    })

                    const { token } = response.data
                    setToken(token)

                    originalRequest.headers.Authorization = `Bearer ${token}`
                    return apiClient(originalRequest)
                }
            } catch (error) {
                console.error('Error refreshing token:', error)
                removeToken()
                localStorage.removeItem('refreshToken')
                window.location.href = '/auth/login'
            }
        }

        return Promise.reject(error)
    }
)

export default apiClient
