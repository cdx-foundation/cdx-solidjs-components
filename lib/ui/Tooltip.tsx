import { createSignal, type JSX } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { Floating } from './Floating';

/**
 * Configuration and properties for the Tooltip component.
 */
interface TooltipProps {
  /**
   * The element (e.g., an Icon or Button) that triggers the tooltip visibility when hovered.
   */
  trigger: JSX.Element;

  /**
   * The text or rich content to display within the tooltip.
   */
  content: JSX.Element | string;

  /**
   * Custom CSS classes for the floating tooltip panel.
   */
  class?: string;

  /**
   * The cardinal direction where the tooltip should appear relative to the trigger.
   * @default "top"
   */
  align?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * ### Tooltip Component
 *
 * A compact floating label that provides additional context about an element when hovered.
 * Now uses position: fixed and zero animations for instant, accurate placement.
 *
 * @param props - Customization options including `trigger`, `content`, and `align`.
 */
export const Tooltip = (props: TooltipProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const align = props.align || 'top';

  const getArrowClasses = () => {
    switch (align) {
      case 'top':
        return 'after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-fg';
      case 'bottom':
        return 'after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-b-fg';
      case 'left':
        return 'after:left-full after:top-1/2 after:-translate-y-1/2 after:border-l-fg';
      case 'right':
        return 'after:right-full after:top-1/2 after:-translate-y-1/2 after:border-r-fg';
    }
  };

  return (
    <Floating
      isOpen={isOpen()}
      align={align}
      sideOffset={8}
      class={twMerge(
        'pointer-events-none whitespace-nowrap rounded-card border border-stroke bg-fg px-2.5 py-1.5 text-xs font-medium text-panel shadow-xl after:absolute after:border-4 after:border-transparent',
        getArrowClasses(),
        props.class,
      )}
      trigger={(ref) => (
        <div
          ref={ref}
          class="inline-flex"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {props.trigger}
        </div>
      )}
    >
      {props.content}
    </Floating>
  );
};
