import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { PayloadMedia } from '@/components/ui/payload-media';
import type { PayloadMediaStackBlock } from '@/payload/payload-types';
import type { StripString } from '@/types/strip-string';
import { cn } from '@/utils/cn';
import { isRelationshipPopulated } from '@/utils/is-relationship-populated';

type FilteredMedia = StripString<PayloadMediaStackBlock['media'][number]>;

export function MediaStackBlock({ media }: PayloadMediaStackBlock) {
  const filteredMedia = media?.filter((item) => isRelationshipPopulated<FilteredMedia>(item));

  if (!filteredMedia?.length) {
    return null;
  }

  const count = filteredMedia.length;

  return (
    <>
      <Carousel className="md:hidden" aria-label="Image stack">
        <CarouselContent className="items-center py-4">
          {filteredMedia.map(({ relationTo, value }) => (
            <CarouselItem key={value.id} className="basis-4/5">
              <PayloadMedia
                relationTo={relationTo}
                value={value}
                className="w-full rounded-sm surface-card"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-between">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
      <div className="hidden gap-4 md:grid md:grid-cols-1 lg:grid-cols-2">
        {filteredMedia.map(({ relationTo, value }, index) => (
          <PayloadMedia
            key={value.id}
            relationTo={relationTo}
            value={value}
            className={cn('w-full rounded-sm surface-card', {
              'lg:col-span-2 lg:w-[calc(50%-0.5rem)] lg:justify-self-center':
                count === 3 && index === 2,
            })}
          />
        ))}
      </div>
    </>
  );
}
