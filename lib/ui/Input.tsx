import { Minus, Plus } from 'lucide-solid';
import {
  createSignal,
  createUniqueId,
  type JSX,
  Show,
  splitProps,
  untrack,
  createEffect,
} from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and properties for the Input component.
 */
export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
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
   */
  error?: string;

  /**
   * Custom CSS classes applied to the outer flex container.
   */
  containerClass?: string;

  /**
   * A regular expression used to validate the input value in real-time.
   */
  regex?: RegExp;

  /**
   * If `true`, characters that do not match the `regex` will be prevented from being entered.
   * @default false
   */
  preventInvalidRegex?: boolean;

  /**
   * Callback fired when the input value does not match the provided `regex`.
   */
  onRegexMismatch?: (value: string) => void;

  /**
   * For type="number", if true, hides the increment/decrement buttons.
   * @default false
   */
  hideButtons?: boolean;

  /**
   * For type="number", callback fired when the numeric value changes.
   */
  onValueChange?: (value: number) => void;
}

/**
 * ### Input Component
 *
 * A highly versatile text input field used for gathering user data.
 */
export const Input = (props: InputProps) => {
  const [local, others] = splitProps(props, [
    'type',
    'label',
    'description',
    'error',
    'class',
    'id',
    'containerClass',
    'regex',
    'preventInvalidRegex',
    'onRegexMismatch',
    'onInput',
    'onValueChange',
    'hideButtons',
    'value',
  ]);

  const id = local.id || `input-${createUniqueId()}`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  const [lastValidValue, setLastValidValue] = createSignal((local.value as string) || '');

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    const value = e.currentTarget.value;

    if (local.regex) {
      if (!local.regex.test(value)) {
        local.onRegexMismatch?.(value);

        if (local.preventInvalidRegex) {
          e.currentTarget.value = lastValidValue();
          return;
        }
      } else {
        setLastValidValue(value);
      }
    }

    if (typeof local.onInput === 'function') {
      local.onInput(e);
    } else if (Array.isArray(local.onInput)) {
      (local.onInput[0] as any)(local.onInput[1], e);
    }
  };

  return (
    <Show
      when={local.type === 'number'}
      fallback={
        <div class={twMerge('flex flex-col gap-1.5 w-full text-left', local.containerClass)}>
          <Show when={local.label}>
            <label for={id} class="text-xs font-semibold text-fg">
              {local.label}
            </label>
          </Show>
          <div class="relative">
            <input
              {...others}
              id={id}
              type={local.type}
              value={local.value as string | number}
              aria-invalid={!!local.error}
              aria-describedby={
                [local.description ? descriptionId : null, local.error ? errorId : null]
                  .filter(Boolean)
                  .join(' ') || undefined
              }
              onInput={handleInput}
              class={twMerge(
                'w-full border border-stroke bg-transparent rounded-input px-3 py-2.5 text-sm font-mono text-fg outline-none placeholder:text-muted/80 transition-colors duration-150 focus:border-fg disabled:opacity-50 disabled:cursor-not-allowed',
                local.error && 'border-primary text-primary focus:border-primary',
                local.class,
              )}
            />
          </div>
          <Show when={local.description}>
            <p id={descriptionId} class="text-xs text-muted mt-0.5">
              {local.description}
            </p>
          </Show>
          <Show when={local.error}>
            <p id={errorId} class="text-xs font-medium text-primary mt-0.5" role="alert">
              {local.error}
            </p>
          </Show>
        </div>
      }
    >
      <NumberInputInternal
        {...(others as any)}
        id={id}
        label={local.label}
        description={local.description}
        error={local.error}
        value={typeof local.value === 'number' ? local.value : parseFloat(local.value as string)}
        onValueChange={local.onValueChange}
        hideButtons={local.hideButtons}
        class={local.class}
        containerClass={local.containerClass}
      />
    </Show>
  );
};

const NumberInputInternal = (props: any) => {
  const [local, others] = splitProps(props, [
    'label',
    'description',
    'error',
    'value',
    'onValueChange',
    'step',
    'min',
    'max',
    'class',
    'id',
    'containerClass',
    'hideButtons',
  ]);

  const step = () => local.step ?? 1;
  const [internalValue, setInternalValue] = createSignal<number>(local.value ?? 0);

  createEffect(() => {
    const val = local.value ?? 0;
    if (val !== untrack(internalValue)) {
      setInternalValue(val);
    }
  });

  const updateValue = (val: number) => {
    let next = val;
    if (local.min !== undefined) next = Math.max(local.min, next);
    if (local.max !== undefined) next = Math.min(local.max, next);

    const precision = step().toString().split('.')[1]?.length || 0;
    next = parseFloat(next.toFixed(precision));

    if (next !== internalValue()) {
      setInternalValue(next);
      local.onValueChange?.(next);
    }
  };

  const increment = () => updateValue(internalValue() + step());
  const decrement = () => updateValue(internalValue() - step());

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    const rawValue = e.currentTarget.value;
    if (rawValue === '') {
      setInternalValue(0);
      local.onValueChange?.(0);
      return;
    }

    const val = parseFloat(rawValue);
    if (!isNaN(val)) {
      if (local.max !== undefined && val > local.max) {
        e.currentTarget.value = internalValue().toString();
        return;
      }
      updateValue(val);
    }
  };

  return (
    <div class={twMerge('flex flex-col gap-1.5 w-full text-left', local.containerClass)}>
      <Show when={local.label}>
        <label for={local.id} class="text-xs font-semibold text-fg">
          {local.label}
        </label>
      </Show>

      <div class="relative flex items-center group">
        <Show when={!local.hideButtons}>
          <button
            type="button"
            onClick={decrement}
            tabIndex={-1}
            class="absolute left-0 h-full px-2.5 flex items-center justify-center text-muted hover:text-fg transition-colors border-r border-transparent group-focus-within:border-stroke"
          >
            <Minus size={14} />
          </button>
        </Show>

        <input
          id={local.id}
          type="number"
          value={internalValue()}
          onInput={handleInput}
          step={local.step}
          min={local.min}
          max={local.max}
          class={twMerge(
            'w-full border border-stroke bg-transparent rounded-input py-2.5 text-sm font-mono text-fg outline-none placeholder:text-muted/80 transition-colors duration-150 focus:border-fg text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            !local.hideButtons && 'px-10',
            local.hideButtons && 'px-3 text-left',
            local.error && 'border-primary text-primary',
            local.class,
          )}
          {...others}
        />

        <Show when={!local.hideButtons}>
          <button
            type="button"
            onClick={increment}
            tabIndex={-1}
            class="absolute right-0 h-full px-2.5 flex items-center justify-center text-muted hover:text-fg transition-colors border-l border-transparent group-focus-within:border-stroke"
          >
            <Plus size={14} />
          </button>
        </Show>
      </div>

      <Show when={local.description}>
        <p class="text-xs text-muted mt-0.5">{local.description}</p>
      </Show>
      <Show when={local.error}>
        <p class="text-xs font-medium text-primary mt-0.5" role="alert">
          {local.error}
        </p>
      </Show>
    </div>
  );
};
