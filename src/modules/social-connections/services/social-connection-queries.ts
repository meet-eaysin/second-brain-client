import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import type { ApiResponse } from '@/types/api.types';
import {socialApi} from "@/modules/social-connections/services/social-connection-apis.ts";
import type {
    ESocialPlatform,
    TConnectionsStatus,
    TConnectionStatus, TCreateSocialPostPayload,
    TSocialCallbackParams
} from "@/modules/social-connections/types";

type BaseQueryKey = readonly ['social'];
type ConnectionsQueryKey = readonly [...BaseQueryKey, 'connections'];
type ConnectionQueryKey = readonly [...BaseQueryKey, 'connection', ESocialPlatform];
type PostsQueryKey = readonly [...BaseQueryKey, 'posts', ESocialPlatform, number, number];
type ProfileQueryKey = readonly [...BaseQueryKey, 'profile', ESocialPlatform];

type PlatformPostsQueryKey = readonly [...BaseQueryKey, 'posts', string, number, number];
type PlatformConnectionQueryKey = readonly [...BaseQueryKey, 'connection', string];
type PlatformProfileQueryKey = readonly [...BaseQueryKey, 'profile', string];

const createSocialKeys = () => {
    const base: BaseQueryKey = ['social'] as const;

    return {
        all: base,
        connections: (): ConnectionsQueryKey => [...base, 'connections'] as const,
        connection: (platform: ESocialPlatform): ConnectionQueryKey => [...base, 'connection', platform] as const,
        posts: (platform: ESocialPlatform, page: number, limit: number): PostsQueryKey =>
            [...base, 'posts', platform, page, limit] as const,
        profile: (platform: ESocialPlatform): ProfileQueryKey => [...base, 'profile', platform] as const,
        linkedin: {
            connection: [...base, 'connection', 'linkedin'] as PlatformConnectionQueryKey,
            posts: (page: number, limit: number): PlatformPostsQueryKey =>
                [...base, 'posts', 'linkedin', page, limit] as const,
            profile: [...base, 'profile', 'linkedin'] as PlatformProfileQueryKey,
        },
        facebook: {
            connection: [...base, 'connection', 'facebook'] as PlatformConnectionQueryKey,
            posts: (page: number, limit: number): PlatformPostsQueryKey =>
                [...base, 'posts', 'facebook', page, limit] as const,
            profile: [...base, 'profile', 'facebook'] as PlatformProfileQueryKey,
        },
        instagram: {
            connection: [...base, 'connection', 'instagram'] as PlatformConnectionQueryKey,
            posts: (page: number, limit: number): PlatformPostsQueryKey =>
                [...base, 'posts', 'instagram', page, limit] as const,
            profile: [...base, 'profile', 'instagram'] as PlatformProfileQueryKey,
        },
    } as const;
};

export const SOCIAL_KEYS = createSocialKeys();

export const useSocialConnectionsQuery = <T = unknown>() => {
    return useQuery({
        queryKey: SOCIAL_KEYS.connections(),
        queryFn: () => socialApi.getConnectionStatus<T>() as Promise<TConnectionsStatus>,
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

export const useSocialConnectionQuery = <T = unknown>(platform: ESocialPlatform) => {
    return useQuery({
        queryKey: SOCIAL_KEYS.connection(platform),
        queryFn: () => socialApi.getConnectionStatus<T>(platform) as Promise<TConnectionStatus<T>>,
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

export const useSocialAuthMutation = (platform: ESocialPlatform) => {
    return useMutation({
        mutationFn: (state?: string) => socialApi.initiateAuth(platform, state),
        onSuccess: (data) => {
            window.location.href = data.authUrl;
        },
        onError: (error: AxiosError<ApiResponse<unknown>>) => {
            const message = error.response?.data?.message || `Failed to initiate ${platform} authentication`;
            toast.error(message);
        },
    });
};

export const useSocialCallbackMutation = (platform: ESocialPlatform) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: TSocialCallbackParams) => socialApi.handleCallback(platform, params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.connection(platform) });
            queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.connections() });
            toast.success(`${platform} connected successfully!`);
        },
        onError: (error: AxiosError<ApiResponse<unknown>>) => {
            const message = error.response?.data?.message || `Failed to connect ${platform}`;
            toast.error(message);
        },
    });
};

export const useSocialDisconnectMutation = (platform: ESocialPlatform) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => socialApi.disconnect(platform),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.connection(platform) });
            queryClient.invalidateQueries({ queryKey: SOCIAL_KEYS.connections() });
            toast.success(`${platform} disconnected successfully!`);
        },
        onError: (error: AxiosError<ApiResponse<unknown>>) => {
            const message = error.response?.data?.message || `Failed to disconnect ${platform}`;
            toast.error(message);
        },
    });
};

export const useSocialPostsQuery = <T = unknown>(platform: ESocialPlatform, page = 1, limit = 10) => {
    return useQuery({
        queryKey: SOCIAL_KEYS.posts(platform, page, limit),
        queryFn: () => socialApi.getPosts<T>(platform, page, limit),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: (failureCount, error: AxiosError) => {
            if (error?.response?.status === 401) {
                return false;
            }
            return failureCount < 2;
        },
    });
};

export const useSocialSyncMutation = <T = unknown>(platform: ESocialPlatform) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => socialApi.syncPosts<T>(platform),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [...SOCIAL_KEYS.all, 'posts', platform] });
            toast.success(`Synced ${data.synced} ${platform} posts successfully!`);
        },
        onError: (error: AxiosError<ApiResponse<unknown>>) => {
            const message = error.response?.data?.message || `Failed to sync ${platform} posts`;
            toast.error(message);
        },
    });
};

export const useSocialCreatePostMutation = <T = unknown>(platform: ESocialPlatform) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postData: TCreateSocialPostPayload) => socialApi.createPost<T>(platform, postData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...SOCIAL_KEYS.all, 'posts', platform] });
            toast.success(`${platform} post created successfully!`);
        },
        onError: (error: AxiosError<ApiResponse<unknown>>) => {
            const message = error.response?.data?.message || `Failed to create ${platform} post`;
            toast.error(message);
        },
    });
};

export const useSocialLikeMutation = (platform: ESocialPlatform) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => socialApi.likePost(platform, postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...SOCIAL_KEYS.all, 'posts', platform] });
            toast.success(`${platform} post liked successfully!`);
        },
        onError: (error: AxiosError<ApiResponse<unknown>>) => {
            const message = error.response?.data?.message || `Failed to like ${platform} post`;
            toast.error(message);
        },
    });
};

export const useSocialCommentMutation = (platform: ESocialPlatform) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, comment }: { postId: string; comment: string }) =>
            socialApi.commentOnPost(platform, postId, comment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...SOCIAL_KEYS.all, 'posts', platform] });
            toast.success(`Comment added to ${platform} post successfully!`);
        },
        onError: (error: AxiosError<ApiResponse<unknown>>) => {
            const message = error.response?.data?.message || `Failed to add comment to ${platform} post`;
            toast.error(message);
        },
    });
};

export const useSocialProfileQuery = <T = unknown>(platform: ESocialPlatform) => {
    return useQuery({
        queryKey: SOCIAL_KEYS.profile(platform),
        queryFn: () => socialApi.getProfile<T>(platform),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: (failureCount, error: AxiosError) => {
            if (error?.response?.status === 401 || error?.response?.status === 404) {
                return false;
            }
            return failureCount < 2;
        },
    });
};

// LinkedIn hooks
export const useLinkedInConnectionQuery = <T = unknown>() => useSocialConnectionQuery<T>('LINKEDIN');
export const useLinkedInAuthMutation = () => useSocialAuthMutation('LINKEDIN');
export const useLinkedInCallbackMutation = () => useSocialCallbackMutation('LINKEDIN');
export const useLinkedInDisconnectMutation = () => useSocialDisconnectMutation('LINKEDIN');
export const useLinkedInPostsQuery = <T = unknown>(page = 1, limit = 10) => useSocialPostsQuery<T>('LINKEDIN', page, limit);
export const useLinkedInSyncMutation = <T = unknown>() => useSocialSyncMutation<T>('LINKEDIN');
export const useCreateLinkedInPostMutation = <T = unknown>() => useSocialCreatePostMutation<T>('LINKEDIN');
export const useLinkedInLikeMutation = () => useSocialLikeMutation('LINKEDIN');
export const useLinkedInCommentMutation = () => useSocialCommentMutation('LINKEDIN');
export const useLinkedInProfileQuery = <T = unknown>() => useSocialProfileQuery<T>('LINKEDIN');

// Facebook hooks
export const useFacebookConnectionQuery = <T = unknown>() => useSocialConnectionQuery<T>('FACEBOOK');
export const useFacebookAuthMutation = () => useSocialAuthMutation('FACEBOOK');
export const useFacebookCallbackMutation = () => useSocialCallbackMutation('FACEBOOK');
export const useFacebookDisconnectMutation = () => useSocialDisconnectMutation('FACEBOOK');
export const useFacebookPostsQuery = <T = unknown>(page = 1, limit = 10) => useSocialPostsQuery<T>('FACEBOOK', page, limit);
export const useFacebookSyncMutation = <T = unknown>() => useSocialSyncMutation<T>('FACEBOOK');
export const useCreateFacebookPostMutation = <T = unknown>() => useSocialCreatePostMutation<T>('FACEBOOK');
export const useFacebookLikeMutation = () => useSocialLikeMutation('FACEBOOK');
export const useFacebookCommentMutation = () => useSocialCommentMutation('FACEBOOK');
export const useFacebookProfileQuery = <T = unknown>() => useSocialProfileQuery<T>('FACEBOOK');

// Instagram hooks
export const useInstagramConnectionQuery = <T = unknown>() => useSocialConnectionQuery<T>('INSTAGRAM');
export const useInstagramAuthMutation = () => useSocialAuthMutation('INSTAGRAM');
export const useInstagramCallbackMutation = () => useSocialCallbackMutation('INSTAGRAM');
export const useInstagramDisconnectMutation = () => useSocialDisconnectMutation('INSTAGRAM');
export const useInstagramPostsQuery = <T = unknown>(page = 1, limit = 10) => useSocialPostsQuery<T>('INSTAGRAM', page, limit);
export const useInstagramSyncMutation = <T = unknown>() => useSocialSyncMutation<T>('INSTAGRAM');
export const useCreateInstagramPostMutation = <T = unknown>() => useSocialCreatePostMutation<T>('INSTAGRAM');
export const useInstagramLikeMutation = () => useSocialLikeMutation('INSTAGRAM');
export const useInstagramCommentMutation = () => useSocialCommentMutation('INSTAGRAM');
export const useInstagramProfileQuery = <T = unknown>() => useSocialProfileQuery<T>('INSTAGRAM');