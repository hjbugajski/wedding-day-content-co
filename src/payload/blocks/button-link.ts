import type { Block } from 'payload';

import { fields } from '@/payload/fields/button-link';

export const ButtonLink: Block = {
  slug: 'buttonLink',
  interfaceName: 'PayloadButtonLinkBlock',
  fields,
};
