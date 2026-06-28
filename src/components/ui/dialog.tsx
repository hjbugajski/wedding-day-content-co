'use client';

import type { ComponentProps } from 'react';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';

import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

const Title = ({ className, ...props }: ComponentProps<typeof BaseDialog.Title>) => (
  <BaseDialog.Title
    className={cn('font-sans text-xl font-medium drop-shadow-lg', className)}
    {...props}
  />
);

const Description = ({ className, ...props }: ComponentProps<typeof BaseDialog.Description>) => (
  <BaseDialog.Description className={cn('text-sm text-neutral-600', className)} {...props} />
);

const Content = ({ className, children, ...props }: ComponentProps<typeof BaseDialog.Popup>) => (
  <BaseDialog.Portal>
    <BaseDialog.Backdrop
      className={cn(
        'fixed inset-0 z-50 bg-neutral-50/25 backdrop-blur-md',
        'transition-opacity duration-300 ease-out',
        'data-ending-style:opacity-0 data-starting-style:opacity-0',
      )}
    />
    <BaseDialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <BaseDialog.Popup
        className={cn(
          'relative flex max-h-[85dvh] w-full max-w-lg flex-col',
          'rounded-xs bg-neutral-50/75 text-neutral-800 shadow-lg ring-2 shadow-neutral-500/10 ring-neutral-200/75 outline-hidden backdrop-blur-lg',
          'transition duration-300 ease-out',
          'data-starting-style:scale-95 data-starting-style:opacity-0',
          'data-ending-style:scale-95 data-ending-style:opacity-0',
          className,
        )}
        {...props}
      >
        <BaseDialog.Close
          aria-label="Close"
          className={cn(
            'absolute top-3 right-3 z-10',
            'inline-flex size-8 items-center justify-center',
            'rounded-xs text-neutral-500',
            'transition-colors hover:bg-neutral-200 hover:text-black',
            'cursor-pointer focus-ring-input',
          )}
        >
          <Icons name="x" className="size-4" />
        </BaseDialog.Close>
        <div className="overflow-y-auto p-6">{children}</div>
      </BaseDialog.Popup>
    </BaseDialog.Viewport>
  </BaseDialog.Portal>
);

export const Dialog = {
  Root: BaseDialog.Root,
  Trigger: BaseDialog.Trigger,
  Close: BaseDialog.Close,
  Content,
  Title,
  Description,
};
