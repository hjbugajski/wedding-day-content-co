import type { ComponentProps } from 'react';

import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/utils/cn';

export type PolaroidImageProps = ComponentProps<'div'> & {
  asChild?: boolean;
};

export const PolaroidImage = ({ asChild, className, ...props }: PolaroidImageProps) => {
  const Component = asChild ? Slot : 'div';

  return (
    <Component
      className={cn(
        'rounded-sm bg-white p-4 pb-16 shadow-lg ring-1 shadow-neutral-500/10 ring-neutral-200 dark:bg-neutral-800 dark:shadow-neutral-600/10 dark:ring-neutral-700',
        className,
      )}
      {...props}
    />
  );
};
