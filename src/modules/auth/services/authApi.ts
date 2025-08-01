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
    // Email/Password Authentication
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

    // Token Management
    refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
        const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken })
        return response.data.data
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
        return response.data.data;
    },

    // Session Management
    logout: async () => {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    },

    logoutAll: async (): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT_ALL)
    },

    // Password Management
    changePassword: async (credentials: ChangePasswordCredentials): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, credentials)
    },

    forgotPassword: async (credentials: ForgotPasswordCredentials): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, credentials)
    },

    resetPassword: async (credentials: ResetPasswordCredentials): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, credentials)
    },

    // Google OAuth - Popup Flow (Better UX)
    initiateGoogleAuthPopup: async (): Promise<{ accessToken: string; refreshToken: string }> => {
        return new Promise(async (resolve, reject) => {
            try {
                // Get Google OAuth URL from backend
                const response = await apiClient.get<ApiResponse<{ url: string }>>(
                    `${API_ENDPOINTS.AUTH.GOOGLE_AUTH}?popup=true`,
                    { headers: { 'Accept': 'application/json' } }
                );
                const { url } = response.data.data;

                // Calculate popup position (center of screen)
                const width = 500;
                const height = 600;
                const left = (window.screen.width / 2) - (width / 2);
                const top = (window.screen.height / 2) - (height / 2);

                // Open popup with the OAuth URL
                const popup = window.open(
                    url,
                    'google-oauth',
                    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no`
                );

                if (!popup) {
                    reject(new Error('Popup blocked. Please allow popups for this site.'));
                    return;
                }

                console.log('🚀 Google OAuth popup opened');

                // Listen for messages from popup
                const messageListener = (event: MessageEvent) => {
                    // Verify origin for security
                    if (event.origin !== window.location.origin) {
                        console.warn('Received message from unexpected origin:', event.origin);
                        return;
                    }

                    console.log('📨 Received message from popup:', event.data);

                    if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
                        cleanup();
                        resolve({
                            accessToken: event.data.data.accessToken,
                            refreshToken: event.data.data.refreshToken
                        });
                    } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
                        cleanup();
                        reject(new Error(event.data.error || 'Google authentication failed'));
                    }
                };

                // Cleanup function
                const cleanup = () => {
                    window.removeEventListener('message', messageListener);
                    clearInterval(checkClosed);
                    clearTimeout(timeoutId);
                    if (!popup.closed) {
                        popup.close();
                    }
                };

                window.addEventListener('message', messageListener);

                // Check if popup was closed manually
                const checkClosed = setInterval(() => {
                    if (popup.closed) {
                        cleanup();
                        reject(new Error('Authentication cancelled by user'));
                    }
                }, 1000);

                // Timeout after 5 minutes
                const timeoutId = setTimeout(() => {
                    cleanup();
                    reject(new Error('Authentication timeout. Please try again.'));
                }, 5 * 60 * 1000);

            } catch (error) {
                console.error('Failed to initiate Google OAuth:', error);
                reject(new Error('Failed to initiate Google authentication'));
            }
        });
    },

    // Google OAuth - Redirect Flow (Traditional)
    initiateGoogleAuth: async (): Promise<void> => {
        try {
            // Direct redirect to Google OAuth
            window.location.href = `${apiClient.defaults.baseURL}${API_ENDPOINTS.AUTH.GOOGLE_AUTH}`;
        } catch (error) {
            console.error('Failed to initiate Google OAuth redirect:', error);
            throw new Error('Failed to initiate Google authentication');
        }
    },

    // Handle Google OAuth callback with authorization code
    handleGoogleCallback: async (code: string): Promise<AuthResponse> => {
        const response = await apiClient.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.GOOGLE_AUTH_CALLBACK, { code })
        return response.data.data
    },

    // Extract tokens from URL (for redirect flow)
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

    // Check if Google OAuth is available
    checkGoogleOAuthAvailability: async (): Promise<boolean> => {
        try {
            await apiClient.get(API_ENDPOINTS.AUTH.GOOGLE_AUTH);
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

    // Health check
    checkApiHealth: async (): Promise<boolean> => {
        try {
            await apiClient.get('/health');
            return true;
        } catch {
            return false;
        }
    },
}