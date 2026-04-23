import { type JSX, Show, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { uid } from '../lib/uid';

/**
 * Configuration and properties for the Textarea component.
 * Inherits all standard HTML textarea attributes.
 */
interface TextareaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * A descriptive label shown above the textarea field.
   */
  label?: string;

  /**
   * An error message displayed in small font below the input.
   * Triggers an error state (primary/red border) on the textarea itself.
   */
  error?: string;

  /**
   * Custom CSS classes applied to the outer flex container.
   */
  containerClass?: string;
}

/**
 * ### Textarea Component
 *
 * A robust multi-line text input field used for gathering longer form data.
 * It features a clean, monospace design that ensures consistent character alignment for
 * code snippets, logs, or structured notes.
 *
 * @example
 * ```tsx
 * // Standard usage
 * <Textarea label="Bio" placeholder="Tell us about yourself..." />
 *
 * // Error state
 * <Textarea
 *   label="Feedback"
 *   error="Please provide at least 20 characters."
 * />
 * ```
 *
 * **Visual Features:**
 * - **Mono Aesthetic:** Uses a monospace font stack to ensure technical clarity and better spacing.
 * - **Vertical Resizing:** Includes a standard `resize-y` handle allowing users to expand the field as needed.
 * - **State Sync:** Border and text colors automatically transition to the primary theme color when an error is present.
 * - **Accessibility:** Automatically generates a unique `id` to link the label and input.
 *
 * @param props - Customization options including `label`, `error`, and all standard textarea attributes.
 */
export const Textarea = (props: TextareaProps) => {
  const [local, others] = splitProps(props, ['label', 'error', 'class', 'id', 'containerClass']);
  const id = local.id || uid('textarea');

  return (
    <div class={twMerge('flex flex-col gap-1.5 w-full', local.containerClass)}>
      {local.label && (
        <label for={id} class="text-xs font-semibold text-fg">
          {local.label}
        </label>
      )}
      <textarea
        id={id}
        class={twMerge(
          'w-full min-h-[80px] border border-stroke bg-transparent rounded-input px-3 py-2.5 text-sm font-mono text-fg outline-none placeholder:text-muted/80 transition-colors duration-150 focus:border-fg resize-y',
          local.error && 'border-primary text-primary',
          local.class,
        )}
        {...others}
      />
      <Show when={local.error}>
        <span class="text-xs font-medium text-primary">{local.error}</span>
      </Show>
    </div>
  );
};
