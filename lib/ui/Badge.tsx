import { type VariantProps, cva } from 'class-variance-authority';
import { type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { twMerge } from 'tailwind-merge';

const badgeVariants = cva(
  'inline-flex items-center px-2 py-0.5 rounded-badge text-[10px] font-bold uppercase tracking-wider transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400',
        secondary: 'bg-surface text-fg border border-stroke',
        primary: 'bg-primary text-white',
        success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
        error: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
        destructive: 'bg-red-600 text-white',
        outline: 'text-fg border border-stroke',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/**
 * Configuration and behavior properties for the Badge component.
 */
export interface BadgeProps
  extends JSX.HTMLAttributes<HTMLElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Polymorphic prop to change the underlying HTML element or component.
   * Allows using the badge styles on links ('a').
   * @default "span"
   */
  as?: any;
}

/**
 * ### Badge Component
 *
 * A compact element used to highlight a status, category, or count.
 * Designed to be visually distinct from buttons, focusing on information display rather than interaction.
 */
export const Badge = (props: BadgeProps) => {
  const [local, others] = splitProps(props, ['variant', 'class', 'children', 'as']);

  return (
    <Dynamic
      component={local.as || 'span'}
      class={twMerge(badgeVariants({ variant: local.variant }), local.class)}
      {...others}
    >
      {local.children}
    </Dynamic>
  );
};
