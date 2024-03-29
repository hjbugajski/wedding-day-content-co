'use client';

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';

import * as LabelPrimitive from '@radix-ui/react-label';

import { cn } from '@/lib/utils';

const Label = forwardRef<ElementRef<typeof LabelPrimitive.Root>, ComponentPropsWithoutRef<typeof LabelPrimitive.Root>>(
  ({ className, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none text-black/75 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white/75',
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
