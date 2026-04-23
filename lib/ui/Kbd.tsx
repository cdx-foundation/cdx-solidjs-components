import { type JSX, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * ### Kbd Component (Keyboard Key)
 *
 * A semantic element for displaying keyboard shortcuts or key commands.
 * Designed to look like a physical key cap, it uses a consistent monospace font and a subtle
 * background to differentiate shortcuts from regular text.
 *
 * @example
 * ```tsx
 * // Simple key
 * <Kbd>ESC</Kbd>
 *
 * // Combined shortcut
 * <div class="flex items-center gap-1">
 *   <Kbd>⌘</Kbd>
 *   <Kbd>K</Kbd>
 * </div>
 * ```
 *
 * **Design Specifications:**
 * - **Pointer Events:** Set to `none` by default, as keys are informational and typically not clickable.
 * - **Typography:** Uses a very small font size (10px) with medium weight for high legibility in dense UIs.
 * - **Sizing:** Fixed height (5 units) to maintain a consistent horizontal "key" look across various contents.
 *
 * @param props - Standard HTML attributes for the `<kbd>` element.
 */
export const Kbd = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return (
    <kbd
      class={twMerge(
        'pointer-events-none inline-flex h-5 select-none items-center gap-1 border border-stroke bg-surface px-1.5 font-mono text-[10px] font-medium text-muted opacity-100',
        local.class,
      )}
      {...others}
    />
  );
};
