'use client';

import { cn } from '@/utils/cn';

const actionClasses = cn([
  'rounded-sm px-6 py-3',
  'font-semibold uppercase',
  'transition',
  'cursor-pointer',
]);

/** `retry` re-fetches and re-renders the root, where `reset` only clears the error state. */
type Props = {
  retry: () => void;
};

export default function GlobalError({ retry }: Props) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4 text-neutral-800">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-light">Something went wrong</h1>
          <p className="text-lg">We encountered an unexpected error.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={retry}
            className={cn(actionClasses, 'bg-neutral-800 text-neutral-100 hover:bg-neutral-900')}
          >
            Try again
          </button>
          {/* oxlint-disable-next-line nextjs/no-html-link-for-pages -- global error boundary; hard nav resets app state */}
          <a
            href="/"
            className={cn(actionClasses, 'text-neutral-800 no-underline hover:bg-neutral-200')}
          >
            Home
          </a>
        </div>
      </body>
    </html>
  );
}
