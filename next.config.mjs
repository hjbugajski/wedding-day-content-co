import { env } from 'node:process';

import { withPayload } from '@payloadcms/next/withPayload';

// Mirror getServerSideUrl(): the stable per-branch host on preview so image remotePatterns
// matches the absolute URLs Payload builds from serverURL.
const domain = env.VERCEL_TARGET_ENV === 'preview' ? env.VERCEL_BRANCH_URL : env.NEXT_PUBLIC_DOMAIN;
const isProductionNode = env.NODE_ENV === 'production';
const isProductionVercel = env.VERCEL_TARGET_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowLocalIP: !isProductionNode,
    remotePatterns: [
      {
        protocol: isProductionNode ? 'https' : 'http',
        hostname: isProductionNode && domain ? domain : 'localhost',
        pathname: '/api/**',
      },
    ],
  },
  turbopack: {},
  headers: async () => [
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
