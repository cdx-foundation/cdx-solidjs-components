import { makeEventListener } from '@solid-primitives/event-listener';
import { Check, ChevronDown } from 'lucide-solid';
import { For, Show, createEffect, createSelector, createSignal } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { uid } from '../uid';
import { Floating } from './Floating';

/**
 * Represents an individual choice within the Select dropdown.
 */
interface SelectOption {
  /** The text string displayed to the user in the list. */
  label: string;
  /** The internal value associated with this choice, passed to `onChange`. */
  value: string | number;
}

/**
 * Configuration and behavior properties for the Select component.
 */
interface SelectProps {
  /**
   * A descriptive label shown above the select box.
   */
  label?: string;

  /**
   * The collection of options that will be rendered in the dropdown menu.
   * Required.
   */
  options: SelectOption[];

  /**
   * The currently active value. Should match a `value` within the `options` array.
   */
  value?: string | number;

  /**
   * Callback fired when a user selects a new option.
   */
  onChange?: (value: string | number) => void;

  /**
   * Text shown when no value is selected and no default exists.
   * @default "Select..."
   */
  placeholder?: string;

  /**
   * An error message displayed in a small red font below the input.
   * Triggers an error state border on the select trigger.
   */
  error?: string;

  /**
   * Custom CSS classes applied directly to the trigger button.
   */
  class?: string;

  /**
   * Custom CSS classes applied to the outer flex container.
   */
  containerClass?: string;

  /**
   * Unique ID for the select component.
   */
  id?: string;
}

/**
 * ### Select Component
 *
 * A replacement for the native `<select>` element that provides a fully themeable and consistent dropdown experience.
 * It automatically handles complex interactions like outside clicking, keyboard escaping, and overflow management.
 * Now uses a Portal and dynamic positioning to avoid being cut off by parent containers.
 *
 * @param props - Customization options including `options`, `value`, and `error`.
 */
export const Select = (props: SelectProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [focusedIndex, setFocusedIndex] = createSignal(-1);
  const isFocused = createSelector(focusedIndex);
  let triggerRef!: HTMLButtonElement;
  const id = props.id || uid('select');

  const selectedOption = () => props.options.find((o) => o.value === props.value);

  const handleSelect = (option: SelectOption) => {
    props.onChange?.(option.value);
    setIsOpen(false);
    triggerRef?.focus();
  };

  // Sync focused index with selected option when opening
  createEffect(() => {
    if (isOpen()) {
      const idx = props.options.findIndex((o) => o.value === props.value);
      setFocusedIndex(idx !== -1 ? idx : 0);
    }
  });

  // Close on outside click
  makeEventListener(document, 'mousedown', (e) => {
    if (isOpen() && triggerRef && !triggerRef.contains(e.target as Node)) {
      // Check if click is also not on the dropdown content (which is in a Portal)
      const listbox = document.getElementById(`${id}-listbox`);
      if (listbox && !listbox.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
  });

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen()) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        triggerRef?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % props.options.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + props.options.length) % props.options.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex() >= 0) {
          handleSelect(props.options[focusedIndex()]);
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div class={twMerge('flex flex-col gap-1.5 w-full text-left', props.containerClass)}>
      <Show when={props.label}>
        <label for={id} class="text-xs font-semibold text-fg">
          {props.label}
        </label>
      </Show>

      <Floating
        isOpen={isOpen()}
        align="bottom"
        sideOffset={4}
        matchTriggerWidth
        class="border border-stroke bg-panel rounded-card overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 shadow-xl"
        id={`${id}-listbox`}
        trigger={(ref) => (
          <button
            ref={(el) => {
              triggerRef = el as HTMLButtonElement;
              ref(el);
            }}
            id={id}
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={isOpen()}
            aria-controls={`${id}-listbox`}
            onClick={() => setIsOpen(!isOpen())}
            onKeyDown={handleKeyDown}
            class={twMerge(
              'w-full flex items-center justify-between border border-stroke bg-transparent rounded-input px-3 py-2.5 text-sm font-mono text-fg outline-none transition-colors duration-150 cursor-pointer hover:border-muted focus:border-fg',
              isOpen() && 'border-fg',
              props.error && 'border-primary',
              props.class,
            )}
          >
            <span class={!selectedOption() ? 'text-muted' : ''}>
              {selectedOption()?.label ?? props.placeholder ?? 'Select...'}
            </span>
            <ChevronDown
              size={15}
              class={twMerge(
                'text-muted transition-transform duration-150',
                isOpen() && 'rotate-180',
              )}
            />
          </button>
        )}
      >
        <div
          role="listbox"
          tabIndex={0}
          aria-activedescendant={focusedIndex() >= 0 ? `${id}-opt-${focusedIndex()}` : undefined}
          class="max-h-48 overflow-y-auto py-1"
        >
          <For each={props.options}>
            {(option, i) => {
              const isSelected = () => props.value === option.value;

              return (
                <button
                  id={`${id}-opt-${i()}`}
                  role="option"
                  aria-selected={isSelected()}
                  type="button"
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setFocusedIndex(i())}
                  class={twMerge(
                    'w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors duration-100 outline-none',
                    isSelected() ? 'text-fg font-bold' : 'text-muted',
                    isFocused(i()) ? 'bg-surface text-fg' : '',
                  )}
                >
                  <span>{option.label}</span>
                  <Show when={isSelected()}>
                    <Check size={14} class="text-primary shrink-0" />
                  </Show>
                </button>
              );
            }}
          </For>
        </div>
      </Floating>

      <Show when={props.error}>
        <p class="text-xs font-medium text-primary mt-0.5">{props.error}</p>
      </Show>
    </div>
  );
};
