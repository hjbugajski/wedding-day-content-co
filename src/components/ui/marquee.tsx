'use client';

import type { ComponentProps } from 'react';

import { useRender } from '@base-ui/react/use-render';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const Marquee = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    tabIndex={-1}
    className={cn(
      'group relative flex flex-row gap-8',
      'overflow-x-scroll whitespace-nowrap motion-safe:overflow-x-hidden',
      className,
    )}
    {...props}
  />
);

const marqueeContentVariants = cva('group-hover:paused whitespace-nowrap', {
  variants: {
    speed: {
      slow: 'animate-marquee-slow',
      normal: 'animate-marquee-normal',
      fast: 'animate-marquee-fast',
    },
  },
  defaultVariants: {
    speed: 'normal',
  },
});

export type MarqueeContentProps = ComponentProps<'div'> &
  VariantProps<typeof marqueeContentVariants> & {
    duplicate?: boolean;
    render?: useRender.RenderProp;
  };

const MarqueeContent = ({
  className,
  duplicate = false,
  ref,
  render,
  speed,
  ...props
}: MarqueeContentProps) => {
  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: {
      'aria-hidden': duplicate,
      className: cn(marqueeContentVariants({ speed }), className),
      ...props,
    },
  });
};

const marqueeFadeVariants = cva(
  'pointer-events-none absolute inset-y-0 w-1/6 from-neutral-50 md:w-1/5 dark:from-black',
  {
    variants: {
      side: {
        left: 'left-0 bg-linear-to-r',
        right: 'right-0 bg-linear-to-l',
      },
    },
  },
);

export type MarqueeFadeProps = ComponentProps<'div'> & { side: 'left' | 'right' };

const MarqueeFade = ({ className, side, ...props }: MarqueeFadeProps) => (
  <div className={cn(marqueeFadeVariants({ side }), className)} {...props} />
);

export { Marquee, MarqueeContent, MarqueeFade };
