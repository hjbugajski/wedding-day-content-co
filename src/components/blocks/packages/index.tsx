import { cva } from 'class-variance-authority';

import { AddOnsAccordion } from '@/components/blocks/packages/add-ons-accordion';
import { RichText } from '@/components/rich-text';
import { Icons } from '@/icons';
import type { PayloadPackagesBlock } from '@/payload/payload-types';

const packagesGridVariants = cva('-m-6 grid grid-cols-1 pb-12', {
  variants: {
    packageCount: {
      1: 'md:grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
      4: 'md:grid-cols-2 lg:grid-cols-4',
    },
  },
  defaultVariants: {
    packageCount: 1,
  },
});

export function PackagesBlock({ packagesSection, addOnsSection }: PayloadPackagesBlock) {
  const packageCount = packagesSection?.packages?.length || 0;
  const gridVariant = packageCount > 4 ? 4 : (packageCount as 1 | 2 | 3 | 4);

  return (
    <section className="my-12 space-y-12 first:mt-0 last:mb-0">
      <div className="space-y-6">
        <div className={packagesGridVariants({ packageCount: gridVariant })}>
          {packagesSection?.packages?.map(
            ({ id, title, details, description, price, highlight }) => (
              <div
                data-highlight={highlight ? 'true' : 'false'}
                key={id}
                className="flex flex-col justify-between gap-4 p-6 data-[highlight=true]:bg-dusty-rose-100 data-[highlight=true]:ring data-[highlight=true]:ring-dusty-rose-600/75 lg:gap-10 lg:rounded-sm"
              >
                <div className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex flex-row justify-between gap-2">
                      <h2 className="text-2xl text-dusty-rose-800">{title}</h2>
                      {highlight ? (
                        <span className="-mt-1 -mr-1 flex h-fit flex-row items-center gap-1 rounded-full border-dusty-rose-400/75 bg-linear-to-r from-dusty-rose-600 to-dusty-rose-800 px-2.5 py-1.5 text-xs font-medium text-dusty-rose-100">
                          <Icons name="sparkle" size="sm" className="mb-0.5" />
                          Most Popular
                        </span>
                      ) : null}
                    </div>
                    {description ? (
                      <div className="text-neutral-600 *:text-base">
                        <RichText data={description} />
                      </div>
                    ) : null}
                  </div>
                  <RichText
                    data={details}
                    overrideClasses={{
                      paragraph: 'my-1 first:mt-0 last:mb-0 text-lg',
                    }}
                  />
                </div>
                <div className="flex items-center justify-between border-l border-l-dusty-rose-600 py-3 pl-4">
                  <p className="pt-1 font-serif text-3xl leading-none font-light text-dusty-rose-800 drop-shadow-lg">
                    {price}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
        {packagesSection?.footer ? (
          <div className="text-neutral-500 *:text-base">
            <RichText data={packagesSection.footer} />
          </div>
        ) : null}
      </div>
      <div className="-mx-6 grid grid-cols-1 gap-6 bg-dusty-rose-100 p-6 md:grid-cols-2 md:gap-12 xl:rounded-sm">
        <div>
          <h2 className="mb-4 text-3xl text-dusty-rose-800">Add-ons</h2>
          {addOnsSection?.description ? (
            <RichText
              data={addOnsSection.description}
              overrideClasses={{
                paragraph: 'my-3 first:mt-0 last:mb-0 text-lg text-dusty-rose-800',
              }}
            />
          ) : null}
        </div>
        <AddOnsAccordion addOns={addOnsSection?.addOns} />
      </div>
    </section>
  );
}
