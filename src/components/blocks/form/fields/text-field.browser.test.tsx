import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import { textConfig } from '@/components/blocks/form/configs/text';
import type { PayloadTextBlock } from '@/payload/payload-types';
import { FieldHarness } from '@/vitest/field-harness';

const makeMeta = (overrides: Partial<PayloadTextBlock> = {}): PayloadTextBlock =>
  ({
    blockType: 'text',
    id: 't',
    name: 'v',
    label: 'First Name',
    width: 'full',
    required: true,
    ...overrides,
  }) as PayloadTextBlock;

describe('TextField renderer', () => {
  test('types text into the labelled input and submits the value', async () => {
    const onSubmit = vi.fn();
    const screen = await render(
      <FieldHarness meta={makeMeta()} config={textConfig} onSubmit={onSubmit} />,
    );

    await screen.getByLabelText('First Name').fill('Ada');
    await screen.getByRole('button', { name: 'Submit' }).click();

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('Ada');
    });
  });

  test('shows the required error when submitted empty', async () => {
    const screen = await render(<FieldHarness meta={makeMeta()} config={textConfig} />);

    await screen.getByRole('button', { name: 'Submit' }).click();
    await expect.element(screen.getByText('Field is required').first()).toBeVisible();
  });
});
