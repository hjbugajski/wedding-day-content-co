'use client';

import type { ComponentProps, KeyboardEvent, RefObject } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Button } from '@/components/ui/button';
import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

type CarouselContextValue = {
  scrollRef: RefObject<HTMLDivElement | null>;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

type CarouselProps = ComponentProps<'div'> & { 'aria-label': string };

const Carousel = ({ className, children, ...props }: CarouselProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;

    if (!el) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = el;

    setCanScrollPrev(scrollLeft > 1);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  const scrollToDirection = useCallback((direction: 1 | -1) => {
    const el = scrollRef.current;

    if (!el) {
      return;
    }

    const items = el.querySelectorAll<HTMLElement>('[data-carousel-item]');

    if (!items.length) {
      return;
    }

    // Assumes all items share the same scroll-snap-align (true for CarouselItem callers).
    const align = getComputedStyle(items[0]).scrollSnapAlign.split(' ').pop() ?? 'start';
    const isCenter = align === 'center';
    const isEnd = align === 'end';

    const containerRect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const spl = parseFloat(style.scrollPaddingLeft) || 0;
    const spr = parseFloat(style.scrollPaddingRight) || 0;

    const containerAnchor = isCenter
      ? containerRect.left + spl + (containerRect.width - spl - spr) / 2
      : isEnd
        ? containerRect.right - spr
        : containerRect.left + spl;

    const itemAnchor = (item: HTMLElement) => {
      const r = item.getBoundingClientRect();

      if (isCenter) {
        return r.left + r.width / 2;
      }

      if (isEnd) {
        return r.right;
      }

      return r.left;
    };

    let currentIndex = 0;
    let bestDistance = Infinity;

    for (let i = 0; i < items.length; i++) {
      const distance = Math.abs(itemAnchor(items[i]) - containerAnchor);

      if (distance < bestDistance) {
        bestDistance = distance;
        currentIndex = i;
      } else {
        break;
      }
    }

    const targetIndex = currentIndex + direction;

    if (targetIndex < 0 || targetIndex >= items.length) {
      return;
    }

    const inline: ScrollLogicalPosition = isCenter ? 'center' : isEnd ? 'end' : 'start';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    items[targetIndex].scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline,
    });
  }, []);

  const scrollPrev = useCallback(() => scrollToDirection(-1), [scrollToDirection]);
  const scrollNext = useCallback(() => scrollToDirection(1), [scrollToDirection]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;

      if (target.closest('input, textarea, select, [contenteditable="true"]')) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  useEffect(() => {
    const el = scrollRef.current;

    if (!el) {
      return;
    }

    updateScrollState();

    el.addEventListener('scroll', updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollState);

    resizeObserver.observe(el);

    for (const child of Array.from(el.children)) {
      resizeObserver.observe(child);
    }

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState]);

  const contextValue = useMemo(
    () => ({ scrollRef, scrollPrev, scrollNext, canScrollPrev, canScrollNext }),
    [scrollPrev, scrollNext, canScrollPrev, canScrollNext],
  );

  return (
    <CarouselContext.Provider value={contextValue}>
      <div
        className={cn('relative', className)}
        role="region"
        aria-roledescription="carousel"
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
};

const CarouselContent = ({ className, ...props }: ComponentProps<'div'>) => {
  const { scrollRef } = useCarousel();

  return (
    <div
      ref={scrollRef}
      tabIndex={-1}
      className={cn(
        'flex gap-4 outline-hidden',
        'overflow-x-auto scroll-smooth motion-reduce:scroll-auto',
        'snap-x snap-mandatory',
        'scroll-x-bleed scrollbar-hidden',
        className,
      )}
      {...props}
    />
  );
};

const CarouselItem = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    data-carousel-item
    role="group"
    aria-roledescription="slide"
    className={cn('min-w-0 shrink-0 grow-0', 'snap-center snap-always sm:snap-start', className)}
    {...props}
  />
);

const CarouselPrevious = ({
  className,
  variant = 'secondary',
  size,
  iconPosition = 'center',
  ...props
}: ComponentProps<typeof Button>) => {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      variant={variant}
      size={size}
      iconPosition={iconPosition}
      disabled={!canScrollPrev}
      className={cn(
        'w-12! md:absolute md:top-1/2 md:left-6 md:-translate-y-1/2',
        { 'md:hidden': !canScrollPrev },
        className,
      )}
      onClick={scrollPrev}
      {...props}
    >
      <Icons name="arrowLeft" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
};

const CarouselNext = ({
  className,
  variant = 'secondary',
  size,
  iconPosition = 'center',
  ...props
}: ComponentProps<typeof Button>) => {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      variant={variant}
      size={size}
      iconPosition={iconPosition}
      disabled={!canScrollNext}
      className={cn(
        'w-12! md:absolute md:top-1/2 md:right-6 md:-translate-y-1/2',
        { 'md:hidden': !canScrollNext },
        className,
      )}
      onClick={scrollNext}
      {...props}
    >
      <Icons name="arrowRight" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
};

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
