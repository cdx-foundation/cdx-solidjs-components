import { Check } from 'lucide-solid';
import { createSignal, createUniqueId, type JSX, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and properties for the Checkbox component.
 * Inherits all standard HTML input attributes except `type`.
 */
export interface CheckboxProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
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
 */
export const Checkbox = (props: CheckboxProps) => {
  const [local, others] = splitProps(props, [
    'label',
    'class',
    'containerClass',
    'id',
    'onCheckedChange',
    'checked',
    'defaultChecked',
  ]);

  const id = local.id || `checkbox-${createUniqueId()}`;

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
    <div class={twMerge('flex items-center gap-2', local.containerClass)}>
      <div class="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={id}
          checked={isChecked()}
          aria-checked={isChecked()}
          onChange={handleChange}
          class={twMerge(
            'peer h-4 w-4 appearance-none rounded-badge border border-stroke bg-surface transition-colors checked:bg-primary checked:border-primary cursor-pointer hover:border-muted outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            local.class,
          )}
          {...others}
        />
        <Check
          size={11}
          class="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white stroke-[4]"
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
