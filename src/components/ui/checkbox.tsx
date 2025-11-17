'use client';

import type { ComponentProps } from 'react';

import { Indicator, Root } from '@radix-ui/react-checkbox';

import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

const Checkbox = ({ className, ...props }: ComponentProps<typeof Root>) => (
  <Root
    className={cn(
      'my-1 size-5 rounded-sm border-2 border-neutral-200/75 text-neutral-800 shadow-sm shadow-black/10 transition hover:border-neutral-600/75 focus-visible:ring-2 focus-visible:ring-neutral-400/75 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-[state="checked"]:border-neutral-800/75 data-[state="checked"]:bg-neutral-800',
      className,
    )}
    {...props}
  >
    <Indicator className="flex items-center justify-center text-white">
      <Icons name="checkmark" className="size-3" />
    </Indicator>
  </Root>
);

export { Checkbox };
