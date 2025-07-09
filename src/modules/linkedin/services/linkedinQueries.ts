import { linkedinApi } from './linkedinApi';
import type { ApiResponse } from '@/types/api.types';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {AxiosError} from "axios";
import {toast} from "sonner";

export const SOCIAL_KEYS = {
    linkedin: {
        connection: ['social', 'linkedin', 'connection'] as const,
        posts: (page: number, limit: number) => ['social', 'linkedin', 'posts', page, limit] as const,
        sync: ['social', 'linkedin', 'sync'] as const,
    },
} as const;

export const useLinkedInConnectionQuery = () => {
    return useQuery({
        queryKey: SOCIAL_KEYS.linkedin.connection,
        queryFn: linkedinApi.getConnectionStatus,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: (failureCount, error: AxiosError) => {
            if (error?.response?.status === 401) {
                return false;
            }
            return failureCount < 2;
        },
    });
};

export const useLinkedInAuthMutation = () => {
    return useMutation({
        mutationFn: linkedinApi.initiateAuth,
        onSuccess: (data) => {
            window.location.href = data.authUrl;
        },
        onError: (error: AxiosError<ApiResponse<unknown>>) => {
            const message = error.response?.data?.message || 'Failed to initiate LinkedIn authentication';
            toast.error(message);
        },
    });
};

export const useLinkedInCallbackMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ code, state }: { code: string; state?: string }) =>
            linkedinApi.handleCallback(code, state),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.linkedin.connection });
            toast.success('LinkedIn connected successfully!');
        },
        onError: (error: AxiosError<ApiResponse<unknown>>) => {
            const message = error.response?.data?.message || 'Failed to connect LinkedIn';
            toast.error(message);
        },
    });
};

export const useLinkedInDisconnectMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: linkedinApi.disconnect,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.linkedin.connection });
            toast.success('LinkedIn disconnected successfully!');
        },
        onError: (error: AxiosError<ApiResponse<unknown>>) => {
            const message = error.response?.data?.message || 'Failed to disconnect LinkedIn';
            toast.error(message);
        },
    });
};

export const useLinkedInPostsQuery = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: SOCIAL_KEYS.linkedin.posts(page, limit),
        queryFn: () => linkedinApi.getPosts(page, limit),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
};

export const useLinkedInSyncMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: linkedinApi.syncPosts,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['social', 'linkedin', 'posts'] });
            toast.success(`Synced ${data.synced} posts successfully!`);
        },
        onError: (error: AxiosError<ApiResponse<unknown>>) => {
            const message = error.response?.data?.message || 'Failed to sync LinkedIn posts';
            toast.error(message);
        },
    });
};

export const useCreateLinkedInPostMutatuion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: linkedinApi.createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['social', 'linkedin', 'posts'] });
            toast.success('Post created successfully!');
        },
        onError: (error: AxiosError<ApiResponse<unknown>>) => {
            const message = error.response?.data?.message || 'Failed to create post';
            toast.error(message);
        },
    });
};

export const useLinkedInLikeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: linkedinApi.likePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['social', 'linkedin', 'posts'] });
            toast.success('Post liked successfully!');
        },
        onError: (error: AxiosError<ApiResponse<unknown>>) => {
            const message = error.response?.data?.message || 'Failed to like post';
            toast.error(message);
        },
    });
};

export const useLinkedInCommentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, comment }: { postId: string; comment: string }) =>
            linkedinApi.commentOnPost(postId, comment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['social', 'linkedin', 'posts'] });
            toast.success('Comment added successfully!');
        },
        onError: (error: AxiosError<ApiResponse<unknown>>) => {
            const message = error.response?.data?.message || 'Failed to add comment';
            toast.error(message);
        },
    });
};
