import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getServerSideUrl } from '@/payload/utils/get-server-side-url';

describe('getServerSideUrl', () => {
  beforeEach(() => {
    vi.stubEnv('VERCEL_TARGET_ENV', '');
    vi.stubEnv('VERCEL_BRANCH_URL', '');
    vi.stubEnv('NEXT_PUBLIC_DOMAIN', '');
    vi.stubEnv('NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses the per-branch Vercel url on preview deployments', () => {
    vi.stubEnv('VERCEL_TARGET_ENV', 'preview');
    vi.stubEnv('VERCEL_BRANCH_URL', 'app-git-my-branch.vercel.app');
    vi.stubEnv('NEXT_PUBLIC_DOMAIN', 'site.test');
    expect(getServerSideUrl()).toBe('https://app-git-my-branch.vercel.app');
  });

  it('uses the custom domain on production (over the Vercel production url)', () => {
    vi.stubEnv('VERCEL_TARGET_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_DOMAIN', 'site.test');
    vi.stubEnv('NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL', 'fallback.vercel.app');
    expect(getServerSideUrl()).toBe('https://site.test');
  });

  it('falls back to the Vercel production url when no custom domain is set', () => {
    vi.stubEnv('NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL', 'example.vercel.app');
    expect(getServerSideUrl()).toBe('https://example.vercel.app');
  });

  it('falls back to localhost:3000 when nothing is set', () => {
    expect(getServerSideUrl()).toBe('http://localhost:3000');
  });
});
