import { describe, expect, it } from 'vitest';

import { radioConfig } from '@/components/blocks/form/configs/radio';
import type { PayloadRadioBlock } from '@/payload/payload-types';

const makeMeta = (overrides: Partial<PayloadRadioBlock> = {}): PayloadRadioBlock =>
  ({
    blockType: 'radio',
    name: 'tier',
    label: 'Tier',
    width: 'full',
    required: false,
    options: [
      { label: 'Essential', value: 'essential' },
      { label: 'Signature', value: 'signature' },
    ],
    ...overrides,
  }) as PayloadRadioBlock;

describe('radioConfig', () => {
  it('defaultValue returns empty string when absent', () => {
    expect(radioConfig.defaultValue(makeMeta())).toBe('');
  });

  it('defaultValue returns the provided default', () => {
    expect(radioConfig.defaultValue(makeMeta({ defaultValue: 'essential' }))).toBe('essential');
  });

  it('required schema rejects empty', () => {
    expect(radioConfig.schema(makeMeta({ required: true })).safeParse('').success).toBe(false);
  });

  it('optional schema accepts empty', () => {
    expect(radioConfig.schema(makeMeta()).safeParse('').success).toBe(true);
  });

  it('format returns the matched option label', () => {
    expect(radioConfig.format(makeMeta(), 'essential')).toBe('Essential');
    expect(radioConfig.format(makeMeta(), 'signature')).toBe('Signature');
  });

  it('format returns empty string when no option matches', () => {
    expect(radioConfig.format(makeMeta(), 'unknown')).toBe('');
    expect(radioConfig.format(makeMeta(), '')).toBe('');
  });
});
