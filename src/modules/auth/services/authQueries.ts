import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from './authApi.ts'
import { useAuthStore } from '../store/authStore.ts'
import { setToken, setRefreshToken, hasToken, removeTokens} from '../utils/tokenUtils.ts'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import type {AxiosError} from "axios";
import type {ApiResponse} from "@/types/api.types.ts";
import {useEffect} from "react";
import type {AuthResponse} from "@/modules/auth/types/auth.types.ts";
import {getDashboardLink, getSignInLink, getSignOutLink} from "@/app/router/router-link.ts";

export const AUTH_KEYS = {
    user: ['auth', 'user'] as const,
    login: ['auth', 'login'] as const,
    register: ['auth', 'register'] as const,
    googleLogin: ['auth', 'google'] as const,
}

interface LoginMutationOptions {
    onSuccess?: (data: AuthResponse) => void;
    onError?: (error: Error) => void;
}

// Global flag to prevent multiple instances
let isUserQueryActive = false;

export const useCurrentUser = () => {
    const { setUser, clearUser } = useAuthStore();

    // Check if we already have user data in store
    const { user: existingUser } = useAuthStore();

    // Only enable query if we don't have user data and token exists
    const tokenExists = hasToken();
    const shouldFetch = tokenExists && !existingUser && !isUserQueryActive;

    // Debug logging with stack trace to identify caller
    if (import.meta.env.DEV) {
        console.log('🔍 useCurrentUser called from:', new Error().stack?.split('\n')[2]?.trim());
        console.log('🔍 useCurrentUser conditions:', {
            tokenExists,
            hasExistingUser: !!existingUser,
            isUserQueryActive,
            shouldFetch
        });
    }

    const query = useQuery({
        queryKey: AUTH_KEYS.user,
        queryFn: async () => {
            isUserQueryActive = true;
            try {
                const result = await authApi.getCurrentUser();
                return result;
            } finally {
                isUserQueryActive = false;
            }
        },
        enabled: shouldFetch,
        staleTime: 15 * 60 * 1000,       // 15 minutes stale time
        gcTime: 30 * 60 * 1000,          // 30 minutes garbage collection
        refetchOnWindowFocus: false,     // Never refetch on window focus
        refetchOnMount: false,           // Never refetch on mount
        refetchOnReconnect: false,       // Never refetch on reconnect
        refetchInterval: false,          // No automatic refetching
        retry: 1,                        // Retry once on failure
        networkMode: 'online',           // Only run when online
        notifyOnChangeProps: ['data', 'error', 'isLoading'], // Only notify on these changes
    });

    // Only set user data once when query succeeds
    useEffect(() => {
        if (query.data && query.isSuccess) {
            setUser(query.data);
        }
    }, [query.data, query.isSuccess, setUser]);

    // Handle errors only once
    useEffect(() => {
        if (query.error && query.isError) {
            const error = query.error as AxiosError;
            if (error?.response?.status === 401) {
                removeTokens();
                clearUser();
                isUserQueryActive = false; // Reset flag on error
            }
        }
    }, [query.error, query.isError, clearUser]);

    return query;
};

export const useLoginMutation = (options?: LoginMutationOptions) => {
    const { setUser, setLoading } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            authApi.login(email, password),
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data: AuthResponse) => {
            // Store tokens in localStorage
            setToken(data.accessToken);
            setRefreshToken(data.refreshToken);

            // Set user data in memory only (not persisted)
            setUser(data.user);

            // Cache user data in React Query
            queryClient.setQueryData(AUTH_KEYS.user, data.user);

            setLoading(false);
            toast.success('Login successful! Welcome back.');

            if (options?.onSuccess) options.onSuccess(data);
        },
        onError: (error: AxiosError<ApiResponse<any>>) => {
            setLoading(false);

            // Handle different types of errors
            if (error.response?.status === 401) {
                toast.error('Invalid email or password. Please try again.');
            } else if (error.response?.status === 429) {
                toast.error('Too many login attempts. Please wait a few minutes before trying again.');
            } else if (error.response?.status === 422) {
                const validationErrors = error.response.data?.errors;
                if (validationErrors) {
                    const firstError = Object.values(validationErrors)[0];
                    toast.error(Array.isArray(firstError) ? firstError[0] : 'Validation error');
                } else {
                    toast.error('Please check your input and try again.');
                }
            } else if (!error.response) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                const message = error.response?.data?.message || 'Login failed. Please try again.';
                toast.error(message);
            }

            if (options?.onError) options.onError(error as Error);
        },
    });
};

export const useRegisterMutation = () => {
    const queryClient = useQueryClient();
    const { setUser, setLoading, intendedPath, setIntendedPath } = useAuthStore();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authApi.register,
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data: AuthResponse) => {
            // Store tokens in localStorage
            setToken(data.accessToken);
            setRefreshToken(data.refreshToken);

            // Set user data in memory only (not persisted)
            setUser(data.user);

            // Cache user data in React Query (memory only)
            queryClient.setQueryData(AUTH_KEYS.user, data.user);

            setLoading(false);
            toast.success('Registration successful! Welcome to Second Brain.');

            // Navigate to intended path or dashboard
            const targetPath = intendedPath || getDashboardLink();
            setIntendedPath(null); // Clear intended path
            navigate(targetPath, { replace: true });
        },
        onError: (error: AxiosError<ApiResponse<any>>) => {
            setLoading(false);

            // Handle different types of registration errors
            if (error.response?.status === 409) {
                toast.error('An account with this email already exists. Please sign in instead.');
            } else if (error.response?.status === 422) {
                const validationErrors = error.response.data?.errors;
                if (validationErrors) {
                    // Show specific validation errors
                    const errorMessages = Object.entries(validationErrors).map(([field, messages]) => {
                        const messageArray = Array.isArray(messages) ? messages : [messages];
                        return `${field}: ${messageArray[0]}`;
                    });
                    toast.error(errorMessages[0]); // Show first error
                } else {
                    toast.error('Please check your input and try again.');
                }
            } else if (error.response?.status === 429) {
                toast.error('Too many registration attempts. Please wait a few minutes before trying again.');
            } else if (!error.response) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                const message = error.response?.data?.message || 'Registration failed. Please try again.';
                toast.error(message);
            }
        },
    });
};

export const useGoogleLoginMutation = () => {
    const queryClient = useQueryClient();
    const { setUser, setLoading, intendedPath, setIntendedPath } = useAuthStore();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authApi.handleGoogleCallback,
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data: AuthResponse) => {
            // Store tokens in localStorage
            setToken(data.accessToken);
            setRefreshToken(data.refreshToken);

            // Set user data in memory only (not persisted)
            setUser(data.user);

            // Cache user data in React Query (memory only)
            queryClient.setQueryData(AUTH_KEYS.user, data.user);

            setLoading(false);
            toast.success('Google login successful! Welcome to Second Brain.');

            // Navigate to intended path or dashboard
            const targetPath = intendedPath || getDashboardLink();
            setIntendedPath(null); // Clear intended path
            navigate(targetPath, { replace: true });
        },
        onError: (error: AxiosError<ApiResponse<any>>) => {
            setLoading(false);
            const message = error.response?.data?.message || 'Google login failed';
            toast.error(message);
            navigate(getSignInLink(), { replace: true });
        },
    });
};

// New mutation for handling tokens from URL parameters
export const useGoogleTokenMutation = () => {
    const queryClient = useQueryClient();
    const { setUser, setLoading, intendedPath, setIntendedPath } = useAuthStore();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
            // Store tokens
            setToken(accessToken);
            setRefreshToken(refreshToken);

            // Fetch user data with the new token
            return await authApi.getCurrentUser();
        },
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (user) => {
            // Set user data in memory
            setUser(user);

            // Cache user data in React Query
            queryClient.setQueryData(AUTH_KEYS.user, user);

            setLoading(false);
            toast.success('Google authentication successful! Welcome to Second Brain.');

            // Navigate to intended path or dashboard
            const targetPath = intendedPath || getDashboardLink();
            setIntendedPath(null); // Clear intended path
            navigate(targetPath, { replace: true });
        },
        onError: (error: AxiosError<ApiResponse<any>>) => {
            setLoading(false);
            // Clear any stored tokens on error
            removeTokens();

            const message = error.response?.data?.message || 'Authentication failed';
            toast.error(message);
            navigate(getSignInLink(), { replace: true });
        },
    });
};

export const useLogoutMutation = () => {
    const { clearUser, setLoading } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.logout,
        onMutate: () => {
            console.log('🔄 Starting logout process...');
            setLoading(true);
        },
        onSuccess: () => {
            console.log('✅ Logout successful, cleaning up...');
            // Clear tokens from localStorage
            removeTokens();
            // Clear user data from memory and reset auth state
            clearUser();
            // Clear all cached data
            queryClient.clear();
            setLoading(false);
            toast.success('Logged out successfully');
            console.log('🔄 Redirecting to sign in page...');
            // Use navigate instead of window.location to avoid full page reload
            setTimeout(() => {
                window.location.href = getSignInLink();
            }, 100);
        },
        onError: (error: AxiosError<ApiResponse<any>>) => {
            console.error('❌ Logout failed, but cleaning up locally:', error);
            // Even on error, clear local data for security
            removeTokens();
            clearUser();
            queryClient.clear();
            setLoading(false);
            // Redirect to login even on error
            setTimeout(() => {
                window.location.href = getSignInLink();
            }, 100);

            const message = error.response?.data?.error?.message ||
                          error.response?.data?.message ||
                          'Logout failed';
            console.error('❌ Logout error message:', message);
            toast.error(message);
            console.log('🔄 Redirecting to sign in page after error...');
            window.location.href = getSignInLink();
        },
    });
};

export const useLogoutAllMutation = () => {
    const queryClient = useQueryClient();
    const { clearUser, setLoading } = useAuthStore();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authApi.logoutAll,
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: () => {
            // Clear tokens from localStorage
            removeTokens();
            // Clear user data from memory and reset auth state
            clearUser();
            // Clear all cached data
            queryClient.clear();
            setLoading(false);

            toast.success('Logged out from all devices successfully');
            navigate(getSignInLink());
        },
        onError: (error: AxiosError<ApiResponse<any>>) => {
            // Even on error, clear local data for security
            removeTokens();
            clearUser();
            queryClient.clear();
            setLoading(false);

            const message = error.response?.data?.message || 'Logout from all devices failed';
            toast.error(message);
            navigate(getSignInLink());
        },
    });
};

export const useChangePasswordMutation = () => {
    return useMutation({
        mutationFn: authApi.changePassword,
        onSuccess: () => {
            toast.success('Password changed successfully');
        },
        onError: (error: AxiosError<ApiResponse<any>>) => {
            const message = error.response?.data?.message || 'Password change failed';
            toast.error(message);
        },
    });
};

export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: authApi.forgotPassword,
        onSuccess: () => {
            toast.success('Password reset email sent successfully');
        },
        onError: (error: AxiosError<ApiResponse<any>>) => {
            const message = error.response?.data?.message || 'Failed to send reset email';
            toast.error(message);
        },
    });
};

export const useResetPasswordMutation = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authApi.resetPassword,
        onSuccess: () => {
            toast.success('Password reset successfully');
            navigate(getSignOutLink());
        },
        onError: (error: AxiosError<ApiResponse<any>>) => {
            const message = error.response?.data?.message || 'Password reset failed';
            toast.error(message);
        },
    });
};
