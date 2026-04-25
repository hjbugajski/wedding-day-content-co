import type { ComponentProps } from 'react';

export function IconExclamationCircle(props: ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8V12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="15.7996" r="1.2" fill="currentColor" />
    </svg>
  );
}
