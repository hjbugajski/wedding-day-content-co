import { RichText } from '@/components/rich-text';
import { Checkbox } from '@/components/ui/checkbox';
import { useFieldAria, useFieldContext } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import type { PayloadCheckboxBlock } from '@/payload/payload-types';

type Props = {
  meta: PayloadCheckboxBlock;
};

export function CheckboxField({ meta }: Props) {
  const field = useFieldContext<string>();
  const { hasError } = useFieldAria();
  const selectedValues = field.state.value ? field.state.value.split(',') : [];

  const handleChange = (value: string, checked: boolean) => {
    let newValues: string[];

    if (checked) {
      newValues = [...selectedValues, value];
    } else {
      newValues = selectedValues.filter((v: string) => v !== value);
    }

    field.handleChange(newValues.join(','));
  };

  return (
    <fieldset aria-invalid={hasError} className="flex flex-col justify-start gap-2">
      {meta.options.map((option) => (
        <div key={option.id || option.value} className="flex flex-row items-start gap-3">
          <Checkbox
            checked={selectedValues.includes(option.value)}
            onCheckedChange={(checked) => handleChange(option.value, checked === true)}
          />
          <div className="flex flex-col gap-1">
            <Label className="text-lg font-normal tracking-normal text-neutral-800 normal-case">
              {option.label}
            </Label>
            {option.description ? (
              <RichText
                data={option.description}
                overrideClasses={{ paragraph: 'text-sm text-neutral-500' }}
              />
            ) : null}
          </div>
        </div>
      ))}
    </fieldset>
  );
}
