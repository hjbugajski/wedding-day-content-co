import { PayloadMedia } from '@/components/ui/payload-media';
import type { PayloadMediaStackBlock } from '@/payload/payload-types';
import type { StripString } from '@/types/strip-string';
import { isRelationshipPopulated } from '@/utils/is-relationship-populated';

type FilteredMedia = StripString<PayloadMediaStackBlock['media'][number]>;

export function MediaStackBlock({ media }: PayloadMediaStackBlock) {
  const filteredMedia = media?.filter((item) => isRelationshipPopulated<FilteredMedia>(item));

  if (!filteredMedia?.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-1! lg:grid-cols-2!">
      {filteredMedia.map(({ relationTo, value }) => (
        <PayloadMedia
          key={value.id}
          relationTo={relationTo}
          value={value}
          className="rounded-sm shadow-lg ring-2 shadow-neutral-500/10 ring-neutral-200 first:z-10 lg:first:translate-x-4 lg:first:translate-y-1 lg:first:-rotate-3 lg:last:-translate-x-8 lg:last:-translate-y-2 lg:last:rotate-3 dark:shadow-neutral-600/10 dark:ring-neutral-700"
        />
      ))}
    </div>
  );
}
