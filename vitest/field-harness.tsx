import { useRef } from 'react';

import type { FieldConfig, FieldMeta } from '@/components/blocks/form/types';
import { useAppForm } from '@/components/ui/form';

interface FieldHarnessProps<M extends FieldMeta> {
  meta: M;
  config: FieldConfig<M>;
  onSubmit?: (value: unknown) => void;
}

/**
 * Minimal TanStack Form harness for exercising a single field renderer.
 * Mirrors how FormClient wires things, but avoids dragging in the server action graph.
 */
export function FieldHarness<M extends FieldMeta>({
  meta,
  config,
  onSubmit,
}: FieldHarnessProps<M>) {
  const defaultValueRef = useRef(config.defaultValue(meta));

  const form = useAppForm({
    defaultValues: { v: defaultValueRef.current as unknown },
    onSubmit: async ({ value }) => onSubmit?.(value.v),
  });

  const { Renderer } = config;

  return (
    <form.Form handleSubmit={() => form.handleSubmit()}>
      <form.AppField name="v" validators={{ onSubmit: config.schema(meta) }}>
        {(field) => (
          <field.Field
            label={meta.label}
            required={meta.required}
            group={meta.blockType === 'checkbox' || meta.blockType === 'radio'}
          >
            <Renderer meta={meta} />
          </field.Field>
        )}
      </form.AppField>
      <form.AppForm>
        <form.SubmitButton>Submit</form.SubmitButton>
      </form.AppForm>
    </form.Form>
  );
}
