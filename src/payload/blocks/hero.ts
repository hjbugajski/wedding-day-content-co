import type { Block, Field } from 'payload';

import { buttonLinkArray } from '@/payload/fields/buttonLink';
import { deepMerge } from '@/payload/utils/deep-merge';

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'PayloadHeroBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'video',
          type: 'relationship',
          relationTo: 'mux-video',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'videoPoster',
          type: 'relationship',
          relationTo: 'images',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    deepMerge<Field>(buttonLinkArray, {
      required: true,
      minRows: 1,
    }),
  ],
};
