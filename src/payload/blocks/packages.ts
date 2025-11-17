import {
  AlignFeature,
  BoldFeature,
  IndentFeature,
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

import { richTextFields } from '@/payload/fields/link';
import {
  cleanEmptyLexicalAfterRead,
  cleanEmptyLexicalBeforeChange,
} from '@/payload/hooks/clean-empty-lexical';

export const Packages: Block = {
  slug: 'packages',
  interfaceName: 'PayloadPackagesBlock',
  fields: [
    {
      name: 'packagesSection',
      label: 'Packages Section',
      type: 'group',
      fields: [
        {
          name: 'packages',
          type: 'array',
          required: true,
          admin: {
            components: {
              RowLabel: {
                path: '@/payload/components/row-label.tsx',
                exportName: 'RowLabel',
                clientProps: {
                  path: 'title',
                  fallback: 'Package',
                },
              },
            },
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: () => [
                  AlignFeature(),
                  BoldFeature(),
                  IndentFeature(),
                  InlineToolbarFeature(),
                  ItalicFeature(),
                  LinkFeature({ fields: richTextFields }),
                  OrderedListFeature(),
                  ParagraphFeature(),
                  StrikethroughFeature(),
                  SubscriptFeature(),
                  SuperscriptFeature(),
                  UnderlineFeature(),
                  UnorderedListFeature(),
                ],
              }),
              hooks: {
                beforeChange: [cleanEmptyLexicalBeforeChange],
                afterRead: [cleanEmptyLexicalAfterRead],
              },
            },
            {
              name: 'details',
              type: 'richText',
              editor: lexicalEditor({
                features: () => [
                  AlignFeature(),
                  BoldFeature(),
                  IndentFeature(),
                  InlineToolbarFeature(),
                  ItalicFeature(),
                  LinkFeature({ fields: richTextFields }),
                  OrderedListFeature(),
                  ParagraphFeature(),
                  StrikethroughFeature(),
                  SubscriptFeature(),
                  SuperscriptFeature(),
                  UnderlineFeature(),
                  UnorderedListFeature(),
                ],
              }),
              required: true,
              hooks: {
                beforeChange: [cleanEmptyLexicalBeforeChange],
                afterRead: [cleanEmptyLexicalAfterRead],
              },
            },
            {
              name: 'price',
              type: 'text',
              required: true,
            },
            {
              name: 'highlight',
              type: 'checkbox',
              defaultValue: false,
              required: true,
            },
          ],
        },
        {
          name: 'footer',
          type: 'richText',
          editor: lexicalEditor({
            features: () => [
              AlignFeature(),
              BoldFeature(),
              IndentFeature(),
              InlineToolbarFeature(),
              ItalicFeature(),
              LinkFeature({ fields: richTextFields }),
              OrderedListFeature(),
              ParagraphFeature(),
              StrikethroughFeature(),
              SubscriptFeature(),
              SuperscriptFeature(),
              UnderlineFeature(),
              UnorderedListFeature(),
            ],
          }),
          hooks: {
            beforeChange: [cleanEmptyLexicalBeforeChange],
            afterRead: [cleanEmptyLexicalAfterRead],
          },
        },
      ],
    },
    {
      name: 'addOnsSection',
      label: 'Add-ons Section',
      type: 'group',
      fields: [
        {
          name: 'description',
          type: 'richText',
          editor: lexicalEditor({
            features: () => [
              AlignFeature(),
              BoldFeature(),
              IndentFeature(),
              InlineToolbarFeature(),
              ItalicFeature(),
              LinkFeature({ fields: richTextFields }),
              OrderedListFeature(),
              ParagraphFeature(),
              StrikethroughFeature(),
              SubscriptFeature(),
              SuperscriptFeature(),
              UnderlineFeature(),
              UnorderedListFeature(),
            ],
          }),
          hooks: {
            beforeChange: [cleanEmptyLexicalBeforeChange],
            afterRead: [cleanEmptyLexicalAfterRead],
          },
        },
        {
          name: 'addOns',
          type: 'array',
          admin: {
            components: {
              RowLabel: {
                path: '@/payload/components/row-label.tsx',
                exportName: 'RowLabel',
                clientProps: {
                  path: 'title',
                  fallback: 'Add-on',
                },
              },
            },
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: () => [
                  AlignFeature(),
                  BoldFeature(),
                  IndentFeature(),
                  InlineToolbarFeature(),
                  ItalicFeature(),
                  LinkFeature({ fields: richTextFields }),
                  OrderedListFeature(),
                  ParagraphFeature(),
                  StrikethroughFeature(),
                  SubscriptFeature(),
                  SuperscriptFeature(),
                  UnderlineFeature(),
                  UnorderedListFeature(),
                ],
              }),
              required: true,
              hooks: {
                beforeChange: [cleanEmptyLexicalBeforeChange],
                afterRead: [cleanEmptyLexicalAfterRead],
              },
            },
            {
              name: 'price',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
};
