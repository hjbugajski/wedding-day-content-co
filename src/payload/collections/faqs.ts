import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { revalidateTag } from 'next/cache';
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
} from 'payload';

import { Role, hasRole, hasRoleOrPublished } from '@/payload/access';
import {
  cleanEmptyLexicalAfterRead,
  cleanEmptyLexicalBeforeChange,
} from '@/payload/hooks/clean-empty-lexical';
import type { PayloadFaqsCollection } from '@/payload/payload-types';
import { revalidatePagesUsingCollection } from '@/payload/utils/revalidation';

const revalidateFaqAfterChange: CollectionAfterChangeHook<PayloadFaqsCollection> = async ({
  context,
  doc,
  req: { payload },
}) => {
  if (context?.disableRevalidate) {
    return doc;
  }

  const logger = (message: string) => payload.logger.info(message);

  logger(`Revalidating Footer global due to FAQ change: ${doc.id}`);
  revalidateTag('global:footer');

  await revalidatePagesUsingCollection({ payload, logger }, 'faqs', doc.id);

  return doc;
};

const revalidateFaqAfterDelete: CollectionAfterDeleteHook<PayloadFaqsCollection> = async ({
  doc,
  req: { payload },
}) => {
  const logger = (message: string) => payload.logger.info(message);

  logger(`Revalidating Footer global due to FAQ deletion: ${doc.id}`);
  revalidateTag('global:footer');

  await revalidatePagesUsingCollection({ payload, logger }, 'faqs', doc.id);

  return doc;
};

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
  hooks: {
    afterChange: [revalidateFaqAfterChange],
    afterDelete: [revalidateFaqAfterDelete],
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
