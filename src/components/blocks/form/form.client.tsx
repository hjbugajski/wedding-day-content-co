'use client';

import { type ReactNode, useMemo } from 'react';

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
import { useAppForm } from '@/components/ui/form';
import { toast } from '@/components/ui/toasts';
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

interface FormClientProps extends PayloadFormsCollection {
  fieldDescriptions: Record<string, ReactNode>;
  optionDescriptions: Record<string, Record<string, ReactNode>>;
}

export function FormClient({
  confirmationMessage,
  fields,
  id,
  submitButtonLabel,
  fieldDescriptions,
  optionDescriptions,
}: FormClientProps) {
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

        toast.add({ type: 'success', description: confirmationMessage });
        form.reset();
      } catch {
        toast.add({
          type: 'error',
          description: 'Something went wrong. Please try again.',
        });
      }
    },
  });

  return (
    <form.Form id={id} handleSubmit={() => form.handleSubmit()}>
      {fieldList.map(({ meta, config: { Renderer } }) => {
        const schema = fieldSchemas[meta.name];

        return (
          <form.AppField key={meta.id} name={meta.name} validators={{ onSubmit: schema }}>
            {(field) => (
              <field.Field
                label={meta.label}
                required={meta.required}
                description={fieldDescriptions[meta.name]}
                width={meta.width}
              >
                <Renderer meta={meta} optionDescriptions={optionDescriptions[meta.name]} />
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
