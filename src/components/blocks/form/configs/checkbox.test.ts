import { describe, expect, it } from 'vitest';

import { checkboxConfig } from '@/components/blocks/form/configs/checkbox';
import type { PayloadCheckboxBlock } from '@/payload/payload-types';

const makeMeta = (overrides: Partial<PayloadCheckboxBlock> = {}): PayloadCheckboxBlock =>
  ({
    blockType: 'checkbox',
    name: 'perks',
    label: 'Perks',
    width: 'full',
    required: false,
    options: [
      { label: 'Photo', value: 'photo' },
      { label: 'Video', value: 'video' },
      { label: 'Drone', value: 'drone' },
    ],
    ...overrides,
  }) as PayloadCheckboxBlock;

describe('checkboxConfig.defaultValue', () => {
  it('returns empty array when defaultValue is absent', () => {
    expect(checkboxConfig.defaultValue(makeMeta())).toEqual([]);
  });

  it('splits comma-delimited defaults and trims whitespace', () => {
    expect(checkboxConfig.defaultValue(makeMeta({ defaultValue: 'photo, video , drone' }))).toEqual(
      ['photo', 'video', 'drone'],
    );
  });

  it('filters out empty entries from trailing/duplicate commas', () => {
    expect(checkboxConfig.defaultValue(makeMeta({ defaultValue: 'photo,,video, ,' }))).toEqual([
      'photo',
      'video',
    ]);
  });
});

describe('checkboxConfig.schema', () => {
  it('required schema rejects an empty array', () => {
    const result = checkboxConfig.schema(makeMeta({ required: true })).safeParse([]);
    expect(result.success).toBe(false);
  });

  it('required schema accepts a non-empty array of strings', () => {
    expect(checkboxConfig.schema(makeMeta({ required: true })).safeParse(['photo']).success).toBe(
      true,
    );
  });

  it('optional schema accepts an empty array', () => {
    expect(checkboxConfig.schema(makeMeta()).safeParse([]).success).toBe(true);
  });
});

describe('checkboxConfig.format', () => {
  it('maps values to their labels joined by ", "', () => {
    expect(checkboxConfig.format(makeMeta(), ['photo', 'drone'])).toBe('Photo, Drone');
  });

  it('drops values without a matching option', () => {
    expect(checkboxConfig.format(makeMeta(), ['photo', 'unknown'])).toBe('Photo');
  });

  it('returns empty string when value is not an array', () => {
    expect(checkboxConfig.format(makeMeta(), 'photo' as unknown as string[])).toBe('');
    expect(checkboxConfig.format(makeMeta(), undefined as unknown as string[])).toBe('');
  });
});
