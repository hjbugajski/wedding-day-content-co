'use client';

import { RichText } from '@/components/rich-text';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { PayloadPackagesBlock } from '@/payload/payload-types';

type Props = {
  addOns: NonNullable<PayloadPackagesBlock['addOnsSection']>['addOns'];
};

export function AddOnsAccordion({ addOns }: Props) {
  if (!addOns?.length) {
    return null;
  }

  return (
    <Accordion type="multiple">
      {addOns.map(({ id, title, content, price }) => (
        <AccordionItem value={id || ''} key={id} className="border-b-dusty-rose-800/75">
          <AccordionHeader asChild>
            <h3 className="font-sans leading-none text-dusty-rose-800 drop-shadow-none">
              <AccordionTrigger className="font-medium">{title}</AccordionTrigger>
            </h3>
          </AccordionHeader>
          <AccordionContent className="flex flex-col gap-4">
            <div>
              <RichText
                data={content}
                overrideClasses={{
                  paragraph: 'my-1 first:mt-0 text-lg last:mb-0 text-dusty-rose-800',
                }}
              />
            </div>
            {price ? <p className="text-lg font-semibold text-dusty-rose-800">{price}</p> : null}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
