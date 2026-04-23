'use client';

import type { ComponentProps } from 'react';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';

import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

const CheckboxGroup = ({ className, ...props }: ComponentProps<typeof BaseCheckboxGroup>) => (
  <BaseCheckboxGroup className={cn('flex flex-col gap-2', className)} {...props} />
);

const Checkbox = ({ className, ...props }: ComponentProps<typeof BaseCheckbox.Root>) => (
  <BaseCheckbox.Root
    className={cn(
      'my-1 size-5 shrink-0',
      'form-field-frame rounded-sm text-neutral-800',
      'data-checked:border-neutral-800/75 data-checked:bg-neutral-800',
      className,
    )}
    {...props}
  >
    <BaseCheckbox.Indicator
      keepMounted
      className={cn([
        'flex h-full w-full items-center justify-center',
        'text-white opacity-0',
        'transition-opacity duration-150',
        'data-checked:opacity-100',
      ])}
    >
      <Icons name="checkmark" className="size-3" />
    </BaseCheckbox.Indicator>
  </BaseCheckbox.Root>
);

export { Checkbox, CheckboxGroup };
