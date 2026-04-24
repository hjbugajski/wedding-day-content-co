'use client';

import type { ComponentProps } from 'react';

import { Accordion as BaseAccordion } from '@base-ui/react/accordion';

import { Icons } from '@/icons';
import { cn } from '@/utils/cn';
import { slugify } from '@/utils/slugify';

const Accordion = BaseAccordion.Root;

const AccordionItem = ({ className, ...props }: ComponentProps<typeof BaseAccordion.Item>) => (
  <BaseAccordion.Item
    className={cn(
      'group border-b-2 border-neutral-800 last:border-b-0 dark:border-neutral-200/75',
      className,
    )}
    {...props}
  />
);

const AccordionHeader = ({ className, ...props }: ComponentProps<typeof BaseAccordion.Header>) => (
  <BaseAccordion.Header className={cn('flex', className)} {...props} />
);

const AccordionTrigger = ({
  className,
  children,
  ...props
}: ComponentProps<typeof BaseAccordion.Trigger>) => (
  <BaseAccordion.Trigger
    className={cn(
      'flex flex-1 justify-between overflow-clip',
      '-mx-4 p-4',
      'rounded-sm text-left text-xl font-normal',
      'hover:underline hover:underline-offset-3 focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:outline-hidden dark:focus-visible:ring-neutral-200',
      'group-first:-mt-4 group-last:-mb-4',
      '[&[data-panel-open]>svg]:rotate-180',
      className,
    )}
    data-umami-event="Accordion trigger"
    data-umami-event-id={slugify(JSON.stringify(children))}
    {...props}
  >
    {children}
    <Icons name="navArrowDown" className="mt-1 transition duration-200" />
  </BaseAccordion.Trigger>
);

const AccordionContent = ({
  className,
  children,
  ...props
}: ComponentProps<typeof BaseAccordion.Panel>) => (
  <BaseAccordion.Panel
    className={cn(
      [
        'h-(--accordion-panel-height) overflow-hidden text-sm',
        'transition-[height] duration-200 ease-out',
        'data-ending-style:h-0 data-starting-style:h-0',
      ],
      className,
    )}
    {...props}
  >
    <div className="pb-4 group-last:pt-4 dark:text-neutral-400">{children}</div>
  </BaseAccordion.Panel>
);

export { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent };
