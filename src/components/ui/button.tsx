'use client';

import type { ComponentProps } from 'react';

import { useRender } from '@base-ui/react/use-render';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'w-full xs:w-fit',
    'font-semibold uppercase no-underline!',
    'rounded-sm',
    'transition',
    'cursor-pointer focus-ring-input',
    'disabled:cursor-not-allowed disabled:border-y-2 disabled:border-t-neutral-100 disabled:border-b-neutral-300 disabled:bg-neutral-200 disabled:text-neutral-400',
  ],
  {
    variants: {
      variant: {
        primary: [
          'border-y-2 border-t-neutral-600 border-b-neutral-950 bg-neutral-800 text-neutral-100',
          'dark:border-t-dusty-rose-600 dark:border-b-dusty-rose-950 dark:bg-dusty-rose-800 dark:text-dusty-rose-50',
        ],
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
      nativeButton: {
        true: 'hover:enabled:no-underline! hover:enabled:shadow-lg hover:enabled:shadow-neutral-500/10',
        false: 'hover:no-underline! hover:shadow-lg hover:shadow-neutral-500/10',
      },
    },
    compoundVariants: [
      { iconPosition: 'none', size: 'sm', className: 'px-4' },
      { iconPosition: 'none', size: 'md', className: 'px-6' },
      { iconPosition: 'none', size: 'lg', className: 'px-8' },
      { iconPosition: 'left', size: 'sm', className: 'px-4 xs:pr-4 xs:pl-3' },
      { iconPosition: 'left', size: 'md', className: 'px-6 xs:pr-6 xs:pl-5' },
      { iconPosition: 'left', size: 'lg', className: 'px-8 xs:pr-8 xs:pl-7' },
      { iconPosition: 'right', size: 'sm', className: 'px-4 xs:pr-3 xs:pl-4' },
      { iconPosition: 'right', size: 'md', className: 'px-6 xs:pr-5 xs:pl-6' },
      { iconPosition: 'right', size: 'lg', className: 'px-8 xs:pr-7 xs:pl-8' },
      { iconPosition: 'center', size: 'sm', className: 'xs:w-10!' },
      { iconPosition: 'center', size: 'md', className: 'xs:w-12!' },
      { iconPosition: 'center', size: 'lg', className: 'xs:w-14!' },
      {
        variant: 'primary',
        nativeButton: true,
        className: [
          'hover:enabled:bg-neutral-900 hover:enabled:text-neutral-50',
          'dark:hover:enabled:bg-dusty-rose-900 dark:hover:enabled:text-dusty-rose-100',
        ],
      },
      {
        variant: 'primary',
        nativeButton: false,
        className: [
          'hover:bg-neutral-900 hover:text-neutral-50',
          'dark:hover:bg-dusty-rose-900 dark:hover:text-dusty-rose-100',
        ],
      },
      {
        variant: 'secondary',
        nativeButton: true,
        className: 'hover:enabled:bg-neutral-200 hover:enabled:text-black',
      },
      {
        variant: 'secondary',
        nativeButton: false,
        className: 'hover:bg-neutral-200 hover:text-black',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      iconPosition: 'none',
      nativeButton: true,
    },
  },
);

export type ButtonProps = ComponentProps<'button'> &
  Omit<VariantProps<typeof buttonVariants>, 'nativeButton'> & {
    render?: useRender.RenderProp;
  };

const Button = ({ className, iconPosition, ref, render, size, variant, ...props }: ButtonProps) => {
  return useRender({
    defaultTagName: 'button',
    ref,
    render,
    props: {
      className: cn(
        buttonVariants({ variant, size, iconPosition, nativeButton: render === undefined }),
        className,
      ),
      ...props,
    },
  });
};

export { Button };
