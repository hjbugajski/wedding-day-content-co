'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { FocusGuard, getTabbable } from '@/components/ui/focus-guard';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import { PayloadButtonLink } from '@/components/ui/payload-button-link';
import { PayloadLink } from '@/components/ui/payload-link';
import { Icons } from '@/icons';
import type { PayloadNavigationGlobal } from '@/payload/payload-types';
import { cn } from '@/utils/cn';
import { slugify } from '@/utils/slugify';

export function Navigation({ callToAction, navigationItems }: PayloadNavigationGlobal) {
  const ref = useRef<HTMLElement>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    document.body.classList.add('overflow-hidden');

    return () => document.body.classList.remove('overflow-hidden');
  }, [open]);

  useEffect(() => {
    const handleResize = () => {
      const width = document.documentElement.clientWidth || 0;

      if (width >= 992) {
        setOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open || !ref.current) {
      return;
    }

    const container = ref.current;

    const handleFocusIn = (event: FocusEvent) => {
      if (!container.contains(event.target as Node)) {
        getTabbable(container)[0]?.focus({ preventScroll: true });
      }
    };

    document.addEventListener('focusin', handleFocusIn);

    return () => document.removeEventListener('focusin', handleFocusIn);
  }, [open]);

  const toggleMenu = () => setOpen((open) => !open);

  const closeMenu = () => setOpen(false);

  const wrapToFirst = () => getTabbable(ref.current)[0]?.focus({ preventScroll: true });

  const wrapToLast = () => {
    const items = getTabbable(ref.current);

    items[items.length - 1]?.focus({ preventScroll: true });
  };

  return (
    <>
      <div
        aria-hidden
        data-open={open || undefined}
        className="pointer-events-none fixed inset-0 z-40 bg-neutral-50/25 opacity-0 backdrop-blur-md transition-opacity duration-300 ease-out data-open:pointer-events-auto data-open:opacity-100"
      />
      <NavigationMenu
        ref={ref}
        role={open ? 'dialog' : 'navigation'}
        className="fixed inset-x-2 top-2 z-50"
      >
        {open ? <FocusGuard onFocus={wrapToLast} /> : null}
        <NavigationMenuList className="z-50 mx-auto flex h-16 max-w-7xl flex-row items-center justify-between gap-4 rounded-xs bg-neutral-50/75 pr-1 pl-4 shadow-lg ring-2 shadow-neutral-500/10 ring-neutral-200/75 backdrop-blur-lg md-lg:px-4 xl:px-6">
          <li className="flex flex-1">
            <Link href="/" onClick={closeMenu} className="text-sm subheading">
              Wedding Day Content Co.
            </Link>
          </li>
          {navigationItems?.map(({ groupText, id, link, links, navigationType }) => (
            <NavigationMenuItem key={id} className="hidden md-lg:flex">
              {navigationType === 'standalone' && link ? (
                <PayloadLink {...link} className="text-sm subheading" />
              ) : null}
              {navigationType === 'group' && links ? (
                <>
                  <NavigationMenuTrigger>{groupText}</NavigationMenuTrigger>
                  <NavigationMenuContent className="dark max-w-96 min-w-3xs">
                    <ul className="flex w-full flex-col p-2">
                      {links.map((link) => (
                        <li key={link.id || slugify(link.text)}>
                          <NavigationMenuLink
                            closeOnClick
                            render={<PayloadLink {...link} />}
                            className="block w-full p-3 text-sm subheading transition hover:bg-neutral-800/90 hover:no-underline"
                          >
                            {link.description ? (
                              <div className="mt-1 text-xs text-neutral-400 normal-case">
                                {link.description}
                              </div>
                            ) : null}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : null}
            </NavigationMenuItem>
          ))}
          {callToAction.link.text ? (
            <li className="hidden md-lg:block">
              <PayloadButtonLink {...callToAction} />
            </li>
          ) : null}
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            className={cn(
              'inline-flex size-10 items-center justify-center rounded-xs transition md-lg:hidden',
              'focus-visible:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-600/75 focus-visible:outline-hidden',
            )}
          >
            {open ? <Icons name="x" /> : <Icons name="menu" />}
          </button>
        </NavigationMenuList>
        <NavigationMenuViewport />
        <dialog
          aria-hidden={!open}
          open={open}
          className="inset-x-0 z-40 m-[unset] mt-3 w-[unset] -translate-y-2 rounded-xs bg-neutral-50/75 p-4 pt-2 opacity-0 shadow-lg ring-2 shadow-neutral-500/10 ring-neutral-200/75 backdrop-blur-lg transition-[opacity,translate,display] transition-discrete duration-300 ease-out [[open]]:translate-y-0 [[open]]:opacity-100 [[open]]:starting:-translate-y-2 [[open]]:starting:opacity-0"
        >
          <ul className="flex w-full flex-col gap-2">
            {navigationItems?.map(({ id, link, links, navigationType }) =>
              navigationType === 'standalone' && link ? (
                <li key={id || slugify(link.text)}>
                  <PayloadLink
                    {...link}
                    onClick={closeMenu}
                    className="inline-flex h-10 w-full items-center justify-between gap-2 subheading"
                  >
                    <Icons name="arrowRight" />
                  </PayloadLink>
                </li>
              ) : (
                links?.map((link) => (
                  <li key={link.id || slugify(link.text)}>
                    <PayloadLink
                      {...link}
                      onClick={closeMenu}
                      className="inline-flex h-10 w-full items-center justify-between gap-2 subheading"
                    >
                      <Icons name="arrowRight" />
                    </PayloadLink>
                  </li>
                ))
              ),
            )}
            {callToAction.link.text ? (
              <li className="mt-2 flex">
                <PayloadButtonLink
                  {...callToAction}
                  onClick={closeMenu}
                  size="md"
                  className="flex-1"
                />
              </li>
            ) : null}
          </ul>
        </dialog>
        {open ? <FocusGuard onFocus={wrapToFirst} /> : null}
      </NavigationMenu>
    </>
  );
}
