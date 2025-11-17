import type { ControllerRenderProps } from 'react-hook-form';

import { RichText } from '@/components/rich-text';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import type { PayloadCheckboxBlock } from '@/payload/payload-types';

type Props = {
  meta: PayloadCheckboxBlock;
  field: ControllerRenderProps<Record<string, string>, string>;
};

export function CheckboxField({ meta, field }: Props) {
  const selectedValues = field.value ? field.value.split(',') : [];

  const handleChange = (value: string, checked: boolean) => {
    let newValues: string[];

    if (checked) {
      newValues = [...selectedValues, value];
    } else {
      newValues = selectedValues.filter((v: string) => v !== value);
    }

    field.onChange(newValues.join(','));
  };

  return (
    <FormControl>
      <div className="flex flex-col justify-start gap-2">
        {meta.options.map((option) => (
          <FormItem key={option.id || option.value} className="flex flex-row items-start gap-3">
            <FormControl>
              <Checkbox
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) => handleChange(option.value, checked === true)}
              />
            </FormControl>
            <div className="flex flex-col gap-1">
              <FormLabel className="text-lg font-normal tracking-normal text-neutral-800 normal-case">
                {option.label}
              </FormLabel>
              {option.description ? (
                <RichText
                  data={option.description}
                  overrideClasses={{ paragraph: 'text-sm text-neutral-500' }}
                />
              ) : null}
            </div>
          </FormItem>
        ))}
      </div>
    </FormControl>
  );
}
