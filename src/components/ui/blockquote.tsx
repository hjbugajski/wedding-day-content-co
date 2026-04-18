import type { ComponentProps } from 'react';

import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

const Blockquote = ({ children, className, ...props }: ComponentProps<'blockquote'>) => (
  <blockquote
    className={cn(
      'group relative isolate flex w-full flex-col gap-4 overflow-hidden rounded-sm bg-neutral-100/75 p-4 shadow-lg ring-2 shadow-neutral-500/10 ring-neutral-200 md:p-6 dark:bg-neutral-900 dark:shadow-neutral-600/10 dark:ring-neutral-800',
      className,
    )}
    {...props}
  >
    <Icons
      name="quoteSolid"
      aria-hidden
      className="size-12 self-center drop-shadow-lg dark:text-neutral-300"
    />
    {children}
    <div className="absolute -z-10 h-64 w-56 rotate-45 rounded-full bg-dusty-rose-300/15 blur-3xl group-odd:top-1/4 group-odd:-right-1/4 group-even:top-1/2 group-even:right-1/4 dark:bg-dusty-rose-800/15" />
  </blockquote>
);

const BlockquoteBody = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className="my-auto flex grow flex-col">
    <div className={cn('text-lg', className)} {...props} />
  </div>
);

const BlockquoteFooter = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    className={cn('text-xl font-medium drop-shadow-lg dark:text-neutral-300', className)}
    {...props}
  />
);

export { Blockquote, BlockquoteBody, BlockquoteFooter };
