import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Icons } from '@/icons';

export default function NotFound() {
  return (
    <section className="flex flex-1 flex-col items-center py-8 text-center md:py-12">
      <div className="mb-8">
        <h1 className="mb-4 text-5xl sm:text-6xl">Page not found</h1>
        <p className="mx-auto max-w-2xl text-lg">
          We couldn&apos;t find the page you were looking for.
        </p>
      </div>
      <Button render={<Link href="/" />} iconPosition="right">
        Home
        <Icons name="arrowRight" />
      </Button>
    </section>
  );
}
