import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

const OverflowText = ({ className, ...props }: ComponentProps<'span'>) => (
  <span className={cn('overflow-hidden text-ellipsis whitespace-nowrap', className)} {...props} />
);

export { OverflowText };
