'use client';

import { type ComponentProps, createContext, useContext } from 'react';

import { Select as Base } from '@base-ui/react/select';
import { type VariantProps, cva } from 'class-variance-authority';

import { OverflowText } from '@/components/ui/overflow-text';
import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

const selectTriggerVariants = cva(
  [
    'flex w-full form-field-frame items-center justify-between',
    'rounded-sm bg-neutral-50 text-neutral-800',
    'hover:bg-neutral-100',
    '[&>span]:line-clamp-1 [&[data-popup-open]>svg]:rotate-180',
  ],
  {
    variants: {
      size: {
        sm: 'h-9 pr-2 pl-3 text-sm',
        md: 'h-14 pr-3 pl-4 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const selectItemVariants = cva(
  [
    'relative flex w-full cursor-pointer items-center justify-between',
    'rounded-xs text-neutral-800',
    'outline-hidden select-none',
    'hover:bg-neutral-200',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
    'data-highlighted:bg-neutral-200 data-highlighted:text-black',
    'data-selected:bg-dusty-rose-100 data-selected:text-dusty-rose-800 data-selected:hover:bg-dusty-rose-200 data-selected:data-highlighted:bg-dusty-rose-200',
  ],
  {
    variants: {
      size: {
        sm: 'py-1.5 pr-3 pl-3 text-sm',
        md: 'py-2 pr-3.75 pl-3 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

type SelectSize = NonNullable<VariantProps<typeof selectTriggerVariants>['size']>;

const SelectSizeContext = createContext<SelectSize>('md');

const useSelectSize = () => useContext(SelectSizeContext);

type SelectProps<Value> = Omit<
  Base.Root.Props<Value, false>,
  'multiple' | 'onValueChange' | 'value' | 'defaultValue'
> & {
  value?: Value;
  defaultValue?: Value;
  onValueChange?: (value: Value) => void;
  size?: SelectSize;
};

const Select = <Value,>({ onValueChange, size = 'md', ...props }: SelectProps<Value>) => (
  <SelectSizeContext.Provider value={size}>
    <Base.Root
      {...props}
      onValueChange={(value) => {
        if (value !== null) {
          onValueChange?.(value);
        }
      }}
    />
  </SelectSizeContext.Provider>
);

const SelectValue = Base.Value;

const SelectTrigger = ({ className, children, ...props }: ComponentProps<typeof Base.Trigger>) => {
  const size = useSelectSize();

  return (
    <Base.Trigger className={cn(selectTriggerVariants({ size }), className)} {...props}>
      {children}
      <Icons
        name="navArrowDownSmall"
        size={size === 'sm' ? 'md' : 'lg'}
        className="text-neutral-500 transition duration-200"
      />
    </Base.Trigger>
  );
};

const SelectScrollUpButton = ({
  className,
  ...props
}: ComponentProps<typeof Base.ScrollUpArrow>) => (
  <Base.ScrollUpArrow
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <Icons name="navArrowUp" className="text-neutral-500" />
  </Base.ScrollUpArrow>
);

const SelectScrollDownButton = ({
  className,
  ...props
}: ComponentProps<typeof Base.ScrollDownArrow>) => (
  <Base.ScrollDownArrow
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <Icons name="navArrowDown" className="text-neutral-500" />
  </Base.ScrollDownArrow>
);

const SelectContent = ({ className, children, ...props }: ComponentProps<typeof Base.Popup>) => (
  <Base.Portal>
    <Base.Positioner alignItemWithTrigger={false} sideOffset={4} className="z-50">
      <Base.Popup
        className={cn(
          'max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) overflow-hidden',
          'surface-overlay bg-neutral-50 text-neutral-800',
          'transition duration-150 ease-out hover:border-neutral-500/60',
          'data-starting-style:scale-95 data-starting-style:opacity-0',
          'data-ending-style:scale-95 data-ending-style:opacity-0',
          className,
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <Base.List className="flex flex-col gap-1 p-1">{children}</Base.List>
        <SelectScrollDownButton />
      </Base.Popup>
    </Base.Positioner>
  </Base.Portal>
);

const SelectItem = ({ className, children, ...props }: ComponentProps<typeof Base.Item>) => {
  const size = useSelectSize();

  return (
    <Base.Item className={cn(selectItemVariants({ size }), className)} {...props}>
      <OverflowText>
        <Base.ItemText>{children}</Base.ItemText>
      </OverflowText>
      <Base.ItemIndicator
        className="size-2 fill-current text-dusty-rose-700"
        render={<Icons name="circle" />}
      />
    </Base.Item>
  );
};

export { Select, SelectValue, SelectTrigger, SelectContent, SelectItem };
