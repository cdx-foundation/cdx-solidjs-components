# Feedback Components

Components for communicating status, alerts, and transient notifications to users.

---

## Alert

An important message for users to acknowledge, with auto-rendered icons per variant and compound sub-components.

```tsx
import { Alert, AlertTitle, AlertDescription } from '@cdx-foundation/cdx-solidjs-components';

<Alert variant="info">
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>You can update your preferences anytime.</AlertDescription>
</Alert>

<Alert variant="error">
  <AlertTitle>Something went wrong</AlertTitle>
  <AlertDescription>Your changes could not be saved.</AlertDescription>
</Alert>
```

### Components

#### `Alert`

`AlertProps` extends `JSX.HTMLAttributes<HTMLElement>` + `VariantProps<typeof alertVariants>`.

| Prop          | Type                                                           | Default  | Description                    |
| ------------- | -------------------------------------------------------------- | -------- | ------------------------------ |
| `variant`     | `'info' \| 'warning' \| 'error' \| 'success' \| 'destructive'` | `'info'` | Visual theme                   |
| `as`          | `keyof JSX.IntrinsicElements \| Component`                     | `'div'`  | Polymorphic underlying element |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLElement>`                              | —        | All standard HTML attributes   |

#### `AlertTitle`

| Prop          | Type                                       | Default | Description                    |
| ------------- | ------------------------------------------ | ------- | ------------------------------ |
| `as`          | `keyof JSX.IntrinsicElements \| Component` | `'h5'`  | Polymorphic underlying element |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLElement>`          | —       | All standard HTML attributes   |

Renders with `class="mb-1 font-medium leading-none tracking-tight"`.

#### `AlertDescription`

| Prop          | Type                                       | Default | Description                    |
| ------------- | ------------------------------------------ | ------- | ------------------------------ |
| `as`          | `keyof JSX.IntrinsicElements \| Component` | `'div'` | Polymorphic underlying element |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLElement>`          | —       | All standard HTML attributes   |

Renders with `class="text-sm [&_p]:leading-relaxed"`.

### Variants

| Variant       | Icon          | Color Theme |
| ------------- | ------------- | ----------- |
| `info`        | Info          | Blue        |
| `warning`     | TriangleAlert | Amber       |
| `error`       | CircleX       | Red         |
| `success`     | CircleCheck   | Emerald     |
| `destructive` | CircleX       | Red         |

### Behavior

- **Auto-icon:** Each variant automatically renders a corresponding Lucide icon.
- **Accessibility:** Renders `role="alert"` on the root element.
- Polymorphic `as` prop on all three components via `<Dynamic>`.
- Non-dismissible (no close button).
- Uses `tailwind-merge` and `class-variance-authority`.

---

## Toast

Fluid, animated notifications with an imperative API, singleton management, and portal rendering.

### Quick Start

Mount the `<Toaster>` once at your app root, then call `toast()` from anywhere:

```tsx
// App root
import { Toaster } from '@cdx-foundation/cdx-solidjs-components';

function App() {
  return (
    <>
      <Toaster />
      <YourApp />
    </>
  );
}

// Anywhere in your app
import { toast } from '@cdx-foundation/cdx-solidjs-components';

toast('Saved successfully');
toast.success('Profile updated!');
toast.error('Connection failed');
toast.warning('Storage almost full');
toast.info('New version available');
```

### Imperative API (`toast`)

```ts
type ToastArgs = string | Omit<ToastData, 'id'>;

interface ToastFunction {
  (data: ToastArgs): string; // returns the generated toast id
  setPosition: (pos: ToasterPosition) => void; // dynamically update spawn position
  info: (data: ToastArgs) => string;
  success: (data: ToastArgs) => string;
  warning: (data: ToastArgs) => string;
  error: (data: ToastArgs) => string;
}
```

| Method                   | Description                                   |
| ------------------------ | --------------------------------------------- |
| `toast(data)`            | Creates a toast with `type: 'default'`        |
| `toast.info(data)`       | Creates an info toast                         |
| `toast.success(data)`    | Creates a success toast                       |
| `toast.warning(data)`    | Creates a warning toast                       |
| `toast.error(data)`      | Creates an error toast                        |
| `toast.setPosition(pos)` | Dynamically updates the global spawn position |

All methods return the generated toast `id` string.

`ToastArgs` accepts either a plain string (used as the title) or a full `ToastData` object (minus `id`):

```ts
toast('Simple message');
toast({ title: 'Saved', description: 'Your changes were stored.', duration: 6000 });
```

### `ToastData`

```ts
interface ToastData {
  id: string; // Generated automatically
  title: string; // Primary message heading
  description?: string; // Secondary information (smaller, monospace font)
  duration?: number; // Display duration in ms (falls back to Toaster's global duration)
  type?: 'default' | 'info' | 'success' | 'warning' | 'error'; // default: 'default'
}
```

### `<Toaster>` Component

```tsx
<Toaster position="bottom-right" duration={4000} maxToasts={5} />
```

| Prop        | Type              | Default          | Description                                                                |
| ----------- | ----------------- | ---------------- | -------------------------------------------------------------------------- |
| `position`  | `ToasterPosition` | `'bottom-right'` | Corner where notifications appear (overrides global `toast.setPosition()`) |
| `duration`  | `number`          | `4000`           | Global default duration in milliseconds                                    |
| `maxToasts` | `number`          | `5`              | Maximum number of toasts visible at once                                   |
| `class`     | `string`          | —                | Additional CSS classes                                                     |

### `ToasterPosition`

```ts
type ToasterPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';
```

### Compound Sub-Components

**`ToastTitle`** — renders `<h3>` with `class="text-sm font-semibold text-fg"`. Props: `JSX.HTMLAttributes<HTMLHeadingElement>`.

**`ToastDescription`** — renders `<p>` with `class="text-xs font-mono text-muted"`. Props: `JSX.HTMLAttributes<HTMLParagraphElement>`.

### `createToaster()` Factory

For custom/isolated toaster instances:

```ts
function createToaster(): {
  toasts: Signal<ToastData[]>;
  setToasts: Setter<ToastData[]>;
  toasterPosition: Signal<ToasterPosition>;
  setToasterPosition: Setter<ToasterPosition>;
  toastConfig: Signal<{ duration: number; maxToasts: number }>;
  _setToastConfig: Setter<{ duration: number; maxToasts: number }>;
  activeToasters: Signal<string[]>;
  setActiveToasters: Setter<string[]>;
  toast: ToastFunction;
  toastTimeouts: Map<string, ReturnType<typeof setTimeout>>;
};
```

### Behavior

- **Portal rendering:** Toasts render inside a `<Portal>` to escape ancestor clipping.
- **Animations:** `TransitionGroup` from `solid-transition-group` — fade in (200ms ease-out) / fade out (200ms ease-in) via Web Animations API.
- **Singleton + multi-instance:** Default `toast()`/`<Toaster>` uses a lazy singleton; `createToaster()` allows custom instances.
- **Auto-dismiss:** Each toast has a configurable `duration` timeout. Set `duration: 0` to disable auto-dismiss.
- **Stacking:** Newest toasts appear at bottom (bottom positions) or top (top positions).
- **Capacity control:** Excess toasts beyond `maxToasts` are trimmed from the front.
- **Master toaster arbitration:** Only the last-mounted `<Toaster>` instance renders (via `activeToasters` stack).
- **SSR-safe:** Returns `null` on server (guarded by `typeof window !== 'undefined'`).
- **Icons per type:** `default`/`info`→Info, `success`→CircleCheck, `warning`→TriangleAlert, `error`→CircleX.
