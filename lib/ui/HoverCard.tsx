import { type JSX, createSignal, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { type Alignment, Floating } from './Floating';

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

  /**
   * The anchor point of the card relative to its trigger.
   * @default "top"
   */
  align?: Alignment;
}

/**
 * ### HoverCard Component
 *
 * Provides a non-interactive preview of content that appears when hovering over a trigger.
 * It uses a Portal and dynamic positioning to ensure it isn't clipped by parent containers
 * and stays within the viewport.
 *
 * @param props - Customization options including the `trigger` and `children`.
 */
export const HoverCard = (props: HoverCardProps) => {
  const [local, others] = splitProps(props, ['trigger', 'children', 'class', 'align']);
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
    <Floating
      isOpen={isOpen()}
      align={local.align || 'top'}
      sideOffset={8}
      class={twMerge('w-64 border border-stroke bg-panel p-4 shadow-xl rounded-card', local.class)}
      trigger={(ref) => (
        <div
          ref={ref}
          class="inline-block cursor-help"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {local.trigger}
        </div>
      )}
      {...others}
    >
      <div onMouseEnter={() => clearTimeout(timeoutId)} onMouseLeave={handleMouseLeave}>
        {local.children}
      </div>
    </Floating>
  );
};

/**
 * ### HoverCardTrigger Component
 *
 * The element that triggers the hover card.
 */
export const HoverCardTrigger = (props: { children: JSX.Element; class?: string }) => {
  return <span class={twMerge('cursor-help underline decoration-dotted', props.class)}>{props.children}</span>;
};

/**
 * ### HoverCardContent Component
 *
 * The main container for the hover card's primary content.
 */
export const HoverCardContent = (props: { children: JSX.Element; class?: string }) => {
  return <div class={twMerge('flex flex-col gap-2', props.class)}>{props.children}</div>;
};
