import { useFieldAria, useFieldContext } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PayloadSelectBlock } from '@/payload/payload-types';

type Props = {
  meta: PayloadSelectBlock;
};

export function SelectField({ meta }: Props) {
  const field = useFieldContext<string>();
  const { hasError } = useFieldAria();

  return (
    <Select
      value={field.state.value}
      onValueChange={field.handleChange}
      defaultValue={field.state.value}
    >
      <SelectTrigger aria-invalid={hasError}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {meta.options.map((option) => (
          <SelectItem key={option.id || option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
