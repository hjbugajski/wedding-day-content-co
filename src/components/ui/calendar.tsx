'use client';

import type { ComponentProps } from 'react';

import { cva } from 'class-variance-authority';
import { type ChevronProps, type DayButtonProps, DayPicker } from 'react-day-picker';

import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

function Chevron({ orientation }: ChevronProps) {
  switch (orientation) {
    case 'left':
      return <Icons name="navArrowLeft" size="sm" />;
    case 'right':
      return <Icons name="navArrowRight" size="sm" />;
    case 'down':
      return <Icons name="navArrowDownSmall" size="sm" />;
    default:
      return <></>;
  }
}

function CalendarDayButton({ day: _day, modifiers, className, ...props }: DayButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-xs p-0 text-sm font-normal transition',
        'hover:bg-neutral-200 hover:text-black',
        'focus:ring-2 focus:ring-neutral-600/75 focus:outline-hidden',
        'disabled:pointer-events-none',
        modifiers.selected &&
          !modifiers.range_start &&
          !modifiers.range_end &&
          !modifiers.range_middle &&
          'bg-dusty-rose-200 font-medium text-dusty-rose-950 hover:bg-dusty-rose-300',
        modifiers.range_start &&
          modifiers.range_end &&
          'rounded-xs bg-dusty-rose-200 font-medium text-dusty-rose-950 hover:bg-dusty-rose-300',
        modifiers.range_start &&
          !modifiers.range_end &&
          'rounded-l-xs rounded-r-none bg-dusty-rose-200 font-medium text-dusty-rose-950 hover:bg-dusty-rose-300',
        modifiers.range_end &&
          !modifiers.range_start &&
          'rounded-l-none rounded-r-xs bg-dusty-rose-200 font-medium text-dusty-rose-950 hover:bg-dusty-rose-300',
        modifiers.range_middle &&
          'rounded-none bg-dusty-rose-100 font-medium text-dusty-rose-800 hover:bg-dusty-rose-200',
        modifiers.outside && 'font-light text-neutral-600',
        modifiers.outside &&
          modifiers.range_start &&
          'bg-dusty-rose-200 text-dusty-rose-950 hover:bg-dusty-rose-300',
        modifiers.outside &&
          modifiers.range_end &&
          'bg-dusty-rose-200 text-dusty-rose-950 hover:bg-dusty-rose-300',
        modifiers.disabled && 'font-light text-neutral-400',
        modifiers.hidden && 'invisible',
        className,
      )}
      {...props}
    />
  );
}

const navButtonVariants = cva(
  'inline-flex items-center justify-center rounded-xs bg-transparent p-0 transition focus-visible:ring-2 focus-visible:ring-neutral-600/75 focus-visible:outline-hidden',
  {
    variants: {
      size: {
        default: 'h-7 w-7',
      },
      variant: {
        default:
          'text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800 focus-visible:bg-neutral-200 aria-disabled:pointer-events-none aria-disabled:text-neutral-300',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  },
);

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-2', className)}
      classNames={{
        months: 'relative flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-2',
        month_caption: 'flex justify-center h-7 relative items-center',
        caption_label: 'inline-flex items-center ml-1 gap-1 text-sm font-medium',
        nav: 'absolute -top-1 z-10 m-0 flex h-9 w-full items-center justify-between pointer-events-none',
        button_previous: cn(navButtonVariants(), 'pointer-events-auto'),
        button_next: cn(navButtonVariants(), 'pointer-events-auto'),
        month_grid: 'w-full border-collapse space-y-1',
        weekdays: 'flex',
        weekday: 'text-neutral-600 rounded-xs w-9 font-normal text-sm',
        week: 'flex w-full mt-2',
        day: 'h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
        day_button: '',
        dropdowns: 'flex gap-2 items-center',
        dropdown_root:
          'relative inline-flex items-center rounded-xs focus-within:ring-2 focus-visible:ring-neutral-600/75',
        dropdown:
          'absolute inset-0 z-10 opacity-0 cursor-pointer appearance-none border-none bg-transparent text-sm focus:outline-hidden',
        years_dropdown: '',
        months_dropdown: '',
        ...classNames,
      }}
      components={{
        Chevron,
        DayButton: CalendarDayButton,
      }}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
