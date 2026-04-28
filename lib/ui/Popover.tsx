import { createShortcut } from '@solid-primitives/keyboard';
import { type JSX, createSignal, onCleanup, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { type Alignment, Floating } from './Floating';

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
   * The anchor point of the popover relative to its trigger.
   * Supports cardinal and diagonal positions.
   * @default "bottom"
   */
  align?: Alignment;
}

/**
 * ### Popover Component
 *
 * A floating container used to display rich content or additional options without navigating away.
 */
export const Popover = (props: PopoverProps) => {
  const [local, others] = splitProps(props, ['trigger', 'children', 'class', 'align']);
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
      align={local.align || 'bottom'}
      sideOffset={8}
      class={twMerge('border border-stroke bg-panel p-4 shadow-xl rounded-card', local.class)}
      trigger={(ref) => (
        <div
          ref={(el) => {
            triggerRef = el;
            ref(el);
          }}
          onClick={() => setIsOpen(!isOpen())}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(!isOpen());
            }
          }}
          class="inline-block cursor-pointer"
        >
          {local.trigger}
        </div>
      )}
      {...others}
    >
      <div ref={containerRef}>{local.children}</div>
    </Floating>
  );
};

/**
 * ### PopoverTrigger Component
 *
 * The element that toggles the popover.
 */
export const PopoverTrigger = (props: { children: JSX.Element; class?: string }) => {
  return <div class={twMerge('inline-block cursor-pointer', props.class)}>{props.children}</div>;
};

/**
 * ### PopoverContent Component
 *
 * The main container for the popover's primary content.
 */
export const PopoverContent = (props: { children: JSX.Element; class?: string }) => {
  return <div class={twMerge('flex flex-col gap-2', props.class)}>{props.children}</div>;
};
