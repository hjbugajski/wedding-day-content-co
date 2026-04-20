import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

export const PolaroidImage = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    className={cn(
      'rounded-sm bg-white p-4 pb-16 shadow-lg ring-1 shadow-neutral-500/10 ring-neutral-200 dark:bg-neutral-800 dark:shadow-neutral-600/10 dark:ring-neutral-700',
      className,
    )}
    {...props}
  />
);
