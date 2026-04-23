import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge<'t-shadow' | 'subheading'>({
  extend: {
    theme: {
      breakpoint: ['xxs', 'xs', 'md-lg'],
    },
    classGroups: {
      't-shadow': [{ 't-shadow': ['sm', 'md', 'lg'] }],
      subheading: ['subheading'],
      'font-weight': [
        { font: ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold'] },
      ],
    },
    conflictingClassGroups: {
      subheading: ['font-weight', 'tracking', 'text-transform'],
      'font-weight': ['subheading'],
      tracking: ['subheading'],
      'text-transform': ['subheading'],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
