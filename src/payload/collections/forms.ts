import { lexicalEditor } from '@payloadcms/richtext-lexical';
import type { CollectionConfig } from 'payload';

import { Role, hasRole } from '@/payload/access';
import { Date } from '@/payload/blocks/form-fields/date';
import { Email } from '@/payload/blocks/form-fields/email';
import { PhoneNumber } from '@/payload/blocks/form-fields/phone-number';
import { Radio } from '@/payload/blocks/form-fields/radio';
import { Select } from '@/payload/blocks/form-fields/select';
import { Text } from '@/payload/blocks/form-fields/text';
import { Textarea } from '@/payload/blocks/form-fields/textarea';
import {
  cleanEmptyLexicalAfterRead,
  cleanEmptyLexicalBeforeChange,
} from '@/payload/hooks/clean-empty-lexical';

export const Forms: CollectionConfig<'forms'> = {
  slug: 'forms',
  typescript: {
    interface: 'PayloadFormsCollection',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'fields', 'createdAt', 'updatedAt'],
    group: 'CRM',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    create: hasRole(Role.Admin, Role.Editor),
    update: hasRole(Role.Admin, Role.Editor),
    delete: hasRole(Role.Admin),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
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
      name: 'submitButtonLabel',
      type: 'text',
      required: true,
      defaultValue: 'Submit',
    },
    {
      name: 'confirmationMessage',
      type: 'textarea',
      required: true,
    },
    {
      name: 'fields',
      type: 'blocks',
      required: true,
      minRows: 1,
      blocks: [Text, Textarea, Date, Select, Radio, Email, PhoneNumber],
    },
  ],
};
