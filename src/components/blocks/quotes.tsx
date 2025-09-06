import { RichText } from '@/components/rich-text';
import { Blockquote, BlockquoteBody, BlockquoteFooter } from '@/components/ui/blockquote';
import type { PayloadQuotesBlock } from '@/payload/payload-types';

export function QuotesBlock({ quotes }: PayloadQuotesBlock) {
  if (!quotes || quotes.length === 0) {
    return null;
  }

  return (
    <div className="masonry">
      {quotes.map(({ client, content, id }) => (
        <Blockquote key={id} className="masonry-item">
          <BlockquoteBody>
            <RichText data={content} />
          </BlockquoteBody>
          <BlockquoteFooter>{client}</BlockquoteFooter>
        </Blockquote>
      ))}
    </div>
  );
}
