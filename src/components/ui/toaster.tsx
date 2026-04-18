'use client';

import type { ComponentProps } from 'react';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="light"
    className="toaster group"
    toastOptions={{
      classNames: {
        toast:
          'group toast group-[.toaster]:bg-neutral-50/75 group-[.toaster]:text-black group-[.toaster]:border-2 group-[.toaster]:border-neutral-300/60 group-[.toaster]:shadow-lg group-[.toaster]:shadow-neutral-500/10 group-[.toaster]:backdrop-blur-lg group-[.toaster]:rounded-sm',
      },
    }}
    {...props}
  />
);

export { Toaster };
