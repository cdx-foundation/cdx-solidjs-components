import { type JSX, createSignal, createUniqueId, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and behavior properties for the Switch component.
 * Inherits all standard HTML checkbox attributes except `type`.
 */
export interface SwitchProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * An optional text label displayed to the right of the switch toggle.
   */
  label?: string;

  /**
   * Callback fired when the checked state changes.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * The initial checked state when the component is first rendered.
   */
  defaultChecked?: boolean;

  /**
   * Custom CSS classes for the horizontal flex container holding the switch and label.
   */
  containerClass?: string;
}

/**
 * ### Switch Component
 *
 * A high-fidelity toggle control that allows users to switch between two states (e.g., On/Off).
 */
export const Switch = (props: SwitchProps) => {
  const [local, others] = splitProps(props, [
    'label',
    'class',
    'containerClass',
    'id',
    'onCheckedChange',
    'checked',
    'defaultChecked',
  ]);

  const id = local.id || `switch-${createUniqueId()}`;

  const [internalChecked, setInternalChecked] = createSignal(local.defaultChecked ?? false);
  const isChecked = () => (local.checked !== undefined ? local.checked : internalChecked());

  const handleChange = (e: Event & { currentTarget: HTMLInputElement }) => {
    const next = e.currentTarget.checked;
    if (local.checked === undefined) {
      setInternalChecked(next);
    }
    local.onCheckedChange?.(next);
  };

  return (
    <div class={twMerge('flex items-center gap-3 group', local.containerClass)}>
      <label for={id} class="flex items-center gap-3 cursor-pointer">
        <div class="relative inline-flex items-center">
          <input
            type="checkbox"
            id={id}
            role="switch"
            checked={isChecked()}
            aria-checked={isChecked()}
            class="sr-only peer"
            onChange={handleChange}
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
