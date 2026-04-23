import { type JSX, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and behavior properties for the Badge component.
 */
interface BadgeProps extends JSX.OutputHTMLAttributes<HTMLOutputElement> {
  /**
   * The visual style variant of the badge.
   * - `default`: Subtle gray style for secondary metadata or tags.
   * - `primary`: High-visibility theme-colored badge.
   * - `success`: Green-tinted badge for positive states (e.g., "Active").
   * - `warning`: Amber-tinted badge for cautionary states (e.g., "Pending").
   * - `error`: Red-tinted badge for critical or negative states (e.g., "Expired").
   * @default "default"
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

/**
 * ### Badge Component
 *
 * A compact element used to highlight a status, category, or count.
 * Designed to be visually distinct from buttons, focusing on information display rather than interaction.
 *
 * @example
 * ```tsx
 * // Status indicators
 * <Badge variant="success">Online</Badge>
 * <Badge variant="error">Critical</Badge>
 *
 * // Tags and metadata
 * <Badge variant="default">Beta</Badge>
 * <Badge variant="primary">New Feature</Badge>
 * ```
 *
 * **Visual Features:**
 * - **Typography:** Uses a bold, uppercase, tracking-wider font at a very small size for a professional "pill" look.
 * - **Variants:** Automatically applies semantic colors and backgrounds based on the chosen `variant`.
 * - **Scaling:** Inherits container line-height for seamless integration into text flows.
 *
 * @param props - Customization options including `variant`.
 */
export const Badge = (props: BadgeProps) => {
  const [local, others] = splitProps(props, ['variant', 'class', 'children']);

  const baseStyles =
    'inline-flex items-center px-2 py-0.5 rounded-badge text-[10px] font-bold uppercase tracking-wider';

  const variants = {
    default: 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400',
    primary: 'bg-primary-alpha text-primary',
    success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    error: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
  };

  return (
    <output
      class={twMerge(baseStyles, variants[local.variant || 'default'], local.class)}
      {...others}
    >
      {local.children}
    </output>
  );
};
