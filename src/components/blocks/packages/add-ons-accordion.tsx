'use client';

import type { ReactNode } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type AddOn = {
  id?: string | null;
  title: string;
  price?: string | null;
  renderedContent: ReactNode;
};

type Props = {
  addOns: AddOn[];
};

export function AddOnsAccordion({ addOns }: Props) {
  if (!addOns.length) {
    return null;
  }

  return (
    <Accordion multiple>
      {addOns.map(({ id, title, renderedContent, price }) => (
        <AccordionItem value={id || ''} key={id} className="border-b-dusty-rose-800/75">
          <AccordionHeader
            // oxlint-disable-next-line jsx-a11y/heading-has-content
            render={<h3 />}
            className="font-sans leading-none text-dusty-rose-800 drop-shadow-none"
          >
            <AccordionTrigger className="font-medium">{title}</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className="flex flex-col gap-4">
            <div>{renderedContent}</div>
            {price ? <p className="text-lg font-semibold text-dusty-rose-800">{price}</p> : null}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
