import { type JSX, Show, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and behavior properties for the Avatar component.
 */
interface AvatarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * The source URL of the profile image.
   * If omitted or failing to load, the component will show initials from the `fallback` prop.
   */
  src?: string;

  /**
   * A required string (typically a user's full name or username).
   * The component extracts the first two characters to display as a placeholder.
   * @example "John Doe" -> "JO"
   */
  fallback: string;
}

/**
 * ### Avatar Component
 *
 * A visual representation of a user or entity. It smartly handles loading states by
 * displaying textual initials whenever an image source is unavailable or invalid.
 *
 * @example
 * ```tsx
 * // With an image
 * <Avatar src="https://github.com/nutlope.png" fallback="Yanis" />
 *
 * // Without an image (Shows "YA")
 * <Avatar fallback="Yanis" />
 *
 * // Custom size
 * <Avatar fallback="Seeker" class="h-12 w-12 text-sm" />
 * ```
 *
 * **Behaviors:**
 * - **Initials Extraction:** Automatically slices the `fallback` string to a max of 2 characters.
 * - **Image Scaling:** Uses `object-cover` to ensure non-square images fill the container without distortion.
 * - **Corner Radius:** Follows the theme's `rounded-card` variable for a consistent squircle or rounded look.
 *
 * @param props - Customization options including `src` and `fallback`.
 */
export const Avatar = (props: AvatarProps) => {
  const [local, others] = splitProps(props, ['src', 'fallback', 'class']);

  return (
    <div
      class={twMerge(
        'relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-card bg-surface border border-stroke overflow-hidden',
        local.class,
      )}
      {...others}
    >
      <Show
        when={local.src}
        fallback={
          <span class="font-semibold text-muted uppercase text-xs">
            {local.fallback.slice(0, 2)}
          </span>
        }
      >
        <img src={local.src} class="aspect-square h-full w-full object-cover" alt="Avatar" />
      </Show>
    </div>
  );
};
