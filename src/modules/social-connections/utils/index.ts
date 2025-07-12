import type {SocialCallbackParams, SocialPlatform} from "@/modules/social-connections/types";

export const parseSocialCallback = (searchParams: URLSearchParams): SocialCallbackParams => {
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

export const getSupportedPlatforms = (): SocialPlatform[] => {
    return ['LINKEDIN', 'FACEBOOK', 'INSTAGRAM', 'TWITTER', 'YOUTUBE', 'TWITTER'];
};

export const isPlatformSupported = (platform: string): platform is SocialPlatform => {
    return getSupportedPlatforms().includes(platform as SocialPlatform);
};
