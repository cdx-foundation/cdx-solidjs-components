import { createShortcut } from '@solid-primitives/keyboard';
import { X } from 'lucide-solid';
import { type JSX, Show, createEffect, onCleanup, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and behavior properties for the Modal component.
 */
interface ModalProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * Controls the visibility state of the modal.
   * Recommended to use with a signal: `const [open, setOpen] = createSignal(false);`
   */
  isOpen: boolean;

  /**
   * Event handler triggered when a "close" action is initiated.
   * This includes:
   * - Clicking the 'X' button in the header.
   * - Clicking the dimmed backdrop.
   * - Pressing the `Escape` key.
   */
  onClose: () => void;

  /**
   * The text displayed in the header of the modal.
   * If omitted, the header will only contain the close button.
   */
  title?: string;

  /**
   * Custom CSS classes for the backdrop (the dimmed area behind the modal).
   * Useful for changing blur amount or color (e.g., `bg-primary/20`).
   */
  backdropClass?: string;
}

/**
 * ### Modal Component
 *
 * A high-level dialog window that interrupts the user's workflow to focus on specific content.
 * It is rendered into a `Portal` at the end of the `document.body` to avoid z-index and overflow issues.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = createSignal(false);
 *
 * <Button onClick={() => setOpen(true)}>Open Profile</Button>
 *
 * <Modal
 *   isOpen={open()}
 *   onClose={() => setOpen(false)}
 *   title="User Profile"
 * >
 *   <p>Welcome to your settings. You can update your bio here.</p>
 *   <Button onClick={() => setOpen(false)}>Save Changes</Button>
 * </Modal>
 * ```
 *
 * **Features:**
 * - **Portal Rendering:** Always stays on top of other content.
 * - **Keyboard Support:** Automatically listens for the `Escape` key to close.
 * - **Backdrop Dismissal:** Closes when the area outside the modal is clicked.
 * - **Scroll Lock:** Automatically prevents the background from scrolling when active.
 * - **Transition Animations:** Uses Tailwind-based entry and exit animations.
 *
 * @param props - Customization options including `isOpen`, `onClose`, and `title`.
 */
export const Modal = (props: ModalProps) => {
  const [local, others] = splitProps(props, [
    'isOpen',
    'onClose',
    'title',
    'class',
    'children',
    'backdropClass',
  ]);

  // Handle ESC key to close using primitive
  createShortcut(['Escape'], () => {
    if (local.isOpen) local.onClose();
  });

  // Body Scroll Lock
  createEffect(() => {
    if (local.isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      onCleanup(() => {
        document.body.style.overflow = originalStyle;
      });
    }
  });

  return (
    <Portal>
      <Show when={local.isOpen}>
        <div class="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close modal"
            class={twMerge(
              'absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 border-none cursor-default',
              local.backdropClass,
            )}
            onClick={local.onClose}
          />

          {/* Modal Content */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={local.title ? 'modal-title' : undefined}
            class={twMerge(
              'clean-panel relative z-10 w-full max-w-md p-6 animate-in zoom-in-95 fade-in duration-200 focus:outline-none',
              local.class,
            )}
            {...others}
          >
            <div class="flex items-center justify-between mb-5">
              <Show when={local.title}>
                <h3 id="modal-title" class="text-lg font-bold">
                  {local.title}
                </h3>
              </Show>
              <button
                type="button"
                onClick={local.onClose}
                class="text-muted hover:text-fg transition-colors p-1"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div class="text-fg/80">{local.children}</div>
          </div>
        </div>
      </Show>
    </Portal>
  );
};
