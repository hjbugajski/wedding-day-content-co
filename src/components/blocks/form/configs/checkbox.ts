import { z } from 'zod';

import { REQUIRED_MESSAGE } from '@/components/blocks/form/constants';
import { CheckboxField } from '@/components/blocks/form/fields/checkbox-field';
import type { FieldConfig } from '@/components/blocks/form/types';
import type { PayloadCheckboxBlock } from '@/payload/payload-types';

export const checkboxConfig: FieldConfig<PayloadCheckboxBlock> = {
  defaultValue: (m) =>
    m.defaultValue
      ? m.defaultValue
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
      : [],
  schema: (m) =>
    m.required ? z.array(z.string()).min(1, { message: REQUIRED_MESSAGE }) : z.array(z.string()),
  Renderer: CheckboxField,
  format: (m, v) => {
    if (!Array.isArray(v)) {
      return '';
    }

    const labels = v.map((val) => m.options.find((o) => o.value === val)?.label).filter(Boolean);

    return labels.join(', ');
  },
};
