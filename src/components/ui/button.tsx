import type { ComponentProps } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex w-full cursor-pointer items-center justify-center rounded-sm font-semibold uppercase no-underline! transition focus-visible:ring-2 focus-visible:ring-neutral-400/75 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:border-y-2 disabled:border-t-neutral-100 disabled:border-b-neutral-300 disabled:bg-neutral-200 disabled:text-neutral-400 xs:w-fit',
  {
    variants: {
      variant: {
        primary:
          'border-y-2 border-t-neutral-600 border-b-neutral-950 bg-neutral-800 text-neutral-100 dark:border-t-dusty-rose-600 dark:border-b-dusty-rose-950 dark:bg-dusty-rose-800 dark:text-dusty-rose-50',
        secondary:
          'border-y-2 border-t-neutral-50/75 border-b-neutral-200/75 bg-neutral-100 text-neutral-900',
      },
      size: {
        sm: 'h-10 gap-1.5 text-sm',
        md: 'h-12 gap-2 text-base',
        lg: 'h-14 gap-2.5 text-xl',
      },
      iconPosition: {
        left: 'flex-row-reverse',
        right: 'flex-row',
        center: 'flex-row',
        none: 'flex-row',
      },
      asChild: {
        true: 'hover:no-underline! hover:shadow-lg hover:shadow-neutral-500/10',
        false:
          'hover:enabled:no-underline! hover:enabled:shadow-lg hover:enabled:shadow-neutral-500/10',
      },
      background: {
        default: '',
        dark: '',
      },
    },
    compoundVariants: [
      {
        iconPosition: 'none',
        size: 'sm',
        className: 'px-4',
      },
      {
        iconPosition: 'none',
        size: 'md',
        className: 'px-6',
      },
      {
        iconPosition: 'none',
        size: 'lg',
        className: 'px-8',
      },
      {
        iconPosition: 'left',
        size: 'sm',
        className: 'px-4 xs:pr-4 xs:pl-3',
      },
      {
        iconPosition: 'left',
        size: 'md',
        className: 'px-6 xs:pr-6 xs:pl-5',
      },
      {
        iconPosition: 'left',
        size: 'lg',
        className: 'px-8 xs:pr-8 xs:pl-7',
      },
      {
        iconPosition: 'right',
        size: 'sm',
        className: 'px-4 xs:pr-3 xs:pl-4',
      },
      {
        iconPosition: 'right',
        size: 'md',
        className: 'px-6 xs:pr-5 xs:pl-6',
      },
      {
        iconPosition: 'right',
        size: 'lg',
        className: 'px-8 xs:pr-7 xs:pl-8',
      },
      {
        iconPosition: 'center',
        size: 'sm',
        className: 'xs:w-10!',
      },
      {
        iconPosition: 'center',
        size: 'md',
        className: 'xs:w-12!',
      },
      {
        iconPosition: 'center',
        size: 'lg',
        className: 'xs:w-14!',
      },
      {
        variant: 'primary',
        asChild: true,
        className:
          'hover:bg-neutral-900 hover:text-neutral-50 dark:hover:bg-dusty-rose-900 dark:hover:text-dusty-rose-100',
      },
      {
        variant: 'primary',
        asChild: false,
        className:
          'hover:enabled:bg-neutral-900 hover:enabled:text-neutral-50 dark:hover:enabled:bg-dusty-rose-900 dark:hover:enabled:text-dusty-rose-100',
      },
      {
        variant: 'secondary',
        asChild: true,
        className: 'hover:bg-neutral-200 hover:text-black',
      },
      {
        variant: 'secondary',
        asChild: false,
        className: 'hover:enabled:bg-neutral-200 hover:enabled:text-black',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      iconPosition: 'none',
    },
  },
);

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = ({
  asChild = false,
  background,
  className,
  iconPosition,
  variant,
  size,
  ...props
}: ButtonProps) => {
  const Component = asChild ? Slot : 'button';

  return (
    <Component
      {...props}
      className={cn(
        buttonVariants({ variant, size, iconPosition, asChild, background }),
        className,
      )}
    />
  );
};

export { Button };
