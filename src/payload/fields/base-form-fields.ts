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
import type { Field } from 'payload';

import { richTextFields } from '@/payload/fields/link';
import { required } from '@/payload/fields/required';
import {
  cleanEmptyLexicalAfterRead,
  cleanEmptyLexicalBeforeChange,
} from '@/payload/hooks/clean-empty-lexical';
import { slugify } from '@/utils/slugify';

export const baseFormFields = (
  overrides?: { defaultValue?: Field | Field[] },
  ...additionalFields: Field[]
): Field[] => [
  {
    type: 'row',
    fields: [
      {
        name: 'label',
        type: 'text',
        required: true,
        unique: true,
        admin: {
          width: '50%',
        },
      },
      {
        name: 'width',
        type: 'select',
        admin: {
          width: '50%',
        },
        required: true,
        defaultValue: 'full',
        options: [
          {
            label: 'Half',
            value: 'half',
          },
          {
            label: 'Full',
            value: 'full',
          },
        ],
      },
    ],
  },
  {
    type: 'row',
    fields: [
      {
        name: 'placeholder',
        type: 'text',
        admin: {
          width: '50%',
        },
      },
      ...(overrides?.defaultValue
        ? Array.isArray(overrides.defaultValue)
          ? overrides.defaultValue
          : [overrides.defaultValue]
        : ([
            {
              name: 'defaultValue',
              type: 'text',
              admin: {
                width: '50%',
              },
            },
          ] as Field[])),
    ],
  },
  ...(additionalFields || []),
  required,
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
    name: 'name',
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
];
