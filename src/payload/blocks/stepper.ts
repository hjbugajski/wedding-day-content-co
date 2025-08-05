import { lexicalEditor } from '@payloadcms/richtext-lexical';
import type { Block } from 'payload';

import {
  cleanEmptyLexicalAfterRead,
  cleanEmptyLexicalBeforeChange,
} from '@/payload/hooks/clean-empty-lexical';

export const Stepper: Block = {
  slug: 'stepper',
  interfaceName: 'PayloadStepperBlock',
  fields: [
    {
      name: 'steps',
      type: 'array',
      minRows: 1,
      admin: {
        components: {
          RowLabel: {
            path: '@/payload/components/row-label.tsx',
            exportName: 'RowLabel',
            clientProps: {
              path: 'heading',
              fallback: 'Step',
            },
          },
        },
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => rootFeatures,
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
