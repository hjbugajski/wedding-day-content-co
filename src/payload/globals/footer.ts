import { lexicalEditor } from '@payloadcms/richtext-lexical';
import type { Field, GlobalConfig } from 'payload';

import { Role, hasRole } from '@/payload/access';
import { linkArray } from '@/payload/fields/link';
import {
  cleanEmptyLexicalAfterRead,
  cleanEmptyLexicalBeforeChange,
} from '@/payload/hooks/clean-empty-lexical';
import { revalidateGlobalAfterChange } from '@/payload/hooks/revalidate-global';
import { deepMerge } from '@/payload/utils/deep-merge';

export const Footer: GlobalConfig = {
  slug: 'footer',
  typescript: {
    interface: 'PayloadFooterGlobal',
  },
  access: {
    read: () => true,
    update: hasRole(Role.Admin),
  },
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
  fields: [
    {
      name: 'contact',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => rootFeatures,
      }),
      hooks: {
        beforeChange: [cleanEmptyLexicalBeforeChange],
        afterRead: [cleanEmptyLexicalAfterRead],
      },
    },
    {
      name: 'faqs',
      label: 'FAQs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
    },
    {
      name: 'linkGroups',
      type: 'array',
      admin: {
        components: {
          RowLabel: {
            path: '@/payload/components/row-label.tsx',
            exportName: 'RowLabel',
            clientProps: {
              path: 'heading',
              fallback: 'Link Group',
            },
          },
        },
      },
      fields: [
        { name: 'heading', type: 'text', required: true },
        deepMerge<Field>(linkArray, { minRows: 1, required: true }),
      ],
    },
    {
      name: 'marquee',
      type: 'text',
      required: true,
    },
  ],
};
