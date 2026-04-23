import type { ComponentProps } from 'react';

import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

const baseClass = cn('h-14 w-full form-field-base px-4 text-neutral-800');

const Input = ({ className, ...props }: ComponentProps<'input'>) => (
  <input className={cn(baseClass, className)} {...props} />
);

export type InputButtonProps = ComponentProps<'button'> & {
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
  ...props
}: InputButtonProps) => (
  <button
    type="button"
    className={cn(baseClass, 'group flex flex-row items-center', { 'pr-3': icon }, className)}
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
