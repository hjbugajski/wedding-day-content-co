'use client';

import { useMemo } from 'react';

import { toast } from 'sonner';

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
import { useAppForm } from '@/components/ui/form';
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
  const fieldList = useMemo(
    () => fields.map((meta) => ({ meta, config: getFieldConfig(meta) })),
    [fields],
  );

  const { defaultValues, fieldSchemas } = useMemo(() => {
    return fieldList.reduce(
      (acc, { meta, config }) => {
        acc.defaultValues[meta.name] = config.defaultValue(meta);
        acc.fieldSchemas[meta.name] = config.schema(meta);
        return acc;
      },
      {
        defaultValues: {} as Record<string, unknown>,
        fieldSchemas: {} as Record<string, ReturnType<FieldConfig<FieldMeta>['schema']>>,
      },
    );
  }, [fieldList]);

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        const payload = fields.map((f) => ({
          blockType: f.blockType,
          label: f.label,
          value: getFieldConfig(f).format(f, value[f.name]),
          name: f.name,
        }));

        await submitForm(id, payload);

        toast.success(confirmationMessage);
        form.reset();
      } catch {
        toast.error('Something went wrong. Please try again.');
      }
    },
  });

  return (
    <form.Form id={id} handleSubmit={() => form.handleSubmit()}>
      {fieldList.map(({ meta, config: { Renderer } }) => {
        const schema = fieldSchemas[meta.name];

        return (
          <form.AppField
            key={meta.id}
            name={meta.name}
            validators={{
              onSubmit: schema,
              onChange: schema,
            }}
          >
            {(field) => (
              <field.Field
                label={meta.label}
                required={meta.required}
                description={
                  meta.description ? (
                    <RichText
                      data={meta.description}
                      overrideClasses={{ paragraph: 'text-sm text-neutral-500' }}
                    />
                  ) : undefined
                }
                width={meta.width}
              >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic field types */}
                <Renderer meta={meta as any} />
              </field.Field>
            )}
          </form.AppField>
        );
      })}
      <form.AppForm>
        <form.SubmitButton>{submitButtonLabel}</form.SubmitButton>
      </form.AppForm>
    </form.Form>
  );
}
