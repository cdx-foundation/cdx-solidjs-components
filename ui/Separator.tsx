import { type JSX, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and properties for the Separator component.
 */
interface SeparatorProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * The visual axis of the divider.
   * - `horizontal`: A full-width 1px line (standard for rows).
   * - `vertical`: A full-height 1px line (standard for columns).
   * @default "horizontal"
   */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * ### Separator Component
 *
 * A clean visual divider used to separate content sections or group related elements.
 * It automatically adapts its dimensions based on the requested orientation.
 *
 * @example
 * ```tsx
 * // Horizontal divider
 * <div>
 *   <h4>Settings</h4>
 *   <Separator class="my-4" />
 *   <p>General preferences...</p>
 * </div>
 *
 * // Vertical divider in a toolbar
 * <div class="flex h-10 items-center">
 *   <Button>Edit</Button>
 *   <Separator orientation="vertical" class="mx-2" />
 *   <Button>Delete</Button>
 * </div>
 * ```
 *
 * **Visual Design:**
 * - **Subtlety:** Uses the theme's `stroke` color to provide structure without creating visual noise.
 * - **Scaling:** The vertical variant requires a parent container with a defined height (e.g., `flex h-full`).
 *
 * @param props - Customization options including `orientation`.
 */
export const Separator = (props: SeparatorProps) => {
  const [local, others] = splitProps(props, ['orientation', 'class']);
  const isVertical = () => local.orientation === 'vertical';

  return (
    <div
      class={twMerge(
        'shrink-0 bg-stroke',
        isVertical() ? 'h-full w-px' : 'h-px w-full',
        local.class,
      )}
      {...others}
    />
  );
};
