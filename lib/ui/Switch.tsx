import { type JSX, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { uid } from '../uid';

/**
 * Configuration and behavior properties for the Switch component.
 * Inherits all standard HTML checkbox attributes except `type`.
 */
interface SwitchProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * An optional text label displayed to the right of the switch toggle.
   */
  label?: string;

  /**
   * Callback fired when the checked state changes.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Custom CSS classes for the horizontal flex container holding the switch and label.
   */
  containerClass?: string;
}

/**
 * ### Switch Component
 *
 * A high-fidelity toggle control that allows users to switch between two states (e.g., On/Off).
 * It is built with an invisible native checkbox for full accessibility support, while providing a
 * premium sliding visual interface.
 *
 * @example
 * ```tsx
 * const [isDark, setIsDark] = createSignal(false);
 *
 * <Switch
 *   label="Enable Dark Mode"
 *   checked={isDark()}
 *   onCheckedChange={setIsDark}
 * />
 * ```
 *
 * **Key Features:**
 * - **Accessibility:** Uses `role="switch"` and `sr-only` native input to ensure it is detectable by screen readers.
 * - **Transitions:** Employs CSS-based transforms for the thumb slider and background color shifts.
 * - **Interactive Grouping:** Clicking the label automatically toggles the switch via the `id/for` relationship.
 * - **State Sync:** Supports `peer` classes to link the native input state to the visual toggle div.
 *
 * @param props - Customization options including `label`, `checked`, and `onCheckedChange`.
 */
export const Switch = (props: SwitchProps) => {
  const [local, others] = splitProps(props, [
    'label',
    'class',
    'containerClass',
    'id',
    'onCheckedChange',
  ]);
  const id = local.id || uid('switch');

  return (
    <div class={twMerge('flex items-center gap-3 group', local.containerClass)}>
      <label for={id} class="flex items-center gap-3 cursor-pointer">
        <div class="relative inline-flex items-center">
          <input
            type="checkbox"
            id={id}
            role="switch"
            aria-checked={props.checked}
            class="sr-only peer"
            onInput={(e) => {
              if (others.disabled) return;
              local.onCheckedChange?.(e.currentTarget.checked);
            }}
            {...others}
          />
          <div
            class={twMerge(
              "w-9 h-5 bg-gray-200 dark:bg-white/10 rounded-full transition-all peer-checked:bg-primary relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4",
              local.class,
            )}
          />
        </div>
        {local.label && (
          <span class="text-sm text-muted group-hover:text-fg transition-colors select-none">
            {local.label}
          </span>
        )}
      </label>
    </div>
  );
};
