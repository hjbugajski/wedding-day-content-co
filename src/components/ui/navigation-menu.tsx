import type { ComponentProps } from 'react';

import { NavigationMenu as Base } from '@base-ui/react/navigation-menu';

import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

const NavigationMenu = Base.Root;

const NavigationMenuList = Base.List;

const NavigationMenuItem = Base.Item;

const NavigationMenuLink = Base.Link;

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof Base.Trigger>) {
  return (
    <Base.Trigger
      className={cn(
        'group inline-flex items-center justify-center rounded-xs text-sm subheading transition',
        'focus-ring-link',
        className,
      )}
      {...props}
    >
      {children}{' '}
      <Icons
        name="navArrowDownSmall"
        className="relative ml-0.5 transition duration-300 group-data-popup-open:rotate-180"
        aria-hidden="true"
      />
    </Base.Trigger>
  );
}

function NavigationMenuContent({ className, ...props }: ComponentProps<typeof Base.Content>) {
  return (
    <Base.Content
      className={cn(
        'transition-[opacity,translate] duration-300 ease-out',
        'data-ending-style:opacity-0 data-starting-style:opacity-0',
        'data-[activation-direction=left]:data-starting-style:-translate-x-8',
        'data-[activation-direction=right]:data-starting-style:translate-x-8',
        'data-[activation-direction=left]:data-ending-style:translate-x-8',
        'data-[activation-direction=right]:data-ending-style:-translate-x-8',
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({ className, ...props }: ComponentProps<typeof Base.Viewport>) {
  return (
    <Base.Portal>
      <Base.Positioner
        positionMethod="fixed"
        sideOffset={28}
        className="z-50 transition-[top,left,right,bottom,translate] duration-300 ease-out data-instant:duration-[0s]"
      >
        <Base.Popup
          className={cn(
            'isolate origin-(--transform-origin) overflow-hidden rounded-xs bg-neutral-900 text-neutral-200 shadow-lg ring-2 shadow-neutral-600/10 ring-neutral-800 backdrop-blur-lg',
            'h-(--popup-height) w-(--popup-width)',
            'transition-[opacity,scale,height,width] duration-300 ease-out',
            'data-starting-style:scale-95 data-starting-style:opacity-0',
            'data-ending-style:scale-95 data-ending-style:opacity-0',
          )}
        >
          <Base.Viewport className={cn('relative', className)} {...props} />
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  );
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
};
