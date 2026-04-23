import { type JSX, Show, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and behavior properties for the Avatar component.
 */
interface AvatarProps extends JSX.HTMLAttributes<HTMLDivElement> {}

/**
 * ### Avatar Component
 *
 * A visual representation of a user or entity. It smartly handles loading states by
 * displaying textual initials whenever an image source is unavailable or invalid.
 *
 * @example
 * ```tsx
 * <Avatar>
 *   <AvatarImage src="https://github.com/nutlope.png" alt="Avatar" />
 *   <AvatarFallback>YA</AvatarFallback>
 * </Avatar>
 * ```
 *
 * **Behaviors:**
 * - **Image Scaling:** Uses `object-cover` to ensure non-square images fill the container without distortion.
 * - **Corner Radius:** Follows the theme's `rounded-card` variable for a consistent squircle or rounded look.
 *
 * @param props - Standard div attributes.
 */
export const Avatar = (props: AvatarProps) => {
  const [local, others] = splitProps(props, ['class', 'children']);

  return (
    <div
      class={twMerge(
        'relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-card bg-surface border border-stroke overflow-hidden',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </div>
  );
};

/**
 * ### AvatarImage Component
 *
 * The image element for the avatar.
 *
 * @example
 * ```tsx
 * <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
 * ```
 *
 * @param props - Standard HTML img attributes.
 */
export const AvatarImage = (props: JSX.ImgHTMLAttributes<HTMLImageElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return (
    <img
      class={twMerge('aspect-square h-full w-full object-cover', local.class)}
      {...others}
    />
  );
};

/**
 * ### AvatarFallback Component
 *
 * The fallback content for the avatar when the image is not available.
 *
 * @example
 * ```tsx
 * <AvatarFallback>CN</AvatarFallback>
 * ```
 *
 * @param props - Standard HTML div attributes.
 */
export const AvatarFallback = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div
      class={twMerge(
        'flex h-full w-full items-center justify-center rounded-full bg-muted',
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  );
};
