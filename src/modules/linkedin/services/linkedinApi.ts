import apiClient from "@/services/apiClient";
import type { ApiResponse } from "@/types/api.types";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type {
    CreateLinkedInPostPayload,
    LinkedInAuthResponse,
    LinkedInConnectionStatus,
    LinkedInPost,
    LinkedInSyncResponse,
    LinkedInPostsResponse,
    LinkedInCallbackParams,
} from "@/modules/linkedin/types";

export const linkedinApi = {
    initiateAuth: async (state?: string): Promise<LinkedInAuthResponse> => {
        const response = await apiClient.get<ApiResponse<LinkedInAuthResponse>>(
            API_ENDPOINTS.LINKEDIN.AUTH_INITIATE,
            { params: { state } }
        );
        return response.data.data;
    },

    handleCallback: async (code: string, state?: string): Promise<void> => {
        const response = await apiClient.get<ApiResponse<void>>(
            API_ENDPOINTS.LINKEDIN.AUTH_CALLBACK,
            { params: { code, state } }
        );
        return response.data.data;
    },

    disconnect: async (): Promise<void> => {
        const response = await apiClient.post<ApiResponse<void>>(
            API_ENDPOINTS.LINKEDIN.DISCONNECT
        );
        return response.data.data;
    },

    getConnectionStatus: async (): Promise<LinkedInConnectionStatus> => {
        const response = await apiClient.get<ApiResponse<LinkedInConnectionStatus>>(
            API_ENDPOINTS.LINKEDIN.CONNECTION_STATUS
        );
        return response.data.data;
    },

    syncPosts: async (): Promise<LinkedInSyncResponse> => {
        const response = await apiClient.post<ApiResponse<LinkedInSyncResponse>>(
            API_ENDPOINTS.LINKEDIN.SYNC_POSTS
        );
        return response.data.data;
    },

    getPosts: async (page = 1, limit = 10): Promise<LinkedInPostsResponse> => {
        const response = await apiClient.get<ApiResponse<LinkedInPostsResponse>>(
            API_ENDPOINTS.LINKEDIN.POSTS,
            { params: { page, limit } }
        );
        return response.data.data;
    },

    createPost: async (postData: CreateLinkedInPostPayload): Promise<LinkedInPost> => {
        const response = await apiClient.post<ApiResponse<LinkedInPost>>(
            API_ENDPOINTS.LINKEDIN.CREATE_POST,
            postData
        );
        return response.data.data;
    },

    likePost: async (postId: string): Promise<void> => {
        const response = await apiClient.post<ApiResponse<void>>(
            API_ENDPOINTS.LINKEDIN.LIKE_POST(postId)
        );
        return response.data.data;
    },

    commentOnPost: async (postId: string, comment: string): Promise<void> => {
        const response = await apiClient.post<ApiResponse<void>>(
            API_ENDPOINTS.LINKEDIN.COMMENT_POST(postId),
            { comment }
        );
        return response.data.data;
    },
};

export const parseLinkedInCallback = (searchParams: URLSearchParams): LinkedInCallbackParams => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
        throw new Error('Authorization code is required');
    }

    return {
        code,
        state: state || undefined,
    };
};