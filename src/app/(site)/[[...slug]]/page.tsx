import { type ReactNode, Suspense } from 'react';

import type { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

import config from '@payload-config';

import { LivePreviewListener } from '@/components/live-preview-listener';
import { RichText } from '@/components/rich-text';
import type { PayloadPagesCollection } from '@/payload/payload-types';
import { getServerSideUrl } from '@/payload/utils/get-server-side-url';
import { cn } from '@/utils/cn';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

type PageDoc = Pick<PayloadPagesCollection, 'title' | 'description' | 'content' | 'slug'>;

const findPage = async (segments: string[], draft: boolean): Promise<PageDoc | null> => {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'pages',
    draft,
    pagination: false,
    limit: 1,
    overrideAccess: draft,
    where: {
      path: {
        equals: `/${segments.join('/')}`,
      },
    },
    select: {
      title: true,
      description: true,
      content: true,
      slug: true,
    },
  });

  return result.docs?.[0] || null;
};

const fetchPublishedPage = async (segments: string[]): Promise<PageDoc | null> => {
  'use cache';
  cacheLife('max');
  cacheTag('pages');

  return findPage(segments, false);
};

const toSegments = (slug: string[] | undefined) => (slug?.length ? slug : ['home']);

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config });
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      pagination: false,
      overrideAccess: false,
      select: {
        path: true,
      },
    });

    return pages.docs.map(({ path }) => ({ slug: path?.split('/')?.slice(1) || undefined }));
  } catch {
    return [{ slug: undefined }];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  'use cache';
  cacheLife('max');

  const { slug } = await params;
  const segments = toSegments(slug);
  const page = await fetchPublishedPage(segments);
  const isHome = segments[0] === 'home';
  const siteUrl = getServerSideUrl();
  const pageUrl = isHome ? siteUrl : `${siteUrl}/${segments.join('/')}`;

  if (!page) {
    return {};
  }

  const title = !page.title || page.title.toLowerCase() === 'home' ? undefined : page.title;
  const description =
    page.description || 'Wedding and event content creation, storytelling for love that inspires.';
  const siteName = 'Wedding Day Content Co.';
  const defaultTitle = `${siteName} | NYC Wedding Content Creator`;
  const resolvedTitle = title || defaultTitle;

  return {
    title: title || { absolute: defaultTitle },
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName,
      title: resolvedTitle,
      description,
      url: pageUrl,
      images: [
        {
          url: `${siteUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      images: [`${siteUrl}/opengraph-image`],
    },
  };
}

/**
 * The published render is cached, so it prerenders into the static shell and doubles as the
 * fallback for the request-time render. Only editors in draft mode pay for an uncached fetch;
 * for everyone else the streamed render resolves against the same cache entry.
 */
export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<PublishedPage params={params} />}>
      <ResolvedPage params={params} />
    </Suspense>
  );
}

async function ResolvedPage({ params }: PageProps) {
  const { isEnabled: draft } = await draftMode();

  if (!draft) {
    return <PublishedPage params={params} />;
  }

  const { slug } = await params;
  const page = await findPage(toSegments(slug), true);

  if (!page) {
    notFound();
  }

  return (
    <PageBody slug={page.slug}>
      <LivePreviewListener />
      <RichText data={page.content} />
    </PageBody>
  );
}

async function PublishedPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await fetchPublishedPage(toSegments(slug));

  if (!page) {
    notFound();
  }

  return (
    <PageBody slug={page.slug}>
      <RichText data={page.content} />
    </PageBody>
  );
}

function PageBody({ slug, children }: { slug: PageDoc['slug']; children: ReactNode }) {
  return (
    <main className={cn('mx-auto w-full max-w-7xl px-6', { 'py-12': slug !== 'home' })}>
      {children}
    </main>
  );
}
