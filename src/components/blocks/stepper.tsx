import { Fragment } from 'react';

import type { RichTextComponent } from '@/components/rich-text/types';
import type { PayloadStepperBlock } from '@/payload/payload-types';
import { cn } from '@/utils/cn';

interface StepperBlockProps extends PayloadStepperBlock {
  RichText: RichTextComponent;
}

export function StepperBlock({ steps, RichText }: StepperBlockProps) {
  if (!steps?.length) {
    return null;
  }

  return (
    <div className="relative my-6 ml-4 max-w-5xl border-l-2 border-neutral-200/75 pl-8 first:mt-0 last:mb-0 dark:border-neutral-700">
      {steps.map(({ content, heading, id }, i) => (
        <Fragment key={id}>
          <h2
            className={cn([
              'relative mt-12 mb-4 flex items-center',
              'text-3xl leading-9.5 drop-shadow-none xs:text-4xl',
              'first:mt-0 last:mb-0',
            ])}
          >
            <span className="sr-only">Step</span>
            <span
              className={cn([
                'absolute -top-0.5 -ml-13',
                'inline-flex size-9 items-center justify-center',
                'rounded-sm border-2 border-neutral-200/75 bg-neutral-100 ring-8 ring-neutral-50',
                'font-sans text-lg font-medium',
                'dark:border-neutral-700 dark:bg-black dark:ring-neutral-800',
              ])}
            >
              <span className="shadow-black/10 t-shadow-lg">{i + 1}</span>
            </span>
            <span className="leading-9.5">{heading}</span>
          </h2>
          <RichText data={content} />
        </Fragment>
      ))}
    </div>
  );
}
