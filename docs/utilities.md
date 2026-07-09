# Utilities

CDX Solid.js Components ships several utility primitives that power the component library and are available for direct use in your applications: hooks, directives, the `Floating` positioning engine, and the `createFocusTrap` helper.

---

## Hooks

### `useTheme`

The reactive theming hook. See the [Theming guide](./theming.md) for the complete API.

```tsx
import { useTheme } from '@cdx-foundation/cdx-solidjs-components/hooks';

const theme = useTheme();
theme.setTheme({ accent: '#c62828' });
theme.toggleTheme();
```

### `useDisclosure`

A lightweight boolean state helper for managing open/close patterns (modals, popovers, drawers, accordions).

```tsx
import { useDisclosure } from '@cdx-foundation/cdx-solidjs-components/hooks';

const { isOpen, onOpen, onClose, onToggle, setIsOpen } = useDisclosure(false);
```

| Property    | Type                | Description                       |
| ----------- | ------------------- | --------------------------------- |
| `isOpen`    | `Accessor<boolean>` | Current boolean state             |
| `onOpen`    | `() => void`        | Sets state to `true`              |
| `onClose`   | `() => void`        | Sets state to `false`             |
| `onToggle`  | `() => void`        | Toggles state (`prev → !prev`)    |
| `setIsOpen` | `Setter<boolean>`   | Direct setter from `createSignal` |

**Signature:**

```ts
function useDisclosure(initialState?: boolean): {
  isOpen: Accessor<boolean>;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  setIsOpen: Setter<boolean>;
};
```

- **Default:** `initialState` defaults to `false`.
- **Behavior:** Simple wrapper around `createSignal(false)`. No persistence, no SSR concerns, no effects.

**Example:**

```tsx
import { useDisclosure } from '@cdx-foundation/cdx-solidjs-components/hooks';
import { Modal } from '@cdx-foundation/cdx-solidjs-components';

function SettingsDialog() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <button onClick={onOpen}>Open Settings</button>
      <Modal isOpen={isOpen()} onClose={onClose}>
        ...
      </Modal>
    </>
  );
}
```

---

## Directives

The library exports four custom SolidJS directives. They are declared via TypeScript module augmentation so `use:directiveName` is fully type-checked.

```tsx
import type { JSX } from 'solid-js';

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      clickOutside: (e: MouseEvent) => void;
      autofocus: boolean;
      clipboard: string | (() => string);
      hover: (isHovering: boolean) => void;
    }
  }
}
```

### `use:clickOutside`

Calls the provided handler when a `click` event occurs outside the bound element.

```tsx
import { clickOutside } from '@cdx-foundation/cdx-solidjs-components';

<div use:clickOutside={(e) => console.log('Clicked outside!', e)}>Content</div>;
```

- Listens for `click` on `document`.
- Fires `accessor()(e)` when the click target is **not** inside the element.
- Cleans up the listener on unmount via `onCleanup`.

### `use:autofocus`

Focuses the element immediately on mount.

```tsx
import { autofocus } from '@cdx-foundation/cdx-solidjs-components';

<input use:autofocus />;
```

- Calls `el.focus()` on mount. No cleanup needed.

### `use:clipboard`

Copies text to the clipboard on click. Accepts a static string or a lazy getter function.

```tsx
import { clipboard } from '@cdx-foundation/cdx-solidjs-components';

<button use:clipboard="Copy this text">Copy</button>

// Or with a dynamic getter:
<button use:clipboard={() => someSignal()}>Copy Dynamic</button>
```

- On `click`, resolves `accessor()` — if it's a function, calls it to get the string; otherwise uses the string directly.
- Writes via `navigator.clipboard.writeText(text)` with error logging.
- Cleans up the listener on unmount.

### `use:hover`

Fires the handler on `mouseenter` / `mouseleave`.

```tsx
import { hover } from '@cdx-foundation/cdx-solidjs-components';

<div use:hover={(isHovering) => console.log(isHovering ? 'Entered' : 'Left')}>Hover me</div>;
```

- `accessor()(true)` on `mouseenter`, `accessor()(false)` on `mouseleave`.
- Cleans up both listeners on unmount.

---

## `Floating` — Portal-Based Positioning Engine

`Floating` is the positioning primitive that powers `Popover`, `HoverCard`, `Tooltip`, `Select`, `DropdownMenu`, `ContextMenu`, and `NavigationMenu`. It renders content into a portal and dynamically positions it relative to a trigger element using `getBoundingClientRect()` — no external floating-ui dependency.

### Exports

| Symbol               | Kind       | Description                        |
| -------------------- | ---------- | ---------------------------------- |
| `Alignment`          | Type alias | 12-position string union           |
| `Floating`           | Component  | Context provider root              |
| `FloatingTrigger`    | Component  | Wraps the trigger element          |
| `FloatingContent`    | Component  | Portal-rendered positioned content |
| `useFloatingContext` | Hook       | Access the floating context        |

### `Alignment`

```ts
type Alignment =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'left-top'
  | 'left-bottom'
  | 'right'
  | 'right-top'
  | 'right-bottom';
```

### `Floating` (Root)

| Prop       | Type          | Required | Default | Description         |
| ---------- | ------------- | -------- | ------- | ------------------- |
| `children` | `JSX.Element` | Yes      | —       | Portal children     |
| `isOpen`   | `boolean`     | No       | `false` | Controls open state |

Creates a `FloatingContext` provider and manages a `triggerEl` signal.

### `FloatingTrigger`

| Prop                                    | Type | Description                       |
| --------------------------------------- | ---- | --------------------------------- |
| `...JSX.HTMLAttributes<HTMLDivElement>` | —    | All div attributes passed through |

Wraps children in a `<div>` whose `ref` is registered with the floating context via `context.setTriggerEl`.

### `FloatingContent`

| Prop                | Type          | Required | Default    | Description                                  |
| ------------------- | ------------- | -------- | ---------- | -------------------------------------------- |
| `isOpen`            | `boolean`     | Yes      | —          | Controls visibility                          |
| `align`             | `Alignment`   | No       | `'bottom'` | Position relative to trigger                 |
| `sideOffset`        | `number`      | No       | `8`        | Gap between trigger and content (px)         |
| `matchTriggerWidth` | `boolean`     | No       | `false`    | If true, content width matches trigger width |
| `class`             | `string`      | No       | —          | Merged with `twMerge`                        |
| `children`          | `JSX.Element` | No       | —          | Rendered inside the portal                   |

### Positioning Behavior

- **No floating-ui dependency.** Positioning is computed manually using `getBoundingClientRect()` on the trigger, inside a `requestAnimationFrame` loop.
- **Strategy:** `position: fixed` with `top`/`left` set to raw viewport coords, then `transform` for anchor-point alignment.
- **Transform mapping per alignment:**

| Alignment      | Transform                 |
| -------------- | ------------------------- |
| `top`          | `translate(-50%, -100%)`  |
| `top-left`     | `translate(0, -100%)`     |
| `top-right`    | `translate(-100%, -100%)` |
| `bottom`       | `translate(-50%, 0)`      |
| `bottom-left`  | `translate(0, 0)`         |
| `bottom-right` | `translate(-100%, 0)`     |
| `left`         | `translate(-100%, -50%)`  |
| `left-top`     | `translate(-100%, 0)`     |
| `left-bottom`  | `translate(-100%, -100%)` |
| `right`        | `translate(0, -50%)`      |
| `right-top`    | `translate(0, 0)`         |
| `right-bottom` | `translate(0, -100%)`     |

- **Re-positioning:** Registers `scroll` (capture, passive) and `resize` (passive) listeners, each calling `rafUpdate` to debounce via `requestAnimationFrame`.
- **z-index:** Hardcoded to `100`.
- **`pointer-events: auto`** applied to the portal div.

### Usage

```tsx
import { Floating } from '@cdx-foundation/cdx-solidjs-components';

<Floating>
  <Floating.Trigger>
    <button>Trigger</button>
  </Floating.Trigger>
  <Floating.Content isOpen={open()} align="bottom" sideOffset={8}>
    Positioned content
  </Floating.Content>
</Floating>;
```

Compound accessors: `Floating.Trigger`, `Floating.Content`, `Floating.useContext`.

---

## `createFocusTrap`

An SSR-safe focus trap primitive that keeps Tab/Shift+Tab focus cycling within a container element while active. Used internally by `Modal` and `Sheet`.

### Signature

```ts
function createFocusTrap(
  container: Accessor<HTMLElement | undefined>,
  isActive: Accessor<boolean>,
): void;
```

| Parameter   | Type                                 | Description                                     |
| ----------- | ------------------------------------ | ----------------------------------------------- |
| `container` | `Accessor<HTMLElement \| undefined>` | Accessor returning the container element        |
| `isActive`  | `Accessor<boolean>`                  | Accessor indicating whether the trap is engaged |

### Behavior

- **SSR-safe:** All `document`/`window` access is guarded.
- **Focusable selector:** `a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])`
- **Activation:** When `isActive()` becomes `true`:
  1. Saves `document.activeElement` to `previouslyFocused`.
  2. Focuses the first focusable descendant (or the container itself if none).
- **Tab-cycling:** `Tab` on last focusable wraps to first; `Shift+Tab` on first wraps to last. If no focusable elements exist, `e.preventDefault()` swallows the tab.
- **Focus restoration:** On deactivation or unmount, restores focus to `previouslyFocused`.

### Usage

```tsx
import { createFocusTrap } from '@cdx-foundation/cdx-solidjs-components/ui/_focusTrap';

function MyDialog() {
  let ref: HTMLDivElement | undefined;
  const [active] = createSignal(false);

  createFocusTrap(() => ref, active);

  return <div ref={ref}>...</div>;
}
```

> **Note:** `_focusTrap` is an internal module. The `createFocusTrap` function is used by `Modal` and `Sheet` automatically — you typically don't need to call it directly.

---

## `uid` — Unique ID Generator

A tiny SSR-safe unique ID helper used throughout the library for HTML element pairing (e.g., `label`/`input` `for`/`id`).

### Signature

```ts
function uid(prefix: string): string;
```

Returns `"${prefix}-${createUniqueId()}"` where `createUniqueId()` is SolidJS's built-in SSR-safe unique ID generator.

```tsx
import { uid } from '@cdx-foundation/cdx-solidjs-components';

const id = uid('accordion'); // e.g. "accordion-1"
```
