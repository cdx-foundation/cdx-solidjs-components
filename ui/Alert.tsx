import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-solid';
import { type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and properties for the Alert component.
 * Inherits all standard HTML div attributes.
 */
interface AlertProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * The bold primary heading of the alert message.
   */
  title: string;

  /**
   * The semantic flavor of the alert, which determines the color scheme and icon.
   * - `info`: Blue theme, for general information.
   * - `warning`: Amber theme, for cautionary messages.
   * - `error`: Red theme, for critical failures or destructive actions.
   * - `success`: Emerald theme, for positive completions.
   * @default "info"
   */
  variant?: 'info' | 'warning' | 'error' | 'success';
}

/**
 * ### Alert Component
 *
 * Provides prominent, non-dismissible feedback or status updates.
 * Each variant automatically renders a contextually appropriate icon to reinforce the message.
 *
 * @example
 * ```tsx
 * <Alert
 *   title="Security Update"
 *   variant="warning"
 * >
 *   Your password will expire in 2 days. Please update it in settings.
 * </Alert>
 *
 * <Alert title="File Uploaded" variant="success">
 *   The report was successfully saved to your cloud storage.
 * </Alert>
 * ```
 *
 * **Visual Design:**
 * - **Iconography:** Automatically injected based on the `variant`.
 * - **Layout:** Uses a structured grid with a fixed icon position and flexible body text.
 * - **Accessibility:** Uses semantic colors that maintain high contrast in both light and dark modes.
 *
 * @param props - Customization options including `title` and `variant`.
 */
export const Alert = (props: AlertProps) => {
  const [local, others] = splitProps(props, ['title', 'variant', 'class', 'children']);

  const baseStyles = 'relative w-full rounded-card border p-4 pl-12 flex flex-col gap-1 text-sm';

  const variants = {
    info: 'bg-blue-50 border-blue-200/60 text-blue-700 dark:bg-blue-500/8 dark:border-blue-500/20 dark:text-blue-400',
    warning:
      'bg-amber-50 border-amber-200/60 text-amber-700 dark:bg-amber-500/8 dark:border-amber-500/20 dark:text-amber-400',
    error:
      'bg-red-50 border-red-200/60 text-red-700 dark:bg-red-500/8 dark:border-red-500/20 dark:text-red-400',
    success:
      'bg-emerald-50 border-emerald-200/60 text-emerald-700 dark:bg-emerald-500/8 dark:border-emerald-500/20 dark:text-emerald-400',
  };

  const icons = {
    info: Info,
    warning: TriangleAlert,
    error: CircleX,
    success: CircleCheck,
  };

  return (
    <div class={twMerge(baseStyles, variants[local.variant || 'info'], local.class)} {...others}>
      <div class="absolute left-4 top-4">
        <Dynamic component={icons[local.variant || 'info']} size={18} />
      </div>
      <h5 class="font-bold tracking-tight">{local.title}</h5>
      <div class="text-current/70 leading-relaxed text-[13px]">{local.children}</div>
    </div>
  );
};
