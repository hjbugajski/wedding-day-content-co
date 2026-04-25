import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_UMAMI_SRC: z.string().min(1),
    NEXT_PUBLIC_UMAMI_ID: z.string().min(1),
    NEXT_PUBLIC_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_SERVER_URL: z.string().min(1),
    NEXT_PUBLIC_VERCEL_TARGET_ENV: z
      .enum(['development', 'preview', 'staging', 'production'])
      .default('development'),
  },
  runtimeEnv: {
    NEXT_PUBLIC_UMAMI_SRC: process.env.NEXT_PUBLIC_UMAMI_SRC,
    NEXT_PUBLIC_UMAMI_ID: process.env.NEXT_PUBLIC_UMAMI_ID,
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_VERCEL_TARGET_ENV: process.env.NEXT_PUBLIC_VERCEL_TARGET_ENV,
  },
});
