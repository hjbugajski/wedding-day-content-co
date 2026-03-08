import { useFieldAria, useFieldContext } from '@/components/ui/form';
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
  const { id, errorId, descriptionId, hasError, hasDescription } = useFieldAria();

  const ariaDescribedBy =
    [hasDescription ? descriptionId : null, hasError ? errorId : null].filter(Boolean).join(' ') ||
    undefined;

  const inputType =
    meta.blockType === 'email' ? 'email' : meta.blockType === 'phoneNumber' ? 'tel' : undefined;

  if (meta.blockType === 'textarea') {
    return (
      <Textarea
        id={id}
        name={field.name}
        value={field.state.value}
        aria-invalid={hasError}
        aria-describedby={ariaDescribedBy}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
    );
  }

  return (
    <Input
      id={id}
      name={field.name}
      type={inputType}
      value={field.state.value}
      aria-invalid={hasError}
      aria-describedby={ariaDescribedBy}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
    />
  );
}
