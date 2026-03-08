import type { Block, Validate } from 'payload';

import { baseFormFields } from '@/payload/fields/base-form-fields';
import type { PayloadRadioBlock } from '@/payload/payload-types';
import { slugify } from '@/utils/slugify';

export const Radio: Block = {
  slug: 'radio',
  interfaceName: 'PayloadRadioBlock',
  fields: baseFormFields(
    {
      defaultValue: {
        name: 'defaultValue',
        type: 'text',
        validate: ((value, { siblingData }) => {
          if (!value) {
            return true;
          }

          const option = siblingData?.options?.find((option) => option.value === value);

          if (!option) {
            return 'Field must equal the value from one of the options';
          }

          return true;
        }) satisfies Validate<string, unknown, Partial<PayloadRadioBlock>>,
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
            // oxlint-disable-next-line typescript/no-unsafe-argument
            beforeValidate: [({ siblingData }) => slugify(siblingData?.label)],
          },
        },
      ],
    },
  ),
};
