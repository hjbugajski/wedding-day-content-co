import { describe, expect, it } from 'vitest';

import { phoneNumberConfig } from '@/components/blocks/form/configs/phone-number';
import type { PayloadPhoneNumberBlock } from '@/payload/payload-types';

const makeMeta = (overrides: Partial<PayloadPhoneNumberBlock> = {}): PayloadPhoneNumberBlock =>
  ({
    blockType: 'phoneNumber',
    name: 'phone',
    label: 'Phone',
    width: 'full',
    required: false,
    ...overrides,
  }) as PayloadPhoneNumberBlock;

describe('phoneNumberConfig.defaultValue', () => {
  it('returns empty string when defaultValue is absent', () => {
    expect(phoneNumberConfig.defaultValue(makeMeta())).toBe('');
  });

  it('returns the provided default value', () => {
    expect(phoneNumberConfig.defaultValue(makeMeta({ defaultValue: '+12024561111' }))).toBe(
      '+12024561111',
    );
  });
});

describe('phoneNumberConfig.schema (required)', () => {
  const schema = () => phoneNumberConfig.schema(makeMeta({ required: true }));

  it('rejects an empty string with the required message', () => {
    const result = schema().safeParse('');
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Field is required');
  });

  it('rejects an invalid phone number', () => {
    const result = schema().safeParse('not-a-phone');
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Must be a valid phone number');
  });

  it('accepts a valid mobile phone number', () => {
    expect(schema().safeParse('+12024561111').success).toBe(true);
  });
});

describe('phoneNumberConfig.schema (optional)', () => {
  const schema = () => phoneNumberConfig.schema(makeMeta({ required: false }));

  it('accepts an empty string', () => {
    expect(schema().safeParse('').success).toBe(true);
  });

  it('rejects an invalid phone number even when optional', () => {
    expect(schema().safeParse('not-a-phone').success).toBe(false);
  });

  it('accepts a valid mobile phone number', () => {
    expect(schema().safeParse('+12024561111').success).toBe(true);
  });
});

describe('phoneNumberConfig.format', () => {
  it('returns the string unchanged', () => {
    expect(phoneNumberConfig.format(makeMeta(), '+12024561111')).toBe('+12024561111');
  });

  it('coerces a non-string value to string', () => {
    expect(phoneNumberConfig.format(makeMeta(), 12024561111 as unknown as string)).toBe(
      '12024561111',
    );
  });
});
