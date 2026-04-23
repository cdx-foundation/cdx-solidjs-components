import { type JSX, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration properties for the AspectRatio container.
 */
interface AspectRatioProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * The calculated aspect ratio as a number (Width divided by Height).
   * - `16 / 9` for HD Video.
   * - `1 / 1` for Square images.
   * - `4 / 3` for Standard definition.
   * @default 1.777 (16/9)
   */
  ratio?: number;

  /**
   * The media or content element that should fill the container.
   */
  children: JSX.Element;
}

/**
 * ### AspectRatio Component
 *
 * Ensures an element maintains a specific width-to-height ratio, regardless of the screen size.
 * This is the standard solution for responsive videos, maps, and image placeholders to prevent layout shifts.
 *
 * @example
 * ```tsx
 * // A responsive YouTube-style video container
 * <AspectRatio ratio={16 / 9}>
 *   <iframe src="..." class="w-full h-full" />
 * </AspectRatio>
 *
 * // A square profile picture placeholder
 * <AspectRatio ratio={1}>
 *   <img src="/avatar.jpg" class="object-cover w-full h-full" />
 * </AspectRatio>
 * ```
 *
 * **How it works:**
 * - **Padding Hack:** Uses the `padding-bottom` CSS technique to create height relative to the width.
 * - **Absolute Positioning:** Automatically wraps children in an absolutely positioned container to fill the reserved space.
 *
 * @param props - Customization options including the numeric `ratio`.
 */
export const AspectRatio = (props: AspectRatioProps) => {
  const [local, others] = splitProps(props, ['ratio', 'children', 'class']);
  const ratio = local.ratio || 16 / 9;

  return (
    <div
      class={twMerge('relative w-full', local.class)}
      style={{ 'padding-bottom': `${(1 / ratio) * 100}%` }}
      {...others}
    >
      <div class="absolute inset-0 w-full h-full">{local.children}</div>
    </div>
  );
};
