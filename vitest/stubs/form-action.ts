import { vi } from 'vitest';

import type { PayloadFormSubmissionsCollection } from '@/payload/payload-types';

export const submitForm = vi.fn(
  async (_form: string, _data: PayloadFormSubmissionsCollection['data']) => ({
    id: 'stub-submission',
  }),
);
