'use client';

import type { ComponentProps } from 'react';

import {
  Content,
  Group,
  Icon,
  Item,
  ItemIndicator,
  ItemText,
  Label,
  Portal,
  Root,
  ScrollDownButton,
  ScrollUpButton,
  Separator,
  Trigger,
  Value,
  Viewport,
} from '@radix-ui/react-select';

import { OverflowText } from '@/components/ui/overflow-text';
import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

const Select = Root;

const SelectGroup = Group;

const SelectValue = Value;

const SelectTrigger = ({ className, children, ...props }: ComponentProps<typeof Trigger>) => (
  <Trigger
    className={cn(
      'flex h-14 w-full items-center justify-between rounded-sm border-2 border-neutral-300/60 bg-neutral-50 pr-3 pl-4 text-lg shadow-md shadow-neutral-500/5 transition placeholder:text-neutral-500 hover:border-neutral-500/60 hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-400/75 focus-visible:outline-hidden [&>span]:line-clamp-1 [&[data-state=open]>svg]:rotate-180',
      className,
    )}
    {...props}
  >
    {children}
    <Icon asChild>
      <Icons
        name="navArrowDownSmall"
        size="lg"
        className="text-neutral-500 transition-transform duration-200"
      />
    </Icon>
  </Trigger>
);

const SelectScrollUpButton = ({ className, ...props }: ComponentProps<typeof ScrollUpButton>) => (
  <ScrollUpButton
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <Icons name="navArrowUp" className="text-neutral-500" />
  </ScrollUpButton>
);

const SelectScrollDownButton = ({
  className,
  ...props
}: ComponentProps<typeof ScrollDownButton>) => (
  <ScrollDownButton
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <Icons name="navArrowDown" className="text-neutral-500" />
  </ScrollDownButton>
);

const SelectContent = ({
  className,
  children,
  position = 'popper',
  ...props
}: ComponentProps<typeof Content>) => (
  <Portal>
    <Content
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-sm border-2 border-neutral-300/60 bg-neutral-50 text-neutral-800 shadow-lg shadow-neutral-500/10 transition hover:border-neutral-500/60 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        position === 'popper' &&
          'w-full min-w-[var(--radix-select-trigger-width)] data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <Viewport
        className={cn(
          'flex flex-col gap-1 p-1',
          position === 'popper' && 'h-[var(--radix-select-trigger-height)]',
        )}
      >
        {children}
      </Viewport>
    </Content>
  </Portal>
);

const SelectLabel = ({ className, ...props }: ComponentProps<typeof Label>) => (
  <Label className={cn('py-1.5 pr-2 pl-8 text-sm font-semibold', className)} {...props} />
);

const SelectItem = ({ className, children, ...props }: ComponentProps<typeof Item>) => (
  <Item
    className={cn(
      'relative flex w-full cursor-pointer items-center justify-between rounded-xs py-2 pr-3.75 pl-3 text-lg text-neutral-800 outline-hidden select-none hover:bg-neutral-200 focus-visible:bg-neutral-200 focus-visible:text-black data-disabled:pointer-events-none data-disabled:opacity-50 data-[state=checked]:bg-dusty-rose-100 data-[state=checked]:text-dusty-rose-800 data-[state=checked]:hover:bg-dusty-rose-200 data-[state=checked]:focus-visible:bg-dusty-rose-200',
      className,
    )}
    {...props}
  >
    <OverflowText>
      <ItemText>{children}</ItemText>
    </OverflowText>
    <ItemIndicator asChild>
      <Icons name="circle" className="size-2 fill-current text-dusty-rose-700" />
    </ItemIndicator>
  </Item>
);

const SelectSeparator = ({ className, ...props }: ComponentProps<typeof Separator>) => (
  <Separator className={cn('-mx-1 my-1 h-px bg-neutral-200', className)} {...props} />
);

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
