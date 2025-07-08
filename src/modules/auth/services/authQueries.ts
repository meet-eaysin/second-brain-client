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
import {getDashboardLink, getSignOutLink} from "@/app/router/router-link.ts";


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

export const useCurrentUser = () => {
    const { setUser, clearUser } = useAuthStore();

    const query = useQuery({
        queryKey: AUTH_KEYS.user,
        queryFn: authApi.getCurrentUser,
        enabled: hasToken(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: (failureCount, error: AxiosError) => {
            if (error?.response?.status === 401) {
                return false;
            }
            return failureCount < 2;
        },
    });

    useEffect(() => {
        if (query.data) {
            setUser(query.data);
        }
    }, [query.data, setUser]);

    useEffect(() => {
        if (query.error) {
            const error = query.error as AxiosError;
            if (error?.response?.status === 401) {
                removeTokens();
                clearUser();
            }
        }
    }, [query.error, clearUser]);

    return query;
};

export const useLoginMutation = (options: LoginMutationOptions) => {
    const { setUser } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            authApi.login(email, password),
        onSuccess: (data) => {
            setToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            setUser(data.user);

            queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user });
            if (options?.onSuccess) options.onSuccess(data);
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Login failed';
            if (options?.onError) options.onError(error);
            toast.error(message);
        },
    });
};

export const useRegisterMutation = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authApi.register,
        onSuccess: () => {
            toast.success('Registration successful! Please login.');
            navigate(getSignOutLink());
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
        },
    });
};

export const useGoogleLoginMutation = () => {
    const queryClient = useQueryClient();
    const { setUser } = useAuthStore();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authApi.handleGoogleCallback,
        onSuccess: (data) => {
            setToken(data.accessToken);
            setRefreshToken(data.refreshToken);

            setUser(data.user);

            queryClient.setQueryData(AUTH_KEYS.user, data.user);

            toast.success('Google login successful');
            navigate(getDashboardLink());
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Google login failed';
            toast.error(message);
        },
    });
};

export const useLogoutMutation = () => {
    const { clearUser } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            removeTokens();
            clearUser();
            queryClient.clear();
            window.location.href = getSignOutLink();
        },
        onError: () => {
            removeTokens();
            clearUser();
            queryClient.clear();
            window.location.href = getSignOutLink();
        },
    });
};

export const useLogoutAllMutation = () => {
    const queryClient = useQueryClient();
    const { clearUser } = useAuthStore();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authApi.logoutAll,
        onSettled: () => {
            removeTokens();
            clearUser();
            queryClient.clear();
            navigate(getSignOutLink());
        },
        onSuccess: () => {
            toast.success('Logged out from all devices');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Logout failed';
            toast.error(message);
        },
    });
};

export const useChangePasswordMutation = () => {
    return useMutation({
        mutationFn: authApi.changePassword,
        onSuccess: () => {
            toast.success('Password changed successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
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
        onError: (error: AxiosError<ApiResponse>) => {
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
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Password reset failed';
            toast.error(message);
        },
    });
};
