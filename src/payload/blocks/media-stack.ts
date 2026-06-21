import type { Block } from 'payload';

export const MediaStack: Block = {
  slug: 'mediaStack',
  interfaceName: 'PayloadMediaStackBlock',
  fields: [
    {
      name: 'media',
      type: 'relationship',
      relationTo: ['images'],
      hasMany: true,
      maxRows: 4,
      minRows: 2,
      required: true,
    },
  ],
};
