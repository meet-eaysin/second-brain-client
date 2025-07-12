export type SocialPlatform = 'LINKEDIN' | 'FACEBOOK' | "TWITTER" | "INSTAGRAM" | "YOUTUBE" | "TIKTOK"

export type TLinkedInProfile = {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    email: string;
    email_verified: boolean;
    picture?: string;
    locale?: {
        language: string;
        country: string;
    };
    headline?: string;
    publicProfileUrl?: string;
    industry?: string;
    location?: string;
    summary?: string;
}


export type TFacebookProfile = {
    id: string;
    name: string;
    email: string;
    picture: {
        data: {
            url: string;
        };
    };
}

export interface TwitterProfile {
    id: string;
    username: string;
    name: string;
    profile_image_url: string;
    followers_count: number;
    following_count: number;
}

export interface InstagramProfile {
    id: string;
    username: string;
    account_type: 'PERSONAL' | 'BUSINESS';
    media_count: number;
    followers_count: number;
}

export interface YouTubeProfile {
    id: string;
    snippet: {
        title: string;
        description: string;
        thumbnails: {
            default: { url: string };
        };
    };
    statistics: {
        subscriberCount: string;
        videoCount: string;
    };
}

export interface TikTokProfile {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
    follower_count: number;
    following_count: number;
}

export type PlatformProfileMap = {
    linkedin: TLinkedInProfile;
    facebook: TFacebookProfile;
    twitter: TwitterProfile;
    instagram: InstagramProfile;
    youtube: YouTubeProfile;
    tiktok: TikTokProfile;
};

export interface SocialAuthResponse {
    authUrl: string;
    state?: string;
}

export interface SocialConnectionStatus<T> {
    platform: SocialPlatform;
    isConnected: boolean;
    connection: {
        profile: Record<string, T>;
        connectedAt: string;
        lastSyncAt: string;
        email?: string;
    } | null;
}

export interface AllConnectionsStatus<T> {
    totalConnections: number;
    platforms: Record<SocialPlatform, {
        isConnected: boolean;
        profile: Record<string, T> | null;
        connectedAt: string | null;
        lastSyncAt: string | null;
        email: string | null;
    }>;
    connections: Array<{
        platform: SocialPlatform;
        profile: Record<string, T>;
        connectedAt: string;
        lastSyncAt: string;
        email?: string;
    }>;
}

export interface SocialPost<T> {
    id: string;
    platform: SocialPlatform;
    content: string;
    createdAt: string;
    author: Record<string, T>;
    engagement: {
        likes: number;
        comments: number;
        shares?: number;
    };
    url?: string;
}

export interface SocialPostsResponse<T> {
    posts: SocialPost<T>[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface SocialSyncResponse<T> {
    posts: SocialPost<T>[];
    synced: number;
}

export interface CreateSocialPostPayload {
    text: string;
    visibility?: 'PUBLIC' | 'PRIVATE' | 'CONNECTIONS';
    media?: Array<{
        type: 'image' | 'video' | 'document';
        url: string;
        title?: string;
        description?: string;
    }>;
}

export interface SocialProfile<T> {
    platform: SocialPlatform;
    profile: Record<string, T>;
    connectedAt: string;
    lastSyncAt: string;
    email?: string;
}

export interface SocialCallbackParams {
    code: string;
    state?: string;
}
