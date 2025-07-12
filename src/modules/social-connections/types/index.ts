export type ESocialPlatform = 'LINKEDIN' | 'FACEBOOK' | "TWITTER" | "INSTAGRAM" | "YOUTUBE" | "TIKTOK"

export type TLinkedInProfile = {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    email: string;
    email_verified: boolean;
    picture: string;
    locale?: {
        language: string;
        country: string;
    };
    headline?: string;
    industry?: string;
    location?: string;
    summary?: string;
}

export type TProfile = {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    email: string;
    email_verified: boolean;
    picture: string;
    locale?: {
        language: string;
        country: string;
    };
    headline?: string;
    industry?: string;
    location?: string;
    summary?: string;
}

export type TSocialAuthResponse = {
    authUrl: string;
    state?: string;
}

export type TConnectionStatus<T> =  {
    isConnected: boolean;
    connectedAt: string;
    lastSyncAt: string;
    email: string;
    profile: TProfileInformation<T>;
}

export interface TConnectionsStatus {
    totalConnections: number
    platforms: TPlatforms
}

export interface TPlatforms {
    linkedin: TProfileInformation<TProfile>
    facebook: TProfileInformation<TProfile>
    instagram: TProfileInformation<TProfile>
    twitter: TProfileInformation<TProfile>
    youtube: TProfileInformation<TProfile>
    tiktok: TProfileInformation<TProfile>
}

export type TProfileInformation<T> = {
    isConnected: boolean
    profile: T
    connectedAt: string
    lastSyncAt: string
    email: string
}

export type TLocale = {
    language: string
    country: string
}

export type TSocialPost<T> = {
    id: string;
    platform: ESocialPlatform;
    content: string;
    createdAt: string;
    author: T;
    engagement: {
        likes: number;
        comments: number;
        shares?: number;
    };
    url?: string;
}

export type TSocialPostsResponse<T> = {
    posts: TSocialPost<T>[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export type TSocialSyncResponse<T> = {
    posts: TSocialPost<T>[];
    synced: number;
}

export type TCreateSocialPostPayload = {
    text: string;
    visibility?: 'PUBLIC' | 'PRIVATE' | 'CONNECTIONS';
    media?: Array<{
        type: 'image' | 'video' | 'document';
        url: string;
        title?: string;
        description?: string;
    }>;
}

export type TSocialCallbackParams = {
    code: string;
    state?: string;
}
