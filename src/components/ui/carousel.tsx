'use client';

import type { ComponentProps, KeyboardEvent } from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import useEmblaCarousel from 'embla-carousel-react';

import { Button } from '@/components/ui/button';
import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

type EmblaApi = NonNullable<ReturnType<typeof useEmblaCarousel>[1]>;

type CarouselProps = {
  opts?: Parameters<typeof useEmblaCarousel>[0];
  plugins?: Parameters<typeof useEmblaCarousel>[1];
  setApi?: (api: EmblaApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

const Carousel = ({
  opts = {},
  setApi,
  plugins,
  className,
  children,
  ...props
}: ComponentProps<'div'> & CarouselProps) => {
  const [carouselRef, api] = useEmblaCarousel(Object.assign(opts, { axis: 'x' }), plugins);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api: EmblaApi) => {
    if (!api) {
      return;
    }

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
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
    if (!api || !setApi) {
      return;
    }

    setApi(api);
  }, [api, setApi]);

  useEffect(() => {
    if (!api) {
      return;
    }

    onSelect(api);
    api.on('reInit', onSelect);
    api.on('select', onSelect);

    return () => {
      api?.off('select', onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn('relative', className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
};

const CarouselContent = ({ className, ...props }: ComponentProps<'div'>) => {
  const { carouselRef } = useCarousel();

  return (
    <div ref={carouselRef}>
      <div className={cn('-ml-4 flex', className)} {...props} />
    </div>
  );
};

const CarouselItem = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    role="group"
    aria-roledescription="slide"
    className={cn('min-w-0 shrink-0 grow-0 basis-full pl-4', className)}
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
        !canScrollPrev && 'md:hidden',
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
        !canScrollNext && 'md:hidden',
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
