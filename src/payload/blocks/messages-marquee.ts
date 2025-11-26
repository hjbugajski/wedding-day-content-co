import type { Block } from 'payload';

export const MessagesMarquee: Block = {
  slug: 'messagesMarquee',
  interfaceName: 'PayloadMessagesMarqueeBlock',
  fields: [
    {
      name: 'messages',
      type: 'array',
      admin: {
        components: {
          RowLabel: {
            path: '@/payload/components/row-label.tsx',
            exportName: 'RowLabel',
            clientProps: {
              path: 'content',
              fallback: 'Message',
            },
          },
        },
      },
      fields: [
        {
          name: 'content',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
};
