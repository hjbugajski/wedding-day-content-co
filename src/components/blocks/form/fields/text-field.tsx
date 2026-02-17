import type { ComponentProps } from 'react';
import { useMemo } from 'react';

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

  const extra = useMemo(() => {
    const e: Partial<ComponentProps<typeof Input>> = {};

    if (meta.blockType === 'email') {
      e.type = 'email';
    }

    if (meta.blockType === 'phoneNumber') {
      e.type = 'tel';
    }

    return e;
  }, [meta.blockType]);

  return (
    <Input
      id={id}
      name={field.name}
      value={field.state.value}
      aria-invalid={hasError}
      aria-describedby={ariaDescribedBy}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      {...extra}
    />
  );
}
