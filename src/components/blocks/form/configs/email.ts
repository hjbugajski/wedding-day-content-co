import { z } from 'zod';

import { TextField } from '@/components/blocks/form/fields/text-field';
import type { FieldConfig } from '@/components/blocks/form/types';
import type { PayloadEmailBlock } from '@/payload/payload-types';

const requiredSchema = z.email({ message: 'Must be a valid email address' });

const optionalSchema = z.email({ message: 'Must be a valid email address' }).or(z.literal(''));

export const emailConfig: FieldConfig<PayloadEmailBlock> = {
  defaultValue: (m) => m.defaultValue || '',
  schema: (m) => (m.required ? requiredSchema : optionalSchema),
  Renderer: TextField,
  format: (_, v) => String(v),
};
