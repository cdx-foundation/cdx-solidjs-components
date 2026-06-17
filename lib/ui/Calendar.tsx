import { ChevronLeft, ChevronRight } from 'lucide-solid';
import { For, type JSX, Show, createEffect, createMemo, createSignal, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import type { Alignment } from './Floating';

// --- Types & Constants ---

/**
 * Defines how the calendar handles user interaction and date selection.
 * - `single`: Select one date at a time.
 * - `multiple`: Select an unlimited number of individual dates.
 * - `range`: Select a continuous span between two dates.
 */
export type CalendarMode = 'single' | 'multiple' | 'range';

/**
 * Data structure used for `range` selection mode.
 */
export interface DateRange {
  /** The beginning of the selected interval. */
  from?: Date;
  /** The end of the selected interval. */
  to?: Date;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// --- Pure Helper Functions ---

const getDayTimestamp = (d: Date | undefined | null) => {
  if (!d || !(d instanceof Date)) return 0;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
};

const isSameDay = (d1: Date | undefined | null, d2: Date | undefined | null) => {
  const t1 = getDayTimestamp(d1);
  const t2 = getDayTimestamp(d2);
  return t1 > 0 && t1 === t2;
};

const isWithinRange = (date: Date, from?: Date, to?: Date) => {
  const t = getDayTimestamp(date);
  const f = getDayTimestamp(from);
  const o = getDayTimestamp(to);
  if (f === 0 || o === 0) return false;
  return t >= f && t <= o;
};

// --- Sub-Components for Modularity ---

const CalendarHeader = (props: {
  month: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
}) => (
  <div class="flex items-center justify-between w-full mb-8 px-2">
    <button
      type="button"
      onClick={props.onPrev}
      class="p-1 text-muted hover:text-fg transition-colors"
    >
      <ChevronLeft size={16} strokeWidth={1.5} />
    </button>
    <span class="text-base font-medium font-mono text-fg">
      {MONTH_NAMES[props.month]} {props.year}
    </span>
    <button
      type="button"
      onClick={props.onNext}
      class="p-1 text-muted hover:text-fg transition-colors"
    >
      <ChevronRight size={16} strokeWidth={1.5} />
    </button>
  </div>
);

// --- Main Component ---

/**
 * Configuration and behavior properties for the Calendar component.
 */
interface CalendarProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * The logic for selecting dates.
   * @default "single"
   */
  mode?: CalendarMode;

  /**
   * The current selection state.
   * - In `single` mode: `Date | undefined`
   * - In `multiple` mode: `Date[]`
   * - In `range` mode: `DateRange`
   */
  selected?: any;

  /**
   * Event handler called whenever a date interaction occurs.
   * Receives the updated selection value corresponding to the current `mode`.
   */
  onChange?: (val: any) => void;

  /**
   * A function to restrict selection. If it returns `true` for a given date,
   * that date will be grayed out and non-interactive.
   */
  disabled?: (date: Date) => boolean;

  /**
   * If `true`, the calendar will show dates from the preceding and succeeding months
   * fill the 7x6 grid.
   * @default false
   */
  showOutsideDays?: boolean;

  /**
   * If `true`, shows a time picker (hours and minutes) below the calendar.
   * @default false
   */
  showTime?: boolean;

  /**
   * The date that should be visible when the calendar first renders.
   * If not provided, it defaults to the first selected date or today's date.
   */
  initialFocus?: Date;

  /**
   * The anchor point of the calendar when used in a floating context.
   * @default "bottom"
   */
  align?: Alignment;
}

/**
 * ### Calendar Component
 *
 * A high-performance date picker and scheduler component built for SolidJS.
 * It provides a clean, grid-based interface for selecting single dates, multiple dates, or date ranges.
 *
 * @example
 * ```tsx
 * // Single selection with time
 * const [dateTime, setDateTime] = createSignal<Date>(new Date());
 * <Calendar
 *   mode="single"
 *   selected={dateTime()}
 *   onChange={setDateTime}
 *   showTime
 * />
 *
 * // Range selection
 * const [range, setRange] = createSignal<DateRange>({ from: new Date() });
 * <Calendar
 *   mode="range"
 *   selected={range()}
 *   onChange={setRange}
 * />
 * ```
 *
 * @param props - Includes `mode`, `selected`, `onChange`, and custom `disabled` logic.
 */
export const Calendar = (props: CalendarProps) => {
  const [local, others] = splitProps(props, [
    'mode',
    'selected',
    'onChange',
    'disabled',
    'showOutsideDays',
    'showTime',
    'class',
    'initialFocus',
    'align',
  ]);

  const [viewDate, setViewDate] = createSignal(
    local.initialFocus instanceof Date
      ? local.initialFocus
      : local.mode === 'single' && local.selected instanceof Date
        ? local.selected
        : local.mode === 'range' && local.selected?.from instanceof Date
          ? local.selected.from
          : new Date(),
  );

  createEffect(() => {
    if (local.initialFocus instanceof Date) {
      setViewDate(local.initialFocus);
    } else if (local.mode === 'single' && local.selected instanceof Date) {
      setViewDate(local.selected);
    }
  });

  const calendarData = createMemo(() => {
    const month = viewDate().getMonth();
    const year = viewDate().getFullYear();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDateOfPrevMonth = new Date(year, month, 0).getDate();

    const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => {
      const day = lastDateOfPrevMonth - firstDayOfMonth + i + 1;
      return { day, date: new Date(year, month - 1, day), isCurrentMonth: false };
    });

    const currentMonthDays = Array.from({ length: lastDateOfMonth }, (_, i) => {
      const day = i + 1;
      return { day, date: new Date(year, month, day), isCurrentMonth: true };
    });

    const remainingCells = 42 - prevMonthDays.length - currentMonthDays.length;
    const nextMonthDays = Array.from({ length: remainingCells }, (_, i) => {
      const day = i + 1;
      return { day, date: new Date(year, month + 1, day), isCurrentMonth: false };
    });

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  });

  const calendarRows = createMemo(() => {
    const data = calendarData();
    const rows = [];
    for (let i = 0; i < data.length; i += 7) {
      rows.push(data.slice(i, i + 7));
    }
    return rows;
  });

  const handleDateClick = (date: Date) => {
    if (local.disabled?.(date)) return;
    if (!local.onChange) return;

    const clickedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (local.mode === 'range') {
      const s = local.selected || {};
      const { from, to } = s;

      if (!from || (from && to)) {
        local.onChange({ from: clickedDate, to: undefined });
      } else {
        if (isSameDay(clickedDate, from)) {
          local.onChange({ from: undefined, to: undefined });
        } else {
          const tFrom = getDayTimestamp(from);
          const tClick = getDayTimestamp(clickedDate);
          if (tClick < tFrom) {
            local.onChange({ from: clickedDate, to: new Date(tFrom) });
          } else {
            local.onChange({ from: new Date(tFrom), to: clickedDate });
          }
        }
      }
    } else if (local.mode === 'multiple') {
      const s = Array.isArray(local.selected) ? local.selected : [];
      const existsIdx = s.findIndex((d) => isSameDay(d, clickedDate));
      if (existsIdx !== -1) {
        local.onChange(s.filter((_, i) => i !== existsIdx));
      } else {
        local.onChange([...s, clickedDate]);
      }
    } else {
      // Preserve time if showTime is enabled and we have a selected date
      if (local.showTime && local.selected instanceof Date) {
        clickedDate.setHours(local.selected.getHours());
        clickedDate.setMinutes(local.selected.getMinutes());
        clickedDate.setSeconds(local.selected.getSeconds());
      }
      local.onChange(clickedDate);
    }
  };

  const adjustTime = (type: 'hours' | 'minutes', delta: number) => {
    if (!local.onChange) return;
    const current = local.selected instanceof Date ? new Date(local.selected) : new Date();
    if (type === 'hours') {
      const h = (current.getHours() + delta + 24) % 24;
      current.setHours(h);
    } else {
      const m = (current.getMinutes() + delta + 60) % 60;
      current.setMinutes(m);
    }
    local.onChange(current);
  };

  const handleTimeInput = (type: 'hours' | 'minutes', value: string) => {
    if (!local.onChange) return;
    let val = Number.parseInt(value, 10);
    if (Number.isNaN(val)) val = 0;

    const current = local.selected instanceof Date ? new Date(local.selected) : new Date();
    if (type === 'hours') {
      current.setHours(Math.max(0, Math.min(23, val)));
    } else {
      current.setMinutes(Math.max(0, Math.min(59, val)));
    }
    local.onChange(current);
  };

  const changeMonth = (offset: number) => {
    const d = new Date(viewDate());
    d.setMonth(d.getMonth() + offset);
    setViewDate(d);
  };

  return (
    <div
      class={twMerge('flex flex-col w-full p-6 border border-stroke bg-transparent', local.class)}
      {...others}
    >
      <CalendarHeader
        month={viewDate().getMonth()}
        year={viewDate().getFullYear()}
        onPrev={() => changeMonth(-1)}
        onNext={() => changeMonth(1)}
      />

      <div class="grid grid-cols-7 gap-y-4 gap-x-2 text-center items-center" role="grid">
        <For each={DAYS_OF_WEEK}>
          {(day) => (
            <span class="text-[13px] font-mono text-muted mb-4" aria-hidden="true">
              {day}
            </span>
          )}
        </For>

        <For each={calendarRows()}>
          {(row) => (
            <div role="row" class="contents" tabIndex={-1}>
              <For each={row}>
                {({ day, date, isCurrentMonth }) => {
                  const s = local.selected;
                  const selected = createMemo(() => {
                    if (!s) return false;
                    if (local.mode === 'range')
                      return isSameDay(date, s.from) || isSameDay(date, s.to);
                    if (local.mode === 'multiple')
                      return Array.isArray(s) && s.some((d) => isSameDay(d, date));
                    return isSameDay(date, s);
                  });

                  const inRange = createMemo(() => {
                    if (local.mode === 'range' && s?.from && s?.to) {
                      return isWithinRange(date, s.from, s.to);
                    }
                    return false;
                  });

                  const disabled = local.disabled?.(date);
                  const isToday = isSameDay(date, new Date());

                  const ariaLabel = () => {
                    return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}${isToday ? ' (Today)' : ''}`;
                  };

                  return (
                    <div
                      class="flex justify-center w-full relative"
                      role="gridcell"
                      tabIndex={-1}
                      aria-selected={selected()}
                    >
                      <Show when={inRange() && !selected()}>
                        <div class="absolute inset-y-0 inset-x-[-4px] bg-primary/20 z-0" />
                      </Show>

                      <button
                        type="button"
                        disabled={disabled || (!isCurrentMonth && !local.showOutsideDays)}
                        onClick={() => handleDateClick(date)}
                        aria-label={ariaLabel()}
                        aria-current={isToday ? 'date' : undefined}
                        class={twMerge(
                          'relative z-10 flex items-center justify-center w-10 h-10 text-sm font-mono cursor-pointer transition-all outline-none',
                          !isCurrentMonth &&
                            (local.showOutsideDays
                              ? 'text-muted/40'
                              : 'invisible pointer-events-none'),
                          isToday &&
                            !selected() &&
                            'text-primary font-bold underline underline-offset-4',
                          selected()
                            ? 'bg-primary text-white font-semibold'
                            : 'text-fg hover:bg-surface hover:text-fg',
                          disabled && 'opacity-30 cursor-not-allowed grayscale',
                        )}
                      >
                        {day}
                      </button>
                    </div>
                  );
                }}
              </For>
            </div>
          )}
        </For>
      </div>

      <Show when={local.showTime}>
        <div class="pt-4 border-t border-stroke flex flex-col items-center gap-4">
          <div class="flex items-center gap-2 font-mono">
            <div class="flex flex-col items-center gap-1 group">
              <button
                type="button"
                onClick={() => adjustTime('hours', 1)}
                class="p-1 text-muted hover:text-primary transition-colors"
              >
                <ChevronLeft size={14} class="rotate-90" />
              </button>
              <div class="relative w-12 h-10 border border-stroke flex items-center justify-center bg-surface/30 group-hover:border-muted transition-colors">
                <input
                  type="text"
                  class="w-full h-full bg-transparent text-center text-lg font-bold outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={(local.selected instanceof Date ? local.selected.getHours() : 0)
                    .toString()
                    .padStart(2, '0')}
                  onInput={(e) => handleTimeInput('hours', e.currentTarget.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => adjustTime('hours', -1)}
                class="p-1 text-muted hover:text-primary transition-colors"
              >
                <ChevronLeft size={14} class="-rotate-90" />
              </button>
              <span class="text-[9px] text-muted uppercase font-bold tracking-tighter">Hours</span>
            </div>

            <span class="text-xl font-bold text-muted mt-[-18px]">:</span>

            <div class="flex flex-col items-center gap-1 group">
              <button
                type="button"
                onClick={() => adjustTime('minutes', 1)}
                class="p-1 text-muted hover:text-primary transition-colors"
              >
                <ChevronLeft size={14} class="rotate-90" />
              </button>
              <div class="relative w-12 h-10 border border-stroke flex items-center justify-center bg-surface/30 group-hover:border-muted transition-colors">
                <input
                  type="text"
                  class="w-full h-full bg-transparent text-center text-lg font-bold outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={(local.selected instanceof Date ? local.selected.getMinutes() : 0)
                    .toString()
                    .padStart(2, '0')}
                  onInput={(e) => handleTimeInput('minutes', e.currentTarget.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => adjustTime('minutes', -1)}
                class="p-1 text-muted hover:text-primary transition-colors"
              >
                <ChevronLeft size={14} class="-rotate-90" />
              </button>
              <span class="text-[9px] text-muted uppercase font-bold tracking-tighter">Min</span>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};
