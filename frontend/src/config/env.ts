import { z } from 'zod';

const clientSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default('RevoxA'),
  NEXT_PUBLIC_APP_URL: z.string().default('http://localhost:3000'),
  NEXT_PUBLIC_ENV: z.string().default('development'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().default('https://mock-supabase.supabase.co'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default('mock-supabase-anon-key'),
});

const serverSchema = z.object({
  BACKEND_URL: z.string().default('http://127.0.0.1:8000'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default('mock-supabase-service-role-key'),
  SUPABASE_JWT_SECRET: z.string().default('mock-supabase-jwt-secret'),
  OPENAI_API_KEY: z.string().default('mock-openai-api-key'),
  ANTHROPIC_API_KEY: z.string().optional().or(z.literal('')),
  GOOGLE_AI_API_KEY: z.string().optional().or(z.literal('')),
  OPENROUTER_API_KEY: z.string().optional().or(z.literal('')),
  HINDSIGHT_API_KEY: z.string().default('mock-hindsight-api-key'),
  HINDSIGHT_BASE_URL: z.string().default('https://api.hindsight.vectorize.io'),
  QDRANT_URL: z.string().optional().or(z.literal('')),
  QDRANT_API_KEY: z.string().optional().or(z.literal('')),
  DATABASE_URL: z.string().default('postgresql://postgres:password@localhost:5432/memora'),
  DIRECT_URL: z.string().optional().or(z.literal('')),
  RESEND_API_KEY: z.string().optional().or(z.literal('')),
  GOOGLE_CLIENT_ID: z.string().optional().or(z.literal('')),
  GOOGLE_CLIENT_SECRET: z.string().optional().or(z.literal('')),
  GITHUB_CLIENT_ID: z.string().optional().or(z.literal('')),
  GITHUB_CLIENT_SECRET: z.string().optional().or(z.literal('')),
  SENTRY_DSN: z.string().optional().or(z.literal('')),
  POSTHOG_API_KEY: z.string().optional().or(z.literal('')),
  SUPABASE_STORAGE_BUCKET: z.string().optional().or(z.literal('')),
});

const isServer = typeof window === 'undefined';

const parseEnv = () => {
  if (isServer) {
    const mergedSchema = clientSchema.merge(serverSchema);
    const parsed = mergedSchema.safeParse(process.env);
    if (!parsed.success) {
      console.warn('⚠️ Environment validation warnings:', parsed.error.format());
      // Return defaults instead of crashing — allows dev mode to work without full config
      return mergedSchema.parse({});
    }
    return parsed.data;
  } else {
    // Client-side validation only checks public vars
    const parsed = clientSchema.safeParse({
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
    if (!parsed.success) {
      console.warn('⚠️ Client environment validation warnings:', parsed.error.format());
      // Return defaults instead of crashing
      return clientSchema.parse({});
    }
    return parsed.data;
  }
};

export const env = parseEnv() as z.infer<typeof clientSchema> & Partial<z.infer<typeof serverSchema>>;
