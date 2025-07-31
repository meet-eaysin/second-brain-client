import { apiClient } from '@/services/api-client.ts';

export interface BackendStatus {
    isOnline: boolean;
    hasGoogleOAuth: boolean;
    apiVersion?: string;
    error?: string;
}

export const checkBackendStatus = async (): Promise<BackendStatus> => {
    try {
        // First check if the API is reachable
        const healthResponse = await fetch(`${apiClient.defaults.baseURL}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!healthResponse.ok) {
            return {
                isOnline: false,
                hasGoogleOAuth: false,
                error: `API health check failed: ${healthResponse.status}`,
            };
        }

        // Check if Google OAuth endpoint exists
        try {
            const googleResponse = await fetch(`${apiClient.defaults.baseURL}/auth/google`, {
                method: 'HEAD',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return {
                isOnline: true,
                hasGoogleOAuth: googleResponse.status !== 404,
                apiVersion: healthResponse.headers.get('x-api-version') || undefined,
            };
        } catch (googleError) {
            // If Google OAuth check fails, API is still online
            return {
                isOnline: true,
                hasGoogleOAuth: false,
                error: 'Google OAuth endpoint not available',
            };
        }
    } catch (error) {
        return {
            isOnline: false,
            hasGoogleOAuth: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};

export const getBackendErrorMessage = (status: BackendStatus): string => {
    if (!status.isOnline) {
        return 'Backend API is not reachable. Please check your internet connection or contact support.';
    }
    
    if (!status.hasGoogleOAuth) {
        return 'Google OAuth is not configured on the backend. Please use email/password authentication or contact your administrator.';
    }
    
    return status.error || 'Unknown backend error';
};
