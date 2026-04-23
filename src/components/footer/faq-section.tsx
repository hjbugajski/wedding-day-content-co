import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';
import { slugify } from '@/utils/slugify';

export function FooterSection({ children, heading }: { children: ReactNode; heading: string }) {
  return (
    <div
      className={cn([
        'grid grid-cols-1 gap-12 md:grid-cols-2',
        'border-t-2 border-neutral-200/75 pt-12 pb-16',
        'first:border-t-0 first:pt-0 last:pb-0',
      ])}
    >
      <h1 id={slugify(heading)} className="text-4xl text-wrap-balance xs:text-5xl">
        {heading}
      </h1>
      {children}
    </div>
  );
}
