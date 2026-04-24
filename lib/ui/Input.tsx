import { type JSX, Show, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { uid } from '../uid';

/**
 * Configuration and properties for the Input component.
 * Inherits all standard HTML input attributes.
 */
interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  /**
   * A descriptive label shown above the input field.
   */
  label?: string;

  /**
   * Optional helper text displayed below the input field.
   */
  description?: string;

  /**
   * An error message displayed in small font below the input.
   * Triggers an error state (primary/red border) on the input itself.
   */
  error?: string;

  /**
   * Custom CSS classes applied to the outer flex container.
   */
  containerClass?: string;
}

/**
 * ### Input Component
 *
 * A highly versatile text input field used for gathering user data.
 * It features a clean, monospace design that aligns with technical and data-driven interfaces.
 *
 * @example
 * ```tsx
 * // Standard usage
 * <Input label="Email Address" placeholder="hello@example.com" type="email" />
 *
 * // With description
 * <Input
 *   label="Username"
 *   description="This is your public display name."
 * />
 *
 * // Error state
 * <Input
 *   label="Password"
 *   type="password"
 *   error="Must be at least 8 characters."
 * />
 * ```
 *
 * **Visual Features:**
 * - **Mono Aesthetic:** Uses a monospace font stack for both value and placeholder for precise character alignment.
 * - **Focus States:** Features a smooth border color transition from `stroke` to `fg` (foreground) when focused.
 * - **Error Highlighting:** Automatically shifts border and text colors to the primary theme color when an error is present.
 * - **ID Management:** Generates a unique `id` automatically to link the label and input for accessibility.
 *
 * @param props - Customization options including `label`, `description`, `error`, and all standard input attributes.
 */
export const Input = (props: InputProps) => {
  const [local, others] = splitProps(props, [
    'label',
    'description',
    'error',
    'class',
    'id',
    'containerClass',
  ]);
  const id = local.id || uid('input');
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  return (
    <div class={twMerge('flex flex-col gap-1.5 w-full text-left', local.containerClass)}>
      <Show when={local.label}>
        <label for={id} class="text-xs font-semibold text-fg">
          {local.label}
        </label>
      </Show>
      <div class="relative">
        <input
          id={id}
          aria-invalid={!!local.error}
          aria-describedby={
            [local.description ? descriptionId : null, local.error ? errorId : null]
              .filter(Boolean)
              .join(' ') || undefined
          }
          class={twMerge(
            'w-full border border-stroke bg-transparent rounded-input px-3 py-2.5 text-sm font-mono text-fg outline-none placeholder:text-muted/80 transition-colors duration-150 focus:border-fg',
            local.error && 'border-primary text-primary',
            local.class,
          )}
          {...others}
        />
      </div>
      <Show when={local.description}>
        <p id={descriptionId} class="text-xs text-muted mt-0.5">
          {local.description}
        </p>
      </Show>
      <Show when={local.error}>
        <p id={errorId} class="text-xs font-medium text-primary mt-0.5">
          {local.error}
        </p>
      </Show>
    </div>
  );
};
