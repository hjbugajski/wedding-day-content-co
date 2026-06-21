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
    <Carousel aria-label="Testimonials">
      <CarouselContent className="items-center py-6">
        {quotes.map(({ client, content, id }) => (
          <CarouselItem key={id} className="basis-11/12 sm:basis-1/2 lg:basis-1/3">
            <Blockquote>
              <BlockquoteBody>
                <RichText data={content} />
              </BlockquoteBody>
              <BlockquoteFooter>{client}</BlockquoteFooter>
            </Blockquote>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-between py-4 md:py-0">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
}
