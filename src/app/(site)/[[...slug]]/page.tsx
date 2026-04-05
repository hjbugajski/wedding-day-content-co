import { cache } from 'react';

import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

import config from '@payload-config';

import { LivePreviewListener } from '@/components/live-preview-listener';
import { RichText } from '@/components/rich-text';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { getServerSideUrl } from '@/payload/utils/get-server-side-url';
import { cn } from '@/utils/cn';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

const fetchCachedPage = cache(async ({ slug }: { slug: string[] }) => {
  const segments = slug || ['home'];
  const draftModePromise = draftMode();
  const payloadPromise = getPayload({ config });
  const [{ isEnabled: draft }, payload] = await Promise.all([draftModePromise, payloadPromise]);
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
      breadcrumbs: true,
    },
  });

  return result.docs?.[0] || null;
});

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
  const { slug } = await params;
  const page = await fetchCachedPage({ slug });
  const segments = slug || ['home'];
  const isHome = !slug || segments[0] === 'home';
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

export default async function Page({ params }: PageProps) {
  const { isEnabled: draft } = await draftMode();
  const { slug } = await params;
  const page = await fetchCachedPage({ slug });

  if (!page) {
    notFound();
  }

  return (
    <main className={cn('mx-auto w-full max-w-7xl px-6', page.slug !== 'home' && 'py-12')}>
      {draft ? <LivePreviewListener /> : null}
      {page.slug !== 'home' ? <Breadcrumbs breadcrumbs={page.breadcrumbs} /> : null}
      <RichText data={page.content} />
    </main>
  );
}
