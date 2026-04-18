import type { ComponentProps } from 'react';

import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

const baseClass =
  'h-14 w-full rounded-sm shadow-md shadow-neutral-500/5 border-2 border-neutral-300/60 bg-neutral-50 px-4 text-lg text-neutral-800 transition placeholder:text-neutral-500 hover:border-neutral-500/60 hover:bg-neutral-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-400/75';

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
    className={cn(
      baseClass,
      'group flex flex-row items-center',
      icon ? 'pr-3' : undefined,
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
