import type { MetadataRoute } from 'next';

import { env } from '@/env/client';
import { getServerSideUrl } from '@/payload/utils/get-server-side-url';

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
    sitemap: `${getServerSideUrl()}/sitemap.xml`,
  };
}
