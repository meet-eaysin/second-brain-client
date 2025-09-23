import { z } from "zod";

const envSchema = z
  .object({
    VITE_API_BASE_URL: z.string().url().default("http://localhost:5000/api/v1"),
  })
  .passthrough();

const envVars = envSchema.safeParse(import.meta.env);

if (!envVars.success) {
  throw new Error(
    `Config validation error: ${envVars.error.errors
      .map((e) => e.message)
      .join(", ")}`
  );
}

// Font configuration
export const fonts = [
  {
    name: "Default",
    label: "Default",
    value: "font-sans",
    class: "font-sans",
  },
  {
    name: "Inter",
    label: "Inter",
    value: "font-inter",
    class: "font-inter",
  },
  {
    name: "Manrope",
    label: "Manrope",
    value: "font-manrope",
    class: "font-manrope",
  },
  {
    name: "System",
    label: "System",
    value: "font-system",
    class: "font-system",
  },
  {
    name: "Serif",
    label: "Serif",
    value: "font-serif",
    class: "font-serif",
  },
  {
    name: "Mono",
    label: "Monospace",
    value: "font-mono",
    class: "font-mono",
  },
] as const;

export const appConfig = {
  APPLICATION_NAME: "Second Brain",
  env: import.meta.env.MODE || "development",
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  api: {
    baseUrl: envVars.data.VITE_API_BASE_URL,
  },
};

export type EnvVars = z.infer<typeof envSchema>;
export type AppConfig = typeof appConfig;
