import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  Field,
} from 'payload';

import { Role, hasRole } from '@/payload/access';
import { linkGroup } from '@/payload/fields/link';
import type { PayloadImagesCollection } from '@/payload/payload-types';
import { createDataUrl } from '@/payload/utils/create-data-url';
import { deepMerge } from '@/payload/utils/deep-merge';
import { revalidatePagesUsingCollection } from '@/payload/utils/revalidation';

const addDataUrl: CollectionAfterChangeHook<PayloadImagesCollection> = async ({
  context,
  doc,
  req,
}) => {
  if (!doc.url || context?.ignoreAddDataUrl) {
    return doc;
  }

  const dataUrl = await createDataUrl(doc.url, doc.mimeType);

  return req.payload.update({
    collection: 'images',
    id: doc.id,
    data: {
      dataUrl,
    },
    context: {
      ignoreAddDataUrl: true,
    },
    req,
  });
};

const revalidateImageAfterChange: CollectionAfterChangeHook<PayloadImagesCollection> = async ({
  context,
  doc,
  req: { payload },
}) => {
  if (context?.disableRevalidate) {
    return doc;
  }

  if (context?.ignoreAddDataUrl) {
    return doc;
  }

  const logger = (message: string) => payload.logger.info(message);

  await revalidatePagesUsingCollection({ payload, logger }, 'images', doc.id);

  return doc;
};

const revalidateImageAfterDelete: CollectionAfterDeleteHook<PayloadImagesCollection> = async ({
  doc,
  req: { payload },
}) => {
  const logger = (message: string) => payload.logger.info(message);

  await revalidatePagesUsingCollection({ payload, logger }, 'images', doc.id);

  return doc;
};

export const Images: CollectionConfig<'images'> = {
  slug: 'images',
  typescript: {
    interface: 'PayloadImagesCollection',
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: hasRole(Role.Admin, Role.Editor),
    update: hasRole(Role.Admin, Role.Editor),
    delete: hasRole(Role.Admin),
  },
  hooks: {
    afterChange: [addDataUrl, revalidateImageAfterChange],
    afterDelete: [revalidateImageAfterDelete],
  },
  upload: {
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 480,
        height: 320,
      },
      {
        name: 'preview',
        height: 1080,
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'alt',
      label: 'Description',
      type: 'textarea',
    },
    deepMerge<Field>(linkGroup, {
      admin: {
        condition: (_, siblingData) => !!siblingData?.hasLink,
      },
    }),
    {
      name: 'dataUrl',
      label: 'Data URL',
      type: 'text',
      maxLength: 1_000_000,
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => !!data?.dataUrl,
      },
    },
    {
      type: 'row',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'hasLink',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'displayOriginal',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            width: '50%',
          },
        },
      ],
    },
  ],
};
