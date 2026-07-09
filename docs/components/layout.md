# Layout Components

Components for structuring page content — cards, aspect ratios, scroll areas, resizable panels, and segmented controls.

---

## Card

A content container with consistent padding and borders, using a compound component pattern for flexible composition.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@cdx-foundation/cdx-solidjs-components';

<Card class="max-w-md">
  <CardHeader>
    <CardTitle>Settings</CardTitle>
    <CardDescription>Manage your account preferences.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>

// Polymorphic — render as a link
<Card as="a" href="/details">
  <CardTitle>Clickable Card</CardTitle>
  <CardContent>Click to view details</CardContent>
</Card>
```

### Components

#### `Card`

| Prop          | Type                                       | Default | Description                          |
| ------------- | ------------------------------------------ | ------- | ------------------------------------ |
| `as`          | `keyof JSX.IntrinsicElements \| Component` | `'div'` | Polymorphic underlying element       |
| `href`        | `string`                                   | —       | Optional href (useful when `as="a"`) |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLElement>`          | —       | All standard HTML attributes         |

Renders with `class="clean-panel w-full p-5 text-left flex flex-col gap-3"`.

#### `CardHeader`

Props: `JSX.HTMLAttributes<HTMLDivElement>`. Renders `flex flex-col space-y-1.5`.

#### `CardTitle`

| Prop          | Type                                       | Default | Description                    |
| ------------- | ------------------------------------------ | ------- | ------------------------------ |
| `as`          | `keyof JSX.IntrinsicElements \| Component` | `'h3'`  | Polymorphic underlying element |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLElement>`          | —       | All standard HTML attributes   |

Renders with `class="text-lg font-semibold leading-none tracking-tight"`.

#### `CardDescription`

| Prop          | Type                                       | Default | Description                    |
| ------------- | ------------------------------------------ | ------- | ------------------------------ |
| `as`          | `keyof JSX.IntrinsicElements \| Component` | `'p'`   | Polymorphic underlying element |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLElement>`          | —       | All standard HTML attributes   |

Renders with `class="text-sm text-muted-foreground"`.

#### `CardContent`

Props: `JSX.HTMLAttributes<HTMLDivElement>`. Empty wrapper class.

#### `CardFooter`

Props: `JSX.HTMLAttributes<HTMLDivElement>`. Renders `flex items-center pt-0`.

### Behavior

- Polymorphic `as` prop on `Card`, `CardTitle`, and `CardDescription`.
- Uses the `.clean-panel` utility class for themed background, border, and card radius.

---

## AspectRatio

Maintains a specific width/height ratio for media content using the padding-hack technique.

```tsx
import { AspectRatio } from '@cdx-foundation/cdx-solidjs-components';

<AspectRatio ratio={16/9}>
  <img src="/photo.jpg" class="w-full h-full object-cover" />
</AspectRatio>

<AspectRatio ratio={1}>
  <img src="/avatar.jpg" class="w-full h-full object-cover" />
</AspectRatio>
```

### Props

`AspectRatioProps` extends `JSX.HTMLAttributes<HTMLDivElement>` (interface not exported).

| Prop          | Type                                 | Required | Default         | Description                                                                                   |
| ------------- | ------------------------------------ | -------- | --------------- | --------------------------------------------------------------------------------------------- |
| `ratio`       | `number`                             | No       | `16/9` (≈1.777) | The aspect ratio as Width ÷ Height (e.g. `16/9` for HD, `1/1` for square, `4/3` for standard) |
| `children`    | `JSX.Element`                        | Yes      | —               | The media or content element that should fill the container                                   |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | —        | —               | All standard div attributes                                                                   |

### Behavior

- **Padding-hack technique:** Uses `padding-bottom: ${(1/ratio)*100}%` on the outer `div` to reserve height proportional to width.
- Children are wrapped in an absolutely-positioned inner `div` (`absolute inset-0 w-full h-full`).
- No polymorphic `as` prop — fixed to `<div>`.

---

## ScrollArea

A minimalist, cross-browser custom scrollbar wrapper.

```tsx
import { ScrollArea } from '@cdx-foundation/cdx-solidjs-components';

<ScrollArea maxHeight="300px">
  <p>Long content that scrolls...</p>
</ScrollArea>;
```

### Props

`ScrollAreaProps` extends `JSX.HTMLAttributes<HTMLDivElement>` (interface not exported).

| Prop          | Type                                 | Required | Default  | Description                                                      |
| ------------- | ------------------------------------ | -------- | -------- | ---------------------------------------------------------------- |
| `children`    | `JSX.Element`                        | Yes      | —        | The content tree that may exceed the container's height or width |
| `maxHeight`   | `string`                             | No       | `'100%'` | CSS string representing the height limit of the container        |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | —        | —        | All standard div attributes                                      |

### Behavior

- **Custom scrollbar styling:** Injects a `<style>` tag with WebKit scrollbar overrides:
  - Width/height: `6px`
  - Track: transparent
  - Thumb: `var(--color-stroke, #333)`, `border-radius: 0` (square)
  - Thumb hover: `var(--color-muted, #555)`
- Renders with `class="relative overflow-auto custom-scrollbar"`.
- Uses `tailwind-merge` for class composition.

---

## Resizable

Draggable panels with snap points and context-based coordination. **Experimental** — the API may change.

```tsx
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@cdx-foundation/cdx-solidjs-components';

<ResizablePanelGroup direction="horizontal" class="h-[200px]">
  <ResizablePanel defaultSize={50}>Panel A</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={50}>Panel B</ResizablePanel>
</ResizablePanelGroup>;
```

### Components

#### `ResizablePanelGroup`

Extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop          | Type                                 | Default        | Description                 |
| ------------- | ------------------------------------ | -------------- | --------------------------- |
| `direction`   | `'horizontal' \| 'vertical'`         | `'horizontal'` | Layout direction            |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | —              | All standard div attributes |

#### `ResizablePanel`

Extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop          | Type                                 | Default                           | Description                  |
| ------------- | ------------------------------------ | --------------------------------- | ---------------------------- |
| `defaultSize` | `number`                             | `50`                              | Initial size as a percentage |
| `id`          | `string`                             | Auto-generated via `uid('panel')` | Used for size tracking       |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | —                                 | All standard div attributes  |

#### `ResizableHandle`

Extends `JSX.HTMLAttributes<HTMLDivElement>`. Intercepts `onMouseDown` and `onTouchStart` internally.

### Behavior

- **Context-based coordination:** `ResizablePanelGroup` provides a `ResizableContext` with panel registration and resize logic.
- **Direction modes:** `"horizontal"` (row) or `"vertical"` (column), changes cursor to `col-resize` / `row-resize`.
- **Panel sizing:** Uses `flex-basis` with `flex-grow: 0` and `flex-shrink: 0` — panels are fixed at their percentage sizes.
- **Handle accessibility:** `role="separator"`, `tabIndex={0}`, focus-visible ring styles.
- **Mouse + Touch support:** `onMouseDown`/`onMouseMove`/`onMouseUp` and `onTouchStart`/`onTouchMove`/`onTouchEnd`.
- **Minimum size protection:** Prevents panels from collapsing below 5%.
- **Error on misuse:** `ResizablePanel` and `ResizableHandle` throw `"must be used within ResizablePanelGroup"` if used outside the context.

> **Note:** This component is marked `@experimental` in the source. The resize calculation is simplified (uses relative position within the group, not true delta-based drag).

---

## SegmentedControl

A compact, mutually exclusive option selector — like a stylized radio group.

```tsx
import { SegmentedControl } from '@cdx-foundation/cdx-solidjs-components';

<SegmentedControl
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month', icon: CalendarIcon },
  ]}
  value={range()}
  onChange={setRange}
/>;
```

### Props

`SegmentedControlProps` (interface not exported).

| Prop        | Type                                | Required | Description                                       |
| ----------- | ----------------------------------- | -------- | ------------------------------------------------- |
| `options`   | `SegmentedControlOption[]`          | Yes      | The list of selectable segments                   |
| `value`     | `string \| number`                  | Yes      | The currently active value                        |
| `onChange`  | `(value: string \| number) => void` | Yes      | Callback fired when a segment is selected         |
| `class`     | `string`                            | No       | Custom CSS classes for the outer container        |
| `itemClass` | `string`                            | No       | Custom CSS classes for individual segment buttons |

### `SegmentedControlOption`

```ts
interface SegmentedControlOption {
  value: string | number; // required — internal value
  label: string; // required — text label
  icon?: Component<{ class?: string; size?: number }>; // optional — icon component
}
```

### Behavior

- **Controlled component:** Requires both `value` and `onChange` — no internal state.
- **Icon support:** Each option can optionally include an `icon` component (rendered via `<Dynamic>` at size 12).
- Active button: `bg-primary text-white shadow-lg`.
- Inactive buttons: `text-muted hover:text-fg hover:bg-panel/50`.
- Container: `inline-flex items-center bg-surface p-1 rounded-input border border-stroke shadow-sm`.
- Each segment is a `<button type="button">` for accessibility.
