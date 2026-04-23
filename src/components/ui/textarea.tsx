import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

const Textarea = ({ className, ...props }: ComponentProps<'textarea'>) => (
  <textarea
    className={cn('w-full form-field-base p-4 text-neutral-800', className)}
    rows={4}
    {...props}
  />
);

export { Textarea };
