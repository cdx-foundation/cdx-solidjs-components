import { type Accessor, createEffect, onCleanup } from 'solid-js';

/**
 * CSS selector for focusable elements.
 */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Creates a focus trap that keeps Tab/Shift+Tab focus cycling within the container
 * element while `isActive` is true. When the trap deactivates, focus is restored to
 * the element that had focus before the trap activated.
 *
 * SSR-safe: all `document` / `window` access is guarded.
 *
 * @param container - Accessor returning the container element (or `undefined` if unmounted).
 * @param isActive  - Accessor indicating whether the trap should be engaged.
 */
export function createFocusTrap(
  container: Accessor<HTMLElement | undefined>,
  isActive: Accessor<boolean>,
): void {
  let previouslyFocused: Element | null = null;

  createEffect(() => {
    if (typeof document === 'undefined') return;
    if (!isActive()) return;

    const el = container();
    if (!el) return;

    // Remember which element was focused before opening the overlay
    previouslyFocused = document.activeElement;

    // Move focus into the container – prefer the first focusable descendant
    const firstFocusable = el.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      el.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    onCleanup(() => {
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus to the element that was focused before the overlay opened
      if (previouslyFocused && typeof (previouslyFocused as HTMLElement).focus === 'function') {
        (previouslyFocused as HTMLElement).focus();
      }
    });
  });
}
