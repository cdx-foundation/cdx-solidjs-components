import { createShortcut } from '@solid-primitives/keyboard';
import { type JSX, Show, createSignal, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { clickOutside } from '../lib/directives';

// Suppress unused warning for directive
false && clickOutside;

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
   * - `left`: Aligns the left edge of the popover with the left edge of the trigger.
   * - `center`: Centers the popover horizontally relative to the trigger.
   * - `right`: Aligns the right edge of the popover with the right edge of the trigger.
   * @default "left"
   */
  align?: 'left' | 'center' | 'right';
}

/**
 * ### Popover Component
 *
 * A floating container used to display rich content or additional options without navigating away.
 * It is typically triggered by a click and automatically dismisses itself when the user clicks
 * anywhere outside the component.
 *
 * @example
 * ```tsx
 * <Popover
 *   trigger={<Button variant="outline">Open Settings</Button>}
 *   align="center"
 * >
 *   <div class="flex flex-col gap-4">
 *     <h4 class="font-bold">Preferences</h4>
 *     <p class="text-sm text-muted">Update your account settings here.</p>
 *     <Button size="sm">Save</Button>
 *   </div>
 * </Popover>
 * ```
 *
 * **Interaction Behaviors:**
 * - **Toggle Logic:** Clicking the trigger toggles the visibility of the popover.
 * - **Smart Dismissal:** Uses the `clickOutside` directive to close when clicking elsewhere.
 * - **Keyboard Support:** Automatically closes on `Escape` key press.
 * - **Alignment Options:** Provides flexible positioning via the `align` prop.
 * - **Transitions:** Smooth fade-in and vertical slide transition.
 *
 * @param props - Customization options including `trigger`, `children`, and `align`.
 */
export const Popover = (props: PopoverProps) => {
  const [isOpen, setIsOpen] = createSignal(false);

  createShortcut(['Escape'], () => {
    if (isOpen()) setIsOpen(false);
  });

  const alignClass =
    props.align === 'right'
      ? 'right-0'
      : props.align === 'center'
        ? 'left-1/2 -translate-x-1/2'
        : 'left-0';

  return (
    <div class="relative inline-block" use:clickOutside={() => setIsOpen(false)}>
      <div onClick={() => setIsOpen(!isOpen())} class="cursor-pointer">
        {props.trigger}
      </div>
      <Show when={isOpen()}>
        <div
          class={twMerge(
            'absolute z-50 mt-2 border border-stroke bg-panel p-4 shadow-md animate-in fade-in slide-in-from-top-2 duration-150',
            alignClass,
            props.class,
          )}
        >
          {props.children}
        </div>
      </Show>
    </div>
  );
};
