import { z } from 'zod';

/**
 * Environment variable schema
 * Add all required environment variables here
 */
const envSchema = z.object({
  // Supabase
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  VITE_SUPABASE_PROJECT_ID: z.string().optional(),

  // Optional: Sentry
  VITE_SENTRY_DSN: z.string().url().optional(),

  // Optional: EmailJS
  VITE_EMAILJS_SERVICE_ID: z.string().optional(),
  VITE_EMAILJS_TEMPLATE_ID: z.string().optional(),
  VITE_EMAILJS_PUBLIC_KEY: z.string().optional(),

  // Optional: App URL
  VITE_APP_URL: z.string().url().optional(),

  // Mode
  MODE: z.enum(['development', 'production', 'test']).default('development'),
});

type Env = z.infer<typeof envSchema>;

/**
 * Validated environment variables
 * Throws error if required variables are missing
 */
function validateEnv(): Env {
  const rawEnv = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    VITE_SUPABASE_PROJECT_ID: import.meta.env.VITE_SUPABASE_PROJECT_ID,
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    VITE_EMAILJS_SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    VITE_EMAILJS_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    VITE_EMAILJS_PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    VITE_APP_URL: import.meta.env.VITE_APP_URL,
    MODE: import.meta.env.MODE,
  };

  try {
    return envSchema.parse(rawEnv);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');

      throw new Error(
        `❌ Invalid environment variables:\n${missingVars}\n\n` +
          `Please check your .env file and ensure all required variables are set.`
      );
    }
    throw error;
  }
}

/**
 * Validated environment variables
 * Access this instead of import.meta.env directly
 */
export const env = validateEnv();

/**
 * Check if we're in development mode
 */
export const isDev = env.MODE === 'development';

/**
 * Check if we're in production mode
 */
export const isProd = env.MODE === 'production';
