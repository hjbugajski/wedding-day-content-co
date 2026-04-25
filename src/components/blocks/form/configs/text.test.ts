import { describe, expect, it } from 'vitest';

import { textConfig } from '@/components/blocks/form/configs/text';
import type { PayloadTextBlock } from '@/payload/payload-types';

const makeMeta = (overrides: Partial<PayloadTextBlock> = {}): PayloadTextBlock =>
  ({
    blockType: 'text',
    name: 'firstName',
    label: 'First Name',
    width: 'half',
    required: false,
    ...overrides,
  }) as PayloadTextBlock;

describe('textConfig.defaultValue', () => {
  it('returns empty string when defaultValue is absent', () => {
    expect(textConfig.defaultValue(makeMeta())).toBe('');
  });

  it('returns the provided default value', () => {
    expect(textConfig.defaultValue(makeMeta({ defaultValue: 'Ada' }))).toBe('Ada');
  });
});

describe('textConfig.schema', () => {
  it('required: rejects empty string with required message', () => {
    const res = textConfig.schema(makeMeta({ required: true })).safeParse('');
    expect(res.success).toBe(false);
    expect(res.error?.issues[0]?.message).toBe('Field is required');
  });

  it('required: accepts a non-empty string', () => {
    expect(textConfig.schema(makeMeta({ required: true })).safeParse('hi').success).toBe(true);
  });

  it('optional: accepts an empty string', () => {
    expect(textConfig.schema(makeMeta()).safeParse('').success).toBe(true);
  });
});

describe('textConfig.format', () => {
  it('returns the string unchanged', () => {
    expect(textConfig.format(makeMeta(), 'Ada')).toBe('Ada');
  });

  it('coerces a non-string value to string', () => {
    expect(textConfig.format(makeMeta(), 42 as unknown as string)).toBe('42');
  });
});
