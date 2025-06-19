import type { Block } from 'payload';

import { buttonLinkArray } from '@/payload/fields/buttonLink';

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
    buttonLinkArray,
  ],
};
