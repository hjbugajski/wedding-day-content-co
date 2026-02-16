import { isMobilePhone } from 'validator';
import { z } from 'zod';

import { REQUIRED_MESSAGE } from '@/components/blocks/form/constants';
import { TextField } from '@/components/blocks/form/fields/text-field';
import type { FieldConfig } from '@/components/blocks/form/types';
import type { PayloadPhoneNumberBlock } from '@/payload/payload-types';

const requiredSchema = z
  .string()
  .min(1, { message: REQUIRED_MESSAGE })
  .refine((arg) => isMobilePhone(arg), {
    message: 'Must be a valid phone number',
  });

const optionalSchema = z
  .string()
  .min(0)
  .refine((arg) => arg === '' || isMobilePhone(arg), {
    message: 'Must be a valid phone number',
  });

export const phoneNumberConfig: FieldConfig<PayloadPhoneNumberBlock> = {
  defaultValue: (m) => m.defaultValue || '',
  schema: (m) => (m.required ? requiredSchema : optionalSchema),
  Renderer: TextField,
  format: (_, v) => String(v),
};
