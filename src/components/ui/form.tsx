'use client';

import type { ComponentProps, ReactNode } from 'react';
import { createContext, useContext, useId, useMemo } from 'react';

import {
  type AnyFieldMeta,
  createFormHook,
  createFormHookContexts,
  useStore,
} from '@tanstack/react-form';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/utils/cn';

type FieldAriaContext = {
  id: string;
  errorId: string;
  descriptionId: string;
  hasError: boolean;
  hasDescription: boolean;
};

const FieldAriaCtx = createContext<FieldAriaContext | null>(null);

function useFieldAria(): FieldAriaContext {
  const ctx = useContext(FieldAriaCtx);

  if (!ctx) {
    throw new Error('useFieldAria must be used within a Field component');
  }

  return ctx;
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

function FieldError({ meta, id }: { meta: AnyFieldMeta; id: string }) {
  if (meta.isValid) {
    return null;
  }

  return (
    <p id={id} className="text-xs font-medium text-red-700" role="alert">
      {getErrorMessage(meta.errors[0])}
    </p>
  );
}

type FieldProps = ComponentProps<'div'> & {
  label: string;
  required?: boolean;
  description?: ReactNode;
  width?: string;
};

function Field({ className, children, label, required = true, description, width }: FieldProps) {
  const field = useFieldContext<unknown>();
  const uniqueId = useId();
  const fieldId = `${field.name}-${uniqueId}`;
  const errorId = `${fieldId}-error`;
  const descriptionId = `${fieldId}-description`;
  const hasError = !field.state.meta.isValid;
  const hasDescription = !!description;
  const fieldAria = useMemo(
    () => ({ id: fieldId, errorId, descriptionId, hasError, hasDescription }),
    [fieldId, errorId, descriptionId, hasError, hasDescription],
  );

  return (
    <div
      data-width={width}
      className={cn('flex w-full flex-col gap-2 data-[width=full]:sm:col-span-2', className)}
    >
      <Label htmlFor={fieldId} className={cn(hasError && 'text-red-700')}>
        {label}
        {required ? null : ' (optional)'}
      </Label>
      <FieldAriaCtx.Provider value={fieldAria}>{children}</FieldAriaCtx.Provider>
      {description ? <div id={descriptionId}>{description}</div> : null}
      <FieldError meta={field.state.meta} id={errorId} />
    </div>
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
        'my-6 grid w-full grid-cols-1 gap-6 first:mt-0 last:mb-0 sm:grid-cols-2',
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

export { useAppForm, useFieldAria, useFieldContext };
