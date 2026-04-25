import type { ComponentProps } from 'react';

import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const labelVariants = cva(
  'leading-none subheading text-neutral-600 data-invalid:text-red-700 dark:text-white/75',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

type LabelProps = Omit<ComponentProps<'label'>, 'size'> & VariantProps<typeof labelVariants>;

const Label = ({ className, size, ...props }: LabelProps) => (
  // oxlint-disable-next-line label-has-associated-control -- primitive; consumers wrap it around a control or set htmlFor
  <label className={cn(labelVariants({ size }), className)} {...props} />
);

export { Label };
