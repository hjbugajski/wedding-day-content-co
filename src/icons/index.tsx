import type { ComponentProps, JSX } from 'react';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { IconArrowLeft } from '@/icons/arrow-left';
import { IconArrowRight } from '@/icons/arrow-right';
import { IconArrowUpRight } from '@/icons/arrow-up-right';
import { IconCalendar } from '@/icons/calendar';
import { IconCalendarCheck } from '@/icons/calendar-check';
import { IconCheckmark } from '@/icons/checkmark';
import { IconCircle } from '@/icons/circle';
import { IconInstagram } from '@/icons/instagram';
import { IconMenu } from '@/icons/menu';
import { IconNavArrowDown } from '@/icons/nav-arrow-down';
import { IconNavArrowDownSmall } from '@/icons/nav-arrow-down-small';
import { IconNavArrowLeft } from '@/icons/nav-arrow-left';
import { IconNavArrowRight } from '@/icons/nav-arrow-right';
import { IconNavArrowUp } from '@/icons/nav-arrow-up';
import { IconQuoteSolid } from '@/icons/quote-solid';
import { IconSparkle } from '@/icons/sparkle';
import { IconTikTok } from '@/icons/tiktok';
import { IconXMark } from '@/icons/x-mark';
import type { PayloadIconField } from '@/payload/payload-types';
import { cn } from '@/utils/cn';

type IconName = NonNullable<PayloadIconField>;

type IconFunction = (props: ComponentProps<'svg'>) => JSX.Element;

const icons: Record<IconName, IconFunction> = {
  arrowLeft: IconArrowLeft,
  arrowRight: IconArrowRight,
  arrowUpRight: IconArrowUpRight,
  calendar: IconCalendar,
  calendarCheck: IconCalendarCheck,
  checkmark: IconCheckmark,
  chevronDown: IconNavArrowDown,
  circle: IconCircle,
  instagram: IconInstagram,
  menu: IconMenu,
  navArrowDown: IconNavArrowDown,
  navArrowDownSmall: IconNavArrowDownSmall,
  navArrowLeft: IconNavArrowLeft,
  navArrowRight: IconNavArrowRight,
  navArrowUp: IconNavArrowUp,
  quoteSolid: IconQuoteSolid,
  sparkle: IconSparkle,
  tikTok: IconTikTok,
  x: IconXMark,
};

const iconVariants = cva('shrink-0', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface Props extends Omit<ComponentProps<'svg'>, 'children'>, VariantProps<typeof iconVariants> {
  name: IconName;
}

export function Icons({ className, name, size, ...rest }: Props) {
  const Icon = icons[name];

  return <Icon className={cn(iconVariants({ size }), className)} {...rest} />;
}
