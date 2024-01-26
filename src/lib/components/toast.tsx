import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';

import * as ToastPrimitives from '@radix-ui/react-toast';
import { type VariantProps, cva } from 'class-variance-authority';
import { Xmark } from 'iconoir-react';

import { cn } from '@/lib/utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = forwardRef<
  ElementRef<typeof ToastPrimitives.Viewport>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn('fixed right-0 top-0 z-[100] flex max-h-screen w-full flex-col p-2 md:max-w-[420px]', className)}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border p-4 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-white text-black border-black/75',
        destructive: 'group destructive group border-red-800 bg-red-100 text-red-800',
        success: 'group success border-green-800 bg-green-100 text-green-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Toast = forwardRef<
  ElementRef<typeof ToastPrimitives.Root>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />;
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastClose = forwardRef<
  ElementRef<typeof ToastPrimitives.Close>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:bg-black/5 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-black/50 group-hover:opacity-100 group-[.destructive]:hover:bg-red-800/10 group-[.success]:hover:bg-green-800/10 group-[.destructive]:focus:ring-red-500/75 group-[.success]:focus:ring-green-500/75',
      className,
    )}
    toast-close=""
    {...props}
  >
    <Xmark className="size-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = forwardRef<
  ElementRef<typeof ToastPrimitives.Title>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn('font-semibold', className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = forwardRef<
  ElementRef<typeof ToastPrimitives.Description>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn('text-base opacity-90', className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = ComponentPropsWithoutRef<typeof Toast>;

export { type ToastProps, ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose };
