import { nanoid } from 'nanoid';
import type {
  CollectionAfterChangeHook,
  CollectionAfterErrorHook,
  CollectionAfterOperationHook,
  CollectionConfig,
  RelationshipFieldSingleValidation,
} from 'payload';
import { Resend } from 'resend';

import { env } from '@/env/server';
import { Role, hasRole } from '@/payload/access';
import { FormSubmissionEmailTemplate } from '@/payload/components/form-submission-email-template';
import { decryptField, encryptField } from '@/payload/hooks/encryption';
import type {
  PayloadFormSubmissionsCollection,
  PayloadFormsCollection,
} from '@/payload/payload-types';
import { sendFallbackFormEmail } from '@/services/email';

const formRelationshipValidation: RelationshipFieldSingleValidation = async (
  value,
  { req: { payload }, req },
) => {
  if (!payload || !value) {
    return true;
  }

  try {
    const id = typeof value === 'string' || typeof value === 'number' ? value : value.value;
    await payload.findByID({ collection: 'forms', id, req });

    return true;
  } catch (error) {
    payload.logger.error(error);

    return 'Form does not exist.';
  }
};

const sendFormSubmissionEmail: CollectionAfterOperationHook<'form-submissions'> = async ({
  operation,
  req: { payload },
  req,
  result,
}) => {
  if (operation === 'create') {
    try {
      let form: PayloadFormsCollection;

      if (typeof result.form === 'string') {
        form = await payload.findByID({ collection: 'forms', id: result.form, req });
      } else {
        form = result.form;
      }

      const emailSettings = form.emailSettings;
      let subject: string | undefined;

      if (emailSettings?.subjectTemplate && emailSettings?.subjectField) {
        const subjectField = result.data.find((d) => d.name === emailSettings.subjectField);
        const subjectValue = subjectField?.value || '';

        subject = emailSettings.subjectTemplate.replace('{{subjectField}}', subjectValue);
      }

      const resend = new Resend(env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: `Wedding Day Content Co. <${env.RESEND_FROM_ADDRESS_PAYLOAD}>`,
        to: env.RESEND_TO_ADDRESS_DEFAULT,
        subject: subject || `New ${form.title} Submission`,
        react: FormSubmissionEmailTemplate({ data: result.data, form }),
        headers: {
          'X-Entity-Ref-ID': nanoid(32),
        },
      });

      if (error) {
        payload.logger.error(error);
      }
    } catch (error) {
      payload.logger.error(error);
    }
  }

  return result;
};

const setClient: CollectionAfterChangeHook<PayloadFormSubmissionsCollection> = async ({
  context,
  doc,
  req,
}) => {
  if (doc?.client || !doc?.data?.length || context?.ignoreSetClient) {
    return doc;
  }

  const { payload } = req;

  let form: PayloadFormsCollection;

  if (typeof doc.form === 'string') {
    form = await payload.findByID({ collection: 'forms', id: doc.form, req });
  } else {
    form = doc.form;
  }

  const { emailField, nameField, phoneField } = form.emailSettings || {};

  let email: string | undefined;
  let name: string | undefined;
  let phoneNumber: string | undefined;

  doc.data?.forEach((datum) => {
    if (emailField && datum.name === emailField) {
      email = datum.value;
    }

    if (nameField && datum.name === nameField) {
      name = datum.value;
    }

    if (phoneField && datum.name === phoneField) {
      phoneNumber = datum.value;
    }
  });

  if (!email) {
    return doc;
  }

  const { docs } = await payload.find({
    collection: 'clients',
    where: { email: { equals: email } },
    limit: 1,
  });

  if (docs.length) {
    return payload.update({
      collection: 'form-submissions',
      id: doc.id,
      data: { client: docs[0].id },
      context: { ignoreSetClient: true },
      req,
    });
  }

  const { id } = await payload.create({
    collection: 'clients',
    data: {
      email,
      name: name || email.split('@')[0],
      password: nanoid(32),
      ...(phoneNumber ? { phoneNumber } : {}),
    },
  });

  return payload.update({
    collection: 'form-submissions',
    id: doc.id,
    data: { client: id },
    context: { ignoreSetClient: true },
    req,
  });
};

const afterErrorHook: CollectionAfterErrorHook = async ({ req, error, context }) => {
  req.payload.logger.error('Form submission error occurred:', {
    error: error.message,
    stack: error.stack,
    context,
  });

  if (context && 'formSubmissionData' in context && context.formSubmissionData) {
    const { form, data } = context.formSubmissionData as {
      form: string;
      data: PayloadFormSubmissionsCollection['data'];
    };

    if (form && data) {
      try {
        await sendFallbackFormEmail(form, data);
        req.payload.logger.info('Fallback email sent due to database error');
      } catch (emailError) {
        req.payload.logger.error('Failed to send fallback email:', emailError);
      }
    }
  }
};

export const FormSubmissions: CollectionConfig<'form-submissions'> = {
  slug: 'form-submissions',
  typescript: {
    interface: 'PayloadFormSubmissionsCollection',
  },
  access: {
    create: () => true,
    read: hasRole(Role.Admin, Role.Editor),
    update: () => false,
    delete: hasRole(Role.Admin),
  },
  admin: {
    group: 'CRM',
  },
  hooks: {
    afterChange: [setClient],
    afterOperation: [sendFormSubmissionEmail],
    afterError: [afterErrorHook],
  },
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      admin: {
        readOnly: true,
      },
      validate: formRelationshipValidation,
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'data',
      type: 'array',
      admin: {
        readOnly: true,
        components: {
          RowLabel: {
            path: '@/payload/components/row-label.tsx',
            exportName: 'RowLabel',
            clientProps: {
              path: 'label',
              fallback: 'Datum',
            },
          },
        },
      },
      required: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            readOnly: true,
          },
          hooks: {
            beforeChange: [encryptField],
            afterRead: [decryptField],
          },
        },
        {
          name: 'blockType',
          type: 'text',
          required: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'name',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
};
