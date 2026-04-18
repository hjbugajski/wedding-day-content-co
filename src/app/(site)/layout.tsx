import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { Figtree } from 'next/font/google';
import localFont from 'next/font/local';
import Script from 'next/script';
import { type GlobalSlug, getPayload } from 'payload';

import payloadConfig from '@payload-config';

import { Footer } from '@/components/footer';
import { Navigation } from '@/components/navigation';
import { Toaster } from '@/components/ui/toaster';
import { env } from '@/env/client';
import type { PayloadFooterGlobal, PayloadNavigationGlobal } from '@/payload/payload-types';
import { getServerSideUrl } from '@/payload/utils/get-server-side-url';
import { cn } from '@/utils/cn';

import './globals.css';

const nightingale = localFont({
  src: '../../../public/font/DTNightingale.ttf',
  display: 'swap',
  variable: '--font-nightingale',
  weight: '400',
});
const figtree = Figtree({ subsets: ['latin'], display: 'swap', variable: '--font-figtree' });

const siteUrl = getServerSideUrl();
const siteName = 'Wedding Day Content Co.';
const siteDescription = 'Wedding and event content creation, storytelling for love that inspires.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | NYC Wedding Content Creator`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'Wedding Day Content Co.',
    'Wedding Day Content Co',
    'Wedding Day Content',
    'Content Creator',
    'Content Creation',
    'Event Content Creator',
    'Event Content Creation',
    'Wedding Content',
    'Wedding Content Creator',
    'Wedding Content Creation',
    'Wedding Day Content Creator',
    'NYC Wedding Content Creator',
    'New York Wedding Content Creator',
    'New York City Wedding Content Creator',
    'Wedding Photography',
    'Wedding Videography',
    'Wedding Photographer',
    'Wedding Videographer',
    'NYC Wedding Videographer',
    'NYC Wedding Photographer',
    'New York Wedding Photographer',
    'New York Wedding Videographer',
    'New York City Wedding Photographer',
    'New York City Wedding Videographer',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName,
    title: `${siteName} | NYC Wedding Content Creator`,
    description: siteDescription,
    url: siteUrl,
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
    title: `${siteName} | NYC Wedding Content Creator`,
    description: siteDescription,
    images: [`${siteUrl}/opengraph-image`],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots:
    env.NEXT_PUBLIC_VERCEL_TARGET_ENV === 'production'
      ? undefined
      : { index: false, follow: false },
  icons: {
    icon: [
      { url: '/favicon.svg' },
      { url: '/favicon.ico' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32' },
      { url: '/favicons/favicon-96x96.png', sizes: '96x96' },
      { url: '/favicons/favicon-128x128.png', sizes: '128x128' },
      { url: '/favicons/favicon-196x196.png', sizes: '196x196' },
    ],
    apple: [
      { url: '/favicons/apple-touch-icon.png' },
      { url: '/favicons/apple-touch-icon-57x57.png', sizes: '57x57' },
      { url: '/favicons/apple-touch-icon-60x60.png', sizes: '60x60' },
      { url: '/favicons/apple-touch-icon-72x72.png', sizes: '72x72' },
      { url: '/favicons/apple-touch-icon-76x76.png', sizes: '76x76' },
      { url: '/favicons/apple-touch-icon-114x114.png', sizes: '114x114' },
      { url: '/favicons/apple-touch-icon-120x120.png', sizes: '120x120' },
      { url: '/favicons/apple-touch-icon-144x144.png', sizes: '144x144' },
      { url: '/favicons/apple-touch-icon-152x152.png', sizes: '152x152' },
      { url: '/favicons/apple-touch-icon-167x167.png', sizes: '167x167' },
    ],
    other: [
      { url: '/favicons/mask-icon.svg', rel: 'mask-icon' },
      { url: '/favicons/android-chrome-192x192.png', sizes: '192x192' },
      { url: '/favicons/android-chrome-512x512.png', sizes: '512x512' },
    ],
  },
};

const fetchGlobal = async (slug: GlobalSlug) => {
  const payload = await getPayload({ config: payloadConfig });

  return payload.findGlobal({ slug });
};

const fetchCachedGlobal = <T,>(slug: GlobalSlug) =>
  unstable_cache(fetchGlobal, [slug], {
    tags: [`global:${slug}`],
  })(slug) as Promise<T>;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const navigation = await fetchCachedGlobal<PayloadNavigationGlobal>('navigation');
  const footer = await fetchCachedGlobal<PayloadFooterGlobal>('footer');

  return (
    <html
      lang="en"
      className={cn(
        figtree.variable,
        nightingale.variable,
        'h-full scroll-p-36 scroll-smooth! bg-neutral-50 font-sans text-neutral-800',
      )}
      data-scroll-behavior="smooth"
    >
      <body className="relative flex h-full flex-col">
        <div className="dot-mask fixed inset-0 -z-10 h-full w-full" />
        <Navigation {...navigation} />
        <div className="mt-18 flex flex-1 flex-col">{children}</div>
        <Footer {...footer} />
        <Toaster />
        <Script
          src={env.NEXT_PUBLIC_UMAMI_SRC}
          data-website-id={env.NEXT_PUBLIC_UMAMI_ID}
          data-domains={env.NEXT_PUBLIC_DOMAIN}
          data-performance="true"
        />
      </body>
    </html>
  );
}
