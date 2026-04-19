import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { PayloadMedia } from '@/components/ui/payload-media';
import type { PayloadGalleryBlock } from '@/payload/payload-types';
import type { StripString } from '@/types/strip-string';
import { isRelationshipPopulated } from '@/utils/is-relationship-populated';

type FilteredMedia = StripString<PayloadGalleryBlock['media'][number]>;

export function GalleryBlock({ media, type }: PayloadGalleryBlock) {
  const filteredMedia = media?.filter((item) => isRelationshipPopulated<FilteredMedia>(item));

  if (!filteredMedia?.length) {
    return null;
  }

  if (type === 'grid') {
    const columns: FilteredMedia[][] = [[], [], []];

    filteredMedia.forEach((item, index) => {
      columns[index % 3].push(item);
    });

    return (
      <div className="my-6 flex flex-col gap-4 first:mt-0 last:mb-0 sm:flex-row">
        {columns.map((items, i) => (
          <div key={i} className="flex w-full flex-col gap-4">
            {items.map(({ relationTo, value }) => (
              <PayloadMedia
                key={value.id}
                relationTo={relationTo}
                value={value}
                className="w-full rounded-sm shadow-lg ring-2 shadow-neutral-500/10 ring-neutral-200 dark:shadow-neutral-600/10 dark:ring-neutral-700"
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <Carousel className="first:mt-0 last:mb-0">
      <CarouselContent className="items-center py-6">
        {filteredMedia?.map(({ relationTo, value }) => (
          <CarouselItem key={value.id} className="mi-auto basis-11/12 sm:basis-1/2 md:basis-1/3">
            <PayloadMedia
              relationTo={relationTo}
              value={value}
              className="rounded-sm shadow-lg ring-2 shadow-neutral-500/10 ring-neutral-200 dark:shadow-neutral-600/10 dark:ring-neutral-700"
            />
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
