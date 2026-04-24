import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { getClientSideUrl } from '@/payload/utils/get-client-side-url';

// In the node project there is no `window`, so the server-side branches are exercised here.
// The DOM branch is covered implicitly by any browser-mode test that imports this module.

const saved = {
  server: process.env.NEXT_PUBLIC_SERVER_URL,
  vercel: process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
};

describe('getClientSideUrl (no DOM)', () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SERVER_URL;
    delete process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  });

  afterEach(() => {
    if (saved.server !== undefined) process.env.NEXT_PUBLIC_SERVER_URL = saved.server;
    if (saved.vercel !== undefined)
      process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL = saved.vercel;
  });

  it('returns the Vercel production url with https prefix when set', () => {
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL = 'example.vercel.app';
    expect(getClientSideUrl()).toBe('https://example.vercel.app');
  });

  it('falls back to NEXT_PUBLIC_SERVER_URL', () => {
    process.env.NEXT_PUBLIC_SERVER_URL = 'https://site.test';
    expect(getClientSideUrl()).toBe('https://site.test');
  });

  it('returns empty string when nothing is set', () => {
    expect(getClientSideUrl()).toBe('');
  });
});
