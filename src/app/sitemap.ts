import type { MetadataRoute } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import { getPayload } from 'payload';

import { env } from '@/env/client';
import config from '@/payload/payload.config';
import { getServerSideUrl } from '@/payload/utils/get-server-side-url';

async function getPagesSitemap(): Promise<MetadataRoute.Sitemap> {
  'use cache';
  cacheLife('max');
  cacheTag('pages:sitemap');

  const payload = await getPayload({ config });
  const siteUrl = getServerSideUrl();

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
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (env.NEXT_PUBLIC_VERCEL_TARGET_ENV !== 'production') {
    return [];
  }

  return getPagesSitemap();
}
