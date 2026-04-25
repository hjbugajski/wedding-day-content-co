import { describe, expect, it } from 'vitest';

import type { PayloadLinkGroupField } from '@/payload/payload-types';
import { internalLink, linkProps } from '@/utils/link';

const page = (url: string) =>
  ({
    breadcrumbs: [{ url }],
  }) as unknown as NonNullable<PayloadLinkGroupField['relationship']>;

const makeLink = (overrides: Partial<PayloadLinkGroupField> = {}): PayloadLinkGroupField => ({
  text: 'Read more',
  type: 'internal',
  ...overrides,
});

describe('internalLink', () => {
  it('returns "/" when the relationship is an unpopulated string id', () => {
    expect(internalLink(makeLink({ relationship: 'abc123' }))).toBe('/');
  });

  it('returns "/" when breadcrumbs are missing', () => {
    expect(internalLink(makeLink({ relationship: {} as never }))).toBe('/');
  });

  it('uses the last breadcrumb url', () => {
    const link = makeLink({
      relationship: {
        breadcrumbs: [{ url: '/parent' }, { url: '/parent/child' }],
      } as never,
    });
    expect(internalLink(link)).toBe('/parent/child');
  });

  it('maps "/home" to "/"', () => {
    expect(internalLink(makeLink({ relationship: page('/home') }))).toBe('/');
  });

  it('appends anchor when present', () => {
    expect(internalLink(makeLink({ relationship: page('/about'), anchor: 'team' }))).toBe(
      '/about#team',
    );
  });
});

describe('linkProps', () => {
  it('resolves internal links via internalLink and slugifies the umami id from text', () => {
    const out = linkProps(makeLink({ text: 'Read More', relationship: page('/about') }));
    expect(out.href).toBe('/about');
    expect(out.target).toBe('_self');
    expect(out['aria-label']).toBe('Read More');
    expect(out['data-umami-event']).toBe('Link');
    expect(out['data-umami-event-id']).toBe('read-more');
    expect(out['data-umami-event-url']).toBe('/about');
  });

  it('uses explicit url for external links', () => {
    const out = linkProps(makeLink({ type: 'external', url: 'https://example.com', newTab: true }));
    expect(out.href).toBe('https://example.com');
    expect(out.target).toBe('_blank');
    expect(out['data-umami-event-url']).toBe('https://example.com');
  });

  it('defaults href to "/" when url is missing on an external link', () => {
    const out = linkProps(makeLink({ type: 'external' }));
    expect(out.href).toBe('/');
  });

  it('joins rel values into a comma-delimited string when present', () => {
    const out = linkProps(
      makeLink({ type: 'external', url: 'https://x', rel: ['noopener', 'noreferrer'] as never }),
    );
    expect(out.rel).toBe('noopener,noreferrer');
  });

  it('omits rel when absent or empty', () => {
    expect('rel' in linkProps(makeLink({ type: 'external', url: 'https://x' }))).toBe(false);
    expect(
      'rel' in linkProps(makeLink({ type: 'external', url: 'https://x', rel: [] as never })),
    ).toBe(false);
  });

  it('prefers explicit umamiEvent/umamiEventId over defaults', () => {
    const out = linkProps(
      makeLink({
        text: 'Shop',
        type: 'external',
        url: 'https://x',
        umamiEvent: 'Purchase',
        umamiEventId: 'purchase-cta',
      }),
    );
    expect(out['data-umami-event']).toBe('Purchase');
    expect(out['data-umami-event-id']).toBe('purchase-cta');
  });
});
