import { cache } from 'react';

import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

import { metadata } from '@/app/(site)/layout';
import { LivePreviewListener } from '@/components/live-preview-listener';
import { RichText } from '@/components/rich-text';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { cn } from '@/utils/cn';
import { pageTitle } from '@/utils/page-title';
import config from '@payload-config';

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

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await fetchCachedPage({ slug });

  return {
    title: pageTitle(page?.title, metadata),
    description: page?.description || metadata.description,
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
      {page.slug !== 'home' && <Breadcrumbs breadcrumbs={page.breadcrumbs} />}
      <RichText data={page.content} />
    </main>
  );
}
