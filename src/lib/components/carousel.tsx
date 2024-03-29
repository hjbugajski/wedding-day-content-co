'use client';

import {
  ComponentProps,
  HTMLAttributes,
  KeyboardEvent,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'iconoir-react';

import { Button } from '@/lib/components/button';
import { cn } from '@/lib/utils';

type CarouselProps = {
  opts?: any;
  plugins?: any[];
  setApi?: (api: any) => void;
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

const Carousel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & CarouselProps>(
  ({ opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: 'x',
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const onSelect = useCallback((api: any) => {
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
          ref={ref}
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
  },
);
Carousel.displayName = 'Carousel';

const CarouselContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const { carouselRef } = useCarousel();

  return (
    <div ref={carouselRef}>
      <div ref={ref} className={cn('-ml-4 flex', className)} {...props} />
    </div>
  );
});
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    aria-roledescription="slide"
    className={cn('min-w-0 shrink-0 grow-0 basis-full pl-4', className)}
    {...props}
  />
));
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = forwardRef<HTMLButtonElement, ComponentProps<typeof Button>>(
  ({ className, variant, size, iconPosition = 'center', ...props }, ref) => {
    const { scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        iconPosition={iconPosition}
        disabled={!canScrollPrev}
        className={cn(
          '!w-12 md:absolute md:left-6 md:top-1/2 md:-translate-y-1/2',
          !canScrollPrev && 'md:hidden',
          className,
        )}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  },
);
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = forwardRef<HTMLButtonElement, ComponentProps<typeof Button>>(
  ({ className, variant = 'outlined', size, iconPosition = 'center', ...props }, ref) => {
    const { scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        iconPosition={iconPosition}
        disabled={!canScrollNext}
        className={cn(
          '!w-12 md:absolute md:right-6 md:top-1/2 md:-translate-y-1/2',
          !canScrollNext && 'md:hidden',
          className,
        )}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  },
);
CarouselNext.displayName = 'CarouselNext';

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
