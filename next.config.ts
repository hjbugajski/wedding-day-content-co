import { env } from 'node:process';

import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const domain = env.VERCEL_TARGET_ENV === 'preview' ? env.VERCEL_BRANCH_URL : env.NEXT_PUBLIC_DOMAIN;
const isProductionNode = env.NODE_ENV === 'production';
const isProductionVercel = env.VERCEL_TARGET_ENV === 'production';

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: !isProductionNode,
    unoptimized: !isProductionVercel,
    remotePatterns: [
      {
        protocol: isProductionNode ? 'https' : 'http',
        hostname: isProductionNode && domain ? domain : 'localhost',
        pathname: '/api/**',
      },
    ],
  },
  turbopack: {},
  headers: () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'DENY' },
        ...(isProductionVercel ? [] : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]),
      ],
    },
  ],
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
