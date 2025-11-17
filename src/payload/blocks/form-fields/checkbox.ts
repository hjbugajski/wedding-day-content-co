import {
  BoldFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';
import type { Block } from 'payload';

import { baseFormFields } from '@/payload/fields/base-form-fields';
import { richTextFields } from '@/payload/fields/link';
import {
  cleanEmptyLexicalAfterRead,
  cleanEmptyLexicalBeforeChange,
} from '@/payload/hooks/clean-empty-lexical';
import type { PayloadCheckboxBlock } from '@/payload/payload-types';
import { slugify } from '@/utils/slugify';

export const Checkbox: Block = {
  slug: 'checkbox',
  interfaceName: 'PayloadCheckboxBlock',
  fields: baseFormFields(
    {
      defaultValue: {
        name: 'defaultValue',
        type: 'text',
        validate: (value: any, { siblingData }: { siblingData: Partial<PayloadCheckboxBlock> }) => {
          if (!value || typeof value !== 'string') {
            return true;
          }

          const options = siblingData?.options?.map((o) => o.value) || [];
          const values = value.split(',').map((v) => v.trim());

          for (const v of values) {
            if (!options.includes(v)) {
              return 'Default values must match option values (comma-separated for multiple)';
            }
          }

          return true;
        },
      },
    },
    {
      name: 'options',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'description',
          type: 'richText',
          editor: lexicalEditor({
            features: () => [
              ParagraphFeature(),
              BoldFeature(),
              ItalicFeature(),
              UnderlineFeature(),
              StrikethroughFeature(),
              SuperscriptFeature(),
              SubscriptFeature(),
              UnorderedListFeature(),
              OrderedListFeature(),
              LinkFeature({ fields: richTextFields }),
              InlineToolbarFeature(),
            ],
          }),
          hooks: {
            beforeChange: [cleanEmptyLexicalBeforeChange],
            afterRead: [cleanEmptyLexicalAfterRead],
          },
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
