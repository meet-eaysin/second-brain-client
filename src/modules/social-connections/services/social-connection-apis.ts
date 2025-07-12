import apiClient from "@/services/apiClient.ts";
import type {ApiResponse} from "@/types/api.types.ts";
import type {
    ESocialPlatform, TConnectionsStatus,
    TConnectionStatus,
    TCreateSocialPostPayload,
    TProfileInformation, TSocialAuthResponse, TSocialCallbackParams, TSocialPostsResponse, TSocialSyncResponse
} from "@/modules/social-connections/types";

export const socialApi = {
    initiateAuth: async (platform: ESocialPlatform, state?: string): Promise<TSocialAuthResponse> => {
        const response = await apiClient.get<ApiResponse<TSocialAuthResponse>>(
            `/social/auth/initiate/${platform.toLocaleLowerCase()}`,
            { params: { state } }
        );
        return response.data.data;
    },

    handleCallback: async <T = unknown>(platform: ESocialPlatform, params: TSocialCallbackParams): Promise<T> => {
        const response = await apiClient.get<ApiResponse<T>>(
            `/social/auth/callback/${platform.toLocaleLowerCase()}`,
            { params }
        );
        return response.data.data;
    },

    disconnect: async (platform: ESocialPlatform): Promise<null> => {
        const response = await apiClient.post<ApiResponse<null>>(
            `/social/disconnect/${platform.toLocaleLowerCase()}`
        );
        return response.data.data;
    },

    getConnectionStatus: async <T = unknown>(platform?: ESocialPlatform): Promise<TConnectionStatus<T> | TConnectionsStatus> => {
        const endpoint = platform
            ? `/social/connection/${platform.toLocaleLowerCase()}`
            : '/social/connections';

        const response = await apiClient.get<ApiResponse<TConnectionStatus<T> | TConnectionsStatus>>(endpoint);
        return response.data.data;
    },

    syncPosts: async <T = unknown>(platform: ESocialPlatform): Promise<TSocialSyncResponse<T>> => {
        const response = await apiClient.post<ApiResponse<TSocialSyncResponse<T>>>(
            `/social/sync/${platform.toLocaleLowerCase()}`
        );
        return response.data.data;
    },

    getPosts: async <T = unknown>(platform: ESocialPlatform, page = 1, limit = 10): Promise<TSocialPostsResponse<T>> => {
        const response = await apiClient.get<ApiResponse<TSocialPostsResponse<T>>>(
            `/social/posts/${platform.toLocaleLowerCase()}`,
            { params: { page, limit } }
        );
        return response.data.data;
    },

    createPost: async <T = unknown>(platform: ESocialPlatform, postData: TCreateSocialPostPayload): Promise<T> => {
        const response = await apiClient.post<ApiResponse<T>>(
            `/social/posts/${platform.toLocaleLowerCase()}`,
            postData
        );
        return response.data.data;
    },

    likePost: async (platform: ESocialPlatform, postId: string): Promise<null> => {
        const response = await apiClient.post<ApiResponse<null>>(
            `/social/posts/${platform.toLocaleLowerCase()}/${postId}/like`
        );
        return response.data.data;
    },

    commentOnPost: async (platform: ESocialPlatform, postId: string, comment: string): Promise<null> => {
        const response = await apiClient.post<ApiResponse<null>>(
            `/social/posts/${platform.toLocaleLowerCase()}/${postId}/comment`,
            { comment }
        );
        return response.data.data;
    },

    getProfile: async <T = unknown>(platform: ESocialPlatform): Promise<TProfileInformation<T>> => {
        const response = await apiClient.get<ApiResponse<TProfileInformation<T>>>(
            `/social/profile/${platform.toLocaleLowerCase()}`
        );
        return response.data.data;
    },
};

export const linkedinApi = {
    initiateAuth: (state?: string) => socialApi.initiateAuth('LINKEDIN', state),
    handleCallback: <T = unknown>(code: string, state?: string) => socialApi.handleCallback<T>('LINKEDIN', { code, state }),
    disconnect: () => socialApi.disconnect('LINKEDIN'),
    getConnectionStatus: <T = unknown>() => socialApi.getConnectionStatus<T>('LINKEDIN') as Promise<TConnectionStatus<T>>,
    syncPosts: <T = unknown>() => socialApi.syncPosts<T>('LINKEDIN'),
    getPosts: <T = unknown>(page = 1, limit = 10) => socialApi.getPosts<T>('LINKEDIN', page, limit),
    createPost: <T = unknown>(postData: TCreateSocialPostPayload) => socialApi.createPost<T>('LINKEDIN', postData),
    likePost: (postId: string) => socialApi.likePost('LINKEDIN', postId),
    commentOnPost: (postId: string, comment: string) => socialApi.commentOnPost('LINKEDIN', postId, comment),
    getProfile: <T = unknown>() => socialApi.getProfile<T>('LINKEDIN'),
};

export const facebookApi = {
    initiateAuth: (state?: string) => socialApi.initiateAuth('FACEBOOK', state),
    handleCallback: <T = unknown>(code: string, state?: string) => socialApi.handleCallback<T>('FACEBOOK', { code, state }),
    disconnect: () => socialApi.disconnect('FACEBOOK'),
    getConnectionStatus: <T = unknown>() => socialApi.getConnectionStatus<T>('FACEBOOK') as Promise<TConnectionStatus<T>>,
    syncPosts: <T = unknown>() => socialApi.syncPosts<T>('FACEBOOK'),
    getPosts: <T = unknown>(page = 1, limit = 10) => socialApi.getPosts<T>('FACEBOOK', page, limit),
    createPost: <T = unknown>(postData: TCreateSocialPostPayload) => socialApi.createPost<T>('FACEBOOK', postData),
    likePost: (postId: string) => socialApi.likePost('FACEBOOK', postId),
    commentOnPost: (postId: string, comment: string) => socialApi.commentOnPost('FACEBOOK', postId, comment),
    getProfile: <T = unknown>() => socialApi.getProfile<T>('FACEBOOK'),
};

export const instagramApi = {
    initiateAuth: (state?: string) => socialApi.initiateAuth('INSTAGRAM', state),
    handleCallback: <T = unknown>(code: string, state?: string) => socialApi.handleCallback<T>('INSTAGRAM', { code, state }),
    disconnect: () => socialApi.disconnect('INSTAGRAM'),
    getConnectionStatus: <T = unknown>() => socialApi.getConnectionStatus<T>('INSTAGRAM') as Promise<TConnectionStatus<T>>,
    syncPosts: <T = unknown>() => socialApi.syncPosts<T>('INSTAGRAM'),
    getPosts: <T = unknown>(page = 1, limit = 10) => socialApi.getPosts<T>('INSTAGRAM', page, limit),
    createPost: <T = unknown>(postData: TCreateSocialPostPayload) => socialApi.createPost<T>('INSTAGRAM', postData),
    likePost: (postId: string) => socialApi.likePost('INSTAGRAM', postId),
    commentOnPost: (postId: string, comment: string) => socialApi.commentOnPost('INSTAGRAM', postId, comment),
    getProfile: <T = unknown>() => socialApi.getProfile<T>('INSTAGRAM'),
};