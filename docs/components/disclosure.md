# Disclosure Components

Components that show and hide content — accordions, collapsibles, tabs, hover cards, and tooltips.

---

## Accordion

A vertically stacked set of interactive headings that each reveal a section of content. Supports single/multiple expansion and controlled/uncontrolled patterns.

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@cdx-foundation/cdx-solidjs-components';

<Accordion>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content for section 1</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>Content for section 2</AccordionContent>
  </AccordionItem>
</Accordion>;
```

### Components

#### `Accordion`

`AccordionProps` extends `Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'>`.

| Prop          | Type                                  | Required | Default | Description                                                          |
| ------------- | ------------------------------------- | -------- | ------- | -------------------------------------------------------------------- |
| `multiple`    | `boolean`                             | No       | `false` | If `true`, multiple items can be expanded at once                    |
| `collapsible` | `boolean`                             | No       | `true`  | If `true`, an expanded item can be collapsed by clicking its trigger |
| `value`       | `string \| string[]`                  | No       | —       | The value of the expanded item(s) (controlled)                       |
| `onChange`    | `(value: string \| string[]) => void` | No       | —       | Callback fired when the expanded item(s) change                      |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>`  | —        | —       | All standard div attributes (except `onChange`)                      |

#### `AccordionItem`

Extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop          | Type                                 | Default                               | Description                 |
| ------------- | ------------------------------------ | ------------------------------------- | --------------------------- |
| `value`       | `string`                             | Auto-generated via `uid('accordion')` | Unique value for the item   |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | —                                     | All standard div attributes |

#### `AccordionTrigger`

Extends `JSX.HTMLAttributes<HTMLButtonElement>`.

| Event     | Behavior                                                            | Signature                                         |
| --------- | ------------------------------------------------------------------- | ------------------------------------------------- |
| `onClick` | Calls `root.toggleItem(item.id)`, then forwards to user's `onClick` | `JSX.EventHandler<HTMLButtonElement, MouseEvent>` |

#### `AccordionContent`

Extends `JSX.HTMLAttributes<HTMLDivElement>`. Shows/hides content based on expansion state.

### Behavior

- Uses `AccordionContext` and `AccordionItemContext` for coordination.
- `collapsible: true` allows collapsing an open item by clicking its trigger again.
- `multiple: true` allows several items open simultaneously.
- Chevron icon rotates when expanded.

---

## Collapsible

Content that expands and contracts with a single trigger.

```tsx
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@cdx-foundation/cdx-solidjs-components';

<Collapsible>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Hidden content</CollapsibleContent>
</Collapsible>;
```

### Components

#### `Collapsible`

Extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop          | Type                                 | Default | Description                       |
| ------------- | ------------------------------------ | ------- | --------------------------------- |
| `defaultOpen` | `boolean`                            | `false` | Initial open state (uncontrolled) |
| `trigger`     | `JSX.Element`                        | —       | Optional trigger element          |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | —       | All standard div attributes       |

#### `CollapsibleTrigger`

Extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Event       | Behavior                                                                              | Signature                                         |
| ----------- | ------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `onClick`   | Toggles `setIsOpen`, then forwards to user's `onClick`                                | `JSX.EventHandler<HTMLDivElement, MouseEvent>`    |
| `onKeyDown` | Enter/Space toggle (skips if event originated from a child `<button>`), then forwards | `JSX.EventHandler<HTMLDivElement, KeyboardEvent>` |

#### `CollapsibleContent`

Extends `JSX.HTMLAttributes<HTMLDivElement>`. Shows/hides content based on open state.

### Behavior

- Internal `isOpen` signal initialized from `defaultOpen`.
- Keyboard accessible: Enter and Space toggle the content.
- Skips keyboard toggle if the event originated from a child `<button>` (lets the button handle it).

---

## Tabs

Layered sections of content with full keyboard navigation. Supports both controlled/uncontrolled patterns and a shorthand `items` prop.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@cdx-foundation/cdx-solidjs-components';

<Tabs value={tab()} onChange={setTab}>
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings</TabsContent>
  <TabsContent value="password">Password settings</TabsContent>
</Tabs>

// Shorthand pattern
<Tabs
  items={[
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details', icon: InfoIcon },
  ]}
  defaultValue="overview"
>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="details">Details content</TabsContent>
</Tabs>
```

### Components

#### `Tabs`

`TabsProps` extends `Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'>`.

| Prop           | Type                                                     | Required | Default                                          | Description                                                   |
| -------------- | -------------------------------------------------------- | -------- | ------------------------------------------------ | ------------------------------------------------------------- |
| `defaultValue` | `string`                                                 | No       | First item's `id` if `items` provided, else `''` | Value of the active tab on initial mount (uncontrolled)       |
| `value`        | `string`                                                 | No       | —                                                | Value of the currently active tab (controlled)                |
| `onChange`     | `(v: string) => void`                                    | No       | —                                                | Callback fired whenever the active tab changes                |
| `children`     | `JSX.Element`                                            | No       | —                                                | A combination of `TabsList`, `TabsTrigger`, and `TabsContent` |
| `items`        | `Array<{ id: string; label: string; icon?: Component }>` | No       | —                                                | Shorthand for rendering tab triggers from a data array        |
| _(inherited)_  | `JSX.HTMLAttributes<HTMLDivElement>`                     | —        | —                                                | All standard div attributes (except `children`, `onChange`)   |

#### `TabsTrigger`

Extends `JSX.HTMLAttributes<HTMLButtonElement>`.

| Prop          | Type                                    | Required | Description                                                       |
| ------------- | --------------------------------------- | -------- | ----------------------------------------------------------------- |
| `value`       | `string`                                | Yes      | Unique identifier for this tab (must match `TabsContent` `value`) |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLButtonElement>` | —        | All standard button attributes                                    |

#### `TabsContent`

Extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop          | Type                                 | Required | Description                                                 |
| ------------- | ------------------------------------ | -------- | ----------------------------------------------------------- |
| `value`       | `string`                             | Yes      | Unique identifier linking this content to its `TabsTrigger` |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | —        | All standard div attributes                                 |

#### `TabsList`

Extends `JSX.HTMLAttributes<HTMLDivElement>`. Container for `TabsTrigger` elements.

### Keyboard Navigation

| Key                        | Behavior           |
| -------------------------- | ------------------ |
| `ArrowRight` / `ArrowLeft` | Cycle through tabs |
| `Home`                     | Go to first tab    |
| `End`                      | Go to last tab     |

On navigation, calls `context.setValue(targetValue)` and focuses the target tab.

### Behavior

- Uses `TabsContext` to share `value` and `setValue` between components.
- Controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
- Shorthand `items` prop auto-renders `TabsTrigger` elements.

---

## HoverCard

Preview content on hover with a grace period before opening/closing.

```tsx
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@cdx-foundation/cdx-solidjs-components';

<HoverCard>
  <HoverCardTrigger>
    <a href="/user">@alice</a>
  </HoverCardTrigger>
  <HoverCardContent>
    <div class="p-4">
      <h4>Alice</h4>
      <p>Software engineer</p>
    </div>
  </HoverCardContent>
</HoverCard>;
```

### Components

#### `HoverCard`

Extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop          | Type                                 | Default | Description                                         |
| ------------- | ------------------------------------ | ------- | --------------------------------------------------- |
| `align`       | `Alignment`                          | `'top'` | Anchor point of the content relative to the trigger |
| `trigger`     | `JSX.Element`                        | —       | Optional trigger element                            |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | —       | All standard div attributes                         |

#### `HoverCardTrigger`

Extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Event          | Behavior                                                                                |
| -------------- | --------------------------------------------------------------------------------------- |
| `onMouseEnter` | Clears any dismiss timeout, sets `isOpen(true)`, forwards to user                       |
| `onMouseLeave` | Sets a 200ms timeout before setting `isOpen(false)` (delayed dismiss), forwards to user |

#### `HoverCardContent`

Extends `JSX.HTMLAttributes<HTMLDivElement>`. Rendered via `Floating.Content`.

| Event          | Behavior                                                                     |
| -------------- | ---------------------------------------------------------------------------- |
| `onMouseEnter` | Clears timeout (prevents premature close when entering content from trigger) |
| `onMouseLeave` | Sets 200ms timeout to close                                                  |

### Behavior

- Uses the `Floating` component for portal-based positioning.
- **Grace period:** 200ms delayed dismiss prevents flicker when moving between trigger and content.
- Uses a `timeoutId` for delayed dismiss behavior.

---

## Tooltip

Informative hover messages with directional alignment.

```tsx
import { Tooltip } from '@cdx-foundation/cdx-solidjs-components';

<Tooltip content="This is helpful information" align="top">
  <button>Hover me</button>
</Tooltip>

// Or with trigger prop
<Tooltip trigger={<button>Hover me</button>} content="Info" align="bottom" />
```

### Props

Extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop          | Type                                 | Required | Default | Description                                                       |
| ------------- | ------------------------------------ | -------- | ------- | ----------------------------------------------------------------- |
| `align`       | `Alignment`                          | No       | `'top'` | Direction where the tooltip should appear relative to the trigger |
| `trigger`     | `JSX.Element`                        | No       | —       | The element that triggers the tooltip on hover                    |
| `content`     | `JSX.Element`                        | No       | —       | The content to display inside the tooltip                         |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | —        | —       | All standard div attributes                                       |

### Behavior

- Uses `local.content ?? local.children` for tooltip content text.
- Uses the `Floating` component for positioning.
- Opens on `onMouseEnter` (sets `isOpen(true)`), closes on `onMouseLeave` (sets `isOpen(false)`).
- 12 alignment directions via the `Alignment` type.
