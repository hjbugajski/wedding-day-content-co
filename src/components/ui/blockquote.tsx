import type { ComponentProps } from 'react';

import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

const Blockquote = ({ children, className, ...props }: ComponentProps<'blockquote'>) => (
  <blockquote
    className={cn(
      'group relative isolate flex w-full flex-col gap-4 overflow-hidden',
      'p-4 md:p-6',
      'rounded-sm bg-neutral-100/75 surface-card dark:bg-neutral-900',
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
    <div
      className={cn([
        'absolute -z-10 h-64 w-56',
        'rotate-45 rounded-full blur-3xl',
        'bg-dusty-rose-300/15 dark:bg-dusty-rose-800/15',
        'group-odd:top-1/4 group-odd:-right-1/4',
        'group-even:top-1/2 group-even:right-1/4',
      ])}
    />
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
