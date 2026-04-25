import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import { checkboxConfig } from '@/components/blocks/form/configs/checkbox';
import type { PayloadCheckboxBlock } from '@/payload/payload-types';
import { FieldHarness } from '@/vitest/field-harness';

const makeMeta = (overrides: Partial<PayloadCheckboxBlock> = {}): PayloadCheckboxBlock =>
  ({
    blockType: 'checkbox',
    id: 'c',
    name: 'v',
    label: 'Perks',
    width: 'full',
    required: true,
    options: [
      { label: 'Photo', value: 'photo' },
      { label: 'Video', value: 'video' },
    ],
    ...overrides,
  }) as PayloadCheckboxBlock;

describe('CheckboxField renderer', () => {
  test('toggles multiple values and submits as an array', async () => {
    const onSubmit = vi.fn();
    const screen = await render(
      <FieldHarness meta={makeMeta()} config={checkboxConfig} onSubmit={onSubmit} />,
    );

    // base-ui's Checkbox renders as <button role="checkbox"> inside a wrapping <label>;
    // the label text isn't the accessible name, so click the visible text instead —
    // the <label> delegates clicks to the contained control.
    await screen.getByText('Photo').click();
    await screen.getByText('Video').click();
    await screen.getByRole('button', { name: 'Submit' }).click();

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(['photo', 'video']);
    });
  });

  test('shows the required error when submitted with nothing checked', async () => {
    const screen = await render(<FieldHarness meta={makeMeta()} config={checkboxConfig} />);

    await screen.getByRole('button', { name: 'Submit' }).click();
    await expect.element(screen.getByText('Field is required').first()).toBeVisible();
  });
});
