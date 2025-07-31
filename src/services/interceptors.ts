import { apiClient } from './api-client.ts'
import type {AxiosResponse, InternalAxiosRequestConfig} from "axios";

export const setupInterceptors = () => {
    apiClient.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data)
            return config
        },
        (error) => {
            console.error('Request error:', error)
            return Promise.reject(error)
        }
    )

    apiClient.interceptors.response.use(
        (response: AxiosResponse) => {
            console.log(`✅ ${response.status} ${response.config.url}`, response.data)
            return response
        },
        (error) => {
            console.error('Response error:', error.response?.data || error.message)
            return Promise.reject(error)
        }
    )
}
