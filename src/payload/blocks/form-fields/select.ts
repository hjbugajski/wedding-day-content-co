import type { Block } from 'payload';

import { baseFormFields } from '@/payload/fields/base-form-fields';
import type { PayloadSelectBlock } from '@/payload/payload-types';
import { slugify } from '@/utils/slugify';

export const Select: Block = {
  slug: 'select',
  interfaceName: 'PayloadSelectBlock',
  fields: baseFormFields(
    {
      defaultValue: {
        name: 'defaultValue',
        type: 'text',
        validate: (value: any, { siblingData }: { siblingData: Partial<PayloadSelectBlock> }) => {
          if (!value) {
            return true;
          }

          const option = siblingData?.options?.find((option) => option.value === value);

          if (!option) {
            return 'Field must equal the value from one of the options';
          }

          return true;
        },
      },
    },
    {
      name: 'options',
      type: 'array',
      required: true,
      minRows: 2,
      admin: {
        components: {
          RowLabel: {
            path: '@/payload/components/row-label.tsx',
            exportName: 'RowLabel',
            clientProps: {
              path: 'label',
              fallback: 'Option',
            },
          },
        },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            readOnly: true,
          },
          hooks: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            beforeValidate: [({ siblingData }) => slugify(siblingData?.label)],
          },
        },
      ],
    },
  ),
};
