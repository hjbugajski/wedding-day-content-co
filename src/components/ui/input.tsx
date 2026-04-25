import type { ComponentProps } from 'react';

import { type VariantProps, cva } from 'class-variance-authority';

import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

const inputVariants = cva(
  'w-full form-field-frame rounded-sm bg-neutral-50 text-neutral-800 placeholder:text-neutral-500 hover:bg-neutral-100',
  {
    variants: {
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-14 px-4 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

type InputSize = NonNullable<VariantProps<typeof inputVariants>['size']>;

type InputProps = Omit<ComponentProps<'input'>, 'size'> & {
  size?: InputSize;
};

const Input = ({ className, size, ...props }: InputProps) => (
  <input className={cn(inputVariants({ size }), className)} {...props} />
);

export type InputButtonProps = Omit<ComponentProps<'button'>, 'size'> & {
  size?: InputSize;
  displayChildren?: boolean;
  icon?: ComponentProps<typeof Icons>['name'];
  placeholder?: string;
};

const InputButton = ({
  children,
  className,
  displayChildren,
  icon,
  placeholder,
  size,
  ...props
}: InputButtonProps) => (
  <button
    type="button"
    className={cn(
      inputVariants({ size }),
      'group flex flex-row items-center',
      { 'pr-3': icon },
      className,
    )}
    {...props}
  >
    {placeholder && !displayChildren ? (
      <span className="text-neutral-500">{placeholder}</span>
    ) : null}
    {displayChildren ? children : null}
    <span className="grow" />
    {icon ? <Icons name={icon} size="lg" className="text-neutral-500" /> : null}
  </button>
);

export { Input, InputButton };
