'use client';

import type { ComponentProps } from 'react';

import { Indicator, Item, Root } from '@radix-ui/react-radio-group';

import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

const RadioGroup = ({ className, ...props }: ComponentProps<typeof Root>) => (
  <Root className={cn('flex flex-col gap-2', className)} {...props} />
);

const RadioGroupItem = ({ className, ...props }: ComponentProps<typeof Item>) => (
  <Item
    className={cn(
      'my-1 aspect-square size-5 rounded-full border-2 border-neutral-300/60 text-neutral-800 shadow-md shadow-neutral-500/5 transition hover:border-neutral-500/60 focus-visible:ring-2 focus-visible:ring-neutral-400/75 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-[state="checked"]:border-neutral-800/75',
      className,
    )}
    {...props}
  >
    <Indicator className="flex items-center justify-center">
      <Icons name="circle" className="size-3 fill-current text-current" />
    </Indicator>
  </Item>
);

export { RadioGroup, RadioGroupItem };
