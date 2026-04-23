import type { JSX } from 'solid-js';
import { twMerge } from 'tailwind-merge';

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
 * It is highly performant, using CSS `group-hover` for visibility transitions rather than JS state.
 *
 * @example
 * ```tsx
 * <Tooltip
 *   trigger={<IconButton icon={Info} />}
 *   content="Learn more about our pricing plans."
 *   align="right"
 * />
 * ```
 *
 * **Interaction Design:**
 * - **High Performance:** Visibility is managed entirely via CSS, ensuring zero-latency transitions.
 * - **Auto-Positioning:** Correctly offsets itself in four cardinal directions with centering logic.
 * - **Aesthetics:** Uses a high-contrast inverted theme (dark background, light text) to ensure it stands out from the primary UI.
 *
 * @param props - Customization options including `trigger`, `content`, and `align`.
 */
export const Tooltip = (props: TooltipProps) => {
  const align = props.align || 'top';

  const getAlignClasses = () => {
    switch (align) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
    }
  };

  return (
    <div class="group relative inline-flex">
      {props.trigger}
      <div
        class={twMerge(
          'pointer-events-none absolute z-50 whitespace-nowrap border border-stroke bg-fg px-2 py-1 text-xs text-panel opacity-0 transition-opacity duration-200 group-hover:opacity-100',
          getAlignClasses(),
          props.class,
        )}
      >
        {props.content}
      </div>
    </div>
  );
};
