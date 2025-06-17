import type { ComponentProps } from 'react';

import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';

import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn('group/navigation-menu relative', className)}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn('relative', className)}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn('relative', className)}
      {...props}
    />
  );
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(
        'group inline-flex items-center justify-center rounded-xs text-sm subheading transition',
        'focus-visible:ring-2 focus-visible:ring-black/75 focus-visible:outline-hidden dark:focus-visible:ring-white/75',
        className,
      )}
      {...props}
    >
      {children}{' '}
      <Icons
        name="navArrowDownSmall"
        className="relative ml-0.5 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        'top-0 left-1/2 w-full -translate-x-1/2 backdrop-blur-lg data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=from-]:slide-in-from-bottom-2 data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out data-[motion^=to-]:slide-out-to-bottom-2 md:absolute md:w-auto',
        'group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-7 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-xs group-data-[viewport=false]/navigation-menu:bg-neutral-900 group-data-[viewport=false]/navigation-menu:text-neutral-200 group-data-[viewport=false]/navigation-menu:shadow-lg group-data-[viewport=false]/navigation-menu:ring-2 group-data-[viewport=false]/navigation-menu:shadow-black/10 group-data-[viewport=false]/navigation-menu:ring-neutral-800/75 group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:slide-out-to-bottom-2 group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=open]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className={cn('isolate z-50 flex w-full justify-center')}>
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          'relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-xs bg-neutral-900 text-neutral-200 shadow-lg ring-2 shadow-black/10 ring-neutral-800 backdrop-blur-lg data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
          className,
        )}
        {...props}
      />
    </div>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuViewport,
};
