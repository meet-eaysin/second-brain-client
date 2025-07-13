import { z } from 'zod';

const envSchema = z.object({
    VITE_API_BASE_URL: z.string().url().default('http://localhost:5000/api/v1'),
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
    }
};

export type EnvVars = z.infer<typeof envSchema>;
export type AppConfig = typeof appConfig;