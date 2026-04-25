import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getServerSideUrl } from '@/payload/utils/get-server-side-url';

describe('getServerSideUrl', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', '');
    vi.stubEnv('NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns NEXT_PUBLIC_SERVER_URL when set (takes precedence over Vercel)', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://site.test');
    vi.stubEnv('NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL', 'fallback.vercel.app');
    expect(getServerSideUrl()).toBe('https://site.test');
  });

  it('prefixes the Vercel production url with https when SERVER_URL is absent', () => {
    vi.stubEnv('NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL', 'example.vercel.app');
    expect(getServerSideUrl()).toBe('https://example.vercel.app');
  });

  it('falls back to localhost:3000 when nothing is set', () => {
    expect(getServerSideUrl()).toBe('http://localhost:3000');
  });
});
