import { For, type JSX, Show, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * Represents an individual choice within a RadioGroup.
 */
export interface RadioOption {
  /**
   * The unique programmatic value of the option.
   */
  value: string;

  /**
   * The human-readable title of the option.
   */
  label: string;

  /**
   * Supplemental information providing context for the choice.
   * Rendered in a smaller, monospace font.
   */
  description?: string;
}

/**
 * Configuration and behavior properties for the RadioGroup component.
 */
interface RadioGroupProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * An array of `RadioOption` objects to render as choices.
   */
  options: RadioOption[];

  /**
   * The value of the currently selected option.
   */
  value: string;

  /**
   * Callback fired when a user selects a new option.
   */
  onChange: (value: string) => void;

  /**
   * The unique name for the radio input group, ensuring exclusive selection within the browser.
   */
  name: string;

  /**
   * An optional title for the entire selection group.
   */
  label?: string;
}

/**
 * ### RadioGroup Component
 *
 * A set of mutually exclusive choices where only one option can be selected at a time.
 * Unlike standard browser radios, this component uses a modern card-based layout that is
 * highly legible and supports rich metadata like descriptions.
 *
 * @example
 * ```tsx
 * const [plan, setPlan] = createSignal("hobby");
 *
 * <RadioGroup
 *   name="pricing-plan"
 *   label="Choose a Plan"
 *   value={plan()}
 *   onChange={setPlan}
 *   options={[
 *     { value: "hobby", label: "Hobby", description: "Free for side projects." },
 *     { value: "pro", label: "Professional", description: "$20/mo for scaling teams." }
 *   ]}
 * />
 * ```
 *
 * **Interaction Design:**
 * - **Card Layout:** Each option is wrapped in a clickable card with distinct hover and active states.
 * - **Custom Indicator:** Uses a theme-aware SVG-like circle indicator instead of the browser default.
 * - **Accessibility:** Uses a hidden native `<input type="radio">` to maintain keyboard navigation and screen reader support.
 * - **Grid Sizing:** Automatically arranges options into a 2-column grid on larger screens for better space utilization.
 *
 * @param props - Customization options including `options`, `value`, and `name`.
 */
export const RadioGroup = (props: RadioGroupProps) => {
  const [local, others] = splitProps(props, [
    'options',
    'value',
    'onChange',
    'name',
    'label',
    'class',
  ]);

  return (
    <div class={twMerge('flex flex-col gap-3 w-full', local.class)} {...others}>
      <Show when={local.label}>
        <div class="text-xs font-semibold text-fg">{local.label}</div>
      </Show>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <For each={local.options}>
          {(option) => {
            const isSelected = () => local.value === option.value;
            return (
              <label
                class={twMerge(
                  'relative flex items-start gap-3 border p-3 cursor-pointer transition-colors duration-150 bg-panel',
                  isSelected() ? 'border-primary bg-primary/5' : 'border-stroke hover:border-muted',
                )}
              >
                <input
                  type="radio"
                  name={local.name}
                  value={option.value}
                  checked={isSelected()}
                  onChange={() => local.onChange(option.value)}
                  class="sr-only"
                />
                <div
                  class={twMerge(
                    'mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all',
                    isSelected() ? 'border-primary' : 'border-stroke',
                  )}
                >
                  <Show when={isSelected()}>
                    <div class="w-2 h-2 rounded-full bg-primary" />
                  </Show>
                </div>
                <div class="flex flex-col">
                  <span
                    class={twMerge('text-sm font-semibold', isSelected() ? 'text-fg' : 'text-fg')}
                  >
                    {option.label}
                  </span>
                  {option.description && (
                    <span class="text-xs text-muted font-mono mt-0.5">{option.description}</span>
                  )}
                </div>
              </label>
            );
          }}
        </For>
      </div>
    </div>
  );
};
