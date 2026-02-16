import { z } from 'zod';

import { REQUIRED_MESSAGE } from '@/components/blocks/form/constants';
import { TextField } from '@/components/blocks/form/fields/text-field';
import type { FieldConfig } from '@/components/blocks/form/types';
import type { PayloadTextBlock } from '@/payload/payload-types';

export const textConfig: FieldConfig<PayloadTextBlock> = {
  defaultValue: (m) => m.defaultValue || '',
  schema: (m) =>
    m.required ? z.string().min(1, { message: REQUIRED_MESSAGE }) : z.string().min(0),
  Renderer: TextField,
  format: (_, v) => String(v),
};
