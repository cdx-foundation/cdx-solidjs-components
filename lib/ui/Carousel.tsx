import { makeEventListener } from '@solid-primitives/event-listener';
import { ChevronLeft, ChevronRight } from 'lucide-solid';
import { createSignal, For, type JSX, onMount, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and properties for the Carousel component.
 */
interface CarouselProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * An ordered list of content elements to display as individual slides.
   * Each element is automatically wrapped in a snap-container.
   */
  items: JSX.Element[];
}

/**
 * ### Carousel Component
 *
 * A high-performance, responsive slider used for browsing collections of images, cards, or products.
 * It leverages native browser snap-scrolling for the best possible touch and trackpad experience,
 * while providing manual navigation controls for mouse users.
 *
 * @param props - Customization options including the `items` array and container classes.
 */
export const Carousel = (props: CarouselProps) => {
  const [local, others] = splitProps(props, ['items', 'class']);
  let containerRef: HTMLDivElement | undefined;
  const [canScrollLeft, setCanScrollLeft] = createSignal(false);
  const [canScrollRight, setCanScrollRight] = createSignal(true);

  const updateScrollState = () => {
    if (!containerRef) return;
    setCanScrollLeft(containerRef.scrollLeft > 0);
    setCanScrollRight(
      Math.ceil(containerRef.scrollLeft + containerRef.clientWidth) < containerRef.scrollWidth,
    );
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef) return;
    const scrollAmount = containerRef.clientWidth * 0.8;
    containerRef.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  onMount(() => {
    if (containerRef) {
      makeEventListener(containerRef, 'scroll', updateScrollState, { passive: true });
      updateScrollState();
    }
  });

  return (
    <div class={twMerge('relative group w-full', local.class)} {...others}>
      <div
        ref={containerRef}
        class="flex w-full gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ 'scrollbar-width': 'none', '-ms-overflow-style': 'none' }}
      >
        <For each={local.items}>
          {(item) => <div class="snap-center shrink-0 w-[80%] sm:w-[50%] md:w-[30%]">{item}</div>}
        </For>
      </div>

      <button
        type="button"
        disabled={!canScrollLeft()}
        onClick={() => scroll('left')}
        class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-panel border border-stroke text-fg opacity-0 group-hover:opacity-100 transition-opacity disabled:hidden"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        type="button"
        disabled={!canScrollRight()}
        onClick={() => scroll('right')}
        class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-panel border border-stroke text-fg opacity-0 group-hover:opacity-100 transition-opacity disabled:hidden"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
