import { useFieldAria, useFieldContext } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { PayloadRadioBlock } from '@/payload/payload-types';

type Props = {
  meta: PayloadRadioBlock;
};

export function RadioField({ meta }: Props) {
  const field = useFieldContext<string>();
  const { hasError } = useFieldAria();

  return (
    <RadioGroup
      value={field.state.value}
      onValueChange={field.handleChange}
      defaultValue={field.state.value}
      aria-invalid={hasError}
      className="flex flex-col justify-start"
    >
      {meta.options.map((option) => (
        <div key={option.id || option.value} className="flex flex-row gap-3">
          <RadioGroupItem value={option.value} />
          <Label className="text-lg font-normal tracking-normal text-neutral-800 normal-case">
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
