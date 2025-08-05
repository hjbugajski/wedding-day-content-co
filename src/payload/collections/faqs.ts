import { lexicalEditor } from '@payloadcms/richtext-lexical';
import type { CollectionConfig } from 'payload';

import { Role, hasRole, hasRoleOrPublished } from '@/payload/access';
import {
  cleanEmptyLexicalAfterRead,
  cleanEmptyLexicalBeforeChange,
} from '@/payload/hooks/clean-empty-lexical';

export const Faqs: CollectionConfig<'faqs'> = {
  slug: 'faqs',
  typescript: {
    interface: 'PayloadFaqsCollection',
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: hasRoleOrPublished(Role.Admin, Role.Editor),
    create: hasRole(Role.Admin, Role.Editor),
    update: hasRole(Role.Admin, Role.Editor),
    delete: hasRole(Role.Admin),
  },
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
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
};
