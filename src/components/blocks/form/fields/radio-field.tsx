import { fieldErrorId, useFieldContext } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { PayloadRadioBlock } from '@/payload/payload-types';

type Props = {
  meta: PayloadRadioBlock;
};

export function RadioField({ meta }: Props) {
  const field = useFieldContext<string>();
  const invalid = !field.state.meta.isValid;

  return (
    <RadioGroup
      value={field.state.value}
      onValueChange={field.handleChange}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? fieldErrorId(field.name) : undefined}
    >
      {meta.options.map((option) => (
        <label key={option.id || option.value} className="flex cursor-pointer flex-row gap-3">
          <RadioGroupItem value={option.value} />
          <span className="text-lg font-normal tracking-normal text-neutral-800 normal-case">
            {option.label}
          </span>
        </label>
      ))}
    </RadioGroup>
  );
}
