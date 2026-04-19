'use client';

import { Toast } from '@base-ui/react/toast';

import { IconCheckmark } from '@/icons/checkmark';
import { IconExclamationCircle } from '@/icons/exclamation-circle';
import { IconXMark } from '@/icons/x-mark';
import { cn } from '@/utils/cn';

const toast = Toast.createToastManager();

const SWIPE_DIRECTIONS: ('right' | 'down')[] = ['right', 'down'];

const TypeIcon = ({ type }: { type?: string }) => {
  if (type === 'success') {
    return <IconCheckmark className="size-5 shrink-0 text-emerald-700" />;
  }

  if (type === 'error') {
    return <IconExclamationCircle className="size-5 shrink-0 text-red-700" />;
  }

  return null;
};

const ToastList = () => {
  const { toasts } = Toast.useToastManager();

  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      swipeDirection={SWIPE_DIRECTIONS}
      className={cn(
        'absolute right-0 bottom-0 left-auto w-full rounded-sm border-2 border-neutral-300/60 bg-neutral-50/95 text-black shadow-lg shadow-neutral-500/10 outline-hidden backdrop-blur-lg',
        'transition-[transform,opacity] duration-300 ease-out',
        'z-[calc(1000-var(--toast-index))]',
        'transform-[translateY(calc(var(--toast-index)*-10px))_scale(calc(1-(var(--toast-index)*0.05)))]',
        'data-expanded:transform-[translateX(var(--toast-swipe-movement-x,0px))_translateY(calc((var(--toast-offset-y,0px)*-1)+var(--toast-swipe-movement-y,0px)-(var(--toast-index)*8px)))_scale(1)]',
        'data-swiping:transition-none',
        'data-limited:opacity-0',
        'data-starting-style:transform-[translateY(calc(100%+1rem))] data-starting-style:opacity-0',
        'data-ending-style:opacity-0',
        'data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))]',
        'data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]',
      )}
    >
      <Toast.Content
        className={cn(
          'flex items-start gap-3 overflow-hidden p-4 transition-opacity duration-200',
          '[&[data-behind]:not([data-expanded])]:opacity-0',
        )}
      >
        <TypeIcon type={toast.type} />
        <Toast.Description className="flex-1 text-sm font-medium" />
        <Toast.Close
          aria-label="Close"
          className="inline-flex size-5 shrink-0 items-center justify-center rounded-xs text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-black focus-visible:ring-2 focus-visible:ring-black/75 focus-visible:outline-hidden"
        >
          <IconXMark className="size-4" />
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
};

const Toasts = () => (
  <Toast.Provider toastManager={toast}>
    <Toast.Portal>
      <Toast.Viewport className="fixed right-4 bottom-4 z-50 flex w-89 max-w-[calc(100%-2rem)] flex-col outline-hidden">
        <ToastList />
      </Toast.Viewport>
    </Toast.Portal>
  </Toast.Provider>
);

export { Toasts, toast };
