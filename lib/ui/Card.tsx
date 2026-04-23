import { type JSX, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * ### Card Component
 *
 * A fundamental layout container used to group related information and actions.
 * It provides a consistent "panel" aesthetic with standardized padding, border, and background.
 *
 * @example
 * ```tsx
 * <Card class="max-w-sm">
 *   <h3 class="font-bold">Project Update</h3>
 *   <p class="text-sm text-muted">The new documentation is now live.</p>
 *   <Button class="mt-2">View Details</Button>
 * </Card>
 * ```
 *
 * **Design Specifications:**
 * - **Visual Style:** Inherits the `clean-panel` utility class, providing a subtle background and stroke.
 * - **Layout:** Uses a vertical flex layout (`flex-col`) with a default gap of `3` (12px).
 * - **Responsiveness:** Sets `w-full` by default, but allows for custom sizing via the `class` prop.
 *
 * @param props - Standard HTML div attributes for the card container.
 */
export const Card = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div
      class={twMerge('clean-panel w-full p-5 text-left flex flex-col gap-3', local.class)}
      {...others}
    >
      {local.children}
    </div>
  );
};
