'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import { Dialog } from '@/components/ui/dialog';
import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

interface QuoteCardProps {
  client: string;
  children: ReactNode;
}

export function QuoteCard({ client, children }: QuoteCardProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = bodyRef.current;

    if (!el) {
      return;
    }

    const check = () => setOverflowing(el.scrollHeight > el.clientHeight + 1);

    check();

    const resizeObserver = new ResizeObserver(check);

    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <Dialog.Root>
      <blockquote
        className={cn(
          'flex h-80 w-full flex-col gap-4 overflow-hidden',
          'p-4',
          'rounded-sm bg-neutral-100/75 surface-card dark:bg-neutral-900',
        )}
      >
        <Icons
          name="quoteSolid"
          aria-hidden
          className="size-12 shrink-0 self-center drop-shadow-lg dark:text-neutral-300"
        />
        <div ref={bodyRef} className="relative grow overflow-hidden text-lg">
          {children}
          {overflowing && (
            <Dialog.Trigger
              className={cn(
                'absolute inset-x-0 bottom-0 flex items-end justify-center',
                'pt-12 pb-1',
                'text-sm font-medium text-neutral-600 dark:text-neutral-400',
                'bg-linear-to-t from-neutral-100 from-30% to-transparent dark:from-neutral-900',
                'cursor-pointer focus-ring-input',
              )}
            >
              Read more
            </Dialog.Trigger>
          )}
        </div>
        <div className="shrink-0 text-xl font-medium drop-shadow-lg dark:text-neutral-300">
          {client}
        </div>
      </blockquote>
      {overflowing && (
        <Dialog.Content>
          <div className="flex flex-col gap-4">
            <Icons name="quoteSolid" aria-hidden className="size-12 self-center drop-shadow-lg" />
            <div className="text-lg">{children}</div>
            <Dialog.Title>{client}</Dialog.Title>
          </div>
        </Dialog.Content>
      )}
    </Dialog.Root>
  );
}
