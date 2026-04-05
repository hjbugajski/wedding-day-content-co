import type { MetadataRoute } from 'next';

import { env } from '@/env/client';

export default function robots(): MetadataRoute.Robots {
  if (env.NEXT_PUBLIC_VERCEL_TARGET_ENV !== 'production') {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/next/', '/api/'],
    },
    sitemap: `${env.NEXT_PUBLIC_SERVER_URL}/sitemap.xml`,
  };
}
