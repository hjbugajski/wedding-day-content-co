import { describe, expect, it } from 'vitest';

import { selectConfig } from '@/components/blocks/form/configs/select';
import type { PayloadSelectBlock } from '@/payload/payload-types';

const makeMeta = (overrides: Partial<PayloadSelectBlock> = {}): PayloadSelectBlock =>
  ({
    blockType: 'select',
    name: 'package',
    label: 'Package',
    width: 'full',
    required: false,
    options: [
      { label: 'Starter', value: 'starter' },
      { label: 'Pro', value: 'pro' },
    ],
    ...overrides,
  }) as PayloadSelectBlock;

describe('selectConfig', () => {
  it('defaultValue returns empty string when absent', () => {
    expect(selectConfig.defaultValue(makeMeta())).toBe('');
  });

  it('defaultValue returns the provided default', () => {
    expect(selectConfig.defaultValue(makeMeta({ defaultValue: 'pro' }))).toBe('pro');
  });

  it('required schema rejects empty', () => {
    expect(selectConfig.schema(makeMeta({ required: true })).safeParse('').success).toBe(false);
  });

  it('optional schema accepts empty', () => {
    expect(selectConfig.schema(makeMeta()).safeParse('').success).toBe(true);
  });

  it('format returns the matched option label', () => {
    expect(selectConfig.format(makeMeta(), 'starter')).toBe('Starter');
  });

  it('format returns empty string when no option matches', () => {
    expect(selectConfig.format(makeMeta(), 'missing')).toBe('');
  });
});
