import { z } from 'zod';

import { REQUIRED_MESSAGE } from '@/components/blocks/form/constants';
import { CheckboxField } from '@/components/blocks/form/fields/checkbox-field';
import type { FieldConfig } from '@/components/blocks/form/types';
import type { PayloadCheckboxBlock } from '@/payload/payload-types';

export const checkboxConfig: FieldConfig<PayloadCheckboxBlock> = {
  defaultValue: (m) => m.defaultValue || '',
  schema: (m) =>
    m.required ? z.string().min(1, { message: REQUIRED_MESSAGE }) : z.string().min(0),
  Renderer: CheckboxField,
  format: (m, v) => {
    if (!v || typeof v !== 'string') {
      return '';
    }

    const values = v.split(',');
    const labels = values
      .map((val) => {
        const option = m.options.find((o) => o.value === val);
        return option?.label;
      })
      .filter(Boolean);

    return labels.join(', ');
  },
};
