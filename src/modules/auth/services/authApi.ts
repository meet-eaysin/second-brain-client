import apiClient from "@/services/api-client.ts";
import type {
    ApiResponse,
    AuthResponse,
    RegisterCredentials,
    User,
    ChangePasswordCredentials,
    ForgotPasswordCredentials,
    ResetPasswordCredentials,
    RefreshTokenResponse
} from "@/modules/auth/types/auth.types.ts";
import {API_ENDPOINTS} from "@/constants/api-endpoints.ts";

export const authApi = {
    login: async (email: string, password: string) => {
        const response = await apiClient.post<ApiResponse<{
            user: User;
            accessToken: string;
            refreshToken: string;
        }>>(API_ENDPOINTS.AUTH.SIGN_IN, { email, password });
        return response.data.data;
    },

    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.SIGN_UP, credentials)
        return response.data.data
    },

    refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
        const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken })
        return response.data.data
    },

    logout: async () => {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    },

    logoutAll: async (): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT_ALL)
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
        return response.data.data;
    },

    changePassword: async (credentials: ChangePasswordCredentials): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, credentials)
    },

    forgotPassword: async (credentials: ForgotPasswordCredentials): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, credentials)
    },

    resetPassword: async (credentials: ResetPasswordCredentials): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, credentials)
    },

    initiateGoogleAuth: async (): Promise<void> => {
        window.location.href = `${apiClient.defaults.baseURL}${API_ENDPOINTS.AUTH.GOOGLE_AUTH}`;
    },

    getGoogleLoginUrl: async (): Promise<{ url: string }> => {
        return { url: `${apiClient.defaults.baseURL}${API_ENDPOINTS.AUTH.GOOGLE_AUTH}` };
    },

    checkGoogleOAuthAvailability: async (): Promise<boolean> => {
        try {
            await apiClient.head(API_ENDPOINTS.AUTH.GOOGLE_AUTH);
            return true;
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number } };
                if (axiosError.response?.status === 404) {
                    return false;
                }
            }
            return true;
        }
    },

    // Handle Google OAuth callback with authorization code
    handleGoogleCallback: async (code: string): Promise<AuthResponse> => {
        const response = await apiClient.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.GOOGLE_AUTH_CALLBACK, { code })
        return response.data.data
    },

    handleTokensFromUrl: (searchParams: URLSearchParams): {
        accessToken?: string;
        refreshToken?: string;
        error?: string
    } => {
        return {
            accessToken: searchParams.get('token') || undefined,
            refreshToken: searchParams.get('refreshToken') || undefined,
            error: searchParams.get('error') || undefined
        };
    },
}