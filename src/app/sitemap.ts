import type { MetadataRoute } from 'next';
import { unstable_cache } from 'next/cache';
import { getPayload } from 'payload';

import { env } from '@/env/client';
import config from '@/payload/payload.config';

const getPagesSitemap = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const payload = await getPayload({ config });
    const siteUrl = env.NEXT_PUBLIC_SERVER_URL;

    const results = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 0,
      pagination: false,
      select: {
        path: true,
        updatedAt: true,
      },
    });
    const docs = results?.docs || [];

    return docs
      .filter((page) => Boolean(page?.path))
      .map<MetadataRoute.Sitemap[number]>((page) => ({
        url: page?.path === '/home' ? siteUrl : siteUrl + page?.path,
        lastModified: page.updatedAt || new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: page?.path === '/home' ? 1 : 0.8,
      }));
  },
  ['pages:sitemap'],
  { tags: ['pages:sitemap'] },
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap = await getPagesSitemap();

  return sitemap;
}
