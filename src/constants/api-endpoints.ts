export const API_ENDPOINTS = {
    AUTH: {
        SIGN_IN: '/auth/sign-in',
        SIGN_UP: '/auth/sign-up',
        GOOGLE_AUTH: '/auth/google',
        GOOGLD_AUTH_CALLBACK: '/auth/google/callback',
        REFRESH_TOKEN: '/auth/refresh',
        LOGOUT: '/auth/logout',
        LOGOUT_ALL: '/auth/logout-all',
        FORGOT_PASSWORD: '/auth/forgot-password',
        CHANGE_PASSWORD: '/auth/change-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_OTP: '/auth/verify-otp',
        VERIFY_EMAIL: '/auth/verify-email',
        ME: '/auth/me',
    },
    USERS: {
        LIST: '/users',
        BY_ID: (id: string) => `/users/${id}`,
        UPDATE: (id: string) => `/users/${id}`,
        DELETE: (id: string) => `/users/${id}`,
    },
    DASHBOARD: {
        STATS: '/dashboard/stats',
        ANALYTICS: '/dashboard/analytics',
    },
    PROFILE: {
        GET: '/profile',
        UPDATE: '/profile',
    },
} as const
