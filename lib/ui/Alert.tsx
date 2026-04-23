import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-solid';
import { type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and properties for the Alert component.
 * Inherits all standard HTML div attributes.
 */
interface AlertProps extends JSX.HTMLAttributes<HTMLElement> {
  /**
   * The semantic flavor of the alert, which determines the color scheme and icon.
   * - `info`: Blue theme, for general information.
   * - `warning`: Amber theme, for cautionary messages.
   * - `error`: Red theme, for critical failures or destructive actions.
   * - `success`: Emerald theme, for positive completions.
   * - `destructive`: Synonym for error, matches Button variant.
   * @default "info"
   */
  variant?: 'info' | 'warning' | 'error' | 'success' | 'destructive';

  /**
   * Polymorphic prop to change the underlying HTML element or component.
   * @default "div"
   */
  as?: any;

  /**
   * Optional URL for when the alert acts as a link (as="a").
   */
  href?: string;
}

/**
 * ### Alert Component
 *
 * Provides prominent, non-dismissible feedback or status updates.
 * Each variant automatically renders a contextually appropriate icon to reinforce the message.
 *
 * @example
 * ```tsx
 * <Alert variant="warning">
 *   <AlertTitle>Security Update</AlertTitle>
 *   <AlertDescription>Your password will expire in 2 days. Please update it in settings.</AlertDescription>
 * </Alert>
 * ```
 *
 * **Visual Design:**
 * - **Iconography:** Automatically injected based on the `variant`.
 * - **Layout:** Uses a structured grid with a fixed icon position and flexible body text.
 * - **Accessibility:** Uses semantic colors that maintain high contrast in both light and dark modes.
 *
 * @param props - Customization options including `variant` and `as`.
 */
export const Alert = (props: AlertProps) => {
  const [local, others] = splitProps(props, ['variant', 'class', 'children', 'as']);

  const baseStyles = 'relative w-full rounded-card border p-4 pl-12 flex flex-col gap-1 text-sm';

  const variants = {
    info: 'bg-blue-50 border-blue-200/60 text-blue-700 dark:bg-blue-500/8 dark:border-blue-500/20 dark:text-blue-400',
    warning:
      'bg-amber-50 border-amber-200/60 text-amber-700 dark:bg-amber-500/8 dark:border-amber-500/20 dark:text-amber-400',
    error:
      'bg-red-50 border-red-200/60 text-red-700 dark:bg-red-500/8 dark:border-red-500/20 dark:text-red-400',
    success:
      'bg-emerald-50 border-emerald-200/60 text-emerald-700 dark:bg-emerald-500/8 dark:border-emerald-500/20 dark:text-emerald-400',
    destructive:
      'bg-red-50 border-red-200/60 text-red-700 dark:bg-red-500/8 dark:border-red-500/20 dark:text-red-400',
  };

  const icons = {
    info: Info,
    warning: TriangleAlert,
    error: CircleX,
    success: CircleCheck,
    destructive: CircleX,
  };

  return (
    <Dynamic
      component={local.as || 'div'}
      class={twMerge(baseStyles, variants[local.variant || 'info'], local.class)}
      {...others}
    >
      <div class="absolute left-4 top-4">
        <Dynamic component={icons[local.variant || 'info']} size={18} />
      </div>
      {local.children}
    </Dynamic>
  );
};

/**
 * ### AlertTitle Component
 *
 * The title for the alert.
 *
 * @example
 * ```tsx
 * <AlertTitle>Heads up!</AlertTitle>
 * ```
 *
 * @param props - Customization options including `as`.
 */
export const AlertTitle = (props: JSX.HTMLAttributes<HTMLElement> & { as?: any }) => {
  const [local, others] = splitProps(props, ['class', 'children', 'as']);
  return (
    <Dynamic
      component={local.as || 'h5'}
      class={twMerge('mb-1 font-medium leading-none tracking-tight', local.class)}
      {...others}
    >
      {local.children}
    </Dynamic>
  );
};

/**
 * ### AlertDescription Component
 *
 * The description for the alert.
 *
 * @example
 * ```tsx
 * <AlertDescription>You can add components to your app using the cli.</AlertDescription>
 * ```
 *
 * @param props - Customization options including `as`.
 */
export const AlertDescription = (props: JSX.HTMLAttributes<HTMLElement> & { as?: any }) => {
  const [local, others] = splitProps(props, ['class', 'children', 'as']);
  return (
    <Dynamic
      component={local.as || 'div'}
      class={twMerge('text-sm [&_p]:leading-relaxed', local.class)}
      {...others}
    >
      {local.children}
    </Dynamic>
  );
};
