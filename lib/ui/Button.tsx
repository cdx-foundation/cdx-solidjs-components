import { type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration options and properties for the Button component.
 * Inherits all standard HTML button attributes.
 */
interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual style variant of the button.
   * - `primary`: High-emphasis action button with theme background.
   * - `secondary`: Medium-emphasis button with border and hover state.
   * - `outline`: Low-emphasis button with distinct borders, often used for secondary actions.
   * - `ghost`: Minimalist style that only appears on hover, ideal for toolbars.
   * - `destructive`: High-visibility red button for critical actions (e.g., Delete).
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';

  /**
   * Indicates an ongoing background process.
   * When true, replaces content with a spinner, disables the button, and prevents interaction.
   * @default false
   */
  isLoading?: boolean;

  /**
   * Polymorphic prop to change the underlying HTML element or component.
   * Allows using the button styles on links ('a') or router components.
   * @example as="a" href="https://google.com"
   * @default "button"
   */
  as?: any;

  /**
   * Optional URL for when the button acts as a link (as="a").
   */
  href?: string;

  /**
   * Optional target for when the button acts as a link (as="a").
   */
  target?: string;

  /**
   * The size of the button.
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

/**
 * ### Button Component
 *
 * A versatile, interactive element used to trigger actions or navigate.
 * Supports multiple visual variants, loading states, and polymorphic rendering (rendering as different tags).
 *
 * @example
 * ```tsx
 * // Standard usage
 * <Button variant="primary" onClick={() => console.log('Clicked!')}>
 *   Submit
 * </Button>
 *
 * // As a link
 * <Button as="a" href="/dashboard" variant="outline">
 *   Go to Dashboard
 * </Button>
 *
 * // Loading state
 * <Button isLoading variant="secondary">
 *   Saving...
 * </Button>
 * ```
 *
 * @param props - Customization options including `variant`, `isLoading`, and `as`.
 */
export const Button = (props: ButtonProps) => {
  const [local, others] = splitProps(props, [
    'variant',
    'size',
    'isLoading',
    'class',
    'children',
    'disabled',
    'as',
  ]);

  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold tracking-wide transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 rounded-btn';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover border-none',
    secondary: 'bg-transparent text-fg border border-stroke hover:bg-surface',
    outline: 'bg-transparent text-fg border border-stroke hover:bg-surface',
    ghost: 'bg-surface text-fg hover:bg-surface/80 border-none',
    destructive: 'bg-red-600 text-white hover:bg-red-700 border-none',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
    icon: 'h-9 w-9 p-0',
  };

  return (
    <Dynamic
      component={local.as || 'button'}
      type={local.as ? undefined : 'button'}
      {...others}
      aria-busy={local.isLoading}
      class={twMerge(
        baseStyles,
        variants[local.variant || 'primary'],
        sizes[local.size || 'md'],
        local.class,
      )}
      disabled={local.disabled || local.isLoading}
    >
      {local.isLoading ? (
        <div class="flex items-center gap-2" aria-live="polite">
          <div class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading...</span>
        </div>
      ) : (
        local.children
      )}
    </Dynamic>
  );
};
