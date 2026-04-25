import { describe, expect, it } from 'vitest';

import { cn } from '@/utils/cn';

describe('cn', () => {
  it('joins class values', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('respects clsx conditional syntax', () => {
    expect(cn('a', { b: true, c: false }, ['d', 'e'])).toBe('a b d e');
  });

  it('dedupes Tailwind conflicts via twMerge', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('treats subheading as conflicting with font-weight/tracking/text-transform', () => {
    expect(cn('font-bold tracking-wide uppercase', 'subheading')).toBe('subheading');
    expect(cn('subheading', 'font-bold')).toBe('font-bold');
  });

  it('dedupes custom t-shadow group', () => {
    expect(cn('t-shadow-sm', 't-shadow-lg')).toBe('t-shadow-lg');
  });

  it('recognises custom breakpoint prefixes (xxs, xs, md-lg)', () => {
    expect(cn('xxs:p-2', 'xxs:p-4')).toBe('xxs:p-4');
    expect(cn('xs:p-2', 'xs:p-4')).toBe('xs:p-4');
    expect(cn('md-lg:hidden', 'md-lg:block')).toBe('md-lg:block');
  });
});
