import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import { selectConfig } from '@/components/blocks/form/configs/select';
import type { PayloadSelectBlock } from '@/payload/payload-types';
import { FieldHarness } from '@/vitest/field-harness';

const makeMeta = (overrides: Partial<PayloadSelectBlock> = {}): PayloadSelectBlock =>
  ({
    blockType: 'select',
    id: 's',
    name: 'v',
    label: 'Package',
    width: 'full',
    required: true,
    options: [
      { label: 'Starter', value: 'starter' },
      { label: 'Pro', value: 'pro' },
    ],
    ...overrides,
  }) as PayloadSelectBlock;

describe('SelectField renderer', () => {
  test('opens options, selects one, and submits its value', async () => {
    const onSubmit = vi.fn();
    const screen = await render(
      <FieldHarness meta={makeMeta()} config={selectConfig} onSubmit={onSubmit} />,
    );

    await screen.getByRole('combobox').click();
    await screen.getByRole('option', { name: 'Pro' }).click();
    await screen.getByRole('button', { name: 'Submit' }).click();

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('pro');
    });
  });

  test('shows the required error when submitted with nothing selected', async () => {
    const screen = await render(<FieldHarness meta={makeMeta()} config={selectConfig} />);

    await screen.getByRole('button', { name: 'Submit' }).click();
    await expect.element(screen.getByText('Field is required').first()).toBeVisible();
  });
});
