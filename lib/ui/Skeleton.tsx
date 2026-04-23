import { type JSX, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * ### Skeleton Component
 *
 * A placeholder used to represent the layout of content while it is loading.
 * It reduces perceived latency and layout shifts by reserving space with a subtle pulse animation.
 *
 * @example
 * ```tsx
 * // A profile card skeleton
 * <div class="flex items-center gap-4">
 *   <Skeleton class="h-12 w-12 rounded-full" />
 *   <div class="space-y-2">
 *     <Skeleton class="h-4 w-[250px]" />
 *     <Skeleton class="h-4 w-[200px]" />
 *   </div>
 * </div>
 * ```
 *
 * **Design Specifications:**
 * - **Animation:** Uses a consistent `pulse` animation that gently fades the background in and out.
 * - **Shape:** Follows the theme's `rounded-card` variable by default, but can be customized (e.g., `rounded-full` for avatars).
 * - **Color:** Uses a neutral, high-contrast background that works across both light and dark modes.
 *
 * @param props - Standard HTML div attributes for sizing and positioning.
 */
export const Skeleton = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return (
    <div
      class={twMerge('animate-pulse rounded-card bg-gray-100 dark:bg-white/5', local.class)}
      {...others}
    />
  );
};
