'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Icons } from '@/icons';

export default function Error() {
  return (
    <section className="flex flex-1 flex-col items-center py-8 text-center md:py-12">
      <div className="mb-8">
        <h1 className="mb-4 text-5xl sm:text-6xl">Something went wrong</h1>
        <p className="mx-auto max-w-2xl text-lg">We encountered an unexpected error.</p>
      </div>
      <Button asChild iconPosition="right">
        <Link href="/">
          Home
          <Icons name="arrowRight" />
        </Link>
      </Button>
    </section>
  );
}
