import { type VariantProps, cva } from 'class-variance-authority';

import { AddOnsAccordion } from '@/components/blocks/packages/add-ons-accordion';
import type { RichTextComponent } from '@/components/rich-text/types';
import { Icons } from '@/icons';
import type { PayloadPackagesBlock } from '@/payload/payload-types';
import { cn } from '@/utils/cn';

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

type PackageCount = NonNullable<VariantProps<typeof packagesGridVariants>['packageCount']>;

interface PackagesBlockProps extends PayloadPackagesBlock {
  RichText: RichTextComponent;
}

export function PackagesBlock({ packagesSection, addOnsSection, RichText }: PackagesBlockProps) {
  const packageCount = packagesSection?.packages?.length || 0;
  const gridVariant = (packageCount > 4 ? 4 : packageCount) as PackageCount;

  return (
    <section className="my-12 space-y-12 first:mt-0 last:mb-0">
      <div className="space-y-6">
        <div className={packagesGridVariants({ packageCount: gridVariant })}>
          {packagesSection?.packages?.map(
            ({ id, title, details, description, price, highlight }) => (
              <div
                data-highlight={highlight ? 'true' : 'false'}
                key={id}
                className={cn([
                  'flex flex-col justify-between gap-4 p-6 lg:gap-10 lg:rounded-sm',
                  'data-[highlight=true]:bg-dusty-rose-100 data-[highlight=true]:ring data-[highlight=true]:ring-dusty-rose-600/75',
                ])}
              >
                <div className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex flex-row justify-between gap-2">
                      <h2 className="text-2xl text-dusty-rose-800">{title}</h2>
                      {highlight ? (
                        <span
                          className={cn([
                            '-mt-1 -mr-1 flex h-fit flex-row items-center gap-1 px-2.5 py-1.5',
                            'rounded-full border-dusty-rose-400/75 bg-linear-to-r from-dusty-rose-600 to-dusty-rose-800',
                            'text-xs font-medium text-dusty-rose-100',
                          ])}
                        >
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
                <div
                  className={cn([
                    'flex items-center justify-between py-3 pl-4',
                    'border-l border-l-dusty-rose-600',
                  ])}
                >
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
      <div
        className={cn([
          '-mx-6 grid grid-cols-1 gap-6 p-6 md:grid-cols-2 md:gap-12',
          'bg-dusty-rose-100 xl:rounded-sm',
        ])}
      >
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
        <AddOnsAccordion
          addOns={
            addOnsSection?.addOns?.map(({ id, title, content, price }) => ({
              id,
              title,
              price,
              renderedContent: (
                <RichText
                  data={content}
                  overrideClasses={{
                    paragraph: 'my-1 first:mt-0 text-lg last:mb-0 text-dusty-rose-800',
                  }}
                />
              ),
            })) ?? []
          }
        />
      </div>
    </section>
  );
}
