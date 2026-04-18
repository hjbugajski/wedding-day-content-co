import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DOMAIN: z.string().min(1),
    VERCEL_TARGET_ENV: z
      .enum(['development', 'preview', 'staging', 'production'])
      .default('development'),
    MUX_TOKEN_ID: z.string().min(1),
    MUX_TOKEN_SECRET: z.string().min(1),
    MUX_WEBHOOK_SIGNING_SECRET: z.string().min(1),
    PAYLOAD_ADMIN_PASSWORD: z.string().min(1),
    PAYLOAD_ADMIN_USER: z.string().min(1),
    PAYLOAD_SECRET: z.string().min(1),
    POSTGRES_CONNECTION_STRING: z.string().min(1),
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_BUCKET: z.string().min(1),
    R2_ENDPOINT: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    RESEND_FROM_ADDRESS_DEFAULT: z.string().min(1),
    RESEND_FROM_ADDRESS_PAYLOAD: z.string().min(1),
    RESEND_FROM_NAME_DEFAULT: z.string().min(1),
    RESEND_TO_ADDRESS_DEFAULT: z.string().min(1),
    SERVER_URL: z
      .string()
      .min(1)
      .transform((url) =>
        process.env.VERCEL_TARGET_ENV === 'preview' ? `https://${process.env.VERCEL_URL}` : url,
      ),
    WHITELIST: z.string().min(1),
  },
  runtimeEnv: {
    DOMAIN: process.env.DOMAIN,
    VERCEL_TARGET_ENV: process.env.VERCEL_TARGET_ENV,
    MUX_TOKEN_ID: process.env.MUX_TOKEN_ID,
    MUX_TOKEN_SECRET: process.env.MUX_TOKEN_SECRET,
    MUX_WEBHOOK_SIGNING_SECRET: process.env.MUX_WEBHOOK_SIGNING_SECRET,
    PAYLOAD_ADMIN_PASSWORD: process.env.PAYLOAD_ADMIN_PASSWORD,
    PAYLOAD_ADMIN_USER: process.env.PAYLOAD_ADMIN_USER,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    POSTGRES_CONNECTION_STRING: process.env.POSTGRES_CONNECTION_STRING,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_BUCKET: process.env.R2_BUCKET,
    R2_ENDPOINT: process.env.R2_ENDPOINT,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_ADDRESS_DEFAULT: process.env.RESEND_FROM_ADDRESS_DEFAULT,
    RESEND_FROM_ADDRESS_PAYLOAD: process.env.RESEND_FROM_ADDRESS_PAYLOAD,
    RESEND_FROM_NAME_DEFAULT: process.env.RESEND_FROM_NAME_DEFAULT,
    RESEND_TO_ADDRESS_DEFAULT: process.env.RESEND_TO_ADDRESS_DEFAULT,
    SERVER_URL: process.env.SERVER_URL,
    WHITELIST: process.env.WHITELIST,
  },
});
