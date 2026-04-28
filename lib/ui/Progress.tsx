import { type JSX, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and properties for the Progress component.
 */
interface ProgressProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * The current numeric value of progress.
   */
  value: number;

  /**
   * The numeric value that corresponds to 100% completion.
   * @default 100
   */
  max?: number;

  /**
   * Custom CSS classes applied directly to the internal moving bar (indicator).
   */
  indicatorClass?: string;
}

/**
 * ### Progress Component
 *
 * A visual indicator that displays the completion status of a task or process.
 * Features a high-contrast theme-aware track and a smooth transition effect when the
 * progress value updates.
 *
 * @example
 * ```tsx
 * const [percent, setPercent] = createSignal(33);
 *
 * <Progress value={percent()} max={100} />
 * ```
 *
 * **Visual Features:**
 * - **Transition:** Uses an `ease-out` transition with a 300ms duration for fluid movement.
 * - **Responsiveness:** Automatically expands to fill the width of its parent container.
 * - **Variants:** The indicator color is linked to the primary theme color by default.
 *
 * **Accessibility:**
 * - Uses `role="progressbar"` to inform screen readers of the component's purpose.
 * - Dynamically updates `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
 *
 * @param props - Customization options including `value` and `max`.
 */
export const Progress = (props: ProgressProps) => {
  const [local, others] = splitProps(props, ['value', 'max', 'class', 'indicatorClass']);
  const max = () => local.max || 100;
  const percentage = () => Math.min(100, Math.max(0, (local.value / max()) * 100));

  return (
    <div
      role="progressbar"
      tabIndex={0}
      aria-valuenow={local.value}
      aria-valuemin={0}
      aria-valuemax={max()}
      class={twMerge('w-full h-1 bg-gray-200 dark:bg-white/10 overflow-hidden', local.class)}
      {...others}
    >
      <div
        class={twMerge(
          'h-full bg-primary transition-all duration-300 ease-out',
          local.indicatorClass,
        )}
        style={{ width: `${percentage()}%` }}
      />
    </div>
  );
};
