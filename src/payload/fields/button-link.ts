import type { Field } from 'payload';

import { linkGroup } from '@/payload/fields/link';

export const fields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'variant',
        type: 'select',
        interfaceName: 'PayloadButtonVariantField',
        admin: {
          width: '50%',
        },
        required: true,
        defaultValue: 'primary',
        options: [
          {
            label: 'Primary',
            value: 'primary',
          },
          {
            label: 'Secondary',
            value: 'secondary',
          },
        ],
      },
      {
        name: 'size',
        type: 'select',
        interfaceName: 'PayloadButtonSizeField',
        admin: {
          width: '50%',
        },
        required: true,
        defaultValue: 'md',
        options: [
          {
            label: 'Small',
            value: 'sm',
          },
          {
            label: 'Medium',
            value: 'md',
          },
          {
            label: 'Large',
            value: 'lg',
          },
        ],
      },
    ],
  },
  {
    type: 'row',
    fields: [
      {
        name: 'icon',
        type: 'select',
        interfaceName: 'PayloadIconField',
        admin: {
          isClearable: true,
          width: '50%',
        },
        options: [
          {
            label: 'Arrow left',
            value: 'arrowLeft',
          },
          {
            label: 'Arrow right',
            value: 'arrowRight',
          },
          {
            label: 'Arrow up right',
            value: 'arrowUpRight',
          },
          {
            label: 'Calendar',
            value: 'calendar',
          },
          {
            label: 'Calendar check',
            value: 'calendarCheck',
          },
          {
            label: 'Checkmark',
            value: 'checkmark',
          },
          {
            label: 'Chevron down',
            value: 'chevronDown',
          },
          {
            label: 'Circle',
            value: 'circle',
          },
          {
            label: 'Instagram',
            value: 'instagram',
          },
          {
            label: 'Menu',
            value: 'menu',
          },
          {
            label: 'Nav arrow down',
            value: 'navArrowDown',
          },
          {
            label: 'Nav arrow down small',
            value: 'navArrowDownSmall',
          },
          {
            label: 'Nav arrow left',
            value: 'navArrowLeft',
          },
          {
            label: 'Nav arrow right',
            value: 'navArrowRight',
          },
          {
            label: 'Nav arrow up',
            value: 'navArrowUp',
          },
          {
            label: 'Quote solid',
            value: 'quoteSolid',
          },
          {
            label: 'Sparkle',
            value: 'sparkle',
          },
          {
            label: 'TikTok',
            value: 'tikTok',
          },
          {
            label: 'X mark',
            value: 'x',
          },
        ],
      },
      {
        name: 'iconPosition',
        type: 'select',
        interfaceName: 'PayloadButtonIconPositionField',
        admin: {
          condition: (_, siblingData) => !!siblingData?.icon,
          width: '50%',
        },
        required: true,
        defaultValue: 'none',
        options: [
          {
            label: 'None',
            value: 'none',
          },
          {
            label: 'Left',
            value: 'left',
          },
          {
            label: 'Right',
            value: 'right',
          },
          {
            label: 'Center',
            value: 'center',
          },
        ],
      },
    ],
  },
  linkGroup,
];

export const buttonLinkGroup: Field = {
  name: 'buttonLink',
  type: 'group',
  interfaceName: 'PayloadButtonLinkGroupField',
  fields,
};

export const buttonLinkArray: Field = {
  name: 'buttonLinks',
  type: 'array',
  interfaceName: 'PayloadButtonLinkArrayField',
  admin: {
    components: {
      RowLabel: {
        path: '@/payload/components/row-label.tsx',
        exportName: 'RowLabel',
        clientProps: {
          path: 'link.text',
          fallback: 'Button Link',
        },
      },
    },
  },
  fields,
};
