import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { getServerSideUrl } from '@/payload/utils/get-server-side-url';

const saved = {
  server: process.env.NEXT_PUBLIC_SERVER_URL,
  vercel: process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
};

describe('getServerSideUrl', () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SERVER_URL;
    delete process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  });

  afterEach(() => {
    if (saved.server !== undefined) process.env.NEXT_PUBLIC_SERVER_URL = saved.server;
    if (saved.vercel !== undefined)
      process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL = saved.vercel;
  });

  it('returns NEXT_PUBLIC_SERVER_URL when set (takes precedence over Vercel)', () => {
    process.env.NEXT_PUBLIC_SERVER_URL = 'https://site.test';
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL = 'fallback.vercel.app';
    expect(getServerSideUrl()).toBe('https://site.test');
  });

  it('prefixes the Vercel production url with https when SERVER_URL is absent', () => {
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL = 'example.vercel.app';
    expect(getServerSideUrl()).toBe('https://example.vercel.app');
  });

  it('falls back to localhost:3000 when nothing is set', () => {
    expect(getServerSideUrl()).toBe('http://localhost:3000');
  });
});
