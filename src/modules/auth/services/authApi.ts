import apiClient from "@/services/apiClient.ts";
import type {
    AuthResponse,
    GoogleAuthResponse,
    LoginCredentials,
    RegisterCredentials, User
} from "@/modules/auth/types/auth.types.ts";

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials)
        return data
    },

    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const { data } = await apiClient.post<AuthResponse>('/auth/register', credentials)
        return data
    },

    googleLogin: async (token: string): Promise<GoogleAuthResponse> => {
        const { data } = await apiClient.post<GoogleAuthResponse>('/auth/google', { token })
        return data
    },

    refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
        const { data } = await apiClient.post<{ token: string }>('/auth/refresh', { refreshToken })
        return data
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout')
    },

    getCurrentUser: async (): Promise<{ user: User }> => {
        const { data } = await apiClient.get<{ user: User }>('/auth/me')
        return data
    },
}
