import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';

const { useRowLabel } = vi.hoisted(() => ({ useRowLabel: vi.fn() }));

vi.mock('@payloadcms/ui', () => ({
  useRowLabel,
}));

import { RowLabel } from '@/payload/components/row-label';

describe('RowLabel', () => {
  test('reads a top-level value from data by path', async () => {
    useRowLabel.mockReturnValue({ data: { text: 'Hello' }, rowNumber: 1 });

    const screen = await render(<RowLabel path="text" fallback="Row" />);
    await expect.element(screen.getByText('Hello')).toBeVisible();
  });

  test('reads a nested dotted path', async () => {
    useRowLabel.mockReturnValue({
      data: { link: { text: 'Deep' } },
      rowNumber: 0,
    });

    const screen = await render(<RowLabel path="link.text" fallback="Row" />);
    await expect.element(screen.getByText('Deep')).toBeVisible();
  });

  test('falls back to fallbackPath value when path is empty', async () => {
    useRowLabel.mockReturnValue({ data: { alt: 'From alt' }, rowNumber: 4 });

    const screen = await render(<RowLabel path="missing" fallbackPath="alt" fallback="Row" />);
    await expect.element(screen.getByText('From alt')).toBeVisible();
  });

  test('falls back to "<fallback> <rowNumber>" when nothing resolves', async () => {
    useRowLabel.mockReturnValue({ data: {}, rowNumber: 7 });

    const screen = await render(<RowLabel path="nothing" fallback="Link" />);
    await expect.element(screen.getByText('Link 7')).toBeVisible();
  });
});
