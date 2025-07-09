// src/config/index.ts

import { z } from 'zod';

const envSchema = z.object({
    // API Configuration
    VITE_API_BASE_URL: z.string().url().default('http://localhost:5000/api/v1'),

    // LinkedIn Configuration
    VITE_LINKEDIN_CLIENT_ID: z.string().optional(),
    VITE_LINKEDIN_CLIENT_SECRET: z.string().optional(),
    VITE_LINKEDIN_CALLBACK_URL: z.string().url().optional(),
    VITE_LINKEDIN_REDIRECT_URI: z.string().url().optional(),
    VITE_LINKEDIN_SCOPE: z.string().default('r_liteprofile').refine(
        (val) => {
            const validScopes = [
                'r_liteprofile',
                'r_emailaddress',
                'w_member_social',
                'r_member_social',
                'w_organization_social',
                'r_organization_social'
            ];
            const scopes = val.split(' ');
            return scopes.every(scope => validScopes.includes(scope));
        },
        'Invalid LinkedIn scope. Must be valid LinkedIn API scopes.'
    ),
    VITE_LINKEDIN_API_BASE_URL: z.string().url().default('https://api.linkedin.com/v2'),
}).passthrough();

const envVars = envSchema.safeParse(import.meta.env);

if (!envVars.success) {
    throw new Error(`Config validation error: ${envVars.error.errors.map(e => e.message).join(', ')}`);
}

export const appConfig = {
    APPLICATION_NAME: 'Sync-Workbench-Frontend',
    env: import.meta.env.MODE || 'development',
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,

    api: {
        baseUrl: envVars.data.VITE_API_BASE_URL,
    },

    linkedin: {
        clientId: envVars.data.VITE_LINKEDIN_CLIENT_ID,
        clientSecret: envVars.data.VITE_LINKEDIN_CLIENT_SECRET,
        callbackUrl: envVars.data.VITE_LINKEDIN_CALLBACK_URL,
        redirectUri: envVars.data.VITE_LINKEDIN_REDIRECT_URI,
        scope: envVars.data.VITE_LINKEDIN_SCOPE,
        apiBaseUrl: envVars.data.VITE_LINKEDIN_API_BASE_URL,
    },
};

export type EnvVars = z.infer<typeof envSchema>;
export type AppConfig = typeof appConfig;