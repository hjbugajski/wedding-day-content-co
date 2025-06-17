import type { Field, GlobalConfig } from 'payload';

import { Role, hasRole } from '@/payload/access';
import { buttonLinkGroup } from '@/payload/fields/buttonLink';
import { linkArray, linkGroup } from '@/payload/fields/link';
import { revalidateGlobalAfterChange } from '@/payload/hooks/revalidate-global';
import { deepMerge } from '@/payload/utils/deep-merge';

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  typescript: {
    interface: 'PayloadNavigationGlobal',
  },
  access: {
    read: () => true,
    update: hasRole(Role.Admin),
  },
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
  fields: [
    {
      name: 'navigationItems',
      type: 'array',
      admin: {
        components: {
          RowLabel: {
            path: '@/payload/components/row-label.tsx',
            exportName: 'RowLabel',
            clientProps: {
              path: 'link.text',
              fallbackPath: 'groupText',
              fallback: 'Link',
            },
          },
        },
      },
      fields: [
        {
          name: 'navigationType',
          type: 'select',
          required: true,
          defaultValue: 'standalone',
          options: [
            {
              label: 'Standalone',
              value: 'standalone',
            },
            {
              label: 'Group',
              value: 'group',
            },
          ],
        },
        deepMerge<Field>(linkGroup, {
          admin: {
            condition: (_, siblingData) => siblingData?.navigationType === 'standalone',
          },
        }),
        {
          name: 'groupText',
          type: 'text',
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.navigationType === 'group',
          },
        },
        deepMerge<Field>(linkArray, {
          admin: {
            condition: (_, siblingData) => siblingData?.navigationType === 'group',
          },
        }),
      ],
    },
    deepMerge<Field>(buttonLinkGroup, { name: 'callToAction', label: 'Call to Action' }),
  ],
};
