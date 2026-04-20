'use client';

import type { ComponentProps } from 'react';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';

import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

const RadioGroup = ({ className, ...props }: ComponentProps<typeof BaseRadioGroup>) => (
  <BaseRadioGroup className={cn('flex flex-col gap-2', className)} {...props} />
);

const RadioGroupItem = ({ className, ...props }: ComponentProps<typeof Radio.Root>) => (
  <Radio.Root
    className={cn(
      'my-1 flex aspect-square size-5 items-center justify-center rounded-full border-2 border-neutral-300/60 text-neutral-800 shadow-md shadow-neutral-500/5 transition hover:border-neutral-500/60 focus-visible:ring-2 focus-visible:ring-neutral-400/75 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-checked:border-neutral-800/75',
      className,
    )}
    {...props}
  >
    <Radio.Indicator
      keepMounted
      className="flex items-center justify-center opacity-0 transition-opacity duration-150 data-checked:opacity-100"
    >
      <Icons name="circle" className="size-3 fill-current text-current" />
    </Radio.Indicator>
  </Radio.Root>
);

export { RadioGroup, RadioGroupItem };
