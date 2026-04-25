import type { ComponentProps } from 'react';

import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const textareaVariants = cva(
  'w-full form-field-frame rounded-sm bg-neutral-50 text-neutral-800 placeholder:text-neutral-500 hover:bg-neutral-100',
  {
    variants: {
      size: {
        sm: 'p-3 text-sm',
        md: 'p-4 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

type TextareaProps = Omit<ComponentProps<'textarea'>, 'size'> &
  VariantProps<typeof textareaVariants>;

const Textarea = ({ className, size, ...props }: TextareaProps) => (
  <textarea className={cn(textareaVariants({ size }), className)} rows={4} {...props} />
);

export { Textarea };
