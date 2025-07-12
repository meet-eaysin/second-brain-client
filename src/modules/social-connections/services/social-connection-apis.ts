import type {
    AllConnectionsStatus, CreateSocialPostPayload,
    SocialAuthResponse, SocialCallbackParams,
    SocialConnectionStatus,
    SocialPlatform, SocialPostsResponse, SocialProfile, SocialSyncResponse
} from "@/modules/social-connections/types";
import apiClient from "@/services/apiClient.ts";
import type {ApiResponse} from "@/types/api.types.ts";

export const socialApi = {
    initiateAuth: async (platform: SocialPlatform, state?: string): Promise<SocialAuthResponse> => {
        const response = await apiClient.get<ApiResponse<SocialAuthResponse>>(
            `/api/social/auth/initiate/${platform}`,
            { params: { state } }
        );
        return response.data.data;
    },

    handleCallback: async <T = unknown>(platform: SocialPlatform, params: SocialCallbackParams): Promise<T> => {
        const response = await apiClient.get<ApiResponse<T>>(
            `/api/social/auth/callback/${platform}`,
            { params }
        );
        return response.data.data;
    },

    disconnect: async (platform: SocialPlatform): Promise<null> => {
        const response = await apiClient.post<ApiResponse<null>>(
            `/api/social/disconnect/${platform}`
        );
        return response.data.data;
    },

    getConnectionStatus: async <T = unknown>(platform?: SocialPlatform): Promise<SocialConnectionStatus<T> | AllConnectionsStatus<T>> => {
        const endpoint = platform
            ? `/api/social/connection/${platform}`
            : '/api/social/connections';

        const response = await apiClient.get<ApiResponse<SocialConnectionStatus<T> | AllConnectionsStatus<T>>>(endpoint);
        return response.data.data;
    },

    syncPosts: async <T = unknown>(platform: SocialPlatform): Promise<SocialSyncResponse<T>> => {
        const response = await apiClient.post<ApiResponse<SocialSyncResponse<T>>>(
            `/api/social/sync/${platform}`
        );
        return response.data.data;
    },

    getPosts: async <T = unknown>(platform: SocialPlatform, page = 1, limit = 10): Promise<SocialPostsResponse<T>> => {
        const response = await apiClient.get<ApiResponse<SocialPostsResponse<T>>>(
            `/api/social/posts/${platform}`,
            { params: { page, limit } }
        );
        return response.data.data;
    },

    createPost: async <T = unknown>(platform: SocialPlatform, postData: CreateSocialPostPayload): Promise<T> => {
        const response = await apiClient.post<ApiResponse<T>>(
            `/api/social/posts/${platform}`,
            postData
        );
        return response.data.data;
    },

    likePost: async (platform: SocialPlatform, postId: string): Promise<null> => {
        const response = await apiClient.post<ApiResponse<null>>(
            `/api/social/posts/${platform}/${postId}/like`
        );
        return response.data.data;
    },

    commentOnPost: async (platform: SocialPlatform, postId: string, comment: string): Promise<null> => {
        const response = await apiClient.post<ApiResponse<null>>(
            `/api/social/posts/${platform}/${postId}/comment`,
            { comment }
        );
        return response.data.data;
    },

    getProfile: async <T = unknown>(platform: SocialPlatform): Promise<SocialProfile<T>> => {
        const response = await apiClient.get<ApiResponse<SocialProfile<T>>>(
            `/api/social/profile/${platform}`
        );
        return response.data.data;
    },
};

export const linkedinApi = {
    initiateAuth: (state?: string) => socialApi.initiateAuth('LINKEDIN', state),
    handleCallback: <T = unknown>(code: string, state?: string) => socialApi.handleCallback<T>('LINKEDIN', { code, state }),
    disconnect: () => socialApi.disconnect('LINKEDIN'),
    getConnectionStatus: <T = unknown>() => socialApi.getConnectionStatus<T>('LINKEDIN') as Promise<SocialConnectionStatus<T>>,
    syncPosts: <T = unknown>() => socialApi.syncPosts<T>('LINKEDIN'),
    getPosts: <T = unknown>(page = 1, limit = 10) => socialApi.getPosts<T>('LINKEDIN', page, limit),
    createPost: <T = unknown>(postData: CreateSocialPostPayload) => socialApi.createPost<T>('LINKEDIN', postData),
    likePost: (postId: string) => socialApi.likePost('LINKEDIN', postId),
    commentOnPost: (postId: string, comment: string) => socialApi.commentOnPost('LINKEDIN', postId, comment),
    getProfile: <T = unknown>() => socialApi.getProfile<T>('LINKEDIN'),
};

export const facebookApi = {
    initiateAuth: (state?: string) => socialApi.initiateAuth('FACEBOOK', state),
    handleCallback: <T = unknown>(code: string, state?: string) => socialApi.handleCallback<T>('FACEBOOK', { code, state }),
    disconnect: () => socialApi.disconnect('FACEBOOK'),
    getConnectionStatus: <T = unknown>() => socialApi.getConnectionStatus<T>('FACEBOOK') as Promise<SocialConnectionStatus<T>>,
    syncPosts: <T = unknown>() => socialApi.syncPosts<T>('FACEBOOK'),
    getPosts: <T = unknown>(page = 1, limit = 10) => socialApi.getPosts<T>('FACEBOOK', page, limit),
    createPost: <T = unknown>(postData: CreateSocialPostPayload) => socialApi.createPost<T>('FACEBOOK', postData),
    likePost: (postId: string) => socialApi.likePost('FACEBOOK', postId),
    commentOnPost: (postId: string, comment: string) => socialApi.commentOnPost('FACEBOOK', postId, comment),
    getProfile: <T = unknown>() => socialApi.getProfile<T>('FACEBOOK'),
};

export const instagramApi = {
    initiateAuth: (state?: string) => socialApi.initiateAuth('INSTAGRAM', state),
    handleCallback: <T = unknown>(code: string, state?: string) => socialApi.handleCallback<T>('INSTAGRAM', { code, state }),
    disconnect: () => socialApi.disconnect('INSTAGRAM'),
    getConnectionStatus: <T = unknown>() => socialApi.getConnectionStatus<T>('INSTAGRAM') as Promise<SocialConnectionStatus<T>>,
    syncPosts: <T = unknown>() => socialApi.syncPosts<T>('INSTAGRAM'),
    getPosts: <T = unknown>(page = 1, limit = 10) => socialApi.getPosts<T>('INSTAGRAM', page, limit),
    createPost: <T = unknown>(postData: CreateSocialPostPayload) => socialApi.createPost<T>('INSTAGRAM', postData),
    likePost: (postId: string) => socialApi.likePost('INSTAGRAM', postId),
    commentOnPost: (postId: string, comment: string) => socialApi.commentOnPost('INSTAGRAM', postId, comment),
    getProfile: <T = unknown>() => socialApi.getProfile<T>('INSTAGRAM'),
};