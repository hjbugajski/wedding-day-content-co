import { QuoteCard } from '@/components/blocks/quote-card';
import type { RichTextComponent } from '@/components/rich-text/types';
import { Blockquote, BlockquoteBody, BlockquoteFooter } from '@/components/ui/blockquote';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { PayloadQuotesBlock } from '@/payload/payload-types';

interface QuotesBlockProps extends PayloadQuotesBlock {
  RichText: RichTextComponent;
}

export function QuotesBlock({ quotes, RichText }: QuotesBlockProps) {
  if (!quotes || quotes.length === 0) {
    return null;
  }

  return (
    <>
      <Carousel className="md:hidden" aria-label="Testimonials">
        <CarouselContent className="py-4">
          {quotes.map(({ client, content, id }) => (
            <CarouselItem key={id} className="basis-4/5">
              <QuoteCard client={client}>
                <RichText data={content} />
              </QuoteCard>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-between">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
      <div className="hidden masonry md:block">
        {quotes.map(({ client, content, id }) => (
          <Blockquote key={id} className="masonry-item">
            <BlockquoteBody>
              <RichText data={content} />
            </BlockquoteBody>
            <BlockquoteFooter>{client}</BlockquoteFooter>
          </Blockquote>
        ))}
      </div>
    </>
  );
}
