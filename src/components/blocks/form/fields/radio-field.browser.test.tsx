import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import { radioConfig } from '@/components/blocks/form/configs/radio';
import type { PayloadRadioBlock } from '@/payload/payload-types';
import { FieldHarness } from '@/vitest/field-harness';

const makeMeta = (overrides: Partial<PayloadRadioBlock> = {}): PayloadRadioBlock =>
  ({
    blockType: 'radio',
    id: 'r',
    name: 'v',
    label: 'Tier',
    width: 'full',
    required: true,
    options: [
      { label: 'Essential', value: 'essential' },
      { label: 'Signature', value: 'signature' },
    ],
    ...overrides,
  }) as PayloadRadioBlock;

describe('RadioField renderer', () => {
  test('selects one option and submits its value', async () => {
    const onSubmit = vi.fn();
    const screen = await render(
      <FieldHarness meta={makeMeta()} config={radioConfig} onSubmit={onSubmit} />,
    );

    await screen.getByText('Signature').click();
    await screen.getByRole('button', { name: 'Submit' }).click();

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('signature');
    });
  });

  test('shows the required error when submitted empty', async () => {
    const screen = await render(<FieldHarness meta={makeMeta()} config={radioConfig} />);

    await screen.getByRole('button', { name: 'Submit' }).click();
    await expect.element(screen.getByText('Field is required').first()).toBeVisible();
  });
});
