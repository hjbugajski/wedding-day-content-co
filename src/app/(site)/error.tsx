'use client';

import { Button } from '@/components/ui/button';
import { Icons } from '@/icons';

type Props = {
  reset: () => void;
};

export default function Error({ reset }: Props) {
  return (
    <section className="flex flex-1 flex-col items-center py-8 text-center md:py-12">
      <div className="mb-8">
        <h1 className="mb-4 text-5xl sm:text-6xl">Something went wrong</h1>
        <p className="mx-auto max-w-2xl text-lg">We encountered an unexpected error.</p>
      </div>
      <Button onClick={reset} iconPosition="right">
        Try again
        <Icons name="arrowRight" />
      </Button>
    </section>
  );
}
