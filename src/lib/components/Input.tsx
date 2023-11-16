import { forwardRef } from 'react';

import { cn } from '../utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={cn(
        'h-14 w-full rounded-xl border border-black border-opacity-75 bg-white px-5 text-lg text-black transition placeholder:text-black/75 hover:border-opacity-100 hover:bg-black/5 focus:border-opacity-100 focus:outline-none focus:ring-2 focus:ring-black/75 dark:border-white dark:bg-black dark:text-white dark:placeholder:text-white/75 dark:hover:bg-white/5 dark:focus:ring-white/75',
        className,
      )}
    />
  );
});
Input.displayName = 'Input';

export { Input };
