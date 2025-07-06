export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        GOOGLE: '/auth/google',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
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
