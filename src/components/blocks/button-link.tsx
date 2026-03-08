import { PayloadButtonLink } from '@/components/ui/payload-button-link';
import type { PayloadButtonLinkBlock } from '@/payload/payload-types';

export function ButtonLinkBlock({
  blockName: _blockName,
  blockType: _blockType,
  id,
  ...props
}: PayloadButtonLinkBlock) {
  return (
    <PayloadButtonLink id={id ?? undefined} className="my-6 first:mt-0 last:mb-0" {...props} />
  );
}
