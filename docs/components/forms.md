# Form Components

A collection of input-based components for gathering and validating user data. All form components are fully typed, accessible, and integrate with the theme system.

---

## Button

A versatile action button with support for variants, loading states, and polymorphic rendering via the `as` prop.

```tsx
import { Button } from '@cdx-foundation/cdx-solidjs-components';

<Button variant="primary">Submit</Button>
<Button variant="outline" isLoading>Saving...</Button>
<Button as="a" href="/docs" variant="ghost">Go to Docs</Button>
```

### Props

`ButtonProps` extends `VariantProps<typeof buttonVariants>` (from class-variance-authority).

| Prop            | Type                                                                | Required | Default     | Description                                                                  |
| --------------- | ------------------------------------------------------------------- | -------- | ----------- | ---------------------------------------------------------------------------- |
| `variant`       | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive'` | No       | `'primary'` | Visual style                                                                 |
| `size`          | `'sm' \| 'md' \| 'lg' \| 'icon'`                                    | No       | `'md'`      | Button size                                                                  |
| `isLoading`     | `boolean`                                                           | No       | `false`     | Shows a spinner, disables the button, and prevents interaction               |
| `as`            | `string`                                                            | No       | `'button'`  | Polymorphic prop — change the underlying HTML element (e.g. `'a'` for links) |
| `class`         | `string`                                                            | No       | —           | CSS class names                                                              |
| `children`      | `JSX.Element`                                                       | No       | —           | Content inside the button                                                    |
| `disabled`      | `boolean`                                                           | No       | —           | Whether the button is disabled                                               |
| `[key: string]` | `unknown`                                                           | No       | —           | Additional props forwarded to the underlying element via `Dynamic`           |

### Variants

| Variant       | Style                                         |
| ------------- | --------------------------------------------- |
| `primary`     | (Default) High-emphasis theme background      |
| `secondary`   | Medium-emphasis with border                   |
| `outline`     | Low-emphasis with 2px border and smaller text |
| `ghost`       | Minimalist style that appears on hover        |
| `destructive` | Red button for critical actions               |

### Sizes

| Size   | Style                              |
| ------ | ---------------------------------- |
| `sm`   | `px-3 py-1.5 text-xs`              |
| `md`   | (Default) `px-5 py-2.5 text-sm`    |
| `lg`   | `px-8 py-3 text-base`              |
| `icon` | `h-9 w-9 p-0` (square icon button) |

### Behavior

- Uses `<Dynamic>` from `solid-js/web` for polymorphic rendering via the `as` prop.
- When `as` is used, `type` is set to `undefined` (avoids `type="button"` on `<a>`).
- **Loading state:** Renders a spinner with "Loading..." text, sets `aria-busy={true}` and `aria-live="polite"`.
- **Disabled state:** Merges `disabled` and `isLoading`.
- Base classes: `rounded-btn`, `shadow-btn` design tokens.

---

## Input

A standard text input field with built-in label, description, error support, regex validation, and a specialized number input mode.

```tsx
import { Input } from '@cdx-foundation/cdx-solidjs-components';

<Input label="Email" placeholder="user@example.com" type="email" />
<Input label="Password" error="Incorrect password" type="password" />
<Input label="Age" type="number" min={0} max={120} onChange={(v) => console.log(v)} />
```

### Props

`InputProps` extends `Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onChange'>`.

| Prop                  | Type                      | Required | Default | Description                                                                                      |
| --------------------- | ------------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------ |
| `label`               | `string`                  | No       | —       | Descriptive label shown above the input field                                                    |
| `description`         | `string`                  | No       | —       | Optional helper text displayed below the input                                                   |
| `error`               | `string`                  | No       | —       | Error message displayed in small font below the input (triggers error styling)                   |
| `containerClass`      | `string`                  | No       | —       | Custom CSS classes for the outer flex container                                                  |
| `regex`               | `RegExp`                  | No       | —       | Regular expression used to validate the input value in real-time                                 |
| `preventInvalidRegex` | `boolean`                 | No       | `false` | If `true`, characters not matching `regex` are prevented from being entered                      |
| `onRegexMismatch`     | `(value: string) => void` | No       | —       | Callback fired when the input value does not match `regex`                                       |
| `hideButtons`         | `boolean`                 | No       | `false` | For `type="number"`: if `true`, hides the increment/decrement buttons                            |
| `onChange`            | `(value: string) => void` | No       | —       | Standard text change callback                                                                    |
| `onChange`            | `(value: number) => void` | No       | —       | For `type="number"`: numeric value change callback                                               |
| _(inherited)_         | `JSX.InputHTMLAttributes` | —        | —       | All standard input attributes (`type`, `placeholder`, `min`, `max`, `step`, `class`, `id`, etc.) |

### Behavior

- **Two render modes:** Splits rendering based on `type`. Uses `NumberInputInternal` for `type="number"`, standard `<input>` otherwise.
- **Regex validation:** Tracks `lastValidValue` signal; optionally prevents invalid input from being entered.
- **Number input:** `Minus`/`Plus` icon buttons for stepping, clamped by `min`/`max`, respects `step` precision.
- **Auto-generated `id`** via `createUniqueId()` if not provided.
- **Accessibility:** `aria-invalid`, `aria-describedby` linking description/error elements. Error displayed with `role="alert"`.

---

## Textarea

A multi-line text input for longer data, with optional auto-resize.

```tsx
import { Textarea } from '@cdx-foundation/cdx-solidjs-components';

<Textarea label="Biography" placeholder="Tell us about yourself..." />
<Textarea label="Notes" autoResize />
```

### Props

`TextareaProps` extends `JSX.TextareaHTMLAttributes<HTMLTextAreaElement>` (interface not exported).

| Prop             | Type                         | Required | Default | Description                                                                                                |
| ---------------- | ---------------------------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| `label`          | `string`                     | No       | —       | Descriptive label shown above the textarea                                                                 |
| `error`          | `string`                     | No       | —       | Error message displayed below the textarea (triggers error border styling)                                 |
| `containerClass` | `string`                     | No       | —       | Custom CSS classes for the outer flex container                                                            |
| `autoResize`     | `boolean`                    | No       | —       | If `true`, the textarea automatically adjusts height as the user types (disables manual vertical resizing) |
| _(inherited)_    | `JSX.TextareaHTMLAttributes` | —        | —       | All standard textarea attributes                                                                           |

### Behavior

- **Auto-resize:** Uses `createEffect` to attach an `input` event listener; resets height to `auto`, then sets `scrollHeight`.
- Auto-resize disables manual resize via `resize-none overflow-hidden`.
- Default minimum height: `min-h-[80px]`.
- Monospace font (`font-mono`) for consistent character alignment.

---

## Checkbox

A squircular boolean input with controlled/uncontrolled support.

```tsx
import { Checkbox } from '@cdx-foundation/cdx-solidjs-components';

<Checkbox label="Accept terms and conditions" onCheckedChange={(v) => console.log(v)} />
<Checkbox label="Pre-checked" defaultChecked />
```

### Props

Extends `JSX.InputHTMLAttributes<HTMLInputElement>` (except `type`).

| Prop              | Type                         | Required | Default | Description                                   |
| ----------------- | ---------------------------- | -------- | ------- | --------------------------------------------- |
| `label`           | `string`                     | No       | —       | Text label displayed next to the checkbox     |
| `checked`         | `boolean`                    | No       | —       | Controlled checked state                      |
| `defaultChecked`  | `boolean`                    | No       | —       | Initial checked state (uncontrolled)          |
| `containerClass`  | `string`                     | No       | —       | Custom CSS classes for the flex container     |
| `onCheckedChange` | `(checked: boolean) => void` | No       | —       | Callback fired when checked state changes     |
| _(inherited)_     | `JSX.InputHTMLAttributes`    | —        | —       | All standard input attributes (except `type`) |

### Behavior

- **Controlled/uncontrolled:** If `checked` is `undefined`, uses an internal `internalChecked` signal initialized from `defaultChecked`; otherwise defers to the `checked` prop.
- Uses the `<Check>` icon from `lucide-solid`, absolutely positioned, shown/hidden via `peer-checked:opacity-100`.
- `aria-checked` set on the hidden input.
- Auto-generates `id` via `createUniqueId()` if not provided. Label linked via `for={id}`.

---

## RadioGroup

A set of mutually exclusive choices using a modern card-based layout. Supports both shorthand (`options` prop) and composable (`RadioGroupItem` children) patterns.

```tsx
import { RadioGroup } from '@cdx-foundation/cdx-solidjs-components';

// Shorthand pattern
<RadioGroup
  name="plan"
  label="Select Plan"
  value={selected()}
  onChange={setSelected}
  options={[
    { value: 'free', label: 'Free', description: 'Basic features' },
    { value: 'pro', label: 'Pro', description: 'Advanced features' },
  ]}
/>;
```

### Props

`RadioGroupProps` extends `Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'>`.

| Prop          | Type                                 | Required | Default | Description                                        |
| ------------- | ------------------------------------ | -------- | ------- | -------------------------------------------------- |
| `options`     | `RadioOption[]`                      | No       | —       | Array of `RadioOption` objects (shorthand pattern) |
| `value`       | `string`                             | Yes      | —       | Value of the currently selected option             |
| `onChange`    | `(value: string) => void`            | Yes      | —       | Callback fired when the selection changes          |
| `name`        | `string`                             | No       | —       | Form field name for the radio group                |
| `label`       | `string`                             | No       | —       | Group label                                        |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | —        | —       | All standard div attributes (except `onChange`)    |

### `RadioOption`

| Field         | Type     | Required | Description                                                                      |
| ------------- | -------- | -------- | -------------------------------------------------------------------------------- |
| `value`       | `string` | Yes      | Unique programmatic value for the option                                         |
| `label`       | `string` | Yes      | Human-readable title for the option                                              |
| `description` | `string` | No       | Supplemental information providing context (rendered in smaller, monospace font) |

### Composable Pattern

```tsx
import { RadioGroup, RadioGroupItem } from '@cdx-foundation/cdx-solidjs-components';

<RadioGroup name="size" value={size()} onChange={setSize}>
  <RadioGroupItem value="sm" label="Small" />
  <RadioGroupItem value="lg" label="Large" />
</RadioGroup>;
```

### Behavior

- Uses `RadioGroupContext` to share `value`, `onChange`, and `name` between `RadioGroup` and `RadioGroupItem`.
- Shorthand pattern renders in a `grid-cols-1 sm:grid-cols-2` layout.
- `<input>` elements use `sr-only` (screen-reader only) with a custom visual radio circle.

---

## Select

A fully themeable, accessible replacement for the native dropdown menu with search and keyboard navigation.

```tsx
import { Select } from '@cdx-foundation/cdx-solidjs-components';

<Select
  label="Environment"
  options={[
    { label: 'Production', value: 'prod' },
    { label: 'Staging', value: 'stage' },
  ]}
  value={env()}
  onChange={setEnv}
/>;
```

### Props

`SelectProps` (does not extend HTML attributes).

| Prop             | Type                                | Required | Default       | Description                                                       |
| ---------------- | ----------------------------------- | -------- | ------------- | ----------------------------------------------------------------- |
| `label`          | `string`                            | No       | —             | Descriptive label shown above the select box                      |
| `options`        | `SelectOption[]`                    | Yes      | —             | Collection of options to render in the dropdown                   |
| `value`          | `string \| number`                  | No       | —             | Currently active value (should match a `value` in `options`)      |
| `onChange`       | `(value: string \| number) => void` | No       | —             | Callback fired when the user selects a new option                 |
| `placeholder`    | `string`                            | No       | `'Select...'` | Text shown when no value is selected                              |
| `error`          | `string`                            | No       | —             | Error message displayed below the select (triggers error border)  |
| `class`          | `string`                            | No       | —             | Custom CSS classes for the trigger button                         |
| `containerClass` | `string`                            | No       | —             | Custom CSS classes for the outer container                        |
| `clearLabel`     | `string`                            | No       | —             | If provided, a clear option (value `''`) is prepended to the list |

### `SelectOption`

```ts
interface SelectOption {
  label: string;
  value: string | number;
}
```

### Behavior

- Custom dropdown using the `Floating` component (portal-based dynamic positioning).
- Uses `@solid-primitives/event-listener` for outside-click detection.
- **Full keyboard navigation:** ArrowUp/Down to navigate, Enter to select, Escape/Tab to close, Enter/Arrow to open when closed.
- **Accessibility:** `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-activedescendant`, `aria-selected` on options.
- Uses `createSelector` for efficient focused-index tracking.
- Syncs focused index to the currently selected option on open.
- ChevronDown icon rotates 180° when open.

---

## Slider

A range input with a custom track and square thumb, with dynamic gradient fill.

```tsx
import { Slider } from '@cdx-foundation/cdx-solidjs-components';

<Slider label="Volume" min={0} max={100} value={vol()} onChange={setVol} />;
```

### Props

`SliderProps` extends `Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onChange'>`.

| Prop             | Type                      | Required | Default | Description                                                                 |
| ---------------- | ------------------------- | -------- | ------- | --------------------------------------------------------------------------- |
| `label`          | `string`                  | No       | —       | Text displayed above the slider track                                       |
| `value`          | `number`                  | Yes      | `0`     | Current numeric value (inherits `min`/`max` from standard input attributes) |
| `onChange`       | `(value: number) => void` | No       | —       | Callback fired when the slider value changes                                |
| `containerClass` | `string`                  | No       | —       | Custom CSS classes for the container                                        |
| _(inherited)_    | `JSX.InputHTMLAttributes` | —        | —       | All standard input attributes (except `onChange`)                           |

### Behavior

- Uses native `<input type="range">` under the hood.
- **Dynamic gradient track:** `background: linear-gradient(...)` fills proportionally based on value.
- Label row shows both the value (with `%` suffix, `tabular-nums`).
- Custom square thumb via WebKit (`::-webkit-slider-thumb`).

---

## Switch

A high-fidelity toggle control (On/Off) with controlled/uncontrolled support.

```tsx
import { Switch } from '@cdx-foundation/cdx-solidjs-components';

<Switch label="Auto-save" checked={enabled()} onCheckedChange={setEnabled} />;
```

### Props

Extends `JSX.InputHTMLAttributes<HTMLInputElement>` (except `type`).

| Prop              | Type                         | Required | Default | Description                                   |
| ----------------- | ---------------------------- | -------- | ------- | --------------------------------------------- |
| `label`           | `string`                     | No       | —       | Text label displayed next to the switch       |
| `checked`         | `boolean`                    | No       | —       | Controlled checked state                      |
| `defaultChecked`  | `boolean`                    | No       | —       | Initial checked state (uncontrolled)          |
| `containerClass`  | `string`                     | No       | —       | Custom CSS classes for the container          |
| `onCheckedChange` | `(checked: boolean) => void` | No       | —       | Callback fired when checked state changes     |
| _(inherited)_     | `JSX.InputHTMLAttributes`    | —        | —       | All standard input attributes (except `type`) |

### Behavior

- **Controlled/uncontrolled:** Same pattern as Checkbox — internal signal with `defaultChecked` fallback.
- Uses `<input type="checkbox" role="switch">` with `aria-checked`.
- Visual toggle via CSS peer-based styling with an `after:` pseudo-element thumb (translates via `peer-checked:after:translate-x-4`).
- Uses `sr-only` native input, rendered label is separate.

---

## ColorPicker

A color selection tool with curated presets and custom hex input.

```tsx
import { ColorPicker } from '@cdx-foundation/cdx-solidjs-components';

<ColorPicker label="Accent Color" value={color()} onChange={setColor} />;
```

### Props

`ColorPickerProps` (does not extend HTML attributes).

| Prop             | Type                                 | Required | Default         | Description                                             |
| ---------------- | ------------------------------------ | -------- | --------------- | ------------------------------------------------------- |
| `label`          | `string`                             | No       | —               | Text label shown above the color picker trigger         |
| `value`          | `string`                             | Yes      | —               | Currently active color in hex format (e.g. `"#FF0000"`) |
| `onChange`       | `(color: string) => void`            | No       | —               | Callback fired when a color is chosen                   |
| `class`          | `string`                             | No       | —               | Custom CSS classes for the trigger button               |
| `containerClass` | `string`                             | No       | —               | Custom CSS classes for the outer container              |
| `presets`        | `{ label: string; value: string }[]` | No       | `PRESET_COLORS` | Custom preset color swatches                            |

### `PRESET_COLORS`

12 preset color swatches: Crimson, Rose, Orange, Amber, Emerald, Teal, Sky, Indigo, Violet, Pink, Slate, Zinc.

### Behavior

- Dropdown uses absolute positioning (not portal-based).
- Selected preset shows a `<Check>` icon overlay with `drop-shadow-sm`.
- Fallback default color: `#c62828` (Crimson).
- Re-opens discard stale hex edits.

---

## DatePicker

A combination of `Popover` and `Calendar` for selecting specific dates, with optional time selection.

```tsx
import { DatePicker } from '@cdx-foundation/cdx-solidjs-components';

<DatePicker label="Start Date" value={date()} onChange={setDate} />
<DatePicker label="Meeting Time" showTime value={date()} onChange={setDate} />
```

### Props

`DatePickerProps` extends `Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'>`.

| Prop          | Type                                 | Required | Default         | Description                                                                   |
| ------------- | ------------------------------------ | -------- | --------------- | ----------------------------------------------------------------------------- |
| `label`       | `string`                             | No       | —               | Text label shown above the picker input                                       |
| `placeholder` | `string`                             | No       | `'Pick a date'` | Text shown when no date is selected                                           |
| `value`       | `Date`                               | No       | —               | Currently active Date object                                                  |
| `onChange`    | `(date: Date) => void`               | No       | —               | Callback fired when the user selects a date                                   |
| `showTime`    | `boolean`                            | No       | `false`         | If `true`, shows a time picker in the calendar and displays time in the input |
| `align`       | `Alignment`                          | No       | `'left'`        | Anchor point of the calendar popover relative to the trigger                  |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | —        | —               | All standard div attributes (except `onChange`)                               |

### Behavior

- Composes `Popover` + `Calendar` components.
- Internal date state synced via `createEffect` tracking `local.value`.
- **Formatting:** `toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })`, optionally `toLocaleTimeString` if `showTime`.
- Popover aligned `"left"` by default.

---

## Calendar

A flexible calendar component supporting single, multiple, and range date selection modes, with optional time picker.

```tsx
import { Calendar } from '@cdx-foundation/cdx-solidjs-components';

// Single date
<Calendar mode="single" selected={date()} onChange={setDate} />

// Multiple dates
<Calendar mode="multiple" selected={dates()} onChange={setDates} />

// Date range
<Calendar mode="range" selected={range()} onChange={setRange} />

// With disabled dates and time picker
<Calendar
  mode="single"
  selected={date()}
  onChange={setDate}
  disabled={(d) => d.getDay() === 0 || d.getDay() === 6}
  showTime
/>
```

### Props

`CalendarProps` extends `Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'>`.

| Prop              | Type                                 | Required | Default    | Description                                                                                            |
| ----------------- | ------------------------------------ | -------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| `mode`            | `CalendarMode`                       | No       | `'single'` | Logic for selecting dates                                                                              |
| `selected`        | `Date \| Date[] \| DateRange`        | No       | —          | Current selection state (type depends on `mode`)                                                       |
| `onChange`        | `(val: any) => void`                 | No       | —          | Event handler called when date interaction occurs (receives value matching `mode`)                     |
| `disabled`        | `(date: Date) => boolean`            | No       | —          | Function to restrict selection. If `true` for a date, it's grayed out and non-interactive              |
| `showOutsideDays` | `boolean`                            | No       | `false`    | If `true`, shows dates from preceding/succeeding months to fill the 7×6 grid                           |
| `showTime`        | `boolean`                            | No       | `false`    | If `true`, shows a time picker (hours/minutes) below the calendar                                      |
| `initialFocus`    | `Date`                               | No       | —          | Date that should be visible when the calendar first renders (defaults to first selected date or today) |
| `align`           | `Alignment`                          | No       | `'bottom'` | Anchor point when used in a floating context                                                           |
| _(inherited)_     | `JSX.HTMLAttributes<HTMLDivElement>` | —        | —          | All standard div attributes (except `onChange`)                                                        |

### Types

```ts
type CalendarMode = 'single' | 'multiple' | 'range';

interface DateRange {
  from?: Date; // Beginning of the selected interval
  to?: Date; // End of the selected interval
}
```

### Selection Modes

| Mode       | `selected` type     | `onChange` receives |
| ---------- | ------------------- | ------------------- |
| `single`   | `Date \| undefined` | `Date`              |
| `multiple` | `Date[]`            | `Date[]`            |
| `range`    | `DateRange`         | `DateRange`         |

### Behavior

- **Range mode:** First click sets `{ from }`, second click sets `{ from, to }` (auto-sorts); clicking the same date clears the range.
- Renders a 7×6 grid (42 cells) with day-of-week headers (`Su`–`Sa`).
- **Outside days:** Optionally shown muted, or hidden (`invisible pointer-events-none`).
- **Today** is highlighted with an underline.
- **Time picker:** Hour/minute inputs with up/down arrow buttons, wraps at 23/59, arrow key adjustment.
- **Accessibility:** `role="grid"`, `role="row"`, `role="gridcell"`, `aria-selected`, `aria-current="date"` for today, `aria-label` with full date.
- Uses memoized `calendarData`/`calendarRows` for efficient per-cell selected/in-range computation.

---

## Label

A semantic wrapper for form headings.

```tsx
import { Label } from '@cdx-foundation/cdx-solidjs-components';

<Label for="username">Username</Label>;
```

### Props

Extends `JSX.LabelHTMLAttributes<HTMLLabelElement>`.

| Prop          | Type                                        | Description                                                      |
| ------------- | ------------------------------------------- | ---------------------------------------------------------------- |
| _(inherited)_ | `JSX.LabelHTMLAttributes<HTMLLabelElement>` | All standard label attributes (`for`, `class`, `children`, etc.) |

A simple presentational component with no custom props beyond standard HTML label attributes.
