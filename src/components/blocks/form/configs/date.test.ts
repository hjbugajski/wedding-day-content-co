import { describe, expect, it } from 'vitest';

import { dateConfig } from '@/components/blocks/form/configs/date';
import type { PayloadDateBlock } from '@/payload/payload-types';

const makeMeta = (overrides: Partial<PayloadDateBlock> = {}): PayloadDateBlock =>
  ({
    blockType: 'date',
    name: 'date',
    label: 'Date',
    width: 'full',
    required: false,
    mode: 'single',
    allowedDates: 'any',
    ...overrides,
  }) as PayloadDateBlock;

describe('dateConfig.defaultValue', () => {
  it('single: returns undefined when no default is configured', () => {
    expect(dateConfig.defaultValue(makeMeta())).toBeUndefined();
  });

  it('single: returns a Date when defaultDateValue is set', () => {
    const v = dateConfig.defaultValue(makeMeta({ defaultDateValue: '2025-06-01' })) as Date;
    expect(v).toBeInstanceOf(Date);
    expect(v.toISOString().slice(0, 10)).toBe('2025-06-01');
  });

  it('multiple: returns empty array when list is absent', () => {
    expect(dateConfig.defaultValue(makeMeta({ mode: 'multiple' }))).toEqual([]);
  });

  it('multiple: maps non-empty entries to Date instances and filters blanks', () => {
    const v = dateConfig.defaultValue(
      makeMeta({
        mode: 'multiple',
        defaultDateValues: [{ value: '2025-06-01' }, { value: null }, { value: '2025-06-05' }],
      }),
    ) as Date[];
    expect(v).toHaveLength(2);
    expect(v.every((d) => d instanceof Date)).toBe(true);
  });

  it('range: returns only the keys that have values', () => {
    expect(
      dateConfig.defaultValue(makeMeta({ mode: 'range', defaultDateFromValue: '2025-06-01' })),
    ).toMatchObject({ from: expect.any(Date) });
    expect(dateConfig.defaultValue(makeMeta({ mode: 'range' }))).toEqual({});
  });
});

describe('dateConfig.schema', () => {
  it('single required rejects undefined with required message', () => {
    const result = dateConfig.schema(makeMeta({ required: true })).safeParse(undefined);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Field is required');
  });

  it('single optional accepts undefined', () => {
    expect(dateConfig.schema(makeMeta()).safeParse(undefined).success).toBe(true);
  });

  it('multiple required rejects an empty array', () => {
    const s = dateConfig.schema(makeMeta({ mode: 'multiple', required: true }));
    expect(s.safeParse([]).success).toBe(false);
  });

  it('multiple required accepts a non-empty array of dates', () => {
    const s = dateConfig.schema(makeMeta({ mode: 'multiple', required: true }));
    expect(s.safeParse([new Date()]).success).toBe(true);
  });

  it('range required requires `from`, `to` is always optional', () => {
    const s = dateConfig.schema(makeMeta({ mode: 'range', required: true }));
    expect(s.safeParse({}).success).toBe(false);
    expect(s.safeParse({ from: new Date() }).success).toBe(true);
    expect(s.safeParse({ from: new Date(), to: new Date() }).success).toBe(true);
  });
});

describe('dateConfig.format', () => {
  it('single: formats a Date in en-US short form', () => {
    expect(dateConfig.format(makeMeta(), new Date(2025, 0, 5))).toBe('Jan 5, 2025');
  });

  it('multiple: joins formatted dates with "; "', () => {
    const dates = [new Date(2025, 0, 5), new Date(2025, 0, 6)];
    expect(dateConfig.format(makeMeta({ mode: 'multiple' }), dates)).toBe(
      'Jan 5, 2025; Jan 6, 2025',
    );
  });

  it('range: renders "from" alone when "to" is absent', () => {
    expect(dateConfig.format(makeMeta({ mode: 'range' }), { from: new Date(2025, 0, 5) })).toBe(
      'Jan 5, 2025',
    );
  });

  it('range: renders "from – to" when both are present', () => {
    expect(
      dateConfig.format(makeMeta({ mode: 'range' }), {
        from: new Date(2025, 0, 5),
        to: new Date(2025, 0, 10),
      }),
    ).toBe('Jan 5, 2025 – Jan 10, 2025');
  });
});
