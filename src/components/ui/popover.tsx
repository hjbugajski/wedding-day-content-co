'use client';

import type { ComponentProps } from 'react';

import { Popover as BasePopover } from '@base-ui/react/popover';

import { cn } from '@/utils/cn';

const Popover = BasePopover.Root;

const PopoverTrigger = BasePopover.Trigger;

const PopoverPortal = BasePopover.Portal;

const PopoverPositioner = BasePopover.Positioner;

const PopoverPopup = ({ className, ...props }: ComponentProps<typeof BasePopover.Popup>) => (
  <BasePopover.Popup
    className={cn(
      'z-50 w-72 origin-(--transform-origin) p-2',
      'surface-overlay bg-neutral-50 text-neutral-800 outline-hidden',
      'transition duration-150 ease-out hover:border-neutral-500/60',
      'data-starting-style:scale-95 data-starting-style:opacity-0',
      'data-ending-style:scale-95 data-ending-style:opacity-0',
      className,
    )}
    {...props}
  />
);

type PopoverContentProps = ComponentProps<typeof BasePopover.Popup> &
  Pick<
    ComponentProps<typeof BasePopover.Positioner>,
    'align' | 'alignOffset' | 'side' | 'sideOffset' | 'collisionPadding' | 'sticky'
  >;

const PopoverContent = ({
  align = 'center',
  alignOffset,
  collisionPadding,
  side,
  sideOffset = 4,
  sticky,
  ...props
}: PopoverContentProps) => (
  <PopoverPortal>
    <PopoverPositioner
      align={align}
      alignOffset={alignOffset}
      collisionPadding={collisionPadding}
      side={side}
      sideOffset={sideOffset}
      sticky={sticky}
    >
      <PopoverPopup {...props} />
    </PopoverPositioner>
  </PopoverPortal>
);

export { Popover, PopoverTrigger, PopoverContent };
