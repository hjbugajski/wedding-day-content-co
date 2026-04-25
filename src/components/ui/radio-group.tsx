'use client';

import type { ComponentProps } from 'react';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';

import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

const RadioGroup = ({ className, ...props }: BaseRadioGroup.Props<string>) => (
  <BaseRadioGroup<string> className={cn('flex flex-col gap-2', className)} {...props} />
);

const RadioGroupItem = ({ className, ...props }: ComponentProps<typeof Radio.Root>) => (
  <Radio.Root
    className={cn(
      'my-1 flex aspect-square size-5 items-center justify-center',
      'form-field-frame rounded-full text-neutral-800',
      'data-checked:border-neutral-800/75',
      className,
    )}
    {...props}
  >
    <Radio.Indicator
      keepMounted
      className={cn([
        'flex items-center justify-center',
        'transition-opacity duration-150',
        'data-unchecked:opacity-0',
        'data-ending-style:opacity-0 data-starting-style:opacity-0',
      ])}
    >
      <Icons name="circle" className="size-3 fill-current text-current" />
    </Radio.Indicator>
  </Radio.Root>
);

export { RadioGroup, RadioGroupItem };
