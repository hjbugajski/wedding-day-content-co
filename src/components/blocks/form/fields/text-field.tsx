import { Field } from '@base-ui/react/field';

import { useFieldContext } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type {
  PayloadEmailBlock,
  PayloadPhoneNumberBlock,
  PayloadTextBlock,
  PayloadTextareaBlock,
} from '@/payload/payload-types';

type PayloadTextField =
  | PayloadTextBlock
  | PayloadTextareaBlock
  | PayloadEmailBlock
  | PayloadPhoneNumberBlock;

type Props = {
  meta: PayloadTextField;
};

export function TextField({ meta }: Props) {
  const field = useFieldContext<string>();

  const inputType =
    meta.blockType === 'email' ? 'email' : meta.blockType === 'phoneNumber' ? 'tel' : undefined;

  if (meta.blockType === 'textarea') {
    return (
      <Field.Control
        render={<Textarea />}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
    );
  }

  return (
    <Field.Control
      render={<Input type={inputType} />}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
    />
  );
}
