# Data Display Components

Components for presenting structured data, status indicators, and visual metadata.

---

## Table

A structured data display with monospace alignment and responsive overflow. Built as a set of compound components for maximum layout flexibility.

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@cdx-foundation/cdx-solidjs-components';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Alice</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>;
```

### Components

| Component     | Underlying Element                      | Props                                         |
| ------------- | --------------------------------------- | --------------------------------------------- |
| `Table`       | `<table>` (wrapped in scroll container) | `JSX.HTMLAttributes<HTMLTableElement>`        |
| `TableHeader` | `<thead>`                               | `JSX.HTMLAttributes<HTMLTableSectionElement>` |
| `TableBody`   | `<tbody>`                               | `JSX.HTMLAttributes<HTMLTableSectionElement>` |
| `TableRow`    | `<tr>`                                  | `JSX.HTMLAttributes<HTMLTableRowElement>`     |
| `TableHead`   | `<th>`                                  | `JSX.ThHTMLAttributes<HTMLTableCellElement>`  |
| `TableCell`   | `<td>`                                  | `JSX.TdHTMLAttributes<HTMLTableCellElement>`  |

### Behavior

- **Responsive overflow:** `Table` wraps `<table>` in a `<div class="w-full overflow-auto">` for horizontal scrolling on small screens.
- `TableHeader` applies `[&_tr]:border-b border-stroke` for consistent bottom borders on rows.
- `TableBody` applies `[&_tr:last-child]:border-0` to remove the bottom border on the final row.
- `TableRow` supports `data-[state=selected]:bg-surface` highlighting and `hover:bg-surface/50` hover state.
- `TableHead` uses semibold typography; `[&:has([role=checkbox])]:pr-0` for checkbox alignment.
- `TableCell` uses monospace font (`font-mono`); `[&:has([role=checkbox])]:pr-0` for checkbox alignment.

---

## Avatar

A visual representation of a user or entity with smart image loading and fallback support. Uses a context-based compound pattern.

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@cdx-foundation/cdx-solidjs-components';

<Avatar>
  <AvatarImage src="/photo.jpg" alt="Alice" />
  <AvatarFallback>A</AvatarFallback>
</Avatar>;
```

### Components

#### `Avatar`

| Prop          | Type                                       | Default | Description                    |
| ------------- | ------------------------------------------ | ------- | ------------------------------ |
| `as`          | `keyof JSX.IntrinsicElements \| Component` | `'div'` | Polymorphic underlying element |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLElement>`          | —       | All standard HTML attributes   |

Creates the `AvatarContext` provider. Tracks loading status (`idle` → `loading` → `loaded`/`error`).

#### `AvatarImage`

| Prop          | Type                                      | Required | Description                                                     |
| ------------- | ----------------------------------------- | -------- | --------------------------------------------------------------- |
| `src`         | `string`                                  | Yes      | Image source URL                                                |
| `alt`         | `string`                                  | Yes      | Alt text (required for accessibility)                           |
| `onLoad`      | `(e: Event) => void`                      | No       | Wrapped — calls `ctx.setStatus('loaded')` then original handler |
| `onError`     | `(e: Event) => void`                      | No       | Wrapped — calls `ctx.setStatus('error')` then original handler  |
| _(inherited)_ | `JSX.ImgHTMLAttributes<HTMLImageElement>` | —        | All standard img attributes                                     |

Hidden when status is not `'loaded'`. Resets status to `'loading'` when `src` changes.

#### `AvatarFallback`

| Prop          | Type                                       | Default | Description                    |
| ------------- | ------------------------------------------ | ------- | ------------------------------ |
| `as`          | `keyof JSX.IntrinsicElements \| Component` | `'div'` | Polymorphic underlying element |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLElement>`          | —       | All standard HTML attributes   |

Content shown only when status is not `'loaded'` (wrapped in `<Show>`).

### Behavior

- Requires `AvatarContext` (throws if used outside `<Avatar>`).
- Smart loading state management via context.
- Polymorphic `as` prop on `Avatar` and `AvatarFallback` via `<Dynamic>`.
- Two-way binding: image `src` changes reset status via `createEffect`.

---

## Badge

A status, category, or count indicator with multiple variants.

```tsx
import { Badge } from '@cdx-foundation/cdx-solidjs-components';

<Badge>Default</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="destructive">Failed</Badge>
<Badge variant="outline">Pending</Badge>
```

### Props

`BadgeProps` extends `JSX.HTMLAttributes<HTMLElement>` + `VariantProps<typeof badgeVariants>`.

| Prop          | Type                                                                                                       | Default     | Description                    |
| ------------- | ---------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------ |
| `variant`     | `'default' \| 'secondary' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'destructive' \| 'outline'` | `'default'` | Visual style                   |
| `as`          | `keyof JSX.IntrinsicElements \| Component`                                                                 | `'div'`     | Polymorphic underlying element |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLElement>`                                                                          | —           | All standard HTML attributes   |

### Variants

| Variant       | Style                                 |
| ------------- | ------------------------------------- |
| `default`     | Gray background                       |
| `secondary`   | Surface background with border        |
| `primary`     | Primary accent background, white text |
| `success`     | Emerald background                    |
| `warning`     | Amber background                      |
| `error`       | Rose background                       |
| `destructive` | Red background, white text            |
| `outline`     | Text foreground with border           |

### Behavior

- Polymorphic `as` prop via `<Dynamic>`.
- Uses `class-variance-authority` for variant management and `tailwind-merge` for class merging.
- Base classes: `inline-flex items-center px-2 py-0.5 rounded-badge text-[10px] font-bold uppercase tracking-wider transition-colors`.

---

## Kbd

A visual representation of keyboard shortcuts.

```tsx
import { Kbd } from '@cdx-foundation/cdx-solidjs-components';

<Kbd>⌘</Kbd>
<Kbd>K</Kbd>
```

### Props

Extends `JSX.HTMLAttributes<HTMLElement>`.

| Prop          | Type                              | Description                  |
| ------------- | --------------------------------- | ---------------------------- |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLElement>` | All standard HTML attributes |

### Behavior

- Renders a `<kbd>` element.
- `pointer-events-none` (informational, not interactive).
- Font: `font-mono text-[10px] font-medium`.
- Border: `border border-stroke bg-surface`.
- Purely presentational — no polymorphism, no ref forwarding, no controlled patterns.

---

## Code

A code block display with optional filename, language tag, and copy button.

```tsx
import { Code } from '@cdx-foundation/cdx-solidjs-components';

<Code code="const x = 42;" fileName="example.ts" language="TypeScript" />;
```

### Props

`CodeProps` extends `JSX.HTMLAttributes<HTMLDivElement>` (interface not exported).

| Prop          | Type                                 | Required | Default | Description                                    |
| ------------- | ------------------------------------ | -------- | ------- | ---------------------------------------------- |
| `code`        | `string`                             | Yes      | —       | The code string to display                     |
| `fileName`    | `string`                             | No       | —       | Optional filename displayed in the header      |
| `language`    | `string`                             | No       | —       | Optional language tag displayed in the header  |
| `showCopy`    | `boolean`                            | No       | `true`  | Whether to show the copy button                |
| `codeClass`   | `string`                             | No       | —       | Custom CSS classes for the code element itself |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | —        | —       | All standard div attributes                    |

### Behavior

- Header displays filename and language tag (if provided).
- Copy button uses the `clipboard` directive to copy code to `navigator.clipboard`.
- `showCopy` defaults to `true`.

---

## Progress

A status indicator for task completion with accessible ARIA attributes.

```tsx
import { Progress } from '@cdx-foundation/cdx-solidjs-components';

<Progress value={65} />
<Progress value={3} max={5} />
```

### Props

`ProgressProps` extends `JSX.HTMLAttributes<HTMLDivElement>` (interface not exported).

| Prop             | Type                                 | Required | Default | Description                                                |
| ---------------- | ------------------------------------ | -------- | ------- | ---------------------------------------------------------- |
| `value`          | `number`                             | Yes      | —       | Current numeric value of progress                          |
| `max`            | `number`                             | No       | `100`   | Numeric value corresponding to 100% completion             |
| `indicatorClass` | `string`                             | No       | —       | Custom CSS classes for the internal moving bar (indicator) |
| _(inherited)_    | `JSX.HTMLAttributes<HTMLDivElement>` | —        | —       | All standard div attributes                                |

### Accessibility

- `role="progressbar"`
- `tabIndex={0}`
- `aria-valuenow={value}`
- `aria-valuemin={0}`
- `aria-valuemax={max}`

### Behavior

- Clamped percentage: `Math.min(100, Math.max(0, (value / max) * 100))`.
- Indicator width set via inline `style={{ width: ... }}`.
- Transition: `transition-all duration-300 ease-out`.
- Controlled via `value` prop — no internal state.

---

## Skeleton

An animated loading placeholder.

```tsx
import { Skeleton } from '@cdx-foundation/cdx-solidjs-components';

<Skeleton class="h-4 w-full" />
<Skeleton class="h-12 w-12 rounded-full" />
```

### Props

Extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop          | Type                                 | Description                                          |
| ------------- | ------------------------------------ | ---------------------------------------------------- |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | All standard div attributes (`class`, `style`, etc.) |

### Behavior

- Renders a `<div>` with `animate-pulse rounded-card bg-gray-100 dark:bg-white/5`.
- Uses `splitProps` to extract `class` and `tailwind-merge` for composition.
- Purely presentational — size and shape are controlled via `class`.

---

## Separator

A visual divider between content blocks, supporting horizontal and vertical orientations.

```tsx
import { Separator } from '@cdx-foundation/cdx-solidjs-components';

<Separator />
<Separator orientation="vertical" class="h-8" />
```

### Props

Extends `JSX.HTMLAttributes<HTMLDivElement>` + `VariantProps<typeof separatorVariants>`.

| Prop          | Type                                 | Default        | Description                    |
| ------------- | ------------------------------------ | -------------- | ------------------------------ |
| `orientation` | `'horizontal' \| 'vertical'`         | `'horizontal'` | The visual axis of the divider |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | —              | All standard div attributes    |

### Variants (cva)

| Orientation  | Style         |
| ------------ | ------------- |
| `horizontal` | `h-px w-full` |
| `vertical`   | `h-full w-px` |

Base classes: `shrink-0 bg-stroke`.

### Behavior

- Uses `class-variance-authority` for orientation variants.
- Renders a `<div>`.
- No polymorphism, no accessibility roles beyond standard div.
