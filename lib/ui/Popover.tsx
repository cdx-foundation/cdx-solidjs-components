import { createShortcut } from '@solid-primitives/keyboard';
import { createSignal, type JSX, onCleanup } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { Floating } from './Floating';

/**
 * Configuration and behavior properties for the Popover component.
 */
interface PopoverProps {
  /**
   * The element (e.g., a Button or Avatar) that toggles the popover visibility when clicked.
   */
  trigger: JSX.Element;

  /**
   * The content to render inside the floating panel.
   */
  children: JSX.Element;

  /**
   * Custom CSS classes for the popover container.
   */
  class?: string;

  /**
   * The horizontal anchor point of the popover relative to its trigger.
   * @default "bottom"
   */
  align?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * ### Popover Component
 *
 * A floating container used to display rich content or additional options without navigating away.
 */
export const Popover = (props: PopoverProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;
  let triggerRef: HTMLDivElement | undefined;

  const onClickOutside = (e: MouseEvent) => {
    if (
      isOpen() &&
      containerRef &&
      !containerRef.contains(e.target as Node) &&
      triggerRef &&
      !triggerRef.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  document.addEventListener('mousedown', onClickOutside);
  onCleanup(() => document.removeEventListener('mousedown', onClickOutside));

  createShortcut(['Escape'], () => {
    if (isOpen()) setIsOpen(false);
  });

  return (
    <Floating
      isOpen={isOpen()}
      align={props.align || 'bottom'}
      sideOffset={8}
      class={twMerge('border border-stroke bg-panel p-4 shadow-xl rounded-card', props.class)}
      trigger={(ref) => (
        <div
          ref={(el) => {
            triggerRef = el;
            ref(el);
          }}
          onClick={() => setIsOpen(!isOpen())}
          class="inline-block cursor-pointer"
        >
          {props.trigger}
        </div>
      )}
    >
      <div ref={containerRef}>{props.children}</div>
    </Floating>
  );
};
