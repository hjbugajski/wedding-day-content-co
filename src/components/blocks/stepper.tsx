import { Fragment } from 'react';

import { RichText } from '@/components/rich-text';
import type { PayloadStepperBlock } from '@/payload/payload-types';

export function StepperBlock({ steps }: PayloadStepperBlock) {
  if (!steps?.length) {
    return null;
  }

  return (
    <div className="relative my-6 ml-4 max-w-5xl border-l-2 border-neutral-200/75 pl-8 first:mt-0 last:mb-0">
      {steps.map(({ content, heading, id }, i) => (
        <Fragment key={id}>
          <h2 className="relative mt-12 mb-4 flex items-center text-3xl leading-9.5 drop-shadow-none first:mt-0 last:mb-0 xs:text-4xl">
            <span className="sr-only">Step</span>
            <span className="absolute -top-0.5 -ml-13 inline-flex size-9 items-center justify-center rounded-sm border-2 border-neutral-200 bg-neutral-100 font-sans text-lg font-medium ring-8 ring-neutral-50">
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
