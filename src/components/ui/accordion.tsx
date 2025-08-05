'use client';

import type { ComponentProps } from 'react';

import { Content, Header, Item, Root, Trigger } from '@radix-ui/react-accordion';

import { Icons } from '@/icons';
import { cn } from '@/utils/cn';
import { slugify } from '@/utils/slugify';

const Accordion = Root;

const AccordionItem = ({ className, ...props }: ComponentProps<typeof Item>) => (
  <Item
    className={cn(
      'group border-b-2 border-neutral-800 last:border-b-0 dark:border-neutral-200/75',
      className,
    )}
    {...props}
  />
);

const AccordionHeader = ({ className, ...props }: ComponentProps<typeof Header>) => (
  <Header className={cn('flex', className)} {...props} />
);

const AccordionTrigger = ({ className, children, ...props }: ComponentProps<typeof Trigger>) => (
  <Trigger
    className={cn(
      '-mx-4 flex flex-1 items-center justify-between overflow-clip rounded-sm p-4 text-left text-xl font-normal group-first:-mt-4 group-last:-mb-4 hover:underline hover:underline-offset-3 focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:outline-hidden dark:focus-visible:ring-neutral-200 [&[data-state=open]>div]:rotate-180',
      className,
    )}
    data-umami-event="Accordion trigger"
    data-umami-event-id={slugify(JSON.stringify(children))}
    {...props}
  >
    {children}
    <div className="flex h-8 items-center justify-center transition-transform duration-200">
      <Icons name="navArrowDown" />
    </div>
  </Trigger>
);

const AccordionContent = ({ className, children, ...props }: ComponentProps<typeof Content>) => (
  <Content
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 group-last:pt-4 dark:text-neutral-400', className)}>{children}</div>
  </Content>
);

export { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent };
