const TABBABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function getTabbable(container: HTMLElement | null) {
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('data-focus-guard') && el.offsetParent !== null,
  );
}

export function FocusGuard({ onFocus }: { onFocus: () => void }) {
  return (
    <span
      data-focus-guard=""
      // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      onFocus={onFocus}
      className="pointer-events-none fixed opacity-0 outline-hidden"
    />
  );
}
