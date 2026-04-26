import { type VariantProps, cva } from 'class-variance-authority';
import { type ComponentProps, type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center font-semibold tracking-wide transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 rounded-btn outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shadow-btn',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-hover border-none',
        secondary: 'bg-transparent text-fg border border-stroke hover:bg-surface',
        outline: 'bg-transparent text-fg border border-stroke hover:bg-surface',
        ghost: 'bg-surface text-fg hover:bg-surface/80 border-none',
        destructive: 'bg-red-600 text-white hover:bg-red-700 border-none',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-8 py-3 text-base',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

/**
 * Configuration options and properties for the Button component.
 */
export interface ButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
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
}

/**
 * ### Button Component
 *
 * A versatile, interactive element used to trigger actions or navigate.
 * Supports multiple visual variants, loading states, and polymorphic rendering.
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

  return (
    <Dynamic
      component={local.as || 'button'}
      type={local.as ? undefined : 'button'}
      {...others}
      aria-busy={local.isLoading}
      class={twMerge(buttonVariants({ variant: local.variant, size: local.size }), local.class)}
      disabled={local.disabled || local.isLoading}
    >
      {local.isLoading ? (
        <div class="flex items-center gap-2" aria-live="polite">
          <div
            class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            role="status"
          />
          <span>Loading...</span>
        </div>
      ) : (
        local.children
      )}
    </Dynamic>
  );
};
