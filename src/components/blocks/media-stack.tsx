import { PayloadMedia } from '@/components/ui/payload-media';
import type { PayloadMediaStackBlock } from '@/payload/payload-types';
import type { StripString } from '@/types/strip-string';
import { cn } from '@/utils/cn';
import { isRelationshipPopulated } from '@/utils/is-relationship-populated';

type FilteredMedia = StripString<PayloadMediaStackBlock['media'][number]>;

const scatterByCount: Record<number, string[]> = {
  2: [
    cn('lg:translate-x-4 lg:translate-y-1 lg:-rotate-3'),
    cn('lg:-translate-x-8 lg:-translate-y-2 lg:rotate-3'),
  ],
  3: [
    cn('lg:translate-x-4 lg:translate-y-1 lg:-rotate-3'),
    cn('lg:-translate-x-4 lg:translate-y-1 lg:rotate-3'),
    cn('lg:-translate-y-3 lg:rotate-2'),
  ],
  4: [
    cn('lg:translate-x-4 lg:translate-y-2 lg:-rotate-3'),
    cn('lg:-translate-x-4 lg:translate-y-2 lg:rotate-3'),
    cn('lg:translate-x-4 lg:-translate-y-2 lg:rotate-3'),
    cn('lg:-translate-x-4 lg:-translate-y-2 lg:-rotate-3'),
  ],
};

export function MediaStackBlock({ media }: PayloadMediaStackBlock) {
  const filteredMedia = media?.filter((item) => isRelationshipPopulated<FilteredMedia>(item));

  if (!filteredMedia?.length) {
    return null;
  }

  const count = filteredMedia.length;

  return (
    <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-1! lg:grid-cols-2!">
      {filteredMedia.map(({ relationTo, value }, index) => (
        <PayloadMedia
          key={value.id}
          relationTo={relationTo}
          value={value}
          className={cn('rounded-sm surface-card', 'first:z-10', scatterByCount[count]?.[index], {
            'col-span-2 w-full justify-self-center xs:w-[calc(50%-0.5rem)] md:w-full lg:w-[calc(50%-0.5rem)]':
              count === 3 && index === 2,
          })}
        />
      ))}
    </div>
  );
}
