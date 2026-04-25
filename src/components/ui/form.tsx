'use client';

import type { ComponentProps, ReactNode } from 'react';

import { Field as BaseField } from '@base-ui/react/field';
import { createFormHook, createFormHookContexts, useStore } from '@tanstack/react-form';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/utils/cn';

function fieldErrorId(name: string) {
  return `${name}-error`;
}

function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message);
  }

  return 'Invalid';
}

type FieldProps = ComponentProps<typeof BaseField.Root> & {
  label: string;
  required?: boolean;
  description?: ReactNode;
  width?: string;
};

function Field({
  className,
  children,
  label,
  required = true,
  description,
  width,
  ...props
}: FieldProps) {
  const field = useFieldContext<unknown>();
  const invalid = !field.state.meta.isValid;
  const errorMessage = invalid ? getErrorMessage(field.state.meta.errors[0]) : undefined;

  return (
    <BaseField.Root
      name={field.name}
      invalid={invalid}
      data-width={width}
      className={cn('flex w-full flex-col gap-2 data-[width=full]:sm:col-span-2', className)}
      {...props}
    >
      <BaseField.Label render={<Label />}>
        {label}
        {required ? null : ' (optional)'}
      </BaseField.Label>
      {children}
      {description ? (
        <BaseField.Description render={<div />}>{description}</BaseField.Description>
      ) : null}
      {invalid ? (
        <BaseField.Error
          id={fieldErrorId(field.name)}
          match={true}
          className="text-xs font-medium text-red-700"
          role="alert"
        >
          {errorMessage}
        </BaseField.Error>
      ) : null}
    </BaseField.Root>
  );
}

type SubmitButtonProps = ComponentProps<typeof Button> & {
  submittingText?: string;
};

function SubmitButton({
  children,
  submittingText,
  className,
  disabled,
  ...props
}: SubmitButtonProps) {
  const form = useFormContext();

  const [isSubmitting, canSubmit] = useStore(form.store, (state) => [
    state.isSubmitting,
    state.canSubmit,
  ]);

  return (
    <Button
      {...props}
      type="submit"
      variant="primary"
      size="lg"
      disabled={!canSubmit || isSubmitting || disabled}
      iconPosition={isSubmitting ? 'left' : undefined}
      className={cn('w-full sm:col-span-2 sm:w-fit sm:justify-self-end', className)}
    >
      {isSubmitting && submittingText ? submittingText : children}
      {isSubmitting ? <Spinner /> : null}
    </Button>
  );
}

type FormProps = Omit<ComponentProps<'form'>, 'onSubmit'> & {
  handleSubmit: () => Promise<void> | void;
};

function Form({ className, handleSubmit, ...props }: FormProps) {
  return (
    <form
      {...props}
      className={cn(
        'my-6 grid w-full grid-cols-1 gap-6 sm:grid-cols-2',
        'first:mt-0 last:mb-0',
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void handleSubmit();
      }}
    />
  );
}

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    Field,
  },
  formComponents: {
    Form,
    SubmitButton,
  },
});

export { fieldErrorId, useAppForm, useFieldContext };
