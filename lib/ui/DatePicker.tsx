import { Calendar as CalendarIcon } from 'lucide-solid';
import { type JSX, Show, createEffect, createSignal, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { Calendar } from './Calendar';
import { type Alignment } from './Floating';
import { Popover } from './Popover';

/**
 * Configuration and properties for the DatePicker component.
 */
interface DatePickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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
  onChange?: (date: Date) => void;

  /**
   * If `true`, shows a time picker in the calendar and displays time in the input.
   * @default false
   */
  showTime?: boolean;
  /**
   * The anchor point of the calendar popover relative to its trigger.
   * Supports cardinal and diagonal positions.
   * @default "left"
   */
  align?: Alignment;
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
 *   onChange={setDeliveryDate}
 *   showTime
 * />
 * ```
 *
 * **Behaviors:**
 * - **Formatting:** Automatically formats selected dates using `toLocaleDateString` (and `toLocaleTimeString` if `showTime` is true) for a human-readable display.
 * - **Aesthetics:** Uses a monospace font for the date readout to ensure character alignment and consistency with the design system.
 * - **Responsive Alignment:** The calendar popover is anchored to the left of the trigger by default but can be customized via the `align` prop.
 * - **Uncontrolled Support:** Manages its own internal state if a value is provided but not explicitly managed.
 *
 * @param props - Customization options including `label`, `value`, and `onChange`.
 */
export const DatePicker = (props: DatePickerProps) => {
  const [local, others] = splitProps(props, [
    'label',
    'placeholder',
    'class',
    'value',
    'onChange',
    'showTime',
    'align',
  ]);
  const [internalDate, setInternalDate] = createSignal<Date | undefined>(local.value);

  createEffect(() => {
    setInternalDate(local.value);
  });

  const handleSelect = (date: Date) => {
    setInternalDate(date);
    local.onChange?.(date);
  };

  const formatDate = (date?: Date) => {
    if (!date) return null;
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    if (local.showTime) {
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      return `${dateStr} ${timeStr}`;
    }

    return dateStr;
  };

  return (
    <div class={twMerge('flex flex-col gap-1.5 w-full', local.class)} {...others}>
      <Show when={local.label}>
        <span class="text-xs font-semibold text-fg">{local.label}</span>
      </Show>

      <Popover align={local.align || 'left'} class="p-0 w-max">
        <Popover.Trigger>
          <div
            class={twMerge(
              'flex items-center gap-2 w-full border border-stroke bg-transparent rounded-none px-3 py-2.5 text-sm font-mono transition-colors duration-150 hover:border-muted cursor-pointer outline-none focus-visible:border-fg focus-visible:ring-1 focus-visible:ring-fg',
              !internalDate() ? 'text-muted/80' : 'text-fg',
            )}
          >
            <CalendarIcon size={16} class="opacity-50" />
            <span>{formatDate(internalDate()) || local.placeholder || 'Pick a date'}</span>
          </div>
        </Popover.Trigger>
        <Popover.Content>
          <Calendar
            mode="single"
            selected={internalDate()}
            onChange={handleSelect}
            showTime={local.showTime}
            class="border-0 shadow-none"
            initialFocus={internalDate()}
            align={local.align}
          />
        </Popover.Content>
      </Popover>
    </div>
  );
};
