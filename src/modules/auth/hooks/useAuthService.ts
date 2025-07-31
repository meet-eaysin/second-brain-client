import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../services/authApi';
import { 
    useLoginMutation, 
    useRegisterMutation, 
    useLogoutMutation, 
    useLogoutAllMutation,
    useGoogleTokenMutation,
    useCurrentUser
} from '../services/authQueries';
import { useAuthStore } from '../store/authStore';
import { hasToken, removeTokens } from '../utils/tokenUtils';
import { getDashboardLink, getSignInLink } from '@/app/router/router-link';
import type { LoginCredentials, RegisterCredentials } from '../types/auth.types';

/**
 * Comprehensive auth service hook that provides all authentication functions
 * as mentioned in the implementation guide
 */
export const useAuthService = () => {
    const navigate = useNavigate();
    const { 
        user, 
        isAuthenticated, 
        isLoading, 
        error, 
        intendedPath,
        setIntendedPath,
        clearError,
        setLoading 
    } = useAuthStore();
    
    const loginMutation = useLoginMutation();
    const registerMutation = useRegisterMutation();
    const logoutMutation = useLogoutMutation();
    const logoutAllMutation = useLogoutAllMutation();
    const googleTokenMutation = useGoogleTokenMutation();
    const currentUserQuery = useCurrentUser();

    // Email/password login
    const login = async (credentials: LoginCredentials) => {
        try {
            clearError();
            await loginMutation.mutateAsync(credentials);
        } catch (error: unknown) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    // User registration
    const register = async (userData: RegisterCredentials) => {
        try {
            clearError();
            await registerMutation.mutateAsync(userData);
        } catch (error: unknown) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    // Google OAuth redirect
    const loginWithGoogle = async () => {
        try {
            clearError();
            setLoading(true);
            
            // Store current path as intended destination
            const currentPath = window.location.pathname;
            if (currentPath !== getSignInLink() && currentPath !== '/auth/sign-up') {
                setIntendedPath(currentPath);
            }

            // Check if Google OAuth is available
            const isAvailable = await authApi.checkGoogleOAuthAvailability();
            if (!isAvailable) {
                throw new Error('Google OAuth is not configured. Please use email/password login or contact your administrator.');
            }

            // Redirect to Google OAuth
            await authApi.initiateGoogleAuth();
        } catch (error: unknown) {
            setLoading(false);
            console.error('Google OAuth initiation failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to initiate Google login. Please try again.';
            toast.error(errorMessage);
            throw error;
        }
    };

    // Handle Google OAuth callback with tokens from URL
    const handleGoogleTokens = async (accessToken: string, refreshToken: string) => {
        try {
            await googleTokenMutation.mutateAsync({ accessToken, refreshToken });
        } catch (error: unknown) {
            console.error('Google token handling failed:', error);
            throw error;
        }
    };

    // Logout current session
    const logout = async () => {
        try {
            await logoutMutation.mutateAsync();
        } catch (error: unknown) {
            console.error('Logout failed:', error);
            // Don't throw error as logout should always succeed locally
        }
    };

    // Logout all devices
    const logoutAll = async () => {
        try {
            await logoutAllMutation.mutateAsync();
        } catch (error: unknown) {
            console.error('Logout all failed:', error);
            // Don't throw error as logout should always succeed locally
        }
    };

    // Refresh token (handled automatically by axios interceptor)
    const refreshToken = async () => {
        // This is handled automatically by the axios interceptor
        // But we can provide a manual trigger if needed
        try {
            await currentUserQuery.refetch();
            return true;
        } catch (error: unknown) {
            console.error('Token refresh failed:', error);
            return false;
        }
    };

    // Check current authentication status
    const checkAuth = () => {
        const tokenExists = hasToken();
        return {
            hasToken: tokenExists,
            isAuthenticated,
            user,
            isLoading: isLoading || currentUserQuery.isLoading,
            error: error || currentUserQuery.error
        };
    };

    // Clear authentication state and redirect to login
    const clearAuthAndRedirect = (redirectPath?: string) => {
        removeTokens();
        useAuthStore.getState().clearUser();
        navigate(redirectPath || getSignInLink(), { replace: true });
    };

    return {
        // State
        user,
        isAuthenticated,
        isLoading: isLoading || loginMutation.isPending || registerMutation.isPending || 
                   logoutMutation.isPending || logoutAllMutation.isPending || googleTokenMutation.isPending,
        error,
        hasToken: hasToken(),

        // Actions
        login,
        register,
        loginWithGoogle,
        handleGoogleTokens,
        logout,
        logoutAll,
        refreshToken,
        checkAuth,
        clearAuthAndRedirect,

        // Utilities
        setIntendedPath,
        clearError,

        // Mutation states for granular loading control
        loginLoading: loginMutation.isPending,
        registerLoading: registerMutation.isPending,
        logoutLoading: logoutMutation.isPending,
        logoutAllLoading: logoutAllMutation.isPending,
        googleTokenLoading: googleTokenMutation.isPending,
    };
};
