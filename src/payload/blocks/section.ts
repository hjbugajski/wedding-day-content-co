import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import type { Block, Field } from 'payload';

import { ButtonLink } from '@/payload/blocks/button-link';
import { Gallery } from '@/payload/blocks/gallery';
import { MediaStack } from '@/payload/blocks/media-stack';
import { MessagesMarquee } from '@/payload/blocks/messages-marquee';
import { Packages } from '@/payload/blocks/packages';
import { Quotes } from '@/payload/blocks/quotes';
import { Stepper } from '@/payload/blocks/stepper';
import { background } from '@/payload/fields/background';
import {
  cleanEmptyLexicalAfterRead,
  cleanEmptyLexicalBeforeChange,
} from '@/payload/hooks/clean-empty-lexical';
import { deepMerge } from '@/payload/utils/deep-merge';

const richTextField = (columns: '1' | '2'): Field => ({
  name: 'content',
  type: 'richText',
  editor: lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      BlocksFeature({
        blocks:
          columns === '1'
            ? [ButtonLink, Gallery, MediaStack, MessagesMarquee, Packages, Quotes, Stepper]
            : [ButtonLink, MediaStack],
      }),
    ],
  }),
  hooks: {
    beforeChange: [cleanEmptyLexicalBeforeChange],
    afterRead: [cleanEmptyLexicalAfterRead],
  },
});

export const Section: Block = {
  slug: 'section',
  interfaceName: 'PayloadSectionBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      type: 'row',
      fields: [
        deepMerge<Field>(background, {
          admin: {
            width: '50%',
          },
        }),
        {
          name: 'columns',
          type: 'select',
          admin: {
            width: '50%',
          },
          required: true,
          defaultValue: '1',
          options: [
            {
              label: 'One',
              value: '1',
            },
            {
              label: 'Two',
              value: '2',
            },
          ],
        },
      ],
    },
    deepMerge<Field>(richTextField('1'), {
      admin: {
        condition: (_, siblingData) => siblingData.columns === '1',
      },
    }),
    deepMerge<Field>(richTextField('2'), {
      name: 'contentColumnOne',
      admin: {
        condition: (_, siblingData) => siblingData.columns === '2',
      },
    }),
    deepMerge<Field>(richTextField('2'), {
      name: 'contentColumnTwo',
      admin: {
        condition: (_, siblingData) => siblingData.columns === '2',
      },
    }),
  ],
};
