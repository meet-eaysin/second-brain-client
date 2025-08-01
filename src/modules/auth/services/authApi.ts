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
        console.log('🔄 Calling logout API...');
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
            console.log('✅ Logout API successful:', response.status);
            return response.data;
        } catch (error) {
            console.error('❌ Logout API failed:', error);
            throw error;
        }
    },

    logoutAll: async (): Promise<void> => {
        console.log('🔄 Calling logout all API...');
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT_ALL);
            console.log('✅ Logout all API successful:', response.status);
            return response.data;
        } catch (error) {
            console.error('❌ Logout all API failed:', error);
            throw error;
        }
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

    // Google OAuth - Redirect Flow (Simple and Reliable)
    initiateGoogleAuth: async (): Promise<void> => {
        console.log('🔄 Initiating Google OAuth redirect...');
        window.location.href = API_ENDPOINTS.AUTH.GOOGLE_AUTH;
    },

    // Google OAuth - Get URL for redirect (alternative method)
    getGoogleAuthUrl: async (): Promise<string> => {
        try {
            console.log('🔄 Getting Google OAuth URL for redirect...');
            const response = await apiClient.get<ApiResponse<{ url: string }>>(
                `${API_ENDPOINTS.AUTH.GOOGLE_AUTH}?response_type=json`
            );

            const url = response.data.data.url;
            console.log('✅ Received Google OAuth URL for redirect');

            if (!url || !url.includes('accounts.google.com')) {
                throw new Error(`Invalid Google OAuth URL: ${url}`);
            }

            return url;
        } catch (error) {
            console.error('❌ Failed to get Google OAuth URL:', error);
            throw error;
        }
    },

    // Google OAuth - Popup Flow (Legacy - use redirect instead)
    initiateGoogleAuthPopup: async (): Promise<{ accessToken: string; refreshToken: string }> => {
        try {
            // First, get the Google OAuth URL from the backend
            console.log('🔄 Getting Google OAuth URL from backend...');
            const response = await apiClient.get<ApiResponse<{ url: string }>>(
                `${API_ENDPOINTS.AUTH.GOOGLE_AUTH}?popup=true&response_type=json`
            );

            const googleOAuthUrl = response.data.data.url;
            console.log('✅ Received Google OAuth URL:', googleOAuthUrl);

            // Validate that we got a Google OAuth URL
            if (!googleOAuthUrl || !googleOAuthUrl.includes('accounts.google.com')) {
                console.error('❌ Backend returned invalid Google OAuth URL:', googleOAuthUrl);
                console.error('❌ Expected URL to contain "accounts.google.com"');
                console.error('❌ This suggests your backend is not properly configured for popup OAuth');
                console.error('❌ Check that your backend handles popup=true&response_type=json parameters');
                throw new Error(`Invalid Google OAuth URL received from backend. Expected Google URL but got: ${googleOAuthUrl}`);
            }

            return new Promise((resolve, reject) => {
                let messageReceived = false;
               
                const width = 500;
                const height = 600;
                const left = (window.screen.width / 2) - (width / 2);
                const top = (window.screen.height / 2) - (height / 2);

                const popup = window.open(
                    googleOAuthUrl,
                    'google-oauth',
                    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no`
                );

                if (!popup) {
                    reject(new Error('Popup blocked. Please allow popups for this site.'));
                    return;
                }

                console.log('🚀 Google OAuth popup opened');
                console.log('ℹ️  Note: COOP policy may block popup.closed access - this is normal');

                const handleMessage = (event: MessageEvent) => {
                    if (event.origin !== window.location.origin) return;

                    if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
                        messageReceived = true;
                        cleanup();

                        // Safely close popup (handle COOP restrictions)
                        try {
                            popup.close();
                        } catch {
                            console.log('🔒 Could not close popup due to COOP policy');
                        }

                        console.log('✅ Tokens received from popup via postMessage');
                        resolve({
                            accessToken: event.data.accessToken,
                            refreshToken: event.data.refreshToken
                        });
                    } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
                        messageReceived = true;
                        cleanup();

                        // Safely close popup (handle COOP restrictions)
                        try {
                            popup.close();
                        } catch {
                            console.log('🔒 Could not close popup due to COOP policy');
                        }

                        reject(new Error(event.data.error || 'Authentication failed'));
                    }
                };

                window.addEventListener('message', handleMessage);
                console.log('👂 Listening for messages from popup...');

                // Note: When COOP is detected, we rely entirely on postMessage communication
                // and the timeout mechanism. We don't try to detect popup closure.

                let popupCheckCount = 0;
                let coopDetected = false;

                const cleanup = () => {
                    window.removeEventListener('message', handleMessage);
                    if (checkPopup) clearInterval(checkPopup);
                    if (timeoutId) clearTimeout(timeoutId);
                };

                // Simplified popup monitoring - only check for COOP once
                const checkPopup = setInterval(() => {
                    popupCheckCount++;

                    // Only try to detect COOP once at the beginning
                    if (popupCheckCount === 2 && !coopDetected) {
                        try {
                            // Test if we can access popup properties
                            popup.closed;
                        } catch {
                            // COOP detected - switch to message-only mode
                            coopDetected = true;
                            console.log('🔒 COOP detected - using message-only communication');
                            console.log('ℹ️  This is normal and expected with Google OAuth');
                        }
                    }

                    // If no COOP detected, we can safely check popup.closed
                    if (!coopDetected) {
                        try {
                            if (popup.closed) {
                                cleanup();
                                if (!messageReceived) {
                                    console.log('❌ Popup was closed by user');
                                    reject(new Error('Authentication was cancelled by user'));
                                }
                                return;
                            }
                        } catch {
                            // COOP just got detected
                            coopDetected = true;
                            console.log('🔒 COOP detected during monitoring');
                        }
                    }

                    // Log progress every 30 seconds
                    if (popupCheckCount % 30 === 0) {
                        const mode = coopDetected ? ' (COOP mode)' : '';
                        console.log(`⏳ Waiting for authentication... (${popupCheckCount}s)${mode}`);
                    }
                }, 1000);

                const timeoutId = setTimeout(() => {
                    if (!messageReceived && !popupClosed) {
                        cleanup();

                        console.log('⏰ Authentication timeout after 10 minutes');

                        // Safely try to close popup (handle COOP restrictions)
                        try {
                            popup.close();
                        } catch {
                            console.log('🔒 Could not close popup due to COOP policy');
                        }

                        reject(new Error('Authentication timeout - please try again'));
                    }
                }, 10 * 60 * 1000); // 10 minutes timeout
            });
        } catch (error) {
            console.error('Failed to get Google OAuth URL:', error);
            throw new Error('Failed to initiate Google authentication. Please try again.');
        }
    },

    initiateGoogleAuth: async (): Promise<void> => {
        try {
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
        console.log('🔍 Extracting tokens from URL params:', Object.fromEntries(searchParams.entries()));

        // Backend sends 'accessToken', but also check 'token' for backward compatibility
        const accessToken = searchParams.get('accessToken') || searchParams.get('token') || undefined;
        const refreshToken = searchParams.get('refreshToken') || undefined;
        const error = searchParams.get('error') || undefined;

        console.log('🔍 Extracted tokens:', {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            error
        });

        return {
            accessToken,
            refreshToken,
            error
        };
    },

    // Check if Google OAuth is available
    checkGoogleOAuthAvailability: async (): Promise<boolean> => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.AUTH.GOOGLE_AUTH);
            return response.status === 200;
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number } };
                // 404 means Google OAuth is not configured
                if (axiosError.response?.status === 404) {
                    return false;
                }
                // 405 Method Not Allowed means endpoint exists but GET is not allowed (which is expected)
                if (axiosError.response?.status === 405) {
                    return true;
                }
            }
            // For other errors, assume it's available but there's a network issue
            console.warn('Unable to check Google OAuth availability:', error);
            return true;
        }
    },

    // Get Google OAuth URL (for testing and manual flows)
    getGoogleLoginUrl: async (): Promise<{ url: string }> => {
        try {
            const response = await apiClient.get<ApiResponse<{ url: string }>>(API_ENDPOINTS.AUTH.GOOGLE_GENERATE_URL);
            return response.data.data;
        } catch (error) {
            console.error('Failed to get Google OAuth URL:', error);
            throw new Error('Failed to get Google OAuth URL');
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

    // Test Google OAuth URL generation (for debugging)
    testGoogleOAuthUrl: async (): Promise<{ url: string; isValid: boolean }> => {
        try {
            console.log('🧪 Testing Google OAuth URL generation...');
            const response = await apiClient.get<ApiResponse<{ url: string }>>(
                `${API_ENDPOINTS.AUTH.GOOGLE_AUTH}?popup=true&response_type=json`
            );

            const url = response.data.data.url;
            const isValid = url && url.includes('accounts.google.com');

            console.log('🧪 Test result:', { url, isValid });

            return { url, isValid };
        } catch (error) {
            console.error('🧪 Test failed:', error);
            throw error;
        }
    },

    // Test logout functionality (for debugging)
    testLogout: async (): Promise<{ success: boolean; error?: string }> => {
        try {
            console.log('🧪 Testing logout API...');
            await authApi.logout();
            console.log('🧪 Logout test successful');
            return { success: true };
        } catch (error: any) {
            console.error('🧪 Logout test failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Unknown error'
            };
        }
    },

    // Test popup communication (for debugging COOP issues)
    testPopupCommunication: (): Promise<boolean> => {
        return new Promise((resolve) => {
            console.log('🧪 Testing popup communication...');

            // Create a test popup to our own domain
            const testPopup = window.open(
                `${window.location.origin}/auth/callback?token=test-token&refreshToken=test-refresh`,
                'test-popup',
                'width=500,height=600'
            );

            if (!testPopup) {
                console.error('🧪 Test failed: Popup blocked');
                resolve(false);
                return;
            }

            const handleMessage = (event: MessageEvent) => {
                if (event.origin !== window.location.origin) return;

                if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
                    console.log('🧪 Test successful: Received message', event.data);
                    window.removeEventListener('message', handleMessage);
                    resolve(true);
                } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
                    console.log('🧪 Test received error message', event.data);
                    window.removeEventListener('message', handleMessage);
                    resolve(true); // Still successful communication
                }
            };

            window.addEventListener('message', handleMessage);

            // Cleanup after 10 seconds
            setTimeout(() => {
                window.removeEventListener('message', handleMessage);
                if (!testPopup.closed) {
                    testPopup.close();
                }
                console.log('🧪 Test timeout - no message received');
                resolve(false);
            }, 10000);
        });
    },
}