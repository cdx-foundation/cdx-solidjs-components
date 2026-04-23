import { Check } from 'lucide-solid';
import { type JSX, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { uid } from '../lib/uid';

/**
 * Configuration and properties for the Checkbox component.
 * Inherits all standard HTML input attributes except `type`.
 */
interface CheckboxProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * An optional text label displayed to the right of the checkbox.
   */
  label?: string;

  /**
   * Callback fired when the checked state changes.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Custom CSS classes applied to the flex container wrapping the checkbox and label.
   */
  containerClass?: string;
}

/**
 * ### Checkbox Component
 *
 * A boolean input field that allows users to select one or multiple items from a list.
 * Replaces the default browser checkbox with a theme-consistent squircular design and animated checkmark.
 *
 * @example
 * ```tsx
 * // Simple usage
 * <Checkbox label="Accept terms and conditions" checked={accepted()} />
 *
 * // Controlled state
 * const [checked, setChecked] = createSignal(false);
 * <Checkbox
 *   label="Enable Notifications"
 *   checked={checked()}
 *   onCheckedChange={setChecked}
 * />
 * ```
 *
 * **Interaction Features:**
 * - **Visual Feedback:** Smooth transition between unchecked (border-only) and checked (solid primary background) states.
 * - **Label Pairing:** Automatically generates a unique ID to link the label and input, ensuring the label is clickable.
 * - **Aesthetics:** Uses a custom `Check` icon from Lucide for better brand alignment than the default checkmark.
 *
 * @param props - Customization options including `label`, `checked`, and `onCheckedChange`.
 */
export const Checkbox = (props: CheckboxProps) => {
  const [local, others] = splitProps(props, [
    'label',
    'class',
    'containerClass',
    'id',
    'onCheckedChange',
  ]);
  const id = local.id || uid('checkbox');

  return (
    <div class={twMerge('flex items-center gap-2', local.containerClass)}>
      <div class="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={id}
          aria-checked={others.checked}
          onInput={(e) => local.onCheckedChange?.(e.currentTarget.checked)}
          class={twMerge(
            'peer h-4 w-4 appearance-none rounded-badge border border-stroke bg-surface transition-colors checked:bg-primary checked:border-primary cursor-pointer hover:border-muted',
            local.class,
          )}
          {...others}
        />
        <Check
          size={11}
          class="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white stroke-3"
        />
      </div>
      {local.label && (
        <label
          for={id}
          class="text-sm cursor-pointer select-none text-muted hover:text-fg transition-colors"
        >
          {local.label}
        </label>
      )}
    </div>
  );
};
