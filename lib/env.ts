import { z } from 'zod';

/**
 * Validated environment access. No secrets yet — this exists so the
 * pattern is in place before Sprint 7 (analytics, domain) needs real ones.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
