import '@/app/(site)/globals.css';

// The browser has no `process` global. A few shared modules (EnvBanner,
// get-*-url) read `process.env.*` at render time; shim an empty env so those
// lookups return undefined. (Note: Vite often inlines these reads at build
// time anyway, so runtime stubbing is only useful in limited cases.)
if (typeof (globalThis as { process?: unknown }).process === 'undefined') {
  (globalThis as unknown as { process: { env: Record<string, string | undefined> } }).process = {
    env: {},
  };
}
