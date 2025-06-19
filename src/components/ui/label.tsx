'use client';

import type { ComponentProps } from 'react';

import { Root } from '@radix-ui/react-label';

import { cn } from '@/utils/cn';

const Label = ({ className, ...props }: ComponentProps<typeof Root>) => (
  <Root
    className={cn(
      'text-sm leading-none subheading text-neutral-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white/75',
      className,
    )}
    {...props}
  />
);

export { Label };
