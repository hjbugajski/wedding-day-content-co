import type { ReactNode } from 'react';

import { FormClient } from '@/components/blocks/form/form.client';
import type { RichTextComponent } from '@/components/rich-text/types';
import type { PayloadFormBlock } from '@/payload/payload-types';
import { slugify } from '@/utils/slugify';

interface FormBlockProps extends PayloadFormBlock {
  RichText: RichTextComponent;
}

export function FormBlock({ RichText, ...props }: FormBlockProps) {
  const { form } = props;

  if (!form || typeof form === 'string') {
    // TODO: make alert component
    return <p>There was an error rendering the form. Please reload the page and try again.</p>;
  }

  const fieldDescriptions: Record<string, ReactNode> = {};
  const optionDescriptions: Record<string, Record<string, ReactNode>> = {};

  for (const field of form.fields) {
    if (field.description) {
      fieldDescriptions[field.name] = (
        <RichText
          data={field.description}
          overrideClasses={{ paragraph: 'text-sm text-neutral-500' }}
        />
      );
    }

    if (field.blockType === 'checkbox') {
      const options: Record<string, ReactNode> = {};

      for (const option of field.options) {
        if (option.description) {
          options[option.id || option.value] = (
            <RichText
              data={option.description}
              overrideClasses={{ paragraph: 'text-sm text-neutral-500' }}
            />
          );
        }
      }

      optionDescriptions[field.name] = options;
    }
  }

  return (
    <section className="mx-auto w-full max-w-4xl">
      <h1 id={slugify(form.title)} className="mt-10 mb-8 text-4xl first:mt-0 last:mb-0 xs:text-5xl">
        {form?.title}
      </h1>
      <RichText data={form.description} />
      <FormClient
        {...form}
        fieldDescriptions={fieldDescriptions}
        optionDescriptions={optionDescriptions}
      />
    </section>
  );
}
