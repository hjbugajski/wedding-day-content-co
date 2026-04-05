import type { ComponentType } from 'react';

import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode,
} from '@payloadcms/richtext-lexical';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

import type {
  PayloadButtonLinkBlock,
  PayloadFormBlock,
  PayloadGalleryBlock,
  PayloadHeroBlock,
  PayloadMediaStackBlock,
  PayloadMessagesMarqueeBlock,
  PayloadPackagesBlock,
  PayloadQuotesBlock,
  PayloadSectionBlock,
  PayloadStepperBlock,
} from '@/payload/payload-types';

export type NodeType =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | PayloadButtonLinkBlock
      | PayloadFormBlock
      | PayloadGalleryBlock
      | PayloadHeroBlock
      | PayloadMediaStackBlock
      | PayloadMessagesMarqueeBlock
      | PayloadPackagesBlock
      | PayloadQuotesBlock
      | PayloadSectionBlock
      | PayloadStepperBlock
    >
  | SerializedInlineBlockNode;

export type Classes = {
  [nodeType in Exclude<NonNullable<NodeType['type']>, 'block' | 'inlineBlock'>]?: string;
} & {
  blocks?: {
    [K in Extract<
      Extract<
        NodeType,
        {
          type: 'block';
        }
      > extends SerializedBlockNode<infer B>
        ? B extends {
            blockType: string;
          }
          ? B['blockType']
          : never
        : never,
      string
    >]?: string;
  };
};

export interface RichTextProps {
  data?: SerializedEditorState | null;
  overrideClasses?: Classes;
}

export type RichTextComponent = ComponentType<RichTextProps>;
