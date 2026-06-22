import type { RichTextComponent } from '@/components/rich-text/types';
import { Blockquote, BlockquoteBody, BlockquoteFooter } from '@/components/ui/blockquote';
import type { PayloadQuotesBlock } from '@/payload/payload-types';

interface QuotesBlockProps extends PayloadQuotesBlock {
  RichText: RichTextComponent;
}

export function QuotesBlock({ quotes, RichText }: QuotesBlockProps) {
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
