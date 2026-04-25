import { describe, expect, it } from 'vitest';

import { emailConfig } from '@/components/blocks/form/configs/email';
import type { PayloadEmailBlock } from '@/payload/payload-types';

const makeMeta = (overrides: Partial<PayloadEmailBlock> = {}): PayloadEmailBlock =>
  ({
    blockType: 'email',
    name: 'email',
    label: 'Email',
    width: 'half',
    required: false,
    ...overrides,
  }) as PayloadEmailBlock;

describe('emailConfig.defaultValue', () => {
  it('returns empty string when defaultValue is absent', () => {
    expect(emailConfig.defaultValue(makeMeta())).toBe('');
  });

  it('returns the provided default value', () => {
    expect(emailConfig.defaultValue(makeMeta({ defaultValue: 'ada@example.com' }))).toBe(
      'ada@example.com',
    );
  });
});

describe('emailConfig.schema (required)', () => {
  const schema = () => emailConfig.schema(makeMeta({ required: true }));

  it('rejects empty string', () => {
    expect(schema().safeParse('').success).toBe(false);
  });

  it('rejects a malformed email', () => {
    expect(schema().safeParse('not-an-email').success).toBe(false);
  });

  it('accepts a valid email', () => {
    expect(schema().safeParse('ada@example.com').success).toBe(true);
  });
});

describe('emailConfig.schema (optional)', () => {
  const schema = () => emailConfig.schema(makeMeta({ required: false }));

  it('accepts an empty string', () => {
    expect(schema().safeParse('').success).toBe(true);
  });

  it('rejects a malformed email', () => {
    expect(schema().safeParse('not-an-email').success).toBe(false);
  });

  it('accepts a valid email', () => {
    expect(schema().safeParse('ada@example.com').success).toBe(true);
  });
});

describe('emailConfig.format', () => {
  it('returns the string unchanged', () => {
    expect(emailConfig.format(makeMeta(), 'ada@example.com')).toBe('ada@example.com');
  });

  it('coerces a non-string value to string', () => {
    expect(emailConfig.format(makeMeta(), 42 as unknown as string)).toBe('42');
  });
});
