import { z } from 'zod';

import { REQUIRED_MESSAGE } from '@/components/blocks/form/constants';
import { DateField } from '@/components/blocks/form/fields/date-field';
import type { FieldConfig } from '@/components/blocks/form/types';
import type { PayloadDateBlock } from '@/payload/payload-types';
import { formatDateShort } from '@/utils/format-date';

const defaultValue: FieldConfig<PayloadDateBlock>['defaultValue'] = (m) => {
  switch (m.mode) {
    case 'single':
      return m.defaultDateValue ? new Date(m.defaultDateValue) : undefined;
    case 'multiple':
      return m.defaultDateValues?.length
        ? m.defaultDateValues.filter((v) => !!v.value).map((v) => new Date(v.value!))
        : [];
    case 'range':
      return {
        ...(m.defaultDateFromValue ? { from: new Date(m.defaultDateFromValue) } : {}),
        ...(m.defaultDateToValue ? { to: new Date(m.defaultDateToValue) } : {}),
      };
  }
};

const schema: FieldConfig<PayloadDateBlock>['schema'] = (m) => {
  switch (m.mode) {
    case 'single':
      return m.required ? z.date({ message: REQUIRED_MESSAGE }) : z.date().optional();
    case 'multiple':
      return m.required
        ? z.date().array().min(1, { message: REQUIRED_MESSAGE })
        : z.date().array().optional();
    case 'range':
      return z.object({
        from: m.required ? z.date({ message: REQUIRED_MESSAGE }) : z.date().optional(),
        to: z.date().optional(),
      });
  }
};

const format: FieldConfig<PayloadDateBlock>['format'] = (m, v) => {
  switch (m.mode) {
    case 'multiple':
      return (v as Date[]).map((d) => formatDateShort(d)).join('; ');
    case 'range': {
      const { from, to } = v as { from?: Date; to?: Date };

      return `${formatDateShort(from)}${to ? ` – ${formatDateShort(to)}` : ''}`.trim();
    }
    default:
      return formatDateShort(v as Date);
  }
};

export const dateConfig: FieldConfig<PayloadDateBlock> = {
  defaultValue,
  schema,
  Renderer: DateField,
  format,
};
