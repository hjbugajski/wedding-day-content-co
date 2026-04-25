import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    dedupe: ['react', 'react-dom'],
  },
  test: {
    env: { TZ: 'UTC' },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/**/*.browser.test.{ts,tsx}', 'node_modules/**'],
        },
      },
      {
        extends: true,
        plugins: [react()],
        resolve: {
          alias: [
            // form.action.ts transitively imports payload.config, which pulls Node-only
            // Payload internals (file-type, crypto, etc.) that Vite cannot optimise for
            // the browser. Alias it to a vi.fn() stub so the server graph is never walked.
            {
              find: '@/components/blocks/form/form.action',
              replacement: path.resolve(rootDir, './vitest/stubs/form-action.ts'),
            },
            // next/image and next/link ship as CJS with __esModule=true. Vite's
            // browser interop double-wraps the default export, so `import Image from
            // 'next/image'` resolves to `{default: fn}` (an object) rather than the
            // component. Aliasing to a tiny native wrapper sidesteps the interop.
            {
              find: /^next\/image$/,
              replacement: path.resolve(rootDir, './vitest/stubs/next-image.tsx'),
            },
            {
              find: /^next\/link$/,
              replacement: path.resolve(rootDir, './vitest/stubs/next-link.tsx'),
            },
          ],
        },
        test: {
          name: 'browser',
          include: ['src/**/*.browser.test.{ts,tsx}'],
          setupFiles: ['./vitest/setup.browser.ts'],
          browser: {
            enabled: true,
            // Cast: pnpm resolves @vitest/browser-playwright against its own vitest peer,
            // producing a structurally identical but nominally distinct provider type.
            provider: playwright() as never,
            headless: true,
            screenshotFailures: false,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
