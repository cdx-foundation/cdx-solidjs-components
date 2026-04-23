import { type JSX, Show, createSignal } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and properties for the HoverCard component.
 */
interface HoverCardProps {
  /**
   * The element (e.g., a Username link or Icon) that reveals the card when the mouse enters its area.
   */
  trigger: JSX.Element;

  /**
   * The rich content (e.g., a profile summary or preview image) to display within the card.
   */
  children: JSX.Element;

  /**
   * Custom CSS classes for the floating card container.
   */
  class?: string;
}

/**
 * ### HoverCard Component
 *
 * Provides a non-interactive preview of content that appears when hovering over a trigger.
 * It is designed with a specific "grace period" (200ms delay) that prevents accidental closure
 * when the mouse moves between the trigger and the card.
 *
 * @example
 * ```tsx
 * <HoverCard
 *   trigger={<a href="/u/yanis" class="underline">@yanis</a>}
 * >
 *   <div class="flex gap-4">
 *     <Avatar fallback="YA" />
 *     <div>
 *       <h4 class="text-sm font-bold">Yanis</h4>
 *       <p class="text-xs text-muted">Building the future of coding.</p>
 *     </div>
 *   </div>
 * </HoverCard>
 * ```
 *
 * **Interaction Behaviors:**
 * - **Intent-based Delay:** Uses a 200ms timeout on mouse leave, allowing users to hover over the card content itself without it disappearing.
 * - **Auto-centering:** The card is automatically centered horizontally above the trigger.
 * - **Transition:** Smooth fade-in and vertical slide-up animation for a premium feel.
 *
 * @param props - Customization options including the `trigger` and `children`.
 */
export const HoverCard = (props: HoverCardProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  let timeoutId: number | undefined;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = window.setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div
      class="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div class="cursor-help">{props.trigger}</div>
      <Show when={isOpen()}>
        <div
          class={twMerge(
            'absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-64 border border-stroke bg-panel p-4 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-150',
            props.class,
          )}
        >
          {props.children}
        </div>
      </Show>
    </div>
  );
};
