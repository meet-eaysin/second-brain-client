import type {ESocialPlatform, TSocialCallbackParams} from "@/modules/social-connections/types";

export const parseSocialCallback = (searchParams: URLSearchParams): TSocialCallbackParams => {
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

export const getSupportedPlatforms = (): ESocialPlatform[] => {
    return ['LINKEDIN', 'FACEBOOK', 'INSTAGRAM', 'TWITTER', 'YOUTUBE', 'TWITTER'];
};

export const isPlatformSupported = (platform: string): platform is ESocialPlatform => {
    return getSupportedPlatforms().includes(platform as ESocialPlatform);
};
