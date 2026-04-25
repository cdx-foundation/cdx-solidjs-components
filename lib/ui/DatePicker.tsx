import { Calendar as CalendarIcon } from 'lucide-solid';
import { createSignal, type JSX, Show, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { Calendar } from './Calendar';
import { Popover } from './Popover';

/**
 * Configuration and properties for the DatePicker component.
 */
interface DatePickerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * A text label shown above the picker input.
   */
  label?: string;

  /**
   * Text shown when no date is selected.
   * @default "Pick a date"
   */
  placeholder?: string;

  /**
   * The currently active Date object.
   */
  value?: Date;

  /**
   * Callback fired when a user selects a date from the calendar.
   */
  onValueChange?: (date: Date) => void;
}

/**
 * ### DatePicker Component
 *
 * A combination of the `Popover` and `Calendar` components that provides a professional input-like
 * interface for date selection. It automatically handles localized date formatting and popover
 * state management.
 *
 * @example
 * ```tsx
 * const [deliveryDate, setDeliveryDate] = createSignal(new Date());
 *
 * <DatePicker
 *   label="Preferred Delivery Date"
 *   value={deliveryDate()}
 *   onValueChange={setDeliveryDate}
 * />
 * ```
 *
 * **Behaviors:**
 * - **Formatting:** Automatically formats selected dates using `toLocaleDateString` for a human-readable display.
 * - **Aesthetics:** Uses a monospace font for the date readout to ensure character alignment and consistency with the design system.
 * - **Responsive Alignment:** The calendar popover is anchored to the left of the trigger by default.
 * - **Uncontrolled Support:** Manages its own internal state if a value is provided but not explicitly managed.
 *
 * @param props - Customization options including `label`, `value`, and `onValueChange`.
 */
export const DatePicker = (props: DatePickerProps) => {
  const [local, others] = splitProps(props, [
    'label',
    'placeholder',
    'class',
    'value',
    'onValueChange',
  ]);
  const [internalDate, setInternalDate] = createSignal<Date | undefined>(local.value);

  const handleSelect = (date: Date) => {
    setInternalDate(date);
    local.onValueChange?.(date);
  };

  const formatDate = (date?: Date) => {
    if (!date) return null;
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div class={twMerge('flex flex-col gap-1.5 w-full', local.class)} {...others}>
      <Show when={local.label}>
        <span class="text-xs font-semibold text-fg">{local.label}</span>
      </Show>

      <Popover
        align="left"
        class="p-0 w-max"
        trigger={
          <div
            class={twMerge(
              'flex items-center gap-2 w-full border border-stroke bg-transparent rounded-none px-3 py-2.5 text-sm font-mono transition-colors duration-150 hover:border-muted cursor-pointer',
              !internalDate() ? 'text-muted/80' : 'text-fg',
            )}
          >
            <CalendarIcon size={16} class="opacity-50" />
            <span>{formatDate(internalDate()) || local.placeholder || 'Pick a date'}</span>
          </div>
        }
      >
        <Calendar
          mode="single"
          selected={internalDate()}
          onSelect={handleSelect}
          class="border-0 shadow-none"
          initialFocus={internalDate()}
        />
      </Popover>
    </div>
  );
};
