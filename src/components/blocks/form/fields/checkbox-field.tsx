import type { ReactNode } from 'react';

import { Checkbox, CheckboxGroup } from '@/components/ui/checkbox';
import { useFieldContext } from '@/components/ui/form';
import type { PayloadCheckboxBlock } from '@/payload/payload-types';

type Props = {
  meta: PayloadCheckboxBlock;
  optionDescriptions?: Record<string, ReactNode>;
};

export function CheckboxField({ meta, optionDescriptions }: Props) {
  const field = useFieldContext<string[]>();
  const invalid = !field.state.meta.isValid;

  return (
    <CheckboxGroup
      value={field.state.value}
      onValueChange={(value) => field.handleChange(value)}
      aria-invalid={invalid || undefined}
    >
      {meta.options.map((option) => (
        <label
          key={option.id || option.value}
          className="flex cursor-pointer flex-row items-start gap-3"
        >
          <Checkbox value={option.value} />
          <div className="flex flex-col gap-1">
            <span className="text-lg font-normal tracking-normal text-neutral-800 normal-case">
              {option.label}
            </span>
            {optionDescriptions?.[option.id || option.value] ?? null}
          </div>
        </label>
      ))}
    </CheckboxGroup>
  );
}
