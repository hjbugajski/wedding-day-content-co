import { ParagraphFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import type { Block } from 'payload';

import {
  cleanEmptyLexicalAfterRead,
  cleanEmptyLexicalBeforeChange,
} from '@/payload/hooks/clean-empty-lexical';

export const Quotes: Block = {
  slug: 'quotes',
  interfaceName: 'PayloadQuotesBlock',
  fields: [
    {
      name: 'quotes',
      type: 'array',
      minRows: 3,
      admin: {
        components: {
          RowLabel: {
            path: '@/payload/components/row-label.tsx',
            exportName: 'RowLabel',
            clientProps: {
              path: 'client',
              fallback: 'Quote',
            },
          },
        },
      },
      fields: [
        {
          name: 'client',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          editor: lexicalEditor({
            features: () => [ParagraphFeature()],
          }),
          hooks: {
            beforeChange: [cleanEmptyLexicalBeforeChange],
            afterRead: [cleanEmptyLexicalAfterRead],
          },
        },
      ],
    },
  ],
};
