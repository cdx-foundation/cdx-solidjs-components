import { For, type JSX, Show, createContext, splitProps, useContext } from 'solid-js';
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

interface RadioGroupContextValue {
  value: () => string;
  onValueChange: (value: string) => void;
  name: string;
}

const RadioGroupContext = createContext<RadioGroupContextValue>();

/**
 * Configuration and behavior properties for the RadioGroup component.
 */
interface RadioGroupProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * An array of `RadioOption` objects to render as choices (Shorthand pattern).
   */
  options?: RadioOption[];

  /**
   * The value of the currently selected option.
   */
  value: string;

  /**
   * Callback fired when a user selects a new option.
   */
  onValueChange: (value: string) => void;

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
 * Supports both a clean shorthand `options` prop and a flexible composable pattern.
 *
 * @example
 * ```tsx
 * // Composable Pattern (Flexible)
 * <RadioGroup name="plan" value={plan()} onValueChange={setPlan}>
 *   <div class="flex items-center gap-2">
 *     <RadioGroupItem value="1" id="r1" />
 *     <Label for="r1">Option 1</Label>
 *   </div>
 * </RadioGroup>
 *
 * // Shorthand Pattern (Clean)
 * <RadioGroup
 *   name="pricing-plan"
 *   label="Choose a Plan"
 *   value={plan()}
 *   onValueChange={setPlan}
 *   options={[
 *     { value: "hobby", label: "Hobby", description: "Free for side projects." }
 *   ]}
 * />
 * ```
 *
 * @param props - Customization options including `options`, `value`, and `name`.
 */
export const RadioGroup = (props: RadioGroupProps) => {
  const [local, others] = splitProps(props, [
    'options',
    'value',
    'onValueChange',
    'name',
    'label',
    'class',
    'children',
  ]);

  const contextValue: RadioGroupContextValue = {
    value: () => local.value,
    onValueChange: local.onValueChange,
    name: local.name,
  };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div class={twMerge('flex flex-col gap-3 w-full', local.class)} {...others}>
        <Show when={local.label}>
          <div class="text-xs font-semibold text-fg">{local.label}</div>
        </Show>
        <Show
          when={local.options}
          fallback={<div class="flex flex-col gap-3">{local.children}</div>}
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <For each={local.options}>
              {(option) => (
                <RadioGroupItemCard
                  value={option.value}
                  label={option.label}
                  description={option.description}
                />
              )}
            </For>
          </div>
        </Show>
      </div>
    </RadioGroupContext.Provider>
  );
};

/**
 * Internal helper for the shorthand card-based radio option.
 */
const RadioGroupItemCard = (props: RadioOption) => {
  const context = useContext(RadioGroupContext);
  if (!context) return null;

  const isSelected = () => context.value() === props.value;

  return (
    <label
      class={twMerge(
        'relative flex items-start gap-3 border p-3 cursor-pointer transition-colors duration-150 bg-panel',
        isSelected() ? 'border-primary bg-primary/5' : 'border-stroke hover:border-muted',
      )}
    >
      <input
        type="radio"
        name={context.name}
        value={props.value}
        checked={isSelected()}
        onChange={() => context.onValueChange(props.value)}
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
        <span class={twMerge('text-sm font-semibold', isSelected() ? 'text-fg' : 'text-fg')}>
          {props.label}
        </span>
        {props.description && (
          <span class="text-xs text-muted font-mono mt-0.5">{props.description}</span>
        )}
      </div>
    </label>
  );
};

/**
 * ### RadioGroupItem Component
 *
 * A low-level radio indicator used within the composable `RadioGroup` pattern.
 *
 * @param props - Standard HTML input attributes.
 */
export const RadioGroupItem = (props: JSX.InputHTMLAttributes<HTMLInputElement>) => {
  const context = useContext(RadioGroupContext);
  const [local, others] = splitProps(props, ['class', 'value']);

  if (!context) return null;

  const isSelected = () => context.value() === local.value;

  return (
    <div class="relative flex items-center justify-center">
      <input
        type="radio"
        name={context.name}
        value={local.value}
        checked={isSelected()}
        onChange={() => context.onValueChange(local.value as string)}
        class={twMerge(
          'peer h-4 w-4 rounded-full border border-stroke text-primary ring-offset-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer checked:border-primary',
          local.class,
        )}
        {...others}
      />
      <div
        class={twMerge(
          'absolute h-2 w-2 rounded-full bg-primary transition-transform scale-0 peer-checked:scale-100 pointer-events-none',
        )}
      />
    </div>
  );
};
