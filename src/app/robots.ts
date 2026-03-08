import type { MetadataRoute } from 'next';

import { env } from '@/env/client';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/next/', '/api/'],
    },
    sitemap: `${env.NEXT_PUBLIC_SERVER_URL}/sitemap.xml`,
  };
}
