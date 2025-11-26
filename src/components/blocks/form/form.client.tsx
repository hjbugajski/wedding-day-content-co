'use client';

import { useCallback, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { checkboxConfig } from '@/components/blocks/form/configs/checkbox';
import { dateConfig } from '@/components/blocks/form/configs/date';
import { emailConfig } from '@/components/blocks/form/configs/email';
import { phoneNumberConfig } from '@/components/blocks/form/configs/phone-number';
import { radioConfig } from '@/components/blocks/form/configs/radio';
import { selectConfig } from '@/components/blocks/form/configs/select';
import { textConfig } from '@/components/blocks/form/configs/text';
import { textareaConfig } from '@/components/blocks/form/configs/textarea';
import { submitForm } from '@/components/blocks/form/form.action';
import type { FieldConfig, FieldConfigs, FieldMeta } from '@/components/blocks/form/types';
import { RichText } from '@/components/rich-text';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import type { PayloadFormsCollection } from '@/payload/payload-types';

const fieldConfigs: FieldConfigs = {
  text: textConfig,
  textarea: textareaConfig,
  email: emailConfig,
  phoneNumber: phoneNumberConfig,
  select: selectConfig,
  radio: radioConfig,
  date: dateConfig,
  checkbox: checkboxConfig,
};

function getFieldConfig<M extends FieldMeta>(meta: M): FieldConfig<M> {
  return fieldConfigs[meta.blockType] as unknown as FieldConfig<M>;
}

export function FormClient({
  confirmationMessage,
  fields,
  id,
  submitButtonLabel,
}: PayloadFormsCollection) {
  const [pending, setPending] = useState(false);

  const fieldList = useMemo(
    () => fields.map((meta) => ({ meta, config: getFieldConfig(meta) })),
    [fields],
  );

  const { defaultValues, schemaShape } = useMemo(() => {
    return fieldList.reduce(
      (acc, { meta, config }) => {
        acc.defaultValues[meta.name] = config.defaultValue(meta);
        acc.schemaShape[meta.name] = config.schema(meta);
        return acc;
      },
      {
        defaultValues: {} as Record<string, unknown>,
        schemaShape: {} as Record<string, z.ZodTypeAny>,
      },
    );
  }, [fieldList]);

  const formSchema = useMemo(() => z.object(schemaShape), [schemaShape]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setPending(true);

      try {
        const payload = fields.map((f) => ({
          blockType: f.blockType,
          label: f.label,
          value: getFieldConfig(f).format(f, values[f.name]),
          name: f.name,
        }));

        await submitForm(id, payload);

        toast.success(confirmationMessage);
        form.reset();
      } catch {
        toast.error('Something went wrong. Please try again.');
      } finally {
        setPending(false);
      }
    },
    [form, fields, id, confirmationMessage],
  );

  return (
    <Form {...form}>
      <form
        id={id}
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="my-6 grid w-full grid-cols-1 gap-6 first:mt-0 last:mb-0 sm:grid-cols-2"
      >
        {fieldList.map(({ meta, config: { Renderer } }) => (
          <FormField
            key={meta.id}
            control={form.control}
            name={meta.name}
            render={({ field }) => (
              <FormItem data-width={meta.width} className="data-[width=full]:sm:col-span-2">
                <FormLabel>
                  {meta.label}
                  {meta.required ? null : ' (optional)'}
                </FormLabel>
                <Renderer meta={meta} field={field} />
                <RichText
                  data={meta.description}
                  overrideClasses={{ paragraph: 'text-sm text-neutral-500' }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button
          type="submit"
          disabled={pending}
          variant="primary"
          size="lg"
          iconPosition={pending ? 'left' : undefined}
          className="w-full sm:col-span-2 sm:w-fit sm:justify-self-end"
        >
          {submitButtonLabel}
          {pending ? <Spinner /> : null}
        </Button>
      </form>
    </Form>
  );
}
