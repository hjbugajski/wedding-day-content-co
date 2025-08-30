import { lexicalEditor } from '@payloadcms/richtext-lexical';
import type { CollectionConfig, TextField, Validate } from 'payload';

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
import type { PayloadFormsCollection } from '@/payload/payload-types';

type TextFieldValidator = Validate<string, PayloadFormsCollection, unknown, TextField>;

const validateFieldExists: TextFieldValidator = (value, { data }) => {
  if (!value || !data?.fields?.length) {
    return true;
  }

  const fieldExists = data.fields.some((field) => field.name === value);

  return fieldExists || 'Selected field does not exist in the form';
};

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
    {
      name: 'emailSettings',
      type: 'group',
      label: 'Email Configuration',
      required: true,
      fields: [
        {
          name: 'subjectTemplate',
          type: 'text',
          label: 'Subject Template',
          required: true,
          admin: {
            description: 'Use {{subjectField}} to include the subject field value in the subject',
          },
        },
        {
          name: 'subjectField',
          type: 'text',
          label: 'Subject field name',
          admin: {
            description:
              'Enter the field name to include in the email subject line. Check the form fields above for available names.',
          },
          validate: validateFieldExists,
        },
        {
          name: 'nameField',
          type: 'text',
          label: 'Name field name',
          admin: {
            description: 'Enter the field name that contains the contact name',
          },
          validate: validateFieldExists,
        },
        {
          name: 'emailField',
          type: 'text',
          label: 'Email field name',
          admin: {
            description: 'Enter the field name that contains the contact email',
          },
          validate: validateFieldExists,
        },
        {
          name: 'phoneField',
          type: 'text',
          label: 'Phone field name',
          admin: {
            description: 'Enter the field name that contains the contact phone number',
          },
          validate: validateFieldExists,
        },
      ],
    },
  ],
};
